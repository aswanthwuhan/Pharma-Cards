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
