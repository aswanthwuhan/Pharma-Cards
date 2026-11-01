"use client";

import Link from "next/link";
import { LABEL_COLOR, LABEL_TEXT } from "@/components/MasteryPill";
import type { MasteryLabel } from "@/lib/mastery";
import type { Paper } from "@/lib/types";
import type { PaperSummary } from "./paperSummary";

/** Vertical capsule tube, filled from the bottom by the score, with quarter ticks. */
export function VerticalCapsule({ score, label, className = "" }: { score: number | null; label: MasteryLabel; className?: string }) {
  return (
    <span className={`relative block h-14 w-4 shrink-0 overflow-hidden rounded-full border border-rule bg-well ${className}`} aria-hidden>
      {score != null && (
        <span
          className="absolute inset-x-0 bottom-0 transition-[height] duration-500"
          style={{ height: `${Math.max(score, 6)}%`, background: LABEL_COLOR[label] }}
        />
      )}
      {[25, 50, 75].map((p) => (
        <span key={p} className="absolute inset-x-0 h-px bg-rule/60" style={{ bottom: `${p}%` }} />
      ))}
    </span>
  );
}

export function paperLabel(paper: Paper) {
  return paper.title.split("—")[0].trim();
}

/**
 * One paper tile. Tapping selects it (inline "Study topic" and "All topics" appear);
 * "All topics" opens the paper's sheet.
 */
export function PaperCard({
  paper,
  summary,
  selected,
  onToggle,
  onOpen,
}: {
  paper: Paper;
  summary: PaperSummary;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const label = paperLabel(paper);
  const subject = (paper.title.split("—")[1]?.trim() ?? paper.title).split(" (")[0];
  const scoreColor = summary.score != null ? LABEL_COLOR[summary.label] : "var(--color-ink-soft)";
  const w = summary.weakest;
  const name = w ? summary.weakestTitle : summary.cards ? "No topics rated yet" : "No cards yet";
  const count = w ? w.cards : summary.cards;
  const tag = w ? LABEL_TEXT[w.label] : summary.cards ? "Not rated yet" : "No cards yet";
  const tagColor = w && w.label !== "unassessed" ? LABEL_COLOR[w.label] : "var(--color-ink-soft)";

  return (
    <div
      className={`glass rounded-xl flex flex-col p-4 transition-colors lg:p-5 ${selected ? "" : "hover:border-teal"}`}
      style={selected ? { borderColor: "var(--color-teal)", background: "var(--color-teal-wash)" } : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        aria-label={`${label}, ${summary.score != null ? `${summary.score} percent mastery` : "no mastery yet"}`}
        className="flex min-h-11 flex-1 flex-col text-left"
      >
        <span className="flex items-start justify-between gap-2">
          <span className="eyebrow">{label}</span>
          <span className="font-mono text-sm font-medium tabular-nums" style={{ color: scoreColor }}>
            {summary.score != null ? `${summary.score}%` : "--%"}
          </span>
        </span>
        <span className="mt-1 hidden font-serif text-lg leading-snug lg:line-clamp-2 lg:block">{subject}</span>
        <span className="mt-4 flex flex-1 items-end gap-3">
          <VerticalCapsule score={summary.score} label={summary.label} />
          <span className="min-w-0">
            <span className="line-clamp-2 block text-sm font-semibold leading-snug">{name}</span>
            <span className="mt-1 block font-mono text-[11px] tabular-nums text-ink-soft">{count} cards</span>
            <span className="eyebrow mt-1 block" style={{ color: tagColor }}>
              {tag}
            </span>
          </span>
        </span>
      </button>

      {selected && (
        <div className="reveal-in mt-3 flex flex-wrap items-center gap-2 border-t border-rule pt-3">
          {summary.studyTopicId ? (
            <Link href={`/study?mode=topic&topic=${summary.studyTopicId}`} className="btn-primary min-h-11 flex-1 px-4 text-sm">
              Study topic →
            </Link>
          ) : (
            <span className="font-mono text-xs text-ink-soft">No cards to study yet</span>
          )}
          <button type="button" onClick={onOpen} className="min-h-11 px-2 text-sm text-ink-soft underline-offset-4 hover:text-teal hover:underline">
            All topics
          </button>
        </div>
      )}
    </div>
  );
}
