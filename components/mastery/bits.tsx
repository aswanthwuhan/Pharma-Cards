import { LABEL_COLOR, LABEL_TEXT } from "@/components/MasteryPill";
import type { MasteryLabel } from "@/lib/mastery";

export function labelColor(label: MasteryLabel): string {
  return label === "unassessed" ? "var(--color-ink-soft)" : LABEL_COLOR[label];
}

/** Small mono label with a coloured dot, e.g. "• Weak". */
export function LabelChip({ label }: { label: MasteryLabel }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-rule px-2 py-0.5 font-mono text-[11px] text-ink-soft">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: labelColor(label) }} aria-hidden="true" />
      {LABEL_TEXT[label]}
    </span>
  );
}

/** Horizontal mastery bar. Width = score (0–100). */
export function ScoreBar({ score, label }: { score: number | null; label: MasteryLabel }) {
  return (
    <span className="block h-2 overflow-hidden rounded-full bg-rule" role="img" aria-label={score == null ? "Not rated yet" : `${score} of 100`}>
      <span className="block h-full rounded-full" style={{ width: `${score ?? 0}%`, background: labelColor(label) }} />
    </span>
  );
}

/** Thin "seen" coverage bar: share of the topic's cards seen at least once. Teal, not a mastery colour. */
export function CoverageBar({ pct, thin = false }: { pct: number; thin?: boolean }) {
  return (
    <span className={`block overflow-hidden rounded-full bg-rule ${thin ? "h-1" : "h-1.5"}`} role="img" aria-label={`${pct}% of cards seen`}>
      <span className="block h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
    </span>
  );
}

/** Segmented bar: each segment is a share of the topic's cards in weak / moderate / strong subtopics. */
export function SegmentBar({ weak, moderate, strong }: { weak: number; moderate: number; strong: number }) {
  const seg = (w: number, label: MasteryLabel) => (
    <span key={label} className="block h-full" style={{ width: `${w * 100}%`, background: labelColor(label) }} />
  );
  return (
    <span className="flex h-2 overflow-hidden rounded-full bg-unseen" role="img" aria-label={`Weak ${Math.round(weak * 100)}%, moderate ${Math.round(moderate * 100)}%, strong ${Math.round(strong * 100)}% of cards`}>
      {seg(weak, "weak")}
      {seg(moderate, "moderate")}
      {seg(strong, "strong")}
    </span>
  );
}

/** Small ring showing the overall syllabus mastery. */
export function MasteryRing({ score, label, size = 64 }: { score: number | null; label: MasteryLabel; size?: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0" role="img" aria-label={score == null ? "No overall rating yet" : `Overall ${score} of 100`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-rule)" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke={labelColor(label)}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - (score ?? 0) / 100)}
        transform="rotate(-90 32 32)"
      />
    </svg>
  );
}
