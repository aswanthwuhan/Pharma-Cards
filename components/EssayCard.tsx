"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "@/lib/db";
import type { Section } from "@/lib/types";

/** A tap inside the essay must not flip the card or start a swipe. */
const stop = (fn: () => void) => (e: React.MouseEvent) => {
  e.stopPropagation();
  fn();
};
const ink = "text-[#1f5c48]";
const short = (h: string) => h.split(/[\s:,&(]+/)[0];

function Points({ points }: { points: string[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1 text-[16px] leading-snug marker:text-porcelain-soft">
      {points.map((p, j) => (
        <li key={j}>{p}</li>
      ))}
    </ul>
  );
}

/**
 * Concept A, "Progress Rail": headings appear one at a time, stacked; a rail pinned to the bottom of the
 * card shows how many are open. Recall the next heading in your head, then tap the next bar to check it.
 */
export function EssayRail({ sections }: { sections: Section[] }) {
  const [shown, setShown] = useState(0);
  const next = () => setShown((n) => Math.min(sections.length, n + 1));
  return (
    <div>
      <p className="font-mono text-[11px] tracking-wide text-porcelain-soft uppercase">
        Headings: {shown} of {sections.length} revealed
      </p>
      <div className="mt-3 space-y-3">
        {sections.slice(0, shown).map((s, i) => (
          <section key={i} className="rounded-lg border border-porcelain-rule bg-porcelain-2/60 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-porcelain-ink font-mono text-[11px] text-porcelain">{i + 1}</span>
              <h3 className={`flex-1 font-serif text-[17px] leading-snug ${ink}`}>{s.h}</h3>
              <span className="font-mono text-[10px] text-porcelain-soft uppercase">Revealed</span>
            </div>
            <div className="mt-2">
              <Points points={s.points} />
            </div>
          </section>
        ))}
        {shown < sections.length && (
          <button
            type="button"
            onClick={stop(next)}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#7fd8b5] font-mono text-xs text-[#1f5c48]"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#2fb383]" />
            Recall heading {shown + 1} before opening
          </button>
        )}
      </div>
      {/* In normal flow, not sticky: the card's own scroll area and swipe zone made a sticky rail cover the prompt. */}
      <div className="mt-4 border-t border-porcelain-rule pt-3">
        <div className="flex items-center justify-between font-mono text-[11px] text-porcelain-soft uppercase">
          <span>Progress rail</span>
          <span className="normal-case">
            {shown} of {sections.length}
            {shown < sections.length ? " · tap the next bar" : " · all open"}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5" role="group" aria-label="Essay headings">
          {sections.map((s, i) => {
            const isNext = i === shown;
            return (
              <button
                key={i}
                type="button"
                disabled={!isNext}
                aria-label={`Heading ${i + 1}${i < shown ? ", revealed" : isNext ? ", reveal next" : ""}`}
                onClick={stop(next)}
                className="min-w-0 flex-1 text-left disabled:cursor-default"
              >
                <span
                  className={`block h-2.5 rounded-full ${i < shown ? "bg-[#2fb383]" : isNext ? "bg-[#7fd8b5] ring-2 ring-[#1f5c48]" : "bg-porcelain-rule"}`}
                />
                <span className={`mt-1 block truncate font-mono text-[10px] ${isNext ? "font-semibold text-porcelain-ink" : "text-porcelain-soft"}`}>
                  {i + 1}. {short(s.h)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Concept B, "Heading Ladder": every heading is a collapsed outline row. Recall its points, tap to open,
 * then log ✓ recalled / ✗ missed. Marks are saved per card (essayMarks table) so they survive reloads.
 */
export function EssayLadder({ cardId, sections }: { cardId: string; sections: Section[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const saved = useLiveQuery(() => db.essayMarks.get(cardId), [cardId]);
  const marks = saved?.marks ?? {};
  const setMark = (i: number, ok: boolean) =>
    db.essayMarks.put({ cardId, marks: { ...marks, [i]: ok }, at: Date.now() });
  const nOk = Object.values(marks).filter((v) => v).length;
  const nMiss = Object.values(marks).filter((v) => !v).length;
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] text-porcelain-soft uppercase">
        <span>Outline ladder · {sections.length} headings</span>
        <span className="normal-case" aria-label={`${nOk} recalled, ${nMiss} missed, ${sections.length - nOk - nMiss} not marked`}>
          <b className="text-[var(--color-strong)]">{nOk} ✓</b> <b className="text-[var(--color-weak)]">{nMiss} ✗</b> {sections.length - nOk - nMiss} ?
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {sections.map((s, i) => {
          const isOpen = open.has(i);
          const mark = marks[i] as boolean | undefined;
          const missed = mark === false;
          return (
            <section
              key={i}
              className={`overflow-hidden rounded-lg border ${missed ? "border-[var(--color-weak)] bg-[color-mix(in_srgb,var(--color-weak)_10%,transparent)]" : "border-porcelain-rule bg-porcelain-2/60"}`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={stop(() => setOpen((o) => new Set(o).add(i)))}
                className="flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left"
              >
                <span
                  aria-hidden
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[12px]"
                  style={{
                    borderColor: mark === undefined ? "var(--color-porcelain-rule, #cfd8d4)" : mark ? "var(--color-strong)" : "var(--color-weak)",
                    color: mark ? "var(--color-strong)" : "var(--color-weak)",
                  }}
                >
                  {mark === undefined ? "" : mark ? "✓" : "✗"}
                </span>
                <span className={`flex-1 font-serif text-[16px] leading-snug ${ink}`}>
                  {i + 1}. {s.h}
                </span>
                {mark !== undefined ? (
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${mark ? "border-[var(--color-strong)] text-[var(--color-strong)]" : "border-[var(--color-weak)] text-[var(--color-weak)]"}`}>
                    {mark ? "Recalled" : "Missed"}
                  </span>
                ) : (
                  !isOpen && <span className="rounded-full bg-[#d9efe4] px-2 py-0.5 font-mono text-[10px] text-[#1f5c48]">recall then tap</span>
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3">
                  <Points points={s.points} />
                  <div className="mt-3 flex gap-2">
                    {([true, false] as const).map((ok) => (
                      <button
                        key={String(ok)}
                        type="button"
                        aria-pressed={mark === ok}
                        onClick={stop(() => setMark(i, ok))}
                        className="min-h-9 flex-1 rounded-full border px-3 font-mono text-xs"
                        style={{
                          borderColor: ok ? "var(--color-strong)" : "var(--color-weak)",
                          background: mark === ok ? `color-mix(in srgb, ${ok ? "var(--color-strong)" : "var(--color-weak)"} 18%, transparent)` : "transparent",
                        }}
                      >
                        {ok ? "✓ Recalled" : "✗ Missed"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <p className="pt-3 text-center font-mono text-[11px] text-porcelain-soft">
        {open.size} of {sections.length} expanded · tap ✓ / ✗ to log a sub-score
      </p>
    </div>
  );
}
