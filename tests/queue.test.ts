import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import bundled from "../content/all.json";
import { createEmptyCard } from "ts-fsrs";
import { db, setSetting } from "../lib/db";
import { cardLevel } from "../lib/levels";
import { buildQueue, dailyNewTarget, isRapid, MAX_DUE_PER_SESSION, MAX_NEW_PER_DAY } from "../lib/store";
import type { FlashCard } from "../lib/types";

// Study cards only: Rapid Fire cards never enter normal sessions.
const CARDS = (bundled as FlashCard[]).filter((c) => !isRapid(c));

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

/** A local calendar day `days` from today as YYYY-MM-DD (the format the exam date setting uses). */
function localDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

describe("exam planner", () => {
  it("caps the daily new target at MAX_NEW_PER_DAY when the revision window is one day", async () => {
    // 11 days out leaves 1 day before the 10-day revision window, so the whole unseen pool would land on one day.
    await setSetting("examDate", localDate(11));
    expect(CARDS.length).toBeGreaterThan(MAX_NEW_PER_DAY);
    expect(await dailyNewTarget(CARDS, { has: () => false })).toBe(MAX_NEW_PER_DAY);
  });
});

describe("study queue", () => {
  it("never serves the same question twice in a diagnostic session", async () => {
    const q = await buildQueue({ mode: "diagnostic", size: 5000 });
    const fronts = q.map((c) => c.front.trim().toLowerCase());
    expect(new Set(fronts).size).toBe(fronts.length);
  });

  it("caps a daily session at MAX_DUE_PER_SESSION and serves no new cards during a backlog", async () => {
    const backlog = CARDS.slice(0, MAX_DUE_PER_SESSION + 50);
    const fsrs = { ...createEmptyCard(new Date()), reps: 1 };
    await db.cardStates.bulkPut(
      backlog.map((c) => ({ cardId: c.id, topicId: c.topicId, fsrs, due: Date.now() - 86_400_000, lastRating: 3 })),
    );
    const due = new Set(backlog.map((c) => c.id));
    const q = await buildQueue({ mode: "daily" });
    expect(q.length).toBeLessThanOrEqual(MAX_DUE_PER_SESSION);
    expect(q.every((c) => due.has(c.id))).toBe(true);
  });

  it("serves only level 1 new cards in a random session when nothing is unlocked", async () => {
    const q = await buildQueue({ mode: "random", size: 300 });
    expect(q.length).toBeGreaterThan(0);
    expect(q.every((c) => cardLevel(c) === 1)).toBe(true);
  });
});
