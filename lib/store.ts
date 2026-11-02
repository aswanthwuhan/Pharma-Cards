"use client";

import { useLiveQuery } from "dexie-react-hooks";
import bundled from "@/content/all.json";
import { db, getSetting } from "./db";
import { groupMastery, groupWeight, rollupMastery, type TopicMastery } from "./mastery";
import { recallProbability } from "./srs";
import { shuffle, stratifiedSample, weakPriority } from "./sampler";
import { TOPICS } from "./syllabus";
import { TAGS, type FlashCard, type Tag } from "./types";

const BUNDLED = bundled as FlashCard[];

/** Bundled + imported cards with admin edits applied. */
export async function loadAllCards(): Promise<FlashCard[]> {
  const [custom, overrides] = await Promise.all([db.customCards.toArray(), db.overrides.toArray()]);
  const byId = new Map<string, FlashCard>();
  for (const c of [...BUNDLED, ...custom]) byId.set(c.id, { ...c, status: c.status ?? "draft" });
  for (const o of overrides) {
    const c = byId.get(o.id);
    if (c) byId.set(o.id, { ...c, ...o });
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
  const group = (key: string, ids: string[]) =>
    groupMastery(key, ids, ids.flatMap((id) => reviewsByCard.get(id) ?? []), recall);

  const subtopic = new Map<string, TopicMastery>();
  const topic = new Map<string, TopicMastery>();
  for (const t of TOPICS) {
    const inTopic = list.filter((c) => c.topicId === t.id);
    if (!inTopic.length) continue;
    const children: TopicMastery[] = [];
    const bySub = new Map<string, string[]>();
    for (const c of inTopic) {
      const k = c.subtopic ?? `${t.id}-other`;
      bySub.set(k, [...(bySub.get(k) ?? []), c.id]);
    }
    for (const [k, ids] of bySub) {
      const m = group(k, ids);
      subtopic.set(k, m);
      children.push(m);
    }
    topic.set(t.id, rollupMastery(t.id, children));
  }

  const tag = new Map<Tag, TopicMastery>();
  for (const tg of TAGS) {
    const ids = list.filter((c) => c.tags?.includes(tg)).map((c) => c.id);
    if (ids.length) tag.set(tg, group(tg, ids));
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
      return shuffle(scored.slice(0, opts.size ?? 30).map((x) => x.c));
    }

    case "bookmarks": {
      const ids = new Set((await db.bookmarks.toArray()).map((b) => b.cardId));
      return shuffle(cards.filter((c) => ids.has(c.id)));
    }

    case "topic":
      return shuffle(cards).slice(0, opts.size ?? cards.length);

    case "daily":
    default: {
      const due = cards
        .filter((c) => (states.get(c.id)?.due ?? Infinity) <= now.getTime())
        .sort((a, b) => states.get(a.id)!.due - states.get(b.id)!.due);
      const newLimit = await dailyNewTarget(cards, states);
      const reviewedToday = await db.reviews.where("at").aboveOrEqual(startOfDay()).toArray();
      const newDoneToday = new Set(reviewedToday.filter((r) => r.mode === "daily-new").map((r) => r.cardId)).size;
      const { subtopic } = await computeMastery(cards);
      const fresh = stratifiedSample(
        cards.filter((c) => !states.has(c.id)).map(bySubtopic),
        Math.max(0, newLimit - newDoneToday),
        (s) => groupWeight(subtopic.get(s)),
      );
      return [...due, ...restore(fresh)];
    }
  }
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
