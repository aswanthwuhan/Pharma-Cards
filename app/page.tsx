"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSettings } from "@/lib/settings";
import { startOfDay, useMastery, weakest } from "@/lib/store";
import { PAPERS, subtopicById } from "@/lib/syllabus";
import { PaperCard, paperLabel } from "@/components/today/PaperCard";
import { PaperSheet } from "@/components/today/PaperSheet";
import { summarisePaper, type PaperSummary } from "@/components/today/paperSummary";
import { SessionTrend } from "@/components/today/Sparkline";
import {
  AttentionList,
  DueHero,
  DueTodayPanel,
  ExamCountdown,
  MoreWays,
  StatsStrip,
  WeakTypes,
  type AttentionItem,
} from "@/components/today/TodayPanels";
import { useTodayData } from "@/components/today/useTodayData";

const DAY_MS = 86_400_000;

export default function Today() {
  const settings = useSettings();
  const mastery = useMastery();
  const data = useTodayData();

  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetPaperId, setSheetPaperId] = useState(PAPERS[0].id);
  const sheetPaper = PAPERS.find((p) => p.id === sheetPaperId) ?? PAPERS[0];

  const needsDiagnostic = data ? !data.diagnosed : false;

  const { examDate, examName } = settings;
  // "YYYY-MM-DD" is a local calendar day; new Date(iso) would read it as UTC midnight.
  const [ey, em, ed] = (examDate ?? "").split("-").map(Number);
  const daysLeft = examDate ? Math.round((new Date(ey, em - 1, ed).getTime() - startOfDay()) / DAY_MS) : null;
  const examChip =
    daysLeft === null
      ? null
      : daysLeft > 1
        ? `T-${daysLeft} days`
        : daysLeft === 1
          ? "T-1 day"
          : daysLeft === 0
            ? "Exam today"
            : "Exam date has passed";

  const summaries = useMemo(
    () => new Map<string, PaperSummary>(PAPERS.map((p) => [p.id, summarisePaper(p, mastery?.topic)])),
    [mastery],
  );

  const weakTags = useMemo(() => weakest(mastery?.tag, 4), [mastery]);
  const weakSubs = useMemo<AttentionItem[] | undefined>(
    () =>
      mastery
        ? weakest(mastery.subtopic, 20)
            .flatMap((m) => {
              const s = subtopicById.get(m.topicId);
              return s ? [{ m, s }] : [];
            })
            .slice(0, 5)
        : undefined,
    [mastery],
  );

  const paperGrid = (
    <section aria-labelledby="papers" className="space-y-3 xl:col-start-2 xl:row-start-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="papers" className="font-serif text-2xl">
          Syllabus papers and mastery
        </h2>
        <span className="eyebrow shrink-0">Tap to select</span>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {PAPERS.map((p) => {
          const s = summaries.get(p.id)!;
          if (!mastery) return <div key={p.id} className="glass rounded-xl min-h-36 lg:min-h-48" aria-hidden />;
          if (!s.cards) {
            return (
              <div key={p.id} className="glass rounded-xl col-span-2 flex items-center justify-between gap-3 px-4 py-3">
                <span className="min-w-0">
                  <span className="eyebrow block">{paperLabel(p)}</span>
                  <span className="block truncate text-sm">{p.title.split("—")[1]?.trim()}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-ink-soft">No cards yet</span>
              </div>
            );
          }
          return (
            <PaperCard
              key={p.id}
              paper={p}
              summary={s}
              selected={selected === p.id}
              onToggle={() => setSelected((cur) => (cur === p.id ? null : p.id))}
              onOpen={() => {
                setSheetPaperId(p.id);
                setSheetOpen(true);
              }}
            />
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8 xl:max-w-none xl:grid xl:grid-cols-[17rem_minmax(0,1fr)_18rem] xl:items-start xl:gap-6 xl:space-y-0">
      <header className="space-y-2 xl:col-span-3">
        <p className="eyebrow">Today</p>
        <h1 className="font-serif text-4xl">Welcome back</h1>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-soft">
          {examDate ? (
            <>
              <span>{examName}</span>
              <Link href="/settings#exam" className="btn-chip min-h-9 text-ink">
                {examChip}
              </Link>
            </>
          ) : (
            <Link href="/settings#exam" className="btn-chip min-h-9 text-ink">
              Set exam date
            </Link>
          )}
        </div>
      </header>

      {/* Mobile: stats, hero, then papers */}
      <div className="space-y-4 xl:hidden">
        <StatsStrip data={data} />
        <DueHero data={data} needsDiagnostic={needsDiagnostic} />
      </div>

      {paperGrid}

      {/* Mobile: attention, weak question types, more ways */}
      <div className="space-y-6 xl:hidden">
        <section aria-labelledby="attention" className="space-y-3">
          <h2 id="attention" className="font-serif text-2xl">
            Needs attention
          </h2>
          <AttentionList items={weakSubs} />
        </section>
        <WeakTypes tags={weakTags} />
        <MoreWays />
      </div>

      {/* Desktop left: stats, countdown, trend, targeted practice */}
      <aside className="hidden space-y-6 xl:col-start-1 xl:row-start-2 xl:block">
        <StatsStrip data={data} />
        <ExamCountdown examName={examName} examDate={examDate} daysLeft={daysLeft} data={data} />
        <SessionTrend points={data?.sessions} />
        <section aria-labelledby="targeted" className="space-y-3">
          <h2 id="targeted" className="font-serif text-xl">
            Targeted practice
          </h2>
          <AttentionList items={weakSubs?.slice(0, 3)} />
        </section>
      </aside>

      {/* Desktop right: due breakdown, weak question types, more ways */}
      <aside className="hidden space-y-6 xl:col-start-3 xl:row-start-2 xl:block">
        <DueTodayPanel data={data} needsDiagnostic={needsDiagnostic} />
        <WeakTypes tags={weakTags} />
        <MoreWays />
      </aside>

      <PaperSheet paper={sheetPaper} open={sheetOpen} onClose={() => setSheetOpen(false)} mastery={mastery} />
    </div>
  );
}
