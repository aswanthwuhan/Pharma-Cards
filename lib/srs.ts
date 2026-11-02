import { createEmptyCard, fsrs, generatorParameters, Rating, type Card as FsrsCard, type Grade } from "ts-fsrs";
import { db, getSetting, type CardState } from "./db";
import type { FlashCard } from "./types";

// One scheduler per target-retention value (the user can change it in Settings).
const schedulers = new Map<number, ReturnType<typeof fsrs>>();
export function schedulerFor(retention = 0.9) {
  const r = Number.isFinite(retention) ? Math.min(0.97, Math.max(0.8, Math.round(retention * 100) / 100)) : 0.9;
  if (!schedulers.has(r)) schedulers.set(r, fsrs(generatorParameters({ enable_fuzz: true, request_retention: r })));
  return schedulers.get(r)!;
}
export const scheduler = schedulerFor(0.9);

export { Rating };

/** Probability (0–1) the student recalls this card right now. */
export function recallProbability(state: CardState | undefined, now = new Date()): number | null {
  const card = state?.fsrs;
  if (!card || card.reps === 0) return null;
  try {
    return scheduler.get_retrievability(card, now, false);
  } catch {
    return null; // one corrupt state must not break mastery or queues
  }
}

/** What is needed to take back one answer. */
export interface ReviewUndo {
  cardId: string;
  previous: CardState | undefined; // undefined = the card had never been seen
  reviewId: number;
}

/** Record one answer: update FSRS state and append to the review log. Returns an undo token. */
export async function recordReview(card: FlashCard, rating: Grade, ms: number, mode: string): Promise<ReviewUndo> {
  const now = new Date();
  const existing = await db.cardStates.get(card.id);
  const base: FsrsCard = existing?.fsrs ?? (createEmptyCard(now) as FsrsCard);
  const retention = await getSetting<number>("retention", 0.9);
  const { card: next } = schedulerFor(retention).next(base, now, rating);
  let reviewId = 0;
  await db.transaction("rw", db.cardStates, db.reviews, async () => {
    await db.cardStates.put({
      cardId: card.id,
      topicId: card.topicId,
      fsrs: next,
      due: new Date(next.due).getTime(),
      lastRating: rating,
    });
    // A first-ever daily answer is a new card, whatever the caller's (possibly stale) view said.
    const logged = mode === "daily" && !existing ? "daily-new" : mode;
    reviewId = (await db.reviews.add({ cardId: card.id, topicId: card.topicId, rating, at: now.getTime(), ms, mode: logged })) as number;
  });
  return { cardId: card.id, previous: existing, reviewId };
}

/** Take back an answer: restore the card's FSRS state exactly and delete the log row. */
export async function undoReview(u: ReviewUndo) {
  await db.transaction("rw", db.cardStates, db.reviews, async () => {
    if (u.previous) await db.cardStates.put(u.previous);
    else await db.cardStates.delete(u.cardId);
    await db.reviews.delete(u.reviewId);
  });
}

/** Human-readable next interval for each button, e.g. "10m", "3d". */
export function previewIntervals(state: CardState | undefined, retention = 0.9): Record<number, string> {
  const now = new Date();
  const out: Record<number, string> = {};
  let preview;
  try {
    preview = schedulerFor(retention).repeat(state?.fsrs ?? (createEmptyCard(now) as FsrsCard), now);
  } catch {
    return out; // damaged stored state: show no intervals rather than crash the session
  }
  for (const g of [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as Grade[]) {
    const mins = (new Date(preview[g].card.due).getTime() - now.getTime()) / 60000;
    out[g] = mins < 60 ? `${Math.max(1, Math.round(mins))}m` : mins < 1440 ? `${Math.round(mins / 60)}h` : `${Math.round(mins / 1440)}d`;
  }
  return out;
}
