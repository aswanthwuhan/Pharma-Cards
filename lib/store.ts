"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { cardError } from "./cardCheck";
import { db, getSetting, setSetting, type CardState } from "./db";
import { groupMastery, groupWeight, HYSTERESIS, LABEL_THRESHOLDS, labelFor, rollupMastery, type MasteryLabel, type TopicMastery } from "./mastery";
import { recallProbability } from "./srs";
import { shuffle, stratifiedSample, weakPriority } from "./sampler";
import { isOpen, levelOrder, reachedTop, unlockedLevels, type LevelSignal } from "./levels";
import { TOPICS } from "./syllabus";
import { TAGS, type FlashCard, type Tag } from "./types";

let bundledCache: Promise<FlashCard[]> | null = null;

/** The 10 MB deck is kept out of the initial JS chunk and loaded on first use. */
function loadBundled(): Promise<FlashCard[]> {
  if (!bundledCache) bundledCache = import("@/content/all.json").then((m) => m.default as FlashCard[]);
  return bundledCache;
}

/** Bundled + imported cards with admin edits applied. */
export async function loadAllCards(): Promise<FlashCard[]> {
  const [custom, overrides, bundled] = await Promise.all([db.customCards.toArray(), db.overrides.toArray(), loadBundled()]);
  const byId = new Map<string, FlashCard>();
  for (const c of bundled) byId.set(c.id, { ...c, status: c.status ?? "draft" });
  // Imported cards and edits are skipped if they would leave a card that cannot render.
  for (const c of custom) if (!cardError(c)) byId.set(c.id, { ...c, status: c.status ?? "draft" });
  for (const o of overrides) {
    const c = byId.get(o.id);
    const merged = c && { ...c, ...o };
    if (merged && !cardError(merged)) byId.set(o.id, merged);
  }
  return [...byId.values()];
}

/** Cards students study. Drafts are included while "show drafts" is on (pilot default). */
export async function loadStudyCards(): Promise<FlashCard[]> {
  const [all, showDrafts] = await Promise.all([loadAllCards(), getSetting("showDrafts", true)]);
  return all.filter((c) => showDrafts || c.status === "approved");
}

export function useAllCards() {
  return useLiveQuery(loadAllCards, [], undefined);
}

export function useStudyCards() {
  return useLiveQuery(loadStudyCards, [], undefined);
}

/** Weak/strong at three levels: topic (rolled up from subtopics), subtopic, and question type. */
export interface MasteryReport {
  topic: Map<string, TopicMastery>;
  subtopic: Map<string, TopicMastery>;
  tag: Map<Tag, TopicMastery>;
}

export const isRapid = (c: FlashCard) => c.type === "rapid";

export async function computeMastery(cards?: FlashCard[]): Promise<MasteryReport> {
  // Rapid-fire pairs are thousands of tiny facts; they get their own progress and would swamp coverage here.
  const list = (cards ?? (await loadStudyCards())).filter((c) => !isRapid(c));
  const now = new Date();
  // shortcut: only the last year of reviews feeds accuracy (older ones carry ~0 decay weight); widen if exams span longer.
  const [states, reviews] = await Promise.all([
    db.cardStates.toArray(),
    db.reviews.where("at").aboveOrEqual(now.getTime() - 365 * 86_400_000).toArray(),
  ]);
  // A card whose last answer was "Forgot" is not remembered, even though FSRS reports high
  // recall straight after seeing the answer. Count it as 0 until it is recalled correctly.
  const recall = new Map(states.map((s) => [s.cardId, s.lastRating === 1 ? 0 : recallProbability(s, now)]));
  const reviewsByCard = new Map<string, typeof reviews>();
  for (const r of reviews) reviewsByCard.set(r.cardId, [...(reviewsByCard.get(r.cardId) ?? []), r]);
  // Last stored labels feed the hysteresis, so a group near a threshold keeps its label.
  const memory = await getSetting<Record<string, MasteryLabel>>("masteryLabels", {});
  const signal = new Map<string, LevelSignal>(states.map((s) => [s.cardId, { lastRating: s.lastRating, recall: recall.get(s.cardId) }]));
  const group = (key: string, ids: string[]) =>
    groupMastery(key, ids, ids.flatMap((id) => reviewsByCard.get(id) ?? []), recall, memory[key]);

  const subtopic = new Map<string, TopicMastery>();
  const topic = new Map<string, TopicMastery>();
  const byTopic = new Map<string, FlashCard[]>();
  for (const c of list) byTopic.set(c.topicId, [...(byTopic.get(c.topicId) ?? []), c]);
  for (const t of TOPICS) {
    const inTopic = byTopic.get(t.id) ?? [];
    if (!inTopic.length) continue;
    const children: TopicMastery[] = [];
    const bySub = new Map<string, FlashCard[]>();
    for (const c of inTopic) {
      const k = c.subtopic ?? `${t.id}-other`;
      bySub.set(k, [...(bySub.get(k) ?? []), c]);
    }
    for (const [k, subCards] of bySub) {
      let m = group(k, subCards.map((c) => c.id));
      // Strong needs the top of the ladder: a subtopic known only at basic level is capped at moderate.
      const strongFloor = LABEL_THRESHOLDS.strong - HYSTERESIS;
      if (m.score !== null && m.score >= strongFloor && !reachedTop(subCards, signal)) {
        m = { ...m, score: strongFloor - 1, label: labelFor(strongFloor - 1, memory[k]) };
      }
      subtopic.set(k, m);
      children.push(m);
    }
    topic.set(t.id, rollupMastery(t.id, children, memory[t.id]));
  }

  const tag = new Map<Tag, TopicMastery>();
  for (const tg of TAGS) {
    const ids = list.filter((c) => c.tags?.includes(tg)).map((c) => c.id);
    if (ids.length) tag.set(tg, group(tg, ids));
  }
  // Merge, so a partial list (e.g. one mode's cards) does not erase other groups' labels.
  const next: Record<string, MasteryLabel> = { ...memory };
  for (const m of [...topic.values(), ...subtopic.values(), ...tag.values()]) if (m.label !== "unassessed") next[m.topicId] = m.label;
  if (JSON.stringify(next) !== JSON.stringify(memory)) {
    // Persist outside the live-query read: a write here would invalidate the query that produced it.
    setTimeout(() => void setSetting("masteryLabels", next), 0);
  }
  return { topic, subtopic, tag };
}

