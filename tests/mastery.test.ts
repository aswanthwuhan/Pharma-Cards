import { describe, expect, it } from "vitest";
import { groupMastery as topicMastery, groupWeight as topicWeight, labelFor, rollupMastery, weightedAccuracy } from "../lib/mastery";
import { stratifiedSample, weakPriority } from "../lib/sampler";
import type { FlashCard, ReviewEvent } from "../lib/types";

const rev = (rating: 1 | 2 | 3 | 4, i: number, ms = 15000): ReviewEvent => ({
  cardId: `c${i}`,
  topicId: "t",
  rating,
  at: 1000 + i,
  ms,
});
const ids = Array.from({ length: 10 }, (_, i) => `c${i}`);

describe("mastery", () => {
  it("is unassessed with fewer than 3 answers", () => {
    const m = topicMastery("t", ids, [rev(4, 0), rev(4, 1)], new Map());
    expect(m.label).toBe("unassessed");
    expect(m.score).toBeNull();
  });

  it("labels consistent Again answers as weak", () => {
    const reviews = ids.map((_, i) => rev(1, i));
    const recall = new Map(ids.map((id) => [id, 0.3]));
    expect(topicMastery("t", ids, reviews, recall).label).toBe("weak");
  });

  it("labels consistent Easy answers with good recall as strong", () => {
    const reviews = ids.map((_, i) => rev(4, i));
    const recall = new Map(ids.map((id) => [id, 0.95]));
    expect(topicMastery("t", ids, reviews, recall).label).toBe("strong");
  });

  it("shrinks small samples toward 50%", () => {
    expect(weightedAccuracy([rev(4, 0)])!).toBeLessThan(0.7);
  });

  it("weights recent answers more", () => {
    const improving = [rev(1, 0), rev(1, 1), rev(1, 2), rev(4, 3), rev(4, 4), rev(4, 5)];
    const declining = [rev(4, 0), rev(4, 1), rev(4, 2), rev(1, 3), rev(1, 4), rev(1, 5)];
    expect(weightedAccuracy(improving)!).toBeGreaterThan(weightedAccuracy(declining)!);
  });

  it("thresholds", () => {
    expect(labelFor(80)).toBe("strong");
    expect(labelFor(60)).toBe("moderate");
    expect(labelFor(30)).toBe("weak");
  });
});

describe("sampler", () => {
  const cards: FlashCard[] = ["a", "b", "c", "d"].flatMap((t) =>
    Array.from({ length: 30 }, (_, i) => ({ id: `${t}${i}`, topicId: t, type: "basic" as const, front: "q", back: "a" })),
  );

  it("covers every topic in a random sample", () => {
    const s = stratifiedSample(cards, 8);
    expect(new Set(s.map((c) => c.topicId)).size).toBe(4);
    expect(s).toHaveLength(8);
    expect(new Set(s.map((c) => c.id)).size).toBe(8);
  });

  it("oversamples weak topics", () => {
    const w = (t: string) => (t === "a" ? topicWeight({ score: 20 } as never) : topicWeight({ score: 90 } as never));
    let a = 0;
    for (let k = 0; k < 50; k++) a += stratifiedSample(cards, 40, w).filter((c) => c.topicId === "a").length;
    expect(a / 50).toBeGreaterThan(20); // well above the 10/40 an even split would give
  });

  it("prioritises missed cards over fading and unseen ones", () => {
    expect(weakPriority({ lastRating: 1, recall: 0.9 })).toBeGreaterThan(weakPriority({ recall: 0.5 }));
    expect(weakPriority({ recall: 0.5 })).toBeGreaterThan(weakPriority({ recall: null }));
    expect(weakPriority({ recall: null })).toBeGreaterThan(weakPriority({ recall: 0.95 }));
  });
});

describe("robust weak/strong", () => {
  it("does not call a group strong when most cards are unseen", () => {
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const recall = new Map<string, number | null>([["a", 1], ["b", 1]]);
    const reviews = [1, 2, 3, 4].map((i) => ({ cardId: "a", topicId: "t", rating: 4 as const, at: Date.now() - i, ms: 5000 }));
    const m = topicMastery("g", ids, reviews, recall);
    expect(m.label).not.toBe("strong");
  });

  it("ignores zero or missing timings when judging speed", () => {
    const ids = ["a", "b", "c"];
    const recall = new Map<string, number | null>(ids.map((id) => [id, 0.9]));
    const reviews = ids.map((id, i) => ({ cardId: id, topicId: "t", rating: 3 as const, at: Date.now() - i, ms: i === 0 ? 0 : NaN }));
    expect(topicMastery("g", ids, reviews, recall).score).not.toBeNull();
  });

  it("rollup pulls a topic to the middle when most subtopics are unassessed", () => {
    const rated = { topicId: "s1", cards: 2, score: 100, label: "strong" as const, coverage: 1, reviews: 9, accuracy: 1, retention: 1 };
    const unrated = { topicId: "s2", cards: 18, score: null, label: "unassessed" as const, coverage: 0, reviews: 0, accuracy: null, retention: null };
    const r = rollupMastery("t", [rated, unrated]);
    expect(r.score).toBeLessThan(60);
  });
});

describe("label hysteresis", () => {
  it("keeps strong until the score drops below 72", () => {
    expect(labelFor(73, "strong")).toBe("strong");
    expect(labelFor(71, "strong")).toBe("moderate");
    expect(labelFor(73)).toBe("moderate");
    expect(labelFor(75)).toBe("strong");
  });
  it("keeps moderate until the score drops below 47", () => {
    expect(labelFor(48, "moderate")).toBe("moderate");
    expect(labelFor(46, "moderate")).toBe("weak");
    expect(labelFor(48, "weak")).toBe("weak");
  });
});
