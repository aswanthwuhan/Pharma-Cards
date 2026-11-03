import "fake-indexeddb/auto";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EssayLadder, EssayRail } from "../components/EssayCard";

const sections = [
  { h: "Construct design", points: ["scFv", "CD3 zeta"] },
  { h: "Drugs", points: ["Tisagenlecleucel"] },
  { h: "CRS: tocilizumab", points: ["IL-6R"] },
];

describe("essay card views", () => {
  it("rail starts with no heading revealed and a bar per heading", () => {
    const html = renderToString(createElement(EssayRail, { sections }));
    expect(html).toContain("0<!-- --> of <!-- -->3<!-- --> revealed");
    expect(html).toContain("Recall heading <!-- -->1<!-- --> before opening");
    expect(html.match(/aria-label="Heading \d/g)).toHaveLength(3);
  });

  it("ladder shows every heading collapsed with a recall chip", () => {
    const html = renderToString(createElement(EssayLadder, { cardId: "x", sections }));
    expect(html.match(/recall then tap/g)).toHaveLength(3);
    expect(html).not.toContain("scFv"); // points stay hidden until opened
  });
});
