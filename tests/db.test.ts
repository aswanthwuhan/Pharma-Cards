import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import bundled from "../content/all.json";
import { db, importBackup } from "../lib/db";
import { recordReview, undoReview } from "../lib/srs";
import { buildQueue, computeMastery, isRapid } from "../lib/store";
import type { FlashCard } from "../lib/types";

// Study cards only: Rapid Fire cards never enter normal sessions or mastery.
const CARDS = (bundled as FlashCard[]).filter((c) => !isRapid(c));
const card = CARDS[0];

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe("undo", () => {
  it("restores a previously seen card's exact FSRS state and removes the log row", async () => {
    await recordReview(card, 3, 5000, "test");
    const before = await db.cardStates.get(card.id);
    const u = await recordReview(card, 1, 5000, "test");
    expect((await db.cardStates.get(card.id))!.lastRating).toBe(1);
    await undoReview(u);
    const after = await db.cardStates.get(card.id);
    expect(after!.due).toBe(before!.due);
    expect(after!.fsrs.reps).toBe(before!.fsrs.reps);
    expect(after!.fsrs.stability).toBe(before!.fsrs.stability);
    expect(await db.reviews.count()).toBe(1);
  });

  it("makes a first-time card unseen again", async () => {
    const u = await recordReview(card, 4, 5000, "test");
    await undoReview(u);
    expect(await db.cardStates.get(card.id)).toBeUndefined();
    expect(await db.reviews.count()).toBe(0);
  });
});

describe("backup import", () => {
  const DAY = 86_400_000;
  // Backups are JSON, so round-trip the row the way an exported file would store it.
  const asBackup = (row: unknown) => JSON.parse(JSON.stringify(row));

  it("keeps a newer local schedule over an older backup, and takes a newer backup", async () => {
    await recordReview(card, 3, 5000, "test");
    const local = (await db.cardStates.get(card.id))!;
    const reviewed = local.fsrs.last_review!.getTime();

    const older = asBackup({ ...local, lastRating: 1, fsrs: { ...local.fsrs, last_review: new Date(reviewed - DAY) } });
    await importBackup({ cardStates: [older] });
    expect((await db.cardStates.get(card.id))!.lastRating).toBe(3);

    await db.cardStates.put({ ...local, fsrs: { ...local.fsrs, last_review: new Date(reviewed - 2 * DAY) } });
    const newer = asBackup({ ...local, lastRating: 1, fsrs: { ...local.fsrs, last_review: new Date(reviewed + DAY) } });
    await importBackup({ cardStates: [newer] });
    expect((await db.cardStates.get(card.id))!.lastRating).toBe(1);
  });

  it("keeps a newer local note over an older backup, and takes a newer backup note", async () => {
    await db.notes.put({ cardId: card.id, text: "edited here", updatedAt: 2000 });
    await importBackup({ notes: [asBackup({ cardId: card.id, text: "old", updatedAt: 1000 })] });
    expect((await db.notes.get(card.id))!.text).toBe("edited here");

    await importBackup({ notes: [asBackup({ cardId: card.id, text: "newer", updatedAt: 3000 })] });
    expect((await db.notes.get(card.id))!.text).toBe("newer");
  });
});

describe("subtopic mastery and weak mode", () => {
  // Two subtopics of the same topic: answer one badly, the other well.
  const topic = CARDS[0].topicId;
  const subs = [...new Set(CARDS.filter((c) => c.topicId === topic).map((c) => c.subtopic))];
  const weakSub = subs[0]!;
  const strongSub = subs[1]!;
  const inSub = (s: string) => CARDS.filter((c) => c.subtopic === s);

  async function seed() {
    for (const c of inSub(weakSub)) for (let k = 0; k < 2; k++) await recordReview(c, 1, 30000, "test");
    for (const c of inSub(strongSub)) for (let k = 0; k < 2; k++) await recordReview(c, 4, 5000, "test");
  }

  it("rates subtopics separately and rolls them into the topic", async () => {
    await seed();
    const m = await computeMastery();
    expect(m.subtopic.get(weakSub)!.label).toBe("weak");
    expect(m.subtopic.get(strongSub)!.score!).toBeGreaterThan(m.subtopic.get(weakSub)!.score!);
    const t = m.topic.get(topic)!;
    expect(t.score!).toBeGreaterThan(m.subtopic.get(weakSub)!.score!);
    expect(t.score!).toBeLessThan(m.subtopic.get(strongSub)!.score!);
  });

  it("groups by question type", async () => {
    await seed();
    const m = await computeMastery();
    const tag = inSub(weakSub)[0].tags![0];
    expect(m.tag.get(tag)!.reviews).toBeGreaterThan(0);
  });

  it("weak mode only picks from weak or moderate subtopics", async () => {
    await seed();
    const m = await computeMastery();
    const allowed = new Set([...m.subtopic.values()].filter((x) => x.label === "weak" || x.label === "moderate").map((x) => x.topicId));
    const q = await buildQueue({ mode: "weak", size: 30 });
    expect(q.length).toBeGreaterThan(0);
    for (const c of q) expect(allowed.has(c.subtopic!)).toBe(true);
    expect(q.some((c) => c.subtopic === strongSub)).toBe(false);
  });

  it("subtopic and tag filters restrict the session", async () => {
    const q = await buildQueue({ mode: "topic", subtopicIds: [weakSub] });
    expect(q.length).toBe(inSub(weakSub).length);
    const tq = await buildQueue({ mode: "topic", tag: "poisoning" });
    expect(tq.every((c) => c.tags?.includes("poisoning"))).toBe(true);
  });
});
