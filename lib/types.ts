export type CardType = "basic" | "shortnote" | "essay" | "cloze" | "rapid";
export type CardStatus = "draft" | "approved";

export interface Section {
  h: string;
  points: string[];
}

export interface PyqTag {
  university: string;
  year: number;
  marks?: number;
}

export const TAGS = [
  "mechanism",
  "classification",
  "pk",
  "uses",
  "adr",
  "interactions",
  "contraindications",
  "poisoning",
  "newer-drugs",
  "dosing",
] as const;
export type Tag = (typeof TAGS)[number];

export const TAG_LABEL: Record<Tag, string> = {
  mechanism: "Mechanism",
  classification: "Classification",
  pk: "Pharmacokinetics",
  uses: "Uses",
  adr: "Adverse effects",
  interactions: "Interactions",
  contraindications: "Contraindications",
  poisoning: "Poisoning",
  "newer-drugs": "Newer drugs",
  dosing: "Dosing",
};

export interface Subtopic {
  id: string;
  title: string;
}

export interface FlashCard {
  id: string;
  topicId: string;
  subtopic?: string;
  tags?: Tag[];
  type: CardType;
  front: string;
  back?: string; // basic
  sections?: Section[]; // shortnote, essay
  text?: string; // cloze
  kind?: "fact" | "class"; // rapid-fire cards: a single fact, or a full drug-class list
  level?: 1 | 2 | 3; // study cards: 1 basic, 2 applied, 3 advanced; default 1
  refs?: string[];
  pyq?: PyqTag[];
  status?: CardStatus;
}

export interface Deck {
  topicId: string;
  source?: string;
  cards: Omit<FlashCard, "topicId">[];
}

export interface Topic {
  id: string;
  paperId: string;
  title: string;
  refs: string[]; // e.g. "KDT8 ch2"
  nmc: number[]; // NMC 2022 MD Pharmacology syllabus item numbers this topic covers
  subtopics: Subtopic[];
}

export interface Paper {
  id: string;
  title: string;
  topics: Topic[];
}

/** One answer from the student, normalised for the mastery engine. */
export interface ReviewEvent {
  cardId: string;
  topicId: string;
  rating: 1 | 2 | 3 | 4; // Again, Hard, Good, Easy
  at: number; // epoch ms
  ms: number; // time spent on the card
}
