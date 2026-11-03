import { describe, expect, it } from "vitest";
import { isOpen, levelOrder, reachedTop, unlockedLevels } from "../lib/levels";
import type { FlashCard } from "../lib/types";

const card = (id: string, level?: 1 | 2 | 3, subtopic = "s1"): FlashCard => ({ id, topicId: "t", subtopic, type: "basic", front: "q", back: "a", tags: ["pk"], level });

describe("unlockedLevels", () => {
  const cards = [card("a", 1), card("b", 1), card("c", 2), card("d", 3)];

  it("starts at level 1 with nothing rated", () => {
    expect(unlockedLevels(cards, new Map()).get("s1")).toBe(1);
  });

  it("opens level 2 once 80% of level 1 is rated Good or Easy", () => {
    const rated = new Map([["a", 3], ["b", 1]]);
    expect(unlockedLevels(cards, rated).get("s1")).toBe(1);
    expect(unlockedLevels([card("a", 1), card("b", 1), card("c", 2)], new Map([["a", 4], ["b", 3]])).get("s1")).toBe(2);
  });

  it("treats an empty level as passed", () => {
    expect(unlockedLevels([card("a", 1), card("d", 3)], new Map([["a", 3]])).get("s1")).toBe(3);
  });

  it("keeps subtopics independent", () => {
    const two = [card("a", 1, "x"), card("b", 2, "y")];
    const m = unlockedLevels(two, new Map([["a", 3]]));
    // "x" has no level 2/3 cards, so its ladder is already complete.
    // "y" has no level 1 cards (passed), but its unrated level 2 card blocks level 3.
    expect(m.get("x")).toBe(3);
    expect(m.get("y")).toBe(2);
  });
});

describe("isOpen", () => {
  it("hides cards above the open level and treats missing level as 1", () => {
    const m = new Map([["s1", 1]]);
    expect(isOpen(card("a"), m)).toBe(true);
    expect(isOpen(card("c", 2), m)).toBe(false);
  });
});

describe("ladder robustness", () => {
  it("does not count a Good answer that FSRS says is now forgotten", () => {
    const cards = [card("a", 1), card("b", 2)];
    expect(unlockedLevels(cards, new Map([["a", { lastRating: 3, recall: 0.4 }]])).get("s1")).toBe(1);
    expect(unlockedLevels(cards, new Map([["a", { lastRating: 3, recall: 0.9 }]])).get("s1")).toBe(2);
  });

  it("caps the good answers needed in a big level at 10", () => {
    const big = Array.from({ length: 40 }, (_, i) => card(`c${i}`, 1));
    const rated = new Map(big.slice(0, 10).map((c) => [c.id, 4]));
    expect(unlockedLevels([...big, card("x", 2)], rated).get("s1")).toBe(2);
  });

  it("blocks the next level while most seen cards are failing", () => {
    const big = Array.from({ length: 40 }, (_, i) => card(`c${i}`, 1));
    const rated = new Map(big.slice(0, 20).map((c, i) => [c.id, i < 10 ? 4 : 1]));
    expect(unlockedLevels([...big, card("x", 2)], rated).get("s1")).toBe(1);
  });
});

describe("levelOrder and reachedTop", () => {
  it("orders basic before advanced, stable inside a level", () => {
    expect(levelOrder([card("c", 3), card("a", 1), card("b", 2), card("a2", 1)]).map((c) => c.id)).toEqual(["a", "a2", "b", "c"]);
  });
  it("needs a held top-level card", () => {
    const cards = [card("a", 1), card("d", 3)];
    expect(reachedTop(cards, new Map([["a", 4]]))).toBe(false);
    expect(reachedTop(cards, new Map([["d", 3]]))).toBe(true);
  });
});
