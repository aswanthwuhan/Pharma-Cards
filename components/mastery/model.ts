import type { MasteryLabel, TopicMastery } from "@/lib/mastery";
import { subtopicById } from "@/lib/syllabus";
import type { Paper, Topic } from "@/lib/types";

export type Filter = "all" | "weak" | "moderate" | "strong" | "unassessed" | "nocards";
export type Sort = "weakest" | "strongest" | "syllabus";

export const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All topics" },
  { id: "weak", label: "Weak (0–49)" },
  { id: "moderate", label: "Moderate (50–74)" },
  { id: "strong", label: "Strong (75–100)" },
  { id: "unassessed", label: "Not rated yet" },
  { id: "nocards", label: "No cards yet" },
];

/** Short capsule shown beside each paper title. */
export const PAPER_CAPSULE: Record<string, string> = {
  P1: "Basic sciences",
  P2: "Systemic",
  P3: "Clinical, research & education",
  P4: "Recent advances",
};

/** Paper tab labels. */
export const PAPER_TAB: Record<string, string> = {
  P1: "Paper I: Basic",
  P2: "II: Systemic",
  P3: "III: Clinical & research",
  P4: "IV: Recent advances",
  PR: "Practical exam",
};

/** "Paper I — General Pharmacology" -> "Paper I: General Pharmacology". */
export function paperTitle(p: Paper): string {
  return p.title.replace(" — ", ": ");
}

/** One syllabus topic with its mastery (undefined when it has no cards). */
export interface Row {
  topic: Topic;
  paper: Paper;
  m?: TopicMastery;
}

export function labelOf(m?: TopicMastery): MasteryLabel {
  return m?.score == null ? "unassessed" : m.label;
}

/** Status word used by badges and chips. */
export function statusWord(m?: TopicMastery): string {
  if (!m || m.score == null) return "Not rated";
  return m.label === "weak" ? "Weak" : m.label === "moderate" ? "Moderate" : "Strong";
}

/** Card-weighted mean of the rated groups. Null when nothing is rated yet. */
export function weightedScore(ms: (TopicMastery | undefined)[]): number | null {
  const rated = ms.filter((m): m is TopicMastery => !!m && m.score !== null);
  const cards = rated.reduce((a, m) => a + m.cards, 0);
  if (!cards) return null;
  return Math.round(rated.reduce((a, m) => a + m.score! * m.cards, 0) / cards);
}

/** Subtopic group key ("<topic>-other" for cards without a subtopic) -> parent topic id. */
export function parentTopicId(key: string): string {
  return subtopicById.get(key)?.topicId ?? key.replace(/-other$/, "");
}

/**
 * Share of a topic's cards in weak / moderate / strong subtopics (0–1 each).
 * Cards in unrated subtopics are the remainder, drawn as background.
 */
export function breakdown(topicCards: number, subs: TopicMastery[]) {
  const out = { weak: 0, moderate: 0, strong: 0 };
  if (!topicCards) return out;
  for (const s of subs) {
    if (s.score == null) continue;
    out[s.label as "weak" | "moderate" | "strong"] += s.cards / topicCards;
  }
  return out;
}

export const CARD_TYPE_LABEL: Record<string, string> = {
  basic: "Recall",
  shortnote: "Short notes",
  essay: "Essays",
  cloze: "Fill the blanks",
};
