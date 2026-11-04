import Link from "next/link";
import { useState } from "react";
import type { FlashCard } from "@/lib/types";

import { CoverageBar, LabelChip, labelColor } from "./bits";
import { CARD_TYPE_LABEL, labelOf, paperTitle, statusWord, PAPER_TAB, type Row } from "./model";
import type { TileData } from "./TopicTile";

const TYPES = ["basic", "shortnote", "essay", "cloze"] as const;

/** "Start with these topics": every topic, ranked, with checkboxes and a mixed-practice builder. */
export function RankedTable({
  rows,
  data,
  picks,
  cards,
  onToggle,
  onClear,
  onInspect,
}: {
  rows: Row[];
  data: Map<string, TileData>;
  picks: Set<string>;
  cards: FlashCard[];
  onToggle: (id: string) => void;
  onClear: () => void;
  onInspect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<Set<string>>(new Set(TYPES));
  const [pyq, setPyq] = useState(false);

  const ids = [...picks];
  const count = cards.filter((c) => types.has(c.type) && (!pyq || (c.pyq?.length ?? 0) > 0)).length;
  const n = Math.min(count, 100);
  const canBuild = ids.length > 0 && types.size > 0 && count > 0;
  const href =
    `/study?mode=random&n=${n}&topic=${ids.join(",")}` +
    (types.size < TYPES.length ? `&types=${[...types].join(",")}` : "") +
    (pyq ? "&pyq=1" : "");

  const toggleType = (t: string) =>
    setTypes((cur) => {
      const next = new Set(cur);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <section id="ranked" aria-labelledby="ranked-heading" className="glass rounded-xl scroll-mt-6 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <h2 id="ranked-heading" className="font-serif text-xl">
            Start with these topics
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Every topic, weakest first. Unrated topics are at the end.</p>
        </div>
      </div>

      {/* Selection bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-rule bg-well px-4 py-3 sm:px-5">
        <span className="font-mono text-xs tabular-nums text-ink-soft">{ids.length} topics selected</span>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-ghost min-h-9 px-4" onClick={onClear} disabled={!ids.length}>
            Clear
          </button>
          <button type="button" className="btn-primary min-h-9 px-4" onClick={() => setOpen((o) => !o)} aria-expanded={open} disabled={!ids.length}>
            Practise selected
          </button>
        </div>
      </div>

      {open && ids.length > 0 && (
        <div className="space-y-4 border-b border-rule p-4 sm:p-5">
          <fieldset>
            <legend className="eyebrow mb-2">Card types</legend>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <label key={t} className={types.has(t) ? "btn-chip-on cursor-pointer" : "btn-chip cursor-pointer"}>
                  <input type="checkbox" className="sr-only" checked={types.has(t)} onChange={() => toggleType(t)} />
                  {CARD_TYPE_LABEL[t]}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-teal" checked={pyq} onChange={(e) => setPyq(e.target.checked)} />
            Previously asked only
          </label>
          {canBuild ? (
            <Link href={href} className="btn-primary w-full">
              Start mixed practice ({n} cards)
            </Link>
          ) : (
            <span aria-disabled="true" className="btn-primary w-full opacity-50">
              Start mixed practice ({n} cards)
            </span>
          )}
          {count === 0 && <p className="text-xs text-ink-soft">No cards match these choices in the selected topics.</p>}
        </div>
      )}

      {/* Table header (desktop) */}
      <div className="hidden grid-cols-[2.75rem_minmax(0,2.4fr)_minmax(0,1.3fr)_4.5rem_6.5rem_6rem_4.5rem_5rem] items-center gap-3 border-b border-rule px-5 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-soft lg:grid">
        <span />
        <span>Topic</span>
        <span>Paper</span>
        <span>Score</span>
        <span>Status</span>
        <span>Seen</span>
        <span className="text-right">Cards</span>
        <span />
      </div>

      <ul className="divide-y divide-rule">
        {rows.map((r) => {
          const d = data.get(r.topic.id);
          const label = labelOf(r.m);
          const on = picks.has(r.topic.id);
          const seenPct = d?.seenPct ?? 0;
          return (
            <li
              key={r.topic.id}
              className={`grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[2.75rem_minmax(0,2.4fr)_minmax(0,1.3fr)_4.5rem_6.5rem_6rem_4.5rem_5rem] lg:px-5 ${on ? "bg-teal-wash" : ""}`}
            >
              <label className="grid h-11 w-11 cursor-pointer place-items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-teal"
                  checked={on}
                  onChange={() => onToggle(r.topic.id)}
                  aria-label={`Select ${r.topic.title}`}
                />
              </label>
              <span className="min-w-0">
                <span className="block truncate text-sm">{r.topic.title}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] tabular-nums text-ink-soft lg:hidden">
                  <span style={{ color: labelColor(label) }}>{r.m?.score ?? "—"} / 100</span>
                  <span>{statusWord(r.m)}</span>
                  <span>{seenPct}% seen</span>
                  <span>{r.m?.cards ?? 0} cards</span>
                </span>
              </span>
              <span className="hidden truncate font-mono text-[11px] text-ink-soft lg:block">{PAPER_TAB[r.paper.id] ?? paperTitle(r.paper)}</span>
              <span className="hidden font-mono text-sm tabular-nums lg:block" style={{ color: labelColor(label) }}>
                {r.m?.score ?? "—"} <span className="text-[11px] text-ink-soft">/ 100</span>
              </span>
              <span className="hidden lg:block">
                <LabelChip label={label} />
              </span>
              <span className="hidden items-center gap-2 lg:flex">
                <span className="w-12">
                  <CoverageBar pct={seenPct} thin />
                </span>
                <span className="font-mono text-[11px] tabular-nums text-ink-soft">{seenPct}%</span>
              </span>
              <span className="hidden text-right font-mono text-sm tabular-nums lg:block">{r.m?.cards ?? 0}</span>
              <span className="text-right">
                <button type="button" className="btn-ghost min-h-9 px-3 text-xs" onClick={() => onInspect(r.topic.id)}>
                  Inspect
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
