"use client";

import type { SessionPoint } from "./useTodayData";

const W = 240;
const H = 64;
const PAD = 6;

/** Average score per session as a line. Draws nothing useful below two points, so the caller should skip it. */
export function SessionSparkline({ points }: { points: SessionPoint[] }) {
  const xs = points.map((_, i) => PAD + (i * (W - 2 * PAD)) / (points.length - 1));
  const ys = points.map((p) => PAD + (1 - Math.min(100, Math.max(0, p.avg)) / 100) * (H - 2 * PAD));
  const line = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const fmt = (at: number) => new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short" });

  return (
    <figure className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-16 w-full overflow-visible" role="img" aria-label={`Average score across ${points.length} sessions, latest ${Math.round(last.avg)} percent`}>
        <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="var(--color-rule)" strokeWidth={1} />
        <polyline points={line} fill="none" stroke="var(--color-teal)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {xs.map((x, i) => (
          <circle key={points[i].at} cx={x} cy={ys[i]} r={2.5} fill="var(--color-teal)" />
        ))}
      </svg>
      <figcaption className="flex justify-between font-mono text-[11px] text-ink-soft tabular-nums">
        <span>{fmt(first.at)} · {Math.round(first.avg)}%</span>
        <span className="text-ink">{fmt(last.at)} · {Math.round(last.avg)}%</span>
      </figcaption>
    </figure>
  );
}

/** Desktop left column card: "Average score per session". */
export function SessionTrend({ points }: { points?: SessionPoint[] }) {
  if (!points || points.length < 2) return null;
  return (
    <section aria-labelledby="trend" className="glass rounded-xl space-y-3 p-5">
      <p id="trend" className="eyebrow">
        Average score per session
      </p>
      <SessionSparkline points={points} />
    </section>
  );
}
