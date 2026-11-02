import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import bundled from "../content/all.json";
import { db, importBackup, patchOverride, setSetting } from "../lib/db";
import { recordReview } from "../lib/srs";
import { buildQueue, isRapid, loadAllCards } from "../lib/store";
import type { FlashCard } from "../lib/types";

const CARDS = (bundled as FlashCard[]).filter((c) => !isRapid(c));
const isoIn = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe("audit round 2", () => {
  it("ignores an override that would leave a card unrenderable", async () => {
    const card = CARDS.find((c) => c.type === "basic")!;
    await db.overrides.put({ id: card.id, type: "shortnote", sections: [{ h: "x" }] } as never);
    const got = (await loadAllCards()).find((c) => c.id === card.id)!;
    expect(got.type).toBe("basic");
  });

  it("keeps both fields when two overrides are patched at once", async () => {
    const id = CARDS[0].id;
    await Promise.all([patchOverride({ id, status: "approved" }), patchOverride({ id, front: "Edited" })]);
    expect(await db.overrides.get(id)).toMatchObject({ status: "approved", front: "Edited" });
  });

  it("does not shrink the exam-mode daily quota when a session is reopened", async () => {
    await setSetting("examDate", isoIn(12)); // 2 planning days: rounding cannot hide a double subtraction
    const first = (await buildQueue({ mode: "daily" })).length;
    const done = (await buildQueue({ mode: "daily" })).slice(0, 6);
    for (const c of done) await recordReview(c, 3, 5000, "daily-new");
    expect((await buildQueue({ mode: "daily" })).length).toBe(first - done.length);
  });

  it("drops out-of-range settings from a backup", async () => {
    const res = await importBackup({
      settings: [
        { key: "examDate", value: "banana" },
        { key: "newPerDay", value: -5 },
        { key: "retention", value: 0.9 },
      ],
    });
    expect(res.invalid).toBe(2);
    expect(await db.settings.get("retention")).toMatchObject({ value: 0.9 });
  });
});
