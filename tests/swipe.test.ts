import { describe, expect, it } from "vitest";
import { rollupMastery, type TopicMastery } from "../lib/mastery";
import { classifySwipe, dragAxis, swipeIntent } from "../lib/swipe";

const base = { vx: 0, vy: 0, width: 360, height: 600, allowVertical: true };

describe("swipe classification", () => {
  it("maps the four directions to Forgot / Hard / Good / Easy", () => {
    expect(classifySwipe({ ...base, dx: -200, dy: 10 })).toBe(1);
    expect(classifySwipe({ ...base, dx: 200, dy: -10 })).toBe(3);
    expect(classifySwipe({ ...base, dx: 5, dy: -200 })).toBe(4);
    expect(classifySwipe({ ...base, dx: -5, dy: 200 })).toBe(2);
  });

  it("snaps back on short, slow drags", () => {
    expect(classifySwipe({ ...base, dx: 60, dy: 0 })).toBeNull(); // < 26% of 360
    expect(classifySwipe({ ...base, dx: 0, dy: -50 })).toBeNull();
    expect(classifySwipe({ ...base, dx: 100, dy: 0 })).toBe(3); // just over a quarter
  });

  it("commits a fast flick even when the drag is short", () => {
    expect(classifySwipe({ ...base, dx: 50, dy: 0, vx: 900 })).toBe(3);
    expect(classifySwipe({ ...base, dx: 0, dy: -40, vy: -600 })).toBe(4);
    // ...but not a flick against the drag direction, or a tiny twitch
    expect(classifySwipe({ ...base, dx: 50, dy: 0, vx: -900 })).toBeNull();
    expect(classifySwipe({ ...base, dx: 10, dy: 0, vx: 900 })).toBeNull();
  });

  it("locks to the dominant axis", () => {
    expect(dragAxis(100, 60, true)).toBe("x");
    expect(dragAxis(60, 100, true)).toBe("y");
  });

  it("never grades vertically while a long answer owns vertical scrolling", () => {
    expect(dragAxis(10, 300, false)).toBe("x");
    expect(classifySwipe({ ...base, allowVertical: false, dx: 10, dy: -300, vy: -1500 })).toBeNull();
    expect(classifySwipe({ ...base, allowVertical: false, dx: -200, dy: 30 })).toBe(1);
  });

  it("previews the grade being approached", () => {
    expect(swipeIntent({ dx: 5, dy: 0, width: 360, height: 600, allowVertical: true })).toBeNull();
    const half = swipeIntent({ dx: -46.8, dy: 0, width: 360, height: 600, allowVertical: true })!;
    expect(half.grade).toBe(1);
    expect(half.strength).toBeCloseTo(0.5, 1);
  });
});

describe("subtopic roll-up", () => {
  const sub = (cards: number, score: number | null, coverage = 1): TopicMastery => ({
    topicId: "s",
    cards,
    score,
    label: "moderate",
    coverage,
    reviews: score === null ? 0 : 5,
    accuracy: score === null ? null : score / 100,
    retention: null,
  });

  it("is the card-weighted mean of the rated subtopics", () => {
    const t = rollupMastery("t", [sub(30, 40), sub(10, 80)]);
    expect(t.score).toBe(50); // (30*40 + 10*80) / 40
    expect(t.label).toBe("moderate");
    expect(t.cards).toBe(40);
  });

  it("ignores unrated subtopics for the score but counts them for coverage", () => {
    const t = rollupMastery("t", [sub(10, 90), sub(10, null, 0)]);
    expect(t.score).toBe(90);
    expect(t.coverage).toBeCloseTo(0.5);
  });

  it("is unrated when no subtopic is rated", () => {
    expect(rollupMastery("t", [sub(5, null, 0)]).label).toBe("unassessed");
  });
});

import { reversed } from "../lib/store";
describe("rapid fire reversal", () => {
  it("swaps question and answer and keeps a separate schedule id", () => {
    const c = { id: "rf-x-0001", topicId: "x", type: "rapid" as const, front: "Antidote for OP poisoning", back: "Atropine + pralidoxime" };
    const r = reversed(c);
    expect(r.front).toBe(c.back);
    expect(r.back).toBe(c.front);
    expect(r.id).toBe("rf-x-0001~r");
    expect(reversed(r).front).toBe(c.front);
  });
});
