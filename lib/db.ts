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

// Mastery snapshots are added after every session; keep only the newest ones.
export const MAX_SNAPSHOTS = 365;
export async function pruneSnapshots() {
  const extra = (await db.snapshots.count()) - MAX_SNAPSHOTS;
  if (extra > 0) await db.snapshots.orderBy("at").limit(extra).delete();
}
db.on("ready", () => pruneSnapshots().catch(() => {}));

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

// ---- Backup export / import ----

export const BACKUP_TABLES = ["cardStates", "reviews", "bookmarks", "notes", "settings", "snapshots", "overrides", "customCards"] as const;
type BackupTable = (typeof BACKUP_TABLES)[number];

export async function exportBackup() {
  const entries = await Promise.all(BACKUP_TABLES.map(async (t) => [t, await db.table(t).toArray()] as const));
  return { app: "pharmacards", exportedAt: new Date().toISOString(), ...Object.fromEntries(entries) };
}

const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const time = (v: unknown) => (typeof v === "string" || typeof v === "number") && Number.isFinite(new Date(v).getTime());
const obj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
const FSRS_NUMS = ["stability", "difficulty", "scheduled_days", "reps", "lapses", "state"];

/** Row shape checks: a bad row is skipped, never imported. */
const VALID: Record<BackupTable, (r: any) => boolean> = {
  cardStates: (r) =>
    obj(r) && str(r.cardId) && str(r.topicId) && num(r.due) && obj(r.fsrs) && time(r.fsrs.due) &&
    FSRS_NUMS.every((k) => num(r.fsrs[k])) && (r.fsrs.last_review == null || time(r.fsrs.last_review)),
  reviews: (r) => obj(r) && str(r.cardId) && str(r.topicId) && [1, 2, 3, 4].includes(r.rating) && num(r.at) && num(r.ms) && typeof r.mode === "string",
  bookmarks: (r) => obj(r) && str(r.cardId) && num(r.at),
  notes: (r) => obj(r) && str(r.cardId) && typeof r.text === "string",
  settings: (r) => obj(r) && str(r.key),
  snapshots: (r) => obj(r) && num(r.at) && typeof r.label === "string" && obj(r.scores),
  overrides: (r) => obj(r) && str(r.id),
  customCards: (r) => obj(r) && str(r.id) && !r.id.includes("~") && str(r.topicId) && typeof r.type === "string" && str(r.front),
};

/**
 * Merge a backup into this device. Keyed rows (schedules, notes, bookmarks, settings, overrides,
 * custom cards) replace rows with the same key. History rows (reviews, snapshots) are appended with
 * fresh ids, so local history is never overwritten, and rows already present are skipped.
 */
export async function importBackup(data: Record<string, unknown>): Promise<{ added: number; invalid: number; duplicates: number }> {
  let added = 0;
  let invalid = 0;
  let duplicates = 0;
  const good = (t: BackupTable): any[] => {
    const all = Array.isArray(data[t]) ? (data[t] as unknown[]) : [];
    const ok = all.filter(VALID[t]);
    invalid += all.length - ok.length;
    return ok;
  };
  /** Keep rows whose key is new (to the device and to the file); strip the auto-increment id. */
  const fresh = (rows: any[], have: Set<string>, key: (r: any) => string) =>
    rows.flatMap(({ id: _id, ...r }) => {
      const k = key(r);
      if (have.has(k)) {
        duplicates++;
        return [];
      }
      have.add(k);
      return [r];
    });

  await db.transaction("rw", BACKUP_TABLES.map((t) => db.table(t)), async () => {
    const states = good("cardStates").map((r) => ({
      ...r,
      fsrs: { ...r.fsrs, due: new Date(r.fsrs.due), last_review: r.fsrs.last_review == null ? undefined : new Date(r.fsrs.last_review) },
    }));
    for (const [t, rows] of [
      ["cardStates", states],
      ["bookmarks", good("bookmarks")],
      ["notes", good("notes")],
      ["settings", good("settings")],
      ["overrides", good("overrides")],
      ["customCards", good("customCards")],
    ] as const) {
      await db.table(t).bulkPut(rows);
      added += rows.length;
    }
    const reviewKey = (r: StoredReview) => `${r.cardId}|${r.at}`;
    const reviews = fresh(good("reviews"), new Set((await db.reviews.toArray()).map(reviewKey)), reviewKey);
    const snapKey = (s: MasterySnapshot) => String(s.at);
    const snaps = fresh(good("snapshots"), new Set((await db.snapshots.toArray()).map(snapKey)), snapKey);
    await db.reviews.bulkAdd(reviews);
    await db.snapshots.bulkAdd(snaps);
    added += reviews.length + snaps.length;
  });
  await pruneSnapshots();
  return { added, invalid, duplicates };
}
