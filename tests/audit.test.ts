import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import bundled from "../content/all.json";
import { db, importBackup, setSetting, type CardState } from "../lib/db";
import { recallProbability, recordReview, schedulerFor } from "../lib/srs";
import { buildQueue, computeMastery, dailyNewTarget, isRapid } from "../lib/store";
import type { FlashCard } from "../lib/types";

const ALL = bundled as FlashCard[];
const CARDS = ALL.filter((c) => !isRapid(c));
const RAPID = ALL.filter(isRapid);
const card = CARDS[0];
const isoIn = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe("backup import", () => {
  it("appends history with fresh ids, skips duplicates and damaged rows", async () => {
    const localId = await db.reviews.add({ cardId: "a", topicId: "t", rating: 3, at: 1000, ms: 1, mode: "daily" });
    await db.snapshots.add({ at: 5, label: "x", scores: {} });
    const res = await importBackup({
      reviews: [
        { id: localId, cardId: "b", topicId: "t", rating: 4, at: 2000, ms: 1, mode: "daily" }, // same id, different review
        { id: 99, cardId: "a", topicId: "t", rating: 3, at: 1000, ms: 1, mode: "daily" }, // already here
        { id: 100, cardId: "c", rating: 9 }, // damaged
      ],
      snapshots: [{ id: 1, at: 5, label: "x", scores: {} }, { id: 1, at: 6, label: "y", scores: {} }],
      cardStates: [{ cardId: "z", topicId: "t", due: 1, lastRating: 3, fsrs: { due: "nope" } }],
    });
    expect(res).toEqual({ added: 2, invalid: 2, duplicates: 2 });
    expect((await db.reviews.get(localId))!.cardId).toBe("a"); // local row untouched
    expect((await db.reviews.toArray()).map((r) => r.cardId).sort()).toEqual(["a", "b"]);
    expect((await db.snapshots.toArray()).map((s) => s.at).sort()).toEqual([5, 6]);
    expect(await db.cardStates.count()).toBe(0);
  });
});

describe("dailyNewTarget", () => {
  it("ignores Rapid and reversed (~r) states", async () => {
    await setSetting("examDate", isoIn(60));
    const cards = CARDS.slice(0, 500);
    const rapidSeen = new Set([...RAPID.slice(0, 400).map((c) => c.id), ...RAPID.slice(0, 400).map((c) => `${c.id}~r`)]);
    expect(await dailyNewTarget(cards, rapidSeen)).toBe(await dailyNewTarget(cards, new Set()));
  });

  it("does not drop to 0 inside the final 10 days", async () => {
    await setSetting("examDate", isoIn(5));
    await setSetting("newPerDay", 7);
    expect(await dailyNewTarget(CARDS.slice(0, 50), new Set())).toBe(7);
  });
});

describe("srs robustness", () => {
  it("NaN retention falls back to 0.9", () => {
    expect(schedulerFor(NaN)).toBe(schedulerFor(0.9));
  });

  it("a corrupt FSRS state gives null recall and does not break mastery or queues", async () => {
    const bad = { cardId: card.id, topicId: card.topicId, due: 0, lastRating: 3, fsrs: { reps: 2, due: "garbage", last_review: "garbage", stability: NaN } } as unknown as CardState;
    await db.cardStates.put(bad);
    expect(recallProbability(bad)).toBeNull();
    await expect(computeMastery()).resolves.toBeDefined();
    await expect(buildQueue({ mode: "weak" })).resolves.toBeDefined();
  });

  it("logs a first-ever daily answer as daily-new", async () => {
    await recordReview(card, 3, 1000, "daily");
    await recordReview(card, 3, 1000, "daily");
    expect((await db.reviews.toArray()).map((r) => r.mode)).toEqual(["daily-new", "daily"]);
  });
});
