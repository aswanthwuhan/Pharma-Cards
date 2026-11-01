"use client";

import Link from "next/link";
import { MasteryPill } from "@/components/MasteryPill";
import type { TopicMastery } from "@/lib/mastery";
import { topicById } from "@/lib/syllabus";
import { TAG_LABEL, type Tag } from "@/lib/types";
import type { TodayData } from "./useTodayData";

const DEFAULT_SECONDS = 20;

/** Icon tile + "14.2s per card · 91% accuracy" for the last 7 days. */
export function StatsStrip({ data }: { data?: TodayData }) {
  const none = !data || data.reviewsWeek === 0;
  return (
    <section aria-label="Last 7 days" className="glass rounded-xl flex items-center gap-3 px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-well text-teal" aria-hidden>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      </span>
      {none ? (
        <p className="text-sm text-ink-soft">No reviews yet. Answers from the last 7 days will show here.</p>
      ) : (
        <p className="min-w-0 font-mono text-sm tabular-nums">
          <span className="text-ink">{data.avgSeconds!.toFixed(1)}s</span>
          <span className="text-ink-soft"> per card · </span>
          <span className="text-ink">{Math.round(data.accuracy! * 100)}%</span>
          <span className="text-ink-soft"> accuracy</span>
          <span className="mt-0.5 block text-[11px] text-ink-soft">last 7 days</span>
        </p>
      )}
    </section>
  );
}

/** Start button, same wording on every layout. */
export function StartButton({ n }: { n: number }) {
  return (
    <Link href="/study?mode=daily" className="btn-primary min-h-14 w-full text-base">
      Start daily review ({n})
    </Link>
  );
}

/** Work on weak areas + Diagnostic test. The diagnostic is primary until it has been taken once. */
export function ActionButtons({ needsDiagnostic, stacked = false }: { needsDiagnostic: boolean; stacked?: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`grid gap-2 ${stacked ? "" : "grid-cols-2"}`}>
        <Link href="/study?mode=weak" className="btn-ghost h-auto py-2.5 text-center leading-tight">
          Work on weak areas
        </Link>
        <Link href="/study?mode=diagnostic" className={`${needsDiagnostic ? "btn-primary" : "btn-ghost"} h-auto py-2.5 text-center leading-tight`}>
          Diagnostic test
        </Link>
      </div>
      {needsDiagnostic && (
        <p className="text-sm text-ink-soft">You haven&apos;t taken one yet. It covers the whole syllabus, so the papers below can fill in.</p>
      )}
    </div>
  );
}

/** Mobile hero: due count, estimated time, two tiles, start button, secondary actions. */
export function DueHero({ data, needsDiagnostic }: { data?: TodayData; needsDiagnostic: boolean }) {
  const n = data?.queueTotal ?? 0;
  const perCard = data?.avgSeconds ?? DEFAULT_SECONDS;
  const mins = Math.ceil((n * perCard) / 60);
  return (
    <section aria-labelledby="due-hero" className="glass rounded-xl space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Today&apos;s queue</p>
          <h2 id="due-hero" className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-5xl font-semibold tabular-nums">{n}</span>
            <span className="font-serif text-xl">cards due today</span>
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-rule bg-well px-3 py-1 font-mono text-xs tabular-nums text-ink-soft">
          ~{mins} min
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Tile value={data?.dueTotal} label="Scheduled reviews" bar="bg-teal" />
        <Tile value={data?.newToday} label="New cards today" bar="bg-ink" />
      </div>

      <StartButton n={n} />
      <ActionButtons needsDiagnostic={needsDiagnostic} />
    </section>
  );
}

function Tile({ value, label, bar }: { value?: number; label: string; bar: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-well px-3 py-3">
      <span className={`h-9 w-1 shrink-0 rounded-full ${bar}`} aria-hidden />
      <div className="min-w-0">
        <p className="font-mono text-2xl font-semibold tabular-nums">{value ?? "–"}</p>
        <p className="eyebrow leading-tight">{label}</p>
      </div>
    </div>
  );
}

