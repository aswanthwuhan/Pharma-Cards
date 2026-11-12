import { CoverageBar, LabelChip, SegmentBar, labelColor } from "./bits";
import { labelOf, type Row } from "./model";

export interface TileData {
  due: number;
  seenPct: number;
  seg: { weak: number; moderate: number; strong: number };
}

/** A topic in the mastery grid. Tapping it selects the topic for the inspector. */
export function TopicTile({
  row,
  data,
  selected,
  span,
  onSelect,
}: {
  row: Row;
  data: TileData;
  selected: boolean;
  span: boolean;
  onSelect: () => void;
}) {
  const { topic, m } = row;
  const label = labelOf(m);
  const color = labelColor(label);
  const cards = m?.cards ?? 0;
  const noCards = cards === 0;
  const rated = m?.score != null;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border p-4 text-left transition-colors hover:border-teal ${
        span ? "sm:col-span-2" : ""
      } ${noCards ? "border-dashed border-rule bg-sheet text-ink-soft" : "border-rule bg-sheet"} ${selected ? "ring-2 ring-teal" : ""}`}
    >
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} aria-hidden="true" />

      <span className="flex items-start justify-between gap-3 pt-1">
        <span className="min-w-0 font-serif text-lg leading-snug">{topic.title}</span>
        <span className="shrink-0 whitespace-nowrap text-right">
          <span className="font-mono text-3xl tabular-nums" style={{ color }}>
            {rated ? m!.score : "—"}
          </span>
          <span className="font-mono text-xs text-ink-soft">/100</span>
        </span>
      </span>

      <span className="flex flex-wrap items-center gap-2 font-mono text-[11px] tabular-nums text-ink-soft">
        <LabelChip label={label} />
        {noCards ? (
          <span>No cards yet</span>
        ) : (
          <span>
            {`${cards} card${cards === 1 ? "" : "s"}`}
            {data.due > 0 ? ` · ${data.due} due` : ""}
          </span>
        )}
      </span>

      {!noCards && rated && (
        <span className="mt-auto block space-y-1.5">
          <SegmentBar {...data.seg} />
          <span className="flex justify-between font-mono text-[11px] text-ink-soft">
            <span>Subtopic breakdown</span>
            <span className="tabular-nums">{data.seenPct}% seen</span>
          </span>
        </span>
      )}

      {!noCards && !rated && (
        <span className="mt-auto block space-y-1.5">
          <span className="block text-xs italic text-ink-soft">Not enough answers yet</span>
          <CoverageBar pct={data.seenPct} thin />
        </span>
      )}
    </button>
  );
}
