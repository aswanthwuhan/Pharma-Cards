"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { labelFor } from "@/lib/mastery";
import { buildQueue, isRapid, loadStudyCards, type MasteryReport } from "@/lib/store";
import type { SwipeGrade } from "@/lib/swipe";
import { subtopicById, topicById } from "@/lib/syllabus";
import type { FlashCard } from "@/lib/types";
import { LABEL_COLOR, LABEL_TEXT } from "./MasteryPill";
import { GRADE_META } from "./SwipeDeck";

const ORDER: SwipeGrade[] = [1, 2, 3, 4];

/** End-of-session report, laid out like the Stitch "Session Complete" screen, with real numbers only. */
export function SessionSummary({
  cards,
  history,
  before,
  after,
  title,
  onUndo,
}: {
  cards: FlashCard[];
  history: { grade: SwipeGrade; ms: number }[];
  before?: MasteryReport;
  after?: MasteryReport;
  title: string;
  onUndo: () => void;
}) {
  const n = history.length;
  const count = (g: SwipeGrade) => history.filter((h) => h.grade === g).length;
  const pct = (x: number) => (n ? Math.round((x / n) * 100) : 0);
  const recalled = count(3) + count(4);
  const recallPct = pct(recalled);
  const avgSec = n ? history.reduce((a, h) => a + h.ms, 0) / n / 1000 : 0;

  const dueTomorrow = useLiveQuery(async () => {
    const end = new Date();
    end.setDate(end.getDate() + 1);
    end.setHours(23, 59, 59, 999);
    const ids = new Set((await loadStudyCards()).filter((c) => !isRapid(c)).map((c) => c.id));
    return (await db.cardStates.where("due").belowOrEqual(end.getTime()).toArray()).filter((s) => ids.has(s.cardId)).length;
  }, []);

  // How many cards the "work on weak areas" button would give.
  const [weakCount, setWeakCount] = useState<number>();
  useEffect(() => {
    buildQueue({ mode: "weak" }).then((q) => setWeakCount(q.length));
  }, [after]);

  // The subtopic in this session whose score moved most.
  const subs = [...new Set(cards.map((c) => c.subtopic).filter(Boolean))] as string[];
  const moves = subs
    .map((s) => ({ s, b: before?.subtopic.get(s), a: after?.subtopic.get(s) }))
    .filter((x) => x.a?.score != null)
    .map((x) => ({ ...x, delta: (x.a!.score ?? 0) - (x.b?.score ?? 0) }))
    // Subtopics with an earlier score come first: a real change beats a first rating.
    .sort((p, q) => Number(q.b?.score != null) - Number(p.b?.score != null) || Math.abs(q.delta) - Math.abs(p.delta));
  const top = moves[0];
  const topSub = top ? subtopicById.get(top.s) : undefined;
  const levelChanged = top && top.b?.score != null && labelFor(top.b.score) !== labelFor(top.a!.score);

  // Ring: circumference for r=30 is 188.5.
  const C = 188.5;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 py-4">
      {/* header */}
      <section className="relative overflow-hidden rounded-xl bg-sheet p-4">
        <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-teal/5 blur-2xl" />
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-well px-2 py-0.5 font-mono text-[11px] tracking-wider text-teal uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Session saved
          </span>
          <span className="font-mono text-[11px] text-ink-soft uppercase">{n} answers</span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <h1 className="font-serif text-3xl">Session complete</h1>
          <span className="font-mono text-xs text-teal">{recalled} recalled</span>
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">{title}</p>
        <div className="mt-2 flex items-center gap-1 opacity-70" aria-hidden>
          {[0, 1, 2].map((k) => (
            <span key={k} className="h-1 w-2 rounded-full bg-teal" />
          ))}
          <span className="h-1 w-6 rounded-full bg-teal" />
          <span className="h-0.5 flex-1 bg-rule" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        {/* recall ring */}
        <section className="col-span-2 flex items-center justify-between rounded-xl bg-sheet p-4">
          <div className="flex flex-col gap-1">
            <span className="eyebrow">Recall this session</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl text-teal">{recallPct}%</span>
              <span className="font-mono text-xs text-ink-soft">Good or Easy</span>
            </div>
            <p className="max-w-[220px] text-sm leading-tight text-ink-soft">
              {recallPct >= 80 ? "Strong session. Keep the interval going." : recallPct >= 60 ? "Solid. The cards you missed will come back sooner." : "Tough set. Missed cards return soon, which is how they stick."}
            </p>
          </div>
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72" aria-hidden>
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--color-rule)" strokeWidth="4" />
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="var(--color-teal)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - recallPct / 100)}
              />
              <circle cx="36" cy="36" r="23" fill="none" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="2 4" />
            </svg>
            <span className="absolute font-mono text-xs text-teal">{recalled}/{n}</span>
          </div>
        </section>

        <section className="flex min-h-[92px] flex-col justify-between rounded-xl bg-sheet p-4">
          <span className="eyebrow">Avg speed</span>
          <div>
            <div className="font-serif text-2xl">{avgSec ? `${avgSec.toFixed(1)}s` : "—"}</div>
            <span className="font-mono text-[11px] text-ink-soft">per card</span>
          </div>
        </section>
        <section className="flex min-h-[92px] flex-col justify-between rounded-xl bg-sheet p-4">
          <span className="eyebrow">Due by tomorrow</span>
          <div>
            <div className="font-serif text-2xl">{dueTomorrow ?? "…"} {dueTomorrow === 1 ? "card" : "cards"}</div>
            <span className="font-mono text-[11px] text-ink-soft">in your review queue</span>
          </div>
        </section>
      </div>

      {/* rating distribution */}
      <section className="flex flex-col gap-2 rounded-xl bg-sheet p-4">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-semibold tracking-wide uppercase">How you rated</span>
          <span className="font-mono text-[11px] text-ink-soft">(n={n})</span>
        </div>
        <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-well p-0.5">
          {ORDER.map((g) => (
            <div key={g} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${pct(count(g))}%`, background: GRADE_META[g].color }} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1 pt-1">
          {ORDER.map((g) => (
            <div key={g} className="flex flex-col rounded-lg bg-well p-2">
              <span className="flex items-center gap-1 font-mono text-[11px] text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GRADE_META[g].color }} />
                {GRADE_META[g].label}
              </span>
              <span className="mt-0.5 font-mono text-sm font-semibold">
                {count(g)} <span className="text-[11px] font-normal text-ink-soft">{pct(count(g))}%</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* biggest mover */}
      {top && topSub && (
        <section className="flex flex-col gap-3 rounded-xl bg-sheet p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold tracking-wide uppercase">Biggest change</span>
            {levelChanged && (
              <span className="rounded-full bg-teal px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-on-teal uppercase">
                {top.delta >= 0 ? "Level up" : "Level down"}
              </span>
            )}
          </div>
          <div>
            <span className="eyebrow">{topicById.get(topSub.topicId)?.title}</span>
            <h2 className="mt-0.5 font-serif text-xl leading-tight">{topSub.title}</h2>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-well p-3">
            <Bar label="Before" m={top.b} muted />
            <Bar label="After this session" m={top.a} />
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] text-ink-soft">
            <span>{moves.length} subtopic{moves.length === 1 ? "" : "s"} practised</span>
            <span className={top.delta >= 0 ? "text-teal" : "text-weak"}>
              {top.b?.score == null ? (
                "First rating"
              ) : (
                <>
                  {top.delta >= 0 ? "+" : ""}
                  {top.delta} points
                </>
              )}
            </span>
          </div>
        </section>
      )}

      <div className="mt-1 flex flex-col gap-1.5">
        <Link href="/study?mode=weak" className="btn-primary min-h-12 w-full rounded-xl font-mono tracking-wide">
          Work on weak areas{weakCount ? ` (${Math.min(weakCount, 30)} ${weakCount === 1 ? "card" : "cards"})` : ""}
        </Link>
        <Link href="/stats" className="btn min-h-11 w-full rounded-xl bg-sheet font-mono text-sm">
          View full report
        </Link>
        <div className="flex justify-center gap-4">
          <button onClick={onUndo} className="btn text-ink-soft hover:text-ink">
            Undo last answer
          </button>
          <Link href="/" className="btn text-ink-soft hover:text-ink">
            Return to Today
          </Link>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, m, muted }: { label: string; m?: { score: number | null; label: string }; muted?: boolean }) {
  const lbl = m?.label ?? "unassessed";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className={`font-mono text-[11px] uppercase ${muted ? "text-ink-soft" : "font-semibold text-teal"}`}>{label}</span>
        <span className="font-mono text-xs" style={{ color: muted ? "var(--color-ink-soft)" : LABEL_COLOR[lbl] }}>
          {m?.score != null ? `${m.score} ${LABEL_TEXT[lbl]}` : "Not rated yet"}
        </span>
      </div>
      <div className="flex h-4 w-36 items-center rounded-full bg-rule p-0.5">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${m?.score ?? 0}%`, background: muted ? "var(--color-unseen)" : LABEL_COLOR[lbl] }}
        />
      </div>
    </div>
  );
}