/** Desktop right column: overdue / due today / new breakdown, start, secondary actions. */
export function DueTodayPanel({ data, needsDiagnostic }: { data?: TodayData; needsDiagnostic: boolean }) {
  const n = data?.queueTotal ?? 0;
  const rows: [string, number | undefined, boolean][] = [
    ["Overdue", data?.overdue, (data?.overdue ?? 0) > 0],
    ["Due today", data?.dueToday, false],
    ["New cards", data?.newToday, false],
  ];
  return (
    <section aria-labelledby="due-panel" className="glass rounded-xl space-y-4 p-5">
      <div>
        <p id="due-panel" className="eyebrow">
          Cards due today
        </p>
        <p className="mt-2 font-mono text-4xl font-semibold tabular-nums">{n}</p>
        <p className="text-sm text-ink-soft">in today&apos;s queue</p>
      </div>
      <dl className="divide-y divide-rule">
        {rows.map(([label, value, hot]) => (
          <div key={label} className="flex items-center justify-between py-2 text-sm">
            <dt className="text-ink-soft">{label}</dt>
            <dd className={`font-mono tabular-nums ${hot ? "text-weak" : "text-ink"}`}>{value ?? "–"}</dd>
          </div>
        ))}
      </dl>
      <StartButton n={n} />
      <ActionButtons needsDiagnostic={needsDiagnostic} stacked />
    </section>
  );
}

/** Desktop left column: days to the exam and how much of the bank has been seen. */
export function ExamCountdown({
  examName,
  examDate,
  daysLeft,
  data,
}: {
  examName: string;
  examDate: string | null;
  daysLeft: number | null;
  data?: TodayData;
}) {
  const seen = data?.seen ?? 0;
  const total = data?.total ?? 0;
  const pct = total ? Math.round((seen / total) * 100) : 0;
  return (
    <section aria-labelledby="countdown" className="glass rounded-xl space-y-4 p-5">
      <p id="countdown" className="eyebrow">
        Exam countdown
      </p>
      {examDate && daysLeft !== null ? (
        daysLeft < 0 ? (
          <p className="text-sm text-ink-soft">The exam date has passed.</p>
        ) : (
          <div>
            <p className="font-mono text-5xl font-semibold tabular-nums">{daysLeft}</p>
            <p className="text-sm text-ink-soft">{daysLeft === 1 ? "day" : "days"} to {examName}</p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-ink-soft">No exam date set. Add one and the daily new-card plan will adjust.</p>
          <Link href="/settings#exam" className="btn-ghost w-full">
            Set exam date
          </Link>
        </div>
      )}
      <div>
        <div className="flex items-baseline justify-between font-mono text-xs text-ink-soft">
          <span>Cards seen</span>
          <span className="tabular-nums text-ink">
            {seen} of {total}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-well" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Cards seen">
          <div className="h-full rounded-full bg-teal transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </section>
  );
}

export interface AttentionItem {
  m: TopicMastery;
  s: { id: string; title: string; topicId: string };
}

/** Weakest rated subtopics as tappable rows. `undefined` while loading. */
export function AttentionList({ items }: { items?: AttentionItem[] }) {
  if (items === undefined) return null;
  if (!items.length)
    return <p className="text-sm text-ink-soft">Nothing rated weak yet. Study a few cards and weak subtopics will show up here.</p>;
  return (
    <ul className="glass rounded-xl divide-y divide-rule overflow-hidden">
      {items.map(({ m, s }) => (
        <li key={s.id}>
          <Link href={`/study?mode=topic&subtopic=${s.id}`} className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-teal-wash">
            <span className="min-w-0">
              <span className="block truncate text-[15px]">{s.title}</span>
              <span className="block truncate font-mono text-[11px] text-ink-soft">{topicById.get(s.topicId)?.title}</span>
            </span>
            <MasteryPill m={m} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Weakest question types as chips. */
export function WeakTypes({ tags }: { tags: TopicMastery[] }) {
  if (!tags.length) return null;
  return (
    <section aria-labelledby="weak-types" className="space-y-3">
      <h2 id="weak-types" className="font-serif text-xl">
        Weakest question types
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((m) => {
          const tag = m.topicId as Tag;
          return (
            <Link key={tag} href={`/study?mode=topic&tag=${tag}`} className="btn-chip min-h-11 text-ink">
              {TAG_LABEL[tag]}
              <span className="font-mono text-xs tabular-nums text-ink-soft">{m.score}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function MoreWays() {
  return (
    <section aria-labelledby="more" className="space-y-3">
      <h2 id="more" className="font-serif text-xl">
        More ways to study
      </h2>
      <ul className="glass rounded-xl divide-y divide-rule overflow-hidden">
        <ModeRow href="/study?mode=random&n=50" title="Grand random" desc="50 cards from every chapter, weighted towards your weaker topics" />
        <ModeRow href="/study?mode=rapid&dir=mixed" title="Rapid fire" desc="Quick two-way recall of facts and drug lists, forwards and reversed" />
        <ModeRow href="/browse" title="Custom mix" desc="Pick papers, topics, card types or PYQ-only cards" />
      </ul>
    </section>
  );
}

function ModeRow({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <li>
      <Link href={href} className="flex min-h-14 flex-col justify-center px-4 py-3 transition-colors hover:bg-teal-wash">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-ink-soft">{desc}</span>
      </Link>
    </li>
  );
}

