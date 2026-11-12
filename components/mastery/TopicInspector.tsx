import Link from "next/link";
import type { TopicMastery } from "@/lib/mastery";
import type { Paper, Topic } from "@/lib/types";
import { LabelChip, CoverageBar, labelColor } from "./bits";
import { labelOf, paperTitle, statusWord } from "./model";

const BADGE: Record<string, string> = {
  Weak: "Focus here",
  Moderate: "Keep practising",
  Strong: "Strong",
  "Not rated": "Not rated",
};

/** Details for the selected topic. Desktop side panel, or a BottomSheet on phones. */
export function TopicInspector({
  topic,
  paper,
  m,
  subs,
  due,
  avgSeconds,
}: {
  topic: Topic;
  paper: Paper;
  m?: TopicMastery;
  subs: Map<string, TopicMastery>;
  due: number;
  avgSeconds: number | null;
}) {
  const label = labelOf(m);
  const status = statusWord(m);
  const cards = m?.cards ?? 0;
  const seen = m ? Math.round(m.coverage * m.cards) : 0;
  const seenPct = Math.round((m?.coverage ?? 0) * 100);
  const retention = m?.retention == null ? null : Math.round(m.retention * 100);

  // Syllabus subtopics, weakest first; unrated (and no-card) subtopics last.
  const subRows = topic.subtopics
    .map((s) => ({ s, m: subs.get(s.id) }))
    .sort((a, b) => (a.m?.score ?? 101) - (b.m?.score ?? 101));

  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="font-mono text-[11px] text-ink-soft">
          {paperTitle(paper).split(":")[0]} <span aria-hidden="true">&gt;</span> {topic.title}
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-serif text-2xl leading-snug">{topic.title}</h2>
          <span className="shrink-0 rounded-full border border-rule px-2.5 py-1 font-mono text-[11px] text-ink-soft">
            {BADGE[status]}
          </span>
        </div>
      </div>

      {/* Score and retention */}
      <div className="rounded-xl bg-well p-4">
        <p className="eyebrow">Score</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <p className="font-mono text-4xl tabular-nums" style={{ color: labelColor(label) }}>
            {m?.score ?? "—"}
            <span className="text-base text-ink-soft">/100</span>
          </p>
          <p className="text-right font-mono text-xs text-ink-soft">
            Retention forecast <span className="text-ink">{retention == null ? "—" : `${retention}%`}</span>
          </p>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Chance you&apos;d recall a seen card today; not an exam percentage.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-well p-3">
          <p className="eyebrow">Seen</p>
          <p className="mt-1 font-mono text-lg tabular-nums">{seenPct}%</p>
          <p className="font-mono text-[11px] text-ink-soft">
            {cards ? `${seen} of ${cards} card${cards === 1 ? "" : "s"} seen` : "No cards yet"}
          </p>
          <div className="mt-2">
            <CoverageBar pct={seenPct} thin />
          </div>
        </div>
        <div className="rounded-xl bg-well p-3">
          <p className="eyebrow">Reviews</p>
          <p className="mt-1 font-mono text-lg tabular-nums">{m?.reviews ?? 0}</p>
          <p className="font-mono text-[11px] text-ink-soft">
            answers · avg {avgSeconds == null ? "—" : `${avgSeconds.toFixed(1)}s`} per card
          </p>
        </div>
      </div>

      {cards > 0 ? (
        <Link href={`/study?mode=topic&topic=${topic.id}`} className="btn-primary w-full">
          Practise {topic.title}
          {due > 0 && <span className="rounded-full bg-on-teal/15 px-2 py-0.5 font-mono text-[11px]">{due} due</span>}
        </Link>
      ) : (
        <p className="text-sm text-ink-soft">No cards for this topic yet.</p>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="eyebrow">Subtopics, weakest first</h3>
          <LabelChip label={label} />
        </div>
        <ul className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-well">
          {subRows.map(({ s, m: sm }) => (
            <li key={s.id}>
              <Link
                href={`/study?mode=topic&subtopic=${s.id}`}
                className="group flex min-h-14 items-center justify-between gap-3 px-4 py-3 hover:bg-teal-wash focus-visible:bg-teal-wash"
              >
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-sm leading-snug">{s.title}</span>
                  <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                    {sm?.score == null ? "Not rated" : `${sm.score}/100`} · {`${sm?.cards ?? 0} card${(sm?.cards ?? 0) === 1 ? "" : "s"}`}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="hidden font-mono text-[11px] text-teal opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline">
                    Study
                  </span>
                  <LabelChip label={sm?.label ?? "unassessed"} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs leading-relaxed text-ink-soft">
        <span className="font-medium text-ink">Methodology.</span> The score combines recent answers, FSRS memory strength and answer speed. A topic needs 3 answers before it gets a rating.
      </p>
    </div>
  );
}
