"use client";

import Link from "next/link";
import { CapsuleMeter, LABEL_COLOR, LABEL_TEXT } from "@/components/MasteryPill";
import { SubtopicList } from "@/components/SubtopicList";
import type { TopicMastery } from "@/lib/mastery";
import type { Topic } from "@/lib/types";

interface Props {
  topic: Topic;
  cardCount: number;
  mastery?: TopicMastery;
  subtopicMastery?: Map<string, TopicMastery>;
  /** Cards in this topic that the student has seen at least once. */
  seen: number;
  /** Cards in this topic that are due now. */
  due: number;
  open: boolean;
  onToggle: () => void;
  /** Subtopic names that matched the active search. */
  matched: string[];
  /** The card deck is still loading, so the count is not known yet. */
  loading?: boolean;
}

/** One topic in the syllabus list: eyebrow, serif title, capsule meter, and a due/status column. */
export function TopicCard({ topic, cardCount, mastery, subtopicMastery, seen, due, open, onToggle, matched, loading = false }: Props) {
  const label = mastery?.label ?? "unassessed";
  const weak = label === "weak";
  const refs = (topic.nmc.length ? ` · NMC ${topic.nmc.join(", ")}` : "") + (topic.refs.length ? ` · ${topic.refs.join(", ")}` : "");
  const panelId = `topic-panel-${topic.id}`;

  if (!cardCount) {
    return (
      <li className="sheet border-dashed px-4 py-4 text-ink-soft">
        <p className="eyebrow min-w-0 truncate">
          {loading ? "Loading…" : "0 cards"}
          {refs}
        </p>
        <p className="mt-1 font-serif text-lg leading-snug text-ink-soft">{topic.title}</p>
        {!loading && <p className="mt-3 font-mono text-xs text-ink-soft">No cards yet</p>}
      </li>
    );
  }

  return (
    <li className="sheet overflow-hidden" style={weak ? { borderLeft: "4px solid var(--color-weak)" } : undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-teal-wash"
      >
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-2">
            <span className="eyebrow min-w-0 truncate">
              {cardCount} {cardCount === 1 ? "card" : "cards"}
              {refs}
            </span>
            {weak && (
              <span
                className="shrink-0 rounded-full border px-2 py-px font-mono text-[11px] font-medium tracking-[0.04em] uppercase"
                style={{ borderColor: "var(--color-weak)", color: "var(--color-weak)" }}
              >
                Weak
              </span>
            )}
          </span>
          <span className="mt-1 block font-serif text-lg leading-snug">{topic.title}</span>
          {matched.length > 0 && (
            <span className="mt-1 block truncate font-mono text-[11px] text-ink-soft">
              Includes {matched.slice(0, 2).join(", ")}
            </span>
          )}
          <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
            <CapsuleMeter m={mastery} />
            <span style={{ color: label === "unassessed" ? "var(--color-ink-soft)" : LABEL_COLOR[label] }}>
              {LABEL_TEXT[label]}
            </span>
            {mastery?.score != null && <span className="tabular-nums text-ink">{mastery.score}</span>}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-3 pt-0.5">
          <span
            className={`whitespace-nowrap font-mono text-[11px] tabular-nums ${seen && due ? "text-ink" : "text-ink-soft"}`}
          >
            {seen ? `${due} due` : "Not started"}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 text-ink-soft transition-transform duration-150 ${open ? "rotate-90" : ""}`}
          >
            <path d="M7 4l6 6-6 6" />
          </svg>
        </span>
      </button>

      {open && (
        <div id={panelId} className="border-t border-rule">
          <SubtopicList topicId={topic.id} mastery={subtopicMastery} order="syllabus" />
          <div className="grid grid-cols-2 gap-2 p-4">
            <Link href={`/study?mode=topic&topic=${topic.id}`} className="btn-ghost w-full">
              Study whole topic
            </Link>
            <Link href={`/study?mode=rapid&topic=${topic.id}`} className="btn-ghost w-full">
              Rapid fire
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}