export function useMastery() {
  return useLiveQuery(() => computeMastery(), [], undefined);
}

/** Lowest-scoring rated groups first; unrated ones are left out. */
export function weakest(m: Map<string, TopicMastery> | undefined, n = 10): TopicMastery[] {
  if (!m) return [];
  return [...m.values()]
    .filter((x) => x.score !== null && x.label !== "strong")
    .sort((a, b) => a.score! - b.score!)
    .slice(0, n);
}

export type StudyMode = "daily" | "diagnostic" | "random" | "weak" | "topic" | "bookmarks" | "rapid";
export type RapidDirection = "forward" | "reverse" | "mixed";

export interface QueueOptions {
  mode: StudyMode;
  size?: number;
  topicIds?: string[];
  subtopicIds?: string[];
  tag?: Tag;
  types?: string[];
  pyqOnly?: boolean;
  direction?: RapidDirection; // rapid mode only
}

/** Builds the card list for a study session. */
export async function buildQueue(opts: QueueOptions): Promise<FlashCard[]> {
  if (opts.mode === "rapid") return buildRapidQueue(opts);
  let cards = (await loadStudyCards()).filter((c) => !isRapid(c));
  if (opts.topicIds?.length) cards = cards.filter((c) => opts.topicIds!.includes(c.topicId));
  if (opts.subtopicIds?.length) cards = cards.filter((c) => c.subtopic && opts.subtopicIds!.includes(c.subtopic));
  if (opts.tag) cards = cards.filter((c) => c.tags?.includes(opts.tag!));
  if (opts.types?.length) cards = cards.filter((c) => opts.types!.includes(c.type));
  if (opts.pyqOnly) cards = cards.filter((c) => c.pyq?.length);

  const states = new Map((await db.cardStates.toArray()).map((s) => [s.cardId, s]));
  const now = new Date();
  // Adaptive sampling works per subtopic, so a weak corner of a strong topic still gets attention.
  const bySubtopic = (c: FlashCard) => ({ ...c, topicId: c.subtopic ?? c.topicId });
  const restore = (xs: FlashCard[]) => {
    const byId = new Map(cards.map((c) => [c.id, c]));
    return xs.map((x) => byId.get(x.id)!);
  };

  switch (opts.mode) {
    case "diagnostic":
      // Even spread over every subtopic, fresh cards first, so it measures the whole syllabus.
      return restore(
        stratifiedSample(cards.map(bySubtopic), opts.size ?? 100, () => 1, Math.random, (c) => [
          ...shuffle(c.filter((x) => !states.has(x.id))),
          ...shuffle(c.filter((x) => states.has(x.id))),
        ]),
      );

    case "random": {
      const { subtopic } = await computeMastery(cards);
      return restore(stratifiedSample(cards.map(bySubtopic), opts.size ?? 50, (s) => groupWeight(subtopic.get(s))));
    }

    case "weak": {
      const { subtopic } = await computeMastery(cards);
      const weakSubs = new Set(
        [...subtopic.values()].filter((m) => m.label === "weak" || m.label === "moderate").map((m) => m.topicId),
      );
      const pool = cards.filter((c) => c.subtopic && weakSubs.has(c.subtopic));
      if (!pool.length) return [];
      const scored = shuffle(pool).map((c) => {
        const s = states.get(c.id);
        return { c, p: weakPriority({ lastRating: s?.lastRating, recall: recallProbability(s, now) }) };
      });
      // Highest priority first; ties go to the weakest subtopic.
      scored.sort((a, b) => b.p - a.p || (subtopic.get(a.c.subtopic!)?.score ?? 50) - (subtopic.get(b.c.subtopic!)?.score ?? 50));
      // Rebuild foundations first: easier weak cards before the advanced ones.
      return levelOrder(shuffle(scored.slice(0, opts.size ?? 30).map((x) => x.c)));
    }

    case "bookmarks": {
      const ids = new Set((await db.bookmarks.toArray()).map((b) => b.cardId));
      return shuffle(cards.filter((c) => ids.has(c.id)));
    }

    case "topic": {
      // Due reviews first, then new cards basic to advanced, then the rest.
      const nowMs = now.getTime();
      const due = shuffle(cards.filter((c) => (states.get(c.id)?.due ?? Infinity) <= nowMs));
      const unseen = levelOrder(shuffle(cards.filter((c) => !states.has(c.id))));
      const rest = shuffle(cards.filter((c) => states.has(c.id) && states.get(c.id)!.due > nowMs));
      return [...due, ...unseen, ...rest].slice(0, opts.size ?? cards.length);
    }

    case "daily":
    default: {
      const due = cards
        .filter((c) => (states.get(c.id)?.due ?? Infinity) <= now.getTime())
        .sort((a, b) => states.get(a.id)!.due - states.get(b.id)!.due);
      const reviewedToday = await db.reviews.where("at").aboveOrEqual(startOfDay()).toArray();
      const doneToday = new Set(reviewedToday.filter((r) => r.mode === "daily-new").map((r) => r.cardId));
      const newDoneToday = doneToday.size;
      // Plan today's quota from the start-of-day count, so reopening a session does not shrink it.
      const newLimit = await dailyNewTarget(cards, { has: (id) => states.has(id) && !doneToday.has(id) });
      const { subtopic } = await computeMastery(cards);
      // New cards only from levels the student has unlocked in each subtopic.
      const unlocked = unlockedLevels(cards, levelSignals([...states.values()], now));
      const fresh = stratifiedSample(
        cards.filter((c) => !states.has(c.id) && isOpen(c, unlocked)).map(bySubtopic),
        Math.max(0, newLimit - newDoneToday),
        (s) => groupWeight(subtopic.get(s)),
      );
      // New cards run basic to advanced, so each session has a flow.
      return [...due, ...levelOrder(restore(fresh))];
    }
  }
}

