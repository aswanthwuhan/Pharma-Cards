"use client";

import { LABEL_COLOR } from "@/components/MasteryPill";

export type OverviewLabel = "strong" | "moderate" | "weak" | "unassessed";
export type OverviewCounts = Record<OverviewLabel, number>;

const NAMES: Record<OverviewLabel, string> = {
  strong: "Strong",
  moderate: "Moderate",
  weak: "Weak",
  unassessed: "Not rated",
};
const ORDER: OverviewLabel[] = ["strong", "moderate", "weak", "unassessed"];

/** Total cards, plus a segmented bar of subtopics by strength. `totalCards` is undefined while loading. */
export function OverviewPanel({ totalCards, counts }: { totalCards?: number; counts: OverviewCounts }) {
  const subtopics = ORDER.reduce((sum, l) => sum + counts[l], 0);
  return (
    <section aria-labelledby="syllabus-overview" className="sheet space-y-5 p-5">
      <div className="space-y-1">
        <h2 id="syllabus-overview" className="eyebrow">
          Overview
        </h2>
        <p className="flex items-baseline gap-2">
          <span className="font-serif text-5xl leading-none tabular-nums">{totalCards ?? "–"}</span>
          <span className="text-sm text-ink-soft">
            {totalCards === undefined ? "Loading…" : `${totalCards === 1 ? "card" : "cards"} in the syllabus`}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-ink-soft">
          <span className="font-mono tabular-nums text-ink">{subtopics}</span> {subtopics === 1 ? "subtopic" : "subtopics"}, by how well you know them
        </p>
        <div
          role="img"
          aria-label={`${subtopics} subtopics: ${ORDER.map((l) => `${counts[l]} ${NAMES[l].toLowerCase()}`).join(", ")}`}
          className="flex h-2.5 gap-[3px] overflow-hidden rounded-full bg-unseen"
        >
          {subtopics > 0 &&
            ORDER.map((l) =>
              counts[l] ? (
                <span
                  key={l}
                  className="h-full rounded-full"
                  style={{ width: `${(counts[l] / subtopics) * 100}%`, background: LABEL_COLOR[l] }}
                />
              ) : null,
            )}
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
          {ORDER.map((l) => (
            <li key={l} className="flex items-center gap-2">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: LABEL_COLOR[l] }} />
              <span className="text-ink-soft">{NAMES[l]}</span>
              <span className="ml-auto tabular-nums text-ink">{counts[l]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
