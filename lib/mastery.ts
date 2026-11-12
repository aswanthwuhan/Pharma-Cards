import type { ReviewEvent } from "./types";

// Weak/strong area engine. Pure functions so they are unit-testable and run
// offline in the browser.

export type MasteryLabel = "strong" | "moderate" | "weak" | "unassessed";

export interface TopicMastery {
  /** Group key: a topic, subtopic or tag id. (Named topicId for backwards compatibility.) */
  topicId: string;
  cards: number;
  score: number | null; // 0–100, null when unassessed
  label: MasteryLabel;
  coverage: number; // fraction of the topic's cards seen at least once
  reviews: number;
  accuracy: number | null; // recency-weighted, 0–1
  retention: number | null; // mean FSRS recall probability of seen cards, 0–1
}

const RATING_VALUE: Record<number, number> = { 1: 0, 2: 0.5, 3: 0.85, 4: 1 };
const DECAY = 0.85; // weight multiplier per older review, per 10 distinct cards in the group (see weightedAccuracy)
const PRIOR_MEAN = 0.5; // Bayesian prior: unknown topics start at 50%
const PRIOR_WEIGHT = 3; // ...worth 3 reviews, so 2 lucky answers can't mark a topic "strong"
const MIN_REVIEWS = 3;
const TARGET_MS = 20_000; // a comfortable time per card
export const TARGET_MS_BY_TYPE: Record<string, number> = { basic: 20_000, cloze: 20_000, rapid: 8_000, shortnote: 60_000, essay: 110_000 };

export const LABEL_THRESHOLDS = { strong: 75, moderate: 50 };

// Hysteresis: a group must drop HYSTERESIS points below a threshold before its label falls,
// so a score hovering on the line does not flip the label every session.
export const HYSTERESIS = 3;

export function labelFor(score: number | null, prev?: MasteryLabel): MasteryLabel {
  if (score === null) return "unassessed";
  const strongAt = LABEL_THRESHOLDS.strong - (prev === "strong" ? HYSTERESIS : 0);
  const moderateAt = LABEL_THRESHOLDS.moderate - (prev === "moderate" || prev === "strong" ? HYSTERESIS : 0);
  if (score >= strongAt) return "strong";
  if (score >= moderateAt) return "moderate";
  return "weak";
}

/** Recency-weighted accuracy, shrunk toward the prior when there is little data. Bigger groups decay slower, so they remember more answers. */
export function weightedAccuracy(reviews: ReviewEvent[]): number | null {
  if (!reviews.length) return null;
  const sorted = [...reviews].sort((a, b) => b.at - a.at); // newest first
  const span = Math.max(10, new Set(reviews.map((r) => r.cardId)).size) / 10;
  let num = PRIOR_MEAN * PRIOR_WEIGHT;
  let den = PRIOR_WEIGHT;
  sorted.forEach((r, i) => {
    const w = Math.pow(DECAY, i / span);
    num += RATING_VALUE[r.rating] * w;
    den += w;
  });
  return num / den;
}

function median(xs: number[]) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * @param cardIds    all cards in the topic
 * @param reviews    the topic's review history
 * @param recall     cardId -> current FSRS recall probability (null = never seen)
 * @param prev       last stored label, for hysteresis
 * @param targetMs   comfortable answer time for this group (long-answer types need more)
 */
export function groupMastery(
  topicId: string,
  cardIds: string[],
  reviews: ReviewEvent[],
  recall: Map<string, number | null>,
  prev?: MasteryLabel,
  targetMs: number = TARGET_MS,
): TopicMastery {
  const seen = cardIds.filter((id) => recall.get(id) != null);
  const coverage = cardIds.length ? seen.length / cardIds.length : 0;
  const accuracy = weightedAccuracy(reviews);
  // Unseen cards count as 0 recall, so a sliver of studied cards cannot make a whole group look strong.
  const retention = cardIds.length ? cardIds.reduce((a, id) => a + (recall.get(id) ?? 0), 0) / cardIds.length : null;

  if (reviews.length < MIN_REVIEWS || accuracy === null) {
    return { topicId, cards: cardIds.length, score: null, label: "unassessed", coverage, reviews: reviews.length, accuracy, retention };
  }

  // Slow answers lower the score a little (up to 5 points); fast answers raise it a little.
  // Zero or missing timings (bad data) are ignored.
  const med = median(reviews.map((r) => r.ms).filter((ms) => Number.isFinite(ms) && ms > 0)) ?? targetMs;
  const speedAdj = Math.max(-0.05, Math.min(0.05, ((targetMs - med) / targetMs) * 0.05));

  const raw = 0.55 * accuracy + 0.45 * (retention ?? accuracy) + speedAdj;
  const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);
  return { topicId, cards: cardIds.length, score, label: labelFor(score, prev), coverage, reviews: reviews.length, accuracy, retention };
}

/**
 * Roll subtopics up into their topic: the score is the card-weighted mean of
 * the rated subtopics, so a big weak subtopic pulls the topic down more than a small one.
 */
export function rollupMastery(topicId: string, children: TopicMastery[], prev?: MasteryLabel): TopicMastery {
  const cards = children.reduce((a, c) => a + c.cards, 0);
  const seen = children.reduce((a, c) => a + c.coverage * c.cards, 0);
  const reviews = children.reduce((a, c) => a + c.reviews, 0);
  const rated = children.filter((c) => c.score !== null);
  const wavg = (f: (c: TopicMastery) => number | null) => {
    const xs = rated.filter((c) => f(c) !== null);
    const ww = xs.reduce((a, c) => a + c.cards, 0);
    return ww ? xs.reduce((a, c) => a + f(c)! * c.cards, 0) / ww : null;
  };
  // Unassessed children count as the prior (50), so a big unstudied part pulls the topic to the middle
  // instead of letting the small rated part decide alone.
  const score = rated.length
    ? Math.round(children.reduce((a, c) => a + (c.score ?? LABEL_THRESHOLDS.moderate) * c.cards, 0) / (cards || 1))
    : null;
  return {
    topicId,
    cards,
    score,
    label: labelFor(score, prev),
    coverage: cards ? seen / cards : 0,
    reviews,
    accuracy: wavg((c) => c.accuracy),
    retention: wavg((c) => c.retention),
  };
}

/** Sampling weight for adaptive queues: weak topics get more cards, strong ones still appear. */
export function groupWeight(m: Pick<TopicMastery, "score"> | undefined): number {
  if (!m || m.score === null) return 0.6;
  return Math.max(0.15, 1 - m.score / 100);
}
