import type { TopicMastery } from "@/lib/mastery";

export const LABEL_COLOR: Record<string, string> = {
  strong: "var(--color-strong)",
  moderate: "var(--color-moderate)",
  weak: "var(--color-weak)",
  unassessed: "var(--color-unseen)",
};

export const LABEL_TEXT: Record<string, string> = {
  strong: "Strong",
  moderate: "Moderate",
  weak: "Weak",
  unassessed: "Not rated yet",
};

/**
 * Segmented capsule meter (the "mastery tube" from the design system):
 * 5 dosing cells that fill with the mastery colour as the score rises.
 */
export function CapsuleMeter({ m, cells = 5 }: { m?: TopicMastery; cells?: number }) {
  const label = m?.label ?? "unassessed";
  const filled = m?.score != null ? Math.max(1, Math.round((m.score / 100) * cells)) : 0;
  return (
    <span className="inline-flex gap-[3px]" role="img" aria-label={m?.score != null ? `${LABEL_TEXT[label]}, ${m.score} of 100` : "Not rated yet"}>
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className={`h-3 w-[7px] ${i === 0 ? "rounded-l-full" : ""} ${i === cells - 1 ? "rounded-r-full" : ""}`}
          style={{ background: i < filled ? LABEL_COLOR[label] : "var(--color-unseen)" }}
        />
      ))}
    </span>
  );
}

/** Capsule meter + label + score, e.g. [■■■□□] Moderate 58 */
export function MasteryPill({ m }: { m?: TopicMastery }) {
  const label = m?.label ?? "unassessed";
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs">
      <CapsuleMeter m={m} />
      <span style={{ color: label === "unassessed" ? "var(--color-ink-soft)" : LABEL_COLOR[label] }}>{LABEL_TEXT[label]}</span>
      {m?.score != null && <span className="tabular-nums text-ink">{m.score}</span>}
    </span>
  );
}
