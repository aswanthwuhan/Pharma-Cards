import { labelFor, type MasteryLabel, type TopicMastery } from "@/lib/mastery";
import type { Paper } from "@/lib/types";

export interface PaperSummary {
  score: number | null; // card-weighted mean of the paper's rated topics, 0–100
  label: MasteryLabel;
  cards: number; // all study cards in the paper
  weakest: TopicMastery | null; // lowest rated topic
  weakestTitle: string | null;
  studyTopicId: string | null; // topic the "Study topic" button opens: weakest, else the biggest
  mix: { weak: number; moderate: number; strong: number; unrated: number }; // card counts by band; sums to cards
}

/** Card-weighted mastery for one paper, plus its weakest rated topic. */
export function summarisePaper(paper: Paper, topics?: Map<string, TopicMastery>): PaperSummary {
  let cards = 0;
  let rated = 0;
  let weighted = 0;
  let weakest: TopicMastery | null = null;
  let weakestTitle: string | null = null;
  let biggest: TopicMastery | null = null;
  const mix = { weak: 0, moderate: 0, strong: 0, unrated: 0 };

  for (const t of paper.topics) {
    const m = topics?.get(t.id);
    if (!m) continue;
    cards += m.cards;
    const band = labelFor(m.score);
    if (band === "unassessed") mix.unrated += m.cards;
    else mix[band] += m.cards;
    if (m.cards && (!biggest || m.cards > biggest.cards)) biggest = m;
    if (m.score === null) continue;
    rated += m.cards;
    weighted += m.score * m.cards;
    if (!weakest || m.score < weakest.score!) {
      weakest = m;
      weakestTitle = t.title;
    }
  }

  const score = rated ? Math.round(weighted / rated) : null;
  return {
    score,
    label: labelFor(score),
    cards,
    weakest,
    weakestTitle,
    studyTopicId: (weakest ?? biggest)?.topicId ?? null,
    mix,
  };
}
