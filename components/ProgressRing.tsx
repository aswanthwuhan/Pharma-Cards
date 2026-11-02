"use client";

/** Round session progress: a teal arc that fills as cards are answered. */
export function ProgressRing({ value, max }: { value: number; max: number }) {
  const r = 15;
  const len = 2 * Math.PI * r;
  const frac = max ? value / max : 0;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label="Session progress" className="shrink-0 -rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" stroke="var(--color-rule)" strokeWidth="4" />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="var(--color-teal)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - frac)}
        className="transition-[stroke-dashoffset] duration-300"
      />
    </svg>
  );
}