/** Per-card pass signal for the level ladder; a last "Forgot" counts as forgotten. */
export function levelSignals(states: CardState[], now = new Date()): Map<string, LevelSignal> {
  return new Map(
    states.map((s) => [s.cardId, { lastRating: s.lastRating, recall: s.lastRating === 1 ? 0 : recallProbability(s, now) }]),
  );
}

export function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

/** Exam planner: spread unseen cards over the days left, keeping the final 10 days for revision. */
/** `seen` holds the ids that have a state; only those among `cards` count, so Rapid/`~r` states are ignored. */
export async function dailyNewTarget(cards: FlashCard[], seen: { has(id: string): boolean }): Promise<number> {
  const examDate = await getSetting<string | null>("examDate", null);
  const fallback = await getSetting<number>("newPerDay", 20);
  if (!examDate) return fallback;
  const unseen = cards.filter((c) => !seen.has(c.id)).length;
  const [y, m, d] = examDate.split("-").map(Number);
  const days = Math.ceil((new Date(y, m - 1, d).getTime() - Date.now()) / 86_400_000) - 10;
  if (!Number.isFinite(days)) return fallback; // malformed date
  // Revision window (or exam passed): fall back to the normal daily limit instead of 0 forever.
  if (days <= 0) return Math.min(fallback, unseen);
  return Math.max(5, Math.ceil(unseen / days));
}


/**
 * Rapid Fire queue. Each card can be shown forward (q -> a) or reversed (a -> q); the reversed
 * view is a separate virtual card ("<id>~r") with its own FSRS schedule, because recalling
 * "drug -> class" is a different memory from "class -> all its drugs".
 * Order: due first, then never-seen, then the rest; shuffled within each group.
 */
export async function buildRapidQueue(opts: QueueOptions): Promise<FlashCard[]> {
  let cards = (await loadStudyCards()).filter(isRapid);
  if (opts.topicIds?.length) cards = cards.filter((c) => opts.topicIds!.includes(c.topicId));
  if (opts.subtopicIds?.length) cards = cards.filter((c) => c.subtopic && opts.subtopicIds!.includes(c.subtopic));
  if (opts.tag) cards = cards.filter((c) => c.tags?.includes(opts.tag!));
  const dir = opts.direction ?? "forward";
  const views = cards.map((c) => {
    const reverse = dir === "reverse" || (dir === "mixed" && Math.random() < 0.5);
    return reverse ? reversed(c) : c;
  });
  const states = new Map((await db.cardStates.toArray()).map((s) => [s.cardId, s]));
  const now = Date.now();
  const due = shuffle(views.filter((v) => (states.get(v.id)?.due ?? Infinity) <= now));
  const fresh = shuffle(views.filter((v) => !states.has(v.id)));
  const rest = shuffle(views.filter((v) => states.has(v.id) && states.get(v.id)!.due > now));
  return [...due, ...fresh, ...rest].slice(0, opts.size ?? 40);
}

export function reversed(c: FlashCard): FlashCard {
  return { ...c, id: `${c.id}~r`, front: c.back ?? "", back: c.front };
}
