import type { FlashCard } from "./types";

// Queue builders for Grand Random, Diagnostic and Weak-Areas modes.

export type Rng = () => number;

export function shuffle<T>(xs: T[], rng: Rng = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function groupByTopic(cards: FlashCard[]) {
  const m = new Map<string, FlashCard[]>();
  for (const c of cards) m.set(c.topicId, [...(m.get(c.topicId) ?? []), c]);
  return m;
}

/**
 * Stratified sample of `n` cards: every topic gets at least one card (when n allows),
 * the rest is split in proportion to `weight(topicId)`. Result is shuffled.
 */
export function stratifiedSample(
  cards: FlashCard[],
  n: number,
  weight: (topicId: string) => number = () => 1,
  rng: Rng = Math.random,
  pickOrder: (topicCards: FlashCard[]) => FlashCard[] = (c) => shuffle(c, rng),
): FlashCard[] {
  const groups = groupByTopic(cards);
  const topics = [...groups.keys()];
  if (!topics.length || n <= 0) return [];
  const pools = new Map(topics.map((t) => [t, pickOrder(groups.get(t)!)]));
  const quota = new Map(topics.map((t) => [t, 0]));

  // 1 card per topic first, so the whole syllabus is covered.
  for (const t of shuffle(topics, rng)) {
    if (n <= [...quota.values()].reduce((a, b) => a + b, 0)) break;
    quota.set(t, 1);
  }
  // Remaining slots by weighted lottery.
  let remaining = Math.min(n, cards.length) - [...quota.values()].reduce((a, b) => a + b, 0);
  while (remaining > 0) {
    const open = topics.filter((t) => quota.get(t)! < pools.get(t)!.length);
    if (!open.length) break;
    const total = open.reduce((s, t) => s + weight(t), 0);
    let x = rng() * total;
    let chosen = open[open.length - 1];
    for (const t of open) {
      x -= weight(t);
      if (x <= 0) {
        chosen = t;
        break;
      }
    }
    quota.set(chosen, quota.get(chosen)! + 1);
    remaining--;
  }
  const out = topics.flatMap((t) => pools.get(t)!.slice(0, quota.get(t)));
  return shuffle(out, rng);
}

export interface CardSignal {
  lastRating?: number; // 1 = Again
  recall: number | null; // FSRS recall probability, null = unseen
}

/** Priority inside weak topics: wrong last time > fading memory > never seen > the rest. */
export function weakPriority(s: CardSignal): number {
  if (s.lastRating === 1) return 3;
  if (s.recall !== null && s.recall < 0.75) return 2;
  if (s.recall === null) return 1;
  return 0.3;
}
