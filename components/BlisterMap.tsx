"use client";

import type { TopicMastery } from "@/lib/mastery";
import { PAPERS } from "@/lib/syllabus";
import { LABEL_COLOR } from "./MasteryPill";

/**
 * The syllabus as a blister pack: one strip per paper, one capsule per topic.
 * A capsule fills with its mastery colour from the bottom up. Empty dashed pockets are topics with no cards yet.
 * Tapping a topic with cards calls `onSelect(topicId)`; the parent decides what to show.
 */
export function BlisterMap({
  mastery,
  counts,
  onSelect,
}: {
  mastery?: Map<string, TopicMastery>;
  counts: Map<string, number>;
  onSelect: (topicId: string) => void;
}) {
  return (
    <div className="space-y-3">
      {PAPERS.map((p) => (
        <div key={p.id} className="sheet p-3">
          <div className="mb-3 flex items-baseline justify-between gap-2 px-1">
            <span className="font-mono text-xs font-medium text-ink">{p.id.replace("P", "Paper ")}</span>
            <span className="truncate text-xs text-ink-soft">{p.title.split("—")[1]?.trim()}</span>
          </div>
          <div className="grid grid-cols-4 gap-x-1 gap-y-2 sm:grid-cols-7">
            {p.topics.map((t) => {
              const n = counts.get(t.id) ?? 0;
              const m = mastery?.get(t.id);
              const fill = m?.score ?? (n ? 0 : null);
              const status = m?.score != null ? `${m.score} out of 100` : n ? "not rated yet" : "no cards yet";
              const capsule = (
                <span
                  className={`relative block h-14 w-9 overflow-hidden rounded-full border ${
                    n ? "border-rule bg-well" : "border-dashed border-rule bg-transparent"
                  }`}
                >
                  {fill !== null && (
                    <span
                      className="absolute inset-x-0 bottom-0 transition-[height] duration-700"
                      style={{ height: `${Math.max(fill, 6)}%`, background: LABEL_COLOR[m?.label ?? "unassessed"] }}
                    />
                  )}
                  <span className="absolute inset-x-0 top-1/2 h-px bg-rule/70" />
                </span>
              );
              const name = (
                <span className={`line-clamp-2 text-center text-[10px] leading-tight ${n ? "text-ink-soft" : "text-ink-soft/50"}`}>
                  {t.title.replace(/^PK: /, "PK ").split(/[,&:(]/)[0].trim()}
                </span>
              );
              return n ? (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelect(t.id)}
                  aria-label={`${t.title}, ${status}`}
                  className="flex min-h-11 w-full flex-col items-center gap-1 rounded-xl py-1 transition-colors hover:bg-teal-wash"
                >
                  {capsule}
                  {name}
                </button>
              ) : (
                <div key={t.id} className="flex min-h-11 w-full flex-col items-center gap-1 py-1 opacity-60" title={`${t.title}: ${status}`}>
                  {capsule}
                  {name}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 font-mono text-[11px] text-ink-soft">
        {(["weak", "moderate", "strong", "unassessed"] as const).map((l) => (
          <span key={l} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LABEL_COLOR[l] }} />
            {l === "unassessed" ? "Not rated yet" : l[0].toUpperCase() + l.slice(1)}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-dashed border-ink-soft" />
          No cards yet
        </span>
      </div>
    </div>
  );
}
