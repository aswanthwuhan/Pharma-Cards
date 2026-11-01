import Dexie, { type EntityTable } from "dexie";
import type { Card as FsrsCard } from "ts-fsrs";
import type { FlashCard, ReviewEvent } from "./types";

// Local-first storage. The shapes mirror the future Supabase tables so a
// sync layer can be added later without changing the UI.

export interface CardState {
  cardId: string;
  topicId: string;
  fsrs: FsrsCard;
  due: number; // epoch ms, indexed for "due today" queries
  lastRating: number;
}

export interface StoredReview extends ReviewEvent {
  id?: number;
  mode: string;
}

export interface Note {
  cardId: string;
  text: string;
  updatedAt: number;
}

export interface Bookmark {
  cardId: string;
  at: number;
}

export interface CardOverride extends Partial<FlashCard> {
  id: string;
}

export interface Setting {
  key: string;
  value: unknown;
}

export interface MasterySnapshot {
  id?: number;
  at: number;
  label: string; // e.g. "diagnostic", "weak-session"
  scores: Record<string, number | null>;
}

export const db = new Dexie("md-pharma-flashcards") as Dexie & {
  cardStates: EntityTable<CardState, "cardId">;
  reviews: EntityTable<StoredReview, "id">;
  notes: EntityTable<Note, "cardId">;
  bookmarks: EntityTable<Bookmark, "cardId">;
  customCards: EntityTable<FlashCard, "id">;
  overrides: EntityTable<CardOverride, "id">;
  settings: EntityTable<Setting, "key">;
  snapshots: EntityTable<MasterySnapshot, "id">;
};

db.version(1).stores({
  cardStates: "cardId, topicId, due",
  reviews: "++id, cardId, topicId, at",
  notes: "cardId",
  bookmarks: "cardId, at",
  customCards: "id, topicId",
  overrides: "id",
  settings: "key",
  snapshots: "++id, at",
});

/** Merge an admin edit/approval into any existing override for the card. */
export async function patchOverride(patch: CardOverride) {
  const prev = await db.overrides.get(patch.id);
  return db.overrides.put({ ...prev, ...patch });
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return (row?.value as T) ?? fallback;
}

export function setSetting(key: string, value: unknown) {
  return db.settings.put({ key, value });
}
