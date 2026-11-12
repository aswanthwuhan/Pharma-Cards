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

/** Per-heading recall marks on a long-essay card (Heading Ladder): heading index -> recalled? */
export interface EssayMark {
  cardId: string;
  marks: Record<number, boolean>;
  at: number;
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
  essayMarks: EntityTable<EssayMark, "cardId">;
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
db.version(2).stores({ essayMarks: "cardId" });

// Mastery snapshots are added after every session; keep only the newest ones.
export const MAX_SNAPSHOTS = 365;
export async function pruneSnapshots() {
  const extra = (await db.snapshots.count()) - MAX_SNAPSHOTS;
  if (extra > 0) await db.snapshots.orderBy("at").limit(extra).delete();
}
db.on("ready", () => pruneSnapshots().catch(() => {}));

/** Merge an admin edit/approval into any existing override for the card. */
export function patchOverride(patch: CardOverride) {
  // One transaction, so two quick edits (or two tabs) cannot drop each other's fields.
  return db.transaction("rw", db.overrides, async () => {
    const prev = await db.overrides.get(patch.id);
    return db.overrides.put({ ...prev, ...patch });
  });
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return (row?.value as T) ?? fallback;
}

export function setSetting(key: string, value: unknown) {
  return db.settings.put({ key, value });
}

// ---- Backup export / import ----

export const BACKUP_TABLES = ["cardStates", "reviews", "bookmarks", "notes", "settings", "snapshots", "overrides", "customCards", "essayMarks"] as const;
type BackupTable = (typeof BACKUP_TABLES)[number];

export async function exportBackup() {
  const entries = await Promise.all(BACKUP_TABLES.map(async (t) => [t, await db.table(t).toArray()] as const));
  return { app: "pharmacards", exportedAt: new Date().toISOString(), ...Object.fromEntries(entries) };
}

const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const time = (v: unknown) => (typeof v === "string" || typeof v === "number") && Number.isFinite(new Date(v).getTime());
const obj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
/** Known settings with a constrained value; other keys pass through. */
const oneOf = (...opts: string[]) => (v: unknown) => opts.includes(v as string);
const SETTING_OK: Record<string, (v: unknown) => boolean> = {
  examDate: (v) => v == null || v === "" || (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && time(v)),
  examName: (v) => typeof v === "string",
  newPerDay: (v) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 500,
  retention: (v) => num(v) && (v as number) >= 0.8 && (v as number) <= 0.97,
  swipeBand: (v) => num(v) && (v as number) >= 24 && (v as number) <= 400,
  swipeEdge: oneOf("bottom", "top", "both"),
  theme: oneOf("dark", "light", "auto"),
  motion: oneOf("full", "system", "reduced"),
  essayStyle: oneOf("ladder", "rail"),
  palette: oneOf("petrol", "ocean", "plum", "graphite", "sepia"),
  appIcon: (v) => typeof v === "string",
  showDrafts: (v) => typeof v === "boolean",
  swipe: (v) => typeof v === "boolean",
  swipeZoneVisible: (v) => typeof v === "boolean",
  haptics: (v) => typeof v === "boolean",
};
const FSRS_NUMS = ["stability", "difficulty", "scheduled_days", "reps", "lapses", "state"];

/** Row shape checks: a bad row is skipped, never imported. */
const VALID: Record<BackupTable, (r: any) => boolean> = {
  cardStates: (r) =>
    obj(r) && str(r.cardId) && str(r.topicId) && num(r.due) && obj(r.fsrs) && time(r.fsrs.due) &&
    FSRS_NUMS.every((k) => num(r.fsrs[k])) && (r.fsrs.last_review == null || time(r.fsrs.last_review)),
  reviews: (r) => obj(r) && str(r.cardId) && str(r.topicId) && [1, 2, 3, 4].includes(r.rating) && num(r.at) && num(r.ms) && typeof r.mode === "string",
  bookmarks: (r) => obj(r) && str(r.cardId) && num(r.at),
  notes: (r) => obj(r) && str(r.cardId) && typeof r.text === "string",
  settings: (r) => obj(r) && str(r.key) && (SETTING_OK[r.key]?.(r.value) ?? true),
  snapshots: (r) => obj(r) && num(r.at) && typeof r.label === "string" && obj(r.scores),
  overrides: (r) => obj(r) && str(r.id),
  essayMarks: (r) => obj(r) && str(r.cardId) && obj(r.marks) && Object.values(r.marks).every((v) => typeof v === "boolean") && num(r.at),
  customCards: (r) => obj(r) && str(r.id) && !r.id.includes("~") && str(r.topicId) && typeof r.type === "string" && str(r.front),
};

/**
 * Merge a backup into this device. Keyed rows (schedules, notes, bookmarks, settings, overrides,
 * custom cards) replace rows with the same key, except a card schedule or note the device changed at or after the backup's, which is kept. History rows (reviews, snapshots) are appended with
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
    const incoming = good("cardStates").map((r) => ({
      ...r,
      fsrs: { ...r.fsrs, due: new Date(r.fsrs.due), last_review: r.fsrs.last_review == null ? undefined : new Date(r.fsrs.last_review) },
    }));
    // Skip a backup schedule when this device's copy was reviewed at or after it (a missing last_review counts as 0).
    const at = (d?: Date | null) => (d ? new Date(d).getTime() : 0);
    const local = await db.cardStates.bulkGet(incoming.map((r) => r.cardId));
    const states = incoming.filter((r, i) => {
      const newer = !!local[i] && at(local[i]!.fsrs.last_review) >= at(r.fsrs.last_review);
      if (newer) duplicates++;
      return !newer;
    });
    // Skip a backup note when this device's note was edited at or after it (a missing updatedAt counts as 0).
    const stamp = (n?: { updatedAt?: unknown }) => (n && num(n.updatedAt) ? (n.updatedAt as number) : 0);
    const notes = good("notes");
    const localNotes = await db.notes.bulkGet(notes.map((r) => r.cardId));
    const keptNotes = notes.filter((r, i) => {
      const newer = !!localNotes[i] && stamp(localNotes[i]) >= stamp(r);
      if (newer) duplicates++;
      return !newer;
    });
    for (const [t, rows] of [
      ["cardStates", states],
      ["bookmarks", good("bookmarks")],
      ["notes", keptNotes],
      ["settings", good("settings")],
      ["overrides", good("overrides")],
      ["customCards", good("customCards")],
      ["essayMarks", good("essayMarks")],
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
