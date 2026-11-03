import type { FlashCard } from "./types";

// Difficulty ladder: 1 = basic recall, 2 = applied, 3 = advanced synthesis.
// A level opens for a subtopic once the student has shown they hold the level below.
export const MAX_LEVEL = 3;
export const PASS_RATIO = 0.8;
// Big subtopics never need more than this many good answers to open the next level,
// so a 60-card level 1 does not hold back level 2 for weeks.
export const PASS_CAP = 10;
// A "Good" answer only counts while FSRS still expects the card to be remembered.
export const RECALL_FLOOR = 0.7;

export interface LevelSignal {
  lastRating?: number;
  recall?: number | null; // FSRS recall probability now; null/undefined = unknown
}

export const cardLevel = (c: FlashCard) => c.level ?? 1;

const toSignal = (v: LevelSignal | number | undefined): LevelSignal | undefined =>
  typeof v === "number" ? { lastRating: v } : v;

/** Card answered Good/Easy last time and not yet forgotten. */
export function passedCard(v: LevelSignal | number | undefined): boolean {
  const s = toSignal(v);
  return !!s && (s.lastRating ?? 0) >= 3 && (s.recall == null || s.recall >= RECALL_FLOOR);
}

/** A level is passed when enough of its cards are held, and most of the seen ones are not failing. */
function levelPassed(atLevel: FlashCard[], signal: Map<string, LevelSignal | number>): boolean {
  if (!atLevel.length) return true; // an empty level never stalls the ladder
  const seen = atLevel.filter((c) => signal.has(c.id)).length;
  const good = atLevel.filter((c) => passedCard(signal.get(c.id))).length;
  const needed = Math.min(Math.ceil(PASS_RATIO * atLevel.length), PASS_CAP);
  return good >= needed && good >= PASS_RATIO * seen;
}

const bySubtopic = (cards: FlashCard[]) => {
  const m = new Map<string, FlashCard[]>();
  for (const c of cards) {
    const k = c.subtopic ?? "";
    m.set(k, [...(m.get(k) ?? []), c]);
  }
  return m;
};

/** Highest level open per subtopic (key = subtopic id, "" for cards without one). */
export function unlockedLevels(cards: FlashCard[], signal: Map<string, LevelSignal | number>): Map<string, number> {
  const out = new Map<string, number>();
  for (const [sub, list] of bySubtopic(cards)) {
    let open = 1;
    for (let L = 1; L < MAX_LEVEL; L++) {
      if (!levelPassed(list.filter((c) => cardLevel(c) === L), signal)) break;
      open = L + 1;
    }
    out.set(sub, open);
  }
  return out;
}

/** Unseen cards that the student is ready for. Seen cards are never filtered here. */
export function isOpen(c: FlashCard, unlocked: Map<string, number>): boolean {
  return cardLevel(c) <= (unlocked.get(c.subtopic ?? "") ?? 1);
}

/** Basic before applied before advanced; keeps the existing order inside each level. */
export function levelOrder<T extends FlashCard>(cards: T[]): T[] {
  return [...cards].sort((a, b) => cardLevel(a) - cardLevel(b));
}

/**
 * True when the student holds at least one card at the group's top level.
 * "Strong" should mean the whole ladder is mastered, not just the easy cards.
 */
export function reachedTop(cards: FlashCard[], signal: Map<string, LevelSignal | number>): boolean {
  if (!cards.length) return true;
  const top = Math.max(...cards.map(cardLevel));
  return cards.some((c) => cardLevel(c) === top && passedCard(signal.get(c.id)));
}
