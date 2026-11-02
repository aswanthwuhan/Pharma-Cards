"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Grade } from "ts-fsrs";
import type { SwipeGrade } from "@/lib/swipe";
import { recordReview, undoReview, type ReviewUndo } from "@/lib/srs";
import { useSettings } from "@/lib/settings";
import type { RapidDirection } from "@/lib/store";
import { subtopicById, topicById } from "@/lib/syllabus";
import type { FlashCard } from "@/lib/types";
import { GradeDock, gradeCurrentCard, SwipeDeck } from "./SwipeDeck";
import { NavBack } from "./NavBack";
import { ProgressRing } from "./ProgressRing";

const NO_INTERVALS: Record<number, string> = { 1: "", 2: "", 3: "", 4: "" };
const ARROW: Record<string, SwipeGrade> = { ArrowLeft: 1, ArrowDown: 2, ArrowRight: 3, ArrowUp: 4 };

/**
 * Rapid Fire: short reversible q/a pairs on the same card engine as full cards.
 * Tap / Space flips, double tap skips. Swipe or arrows: ← Forgot, ↓ Hard, → Good, ↑ Easy.
 * Hard, Good and Easy count as "knew it" for the streak.
 */
export function RapidFireSession({
  cards: initial,
  title,
  direction,
  onDirection,
  fullCardsHref,
}: {
  cards: FlashCard[];
  title: string;
  direction: RapidDirection;
  onDirection: (d: RapidDirection) => void;
  fullCardsHref: string;
}) {
  const settings = useSettings();
  const [cards, setCards] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState<{ card: FlashCard; knew: boolean; undo: ReviewUndo }[]>([]);
  const shownAt = useRef(Date.now());
  const busy = useRef(false);
  const card = cards[i];
  const done = i >= cards.length;
  // Streaks come from the log, so Undo and "drill missed" keep them right.
  let streak = 0;
  let best = 0;
  for (const e of log) {
    streak = e.knew ? streak + 1 : 0;
    best = Math.max(best, streak);
  }

  useEffect(() => setCards(initial), [initial]);
  useEffect(() => {
    shownAt.current = Date.now();
  }, [i]);

  // The deck flies the card out, then hands the grade here.
  const grade = useCallback(
    async (g: SwipeGrade) => {
      if (!card || busy.current) return;
      busy.current = true;
      try {
        const undo = await recordReview(card, g as Grade, Date.now() - shownAt.current, "rapid");
        setLog((l) => [...l, { card, knew: g > 1, undo }]);
        setFlipped(false);
        setI((n) => n + 1);
      } finally {
        busy.current = false;
      }
    },
    [card],
  );

  const undoLast = useCallback(async () => {
    const last = log.at(-1);
    if (!last || busy.current) return;
    busy.current = true;
    try {
      await undoReview(last.undo);
      setLog((l) => l.slice(0, -1));
      setI((n) => n - 1);
      setFlipped(true);
    } finally {
      busy.current = false;
    }
  }, [log]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest?.("input, textarea, select, [contenteditable]")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") return void (e.preventDefault(), undoLast());
      if (done) return;
      if (e.code === "Space" || e.key === "Enter") {
        // Enter/Space on a focused control belongs to that control.
        if (el.closest?.("button, a, [role=radio]")) return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && ["1", "2", "3", "4"].includes(e.key)) gradeCurrentCard(Number(e.key) as SwipeGrade);
      else if (flipped && ARROW[e.key]) {
        e.preventDefault();
        gradeCurrentCard(ARROW[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, undoLast, done]);

  const knewCount = log.filter((l) => l.knew).length;
  const missed = log.filter((l) => !l.knew).map((l) => l.card);

  const header = (
    <div className="flex items-center gap-2">
      <NavBack />
      <ProgressRing value={i} max={Math.max(1, cards.length)} />
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-teal">Rapid fire</p>
        <p className="font-serif text-base leading-snug">{title}</p>
      </div>
      <Link href={fullCardsHref} role="switch" aria-checked="true" aria-label="Rapid fire mode on; switch to full cards" className="flex min-h-10 items-center gap-2 rounded-full border border-teal bg-teal-wash px-3 text-xs font-semibold text-teal">
        <span className="relative h-4 w-7 rounded-full bg-teal">
          <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-on-teal" />
        </span>
        Rapid
      </Link>
    </div>
  );

  const directionPicker = (
    <div className="flex rounded-full border border-rule bg-sheet p-0.5 text-xs" role="radiogroup" aria-label="Direction">
      {(
        [
          ["forward", "Q → A"],
          ["reverse", "A → Q"],
          ["mixed", "Mixed"],
        ] as const
      ).map(([d, label]) => (
        <button
          key={d}
          role="radio"
          aria-checked={direction === d}
          onClick={() => onDirection(d)}
          className={`min-h-9 rounded-full px-3 font-mono ${direction === d ? "bg-teal font-semibold text-on-teal" : "text-ink-soft"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (!initial.length)
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-serif text-2xl">No rapid-fire cards here yet</p>
        <p className="max-w-sm text-sm text-ink-soft">Rapid-fire sets are being written chapter by chapter from your textbooks. Try full cards for this topic meanwhile.</p>
        <Link href={fullCardsHref} className="btn-primary mt-2">
          Study full cards
        </Link>
      </div>
    );

  if (done)
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 py-4">
        {header}
        <section className="card-surface">
          <p className="eyebrow">Rapid fire finished</p>
          <h1 className="mt-2 font-serif text-4xl">
            {knewCount}/{log.length} <span className="text-ink-soft">known</span>
          </h1>
          <p className="mt-1 font-mono text-sm text-ink-soft">
            Best streak {best} · {Math.round((knewCount / Math.max(1, log.length)) * 100)}% recall
          </p>
        </section>
        {missed.length > 0 && (
          <section className="sheet p-4">
            <p className="eyebrow mb-2">Missed ({missed.length})</p>
            <ul className="divide-y divide-rule text-sm">
              {missed.slice(0, 12).map((c) => (
                <li key={c.id} className="py-2">
                  <span className="text-ink-soft">{c.front}</span> → <b>{c.back}</b>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          {missed.length > 0 && (
            <button
              className="btn-primary flex-1"
              onClick={() => {
                setCards(missed);
                setLog([]);
                setI(0);
              }}
            >
              Drill the {missed.length} missed
            </button>
          )}
          <Link href={fullCardsHref} className="btn-ghost flex-1">
            Full cards for this topic
          </Link>
        </div>
        <Link href="/" className="btn self-center text-ink-soft hover:text-ink">
          Back to Today
        </Link>
      </div>
    );

  const isList = card.kind === "class";
  const answerItems = isList && card.back ? card.back.split(/\s*;\s*|,\s+(?![^()]*\))/) : null;
  const sub = card.subtopic ? subtopicById.get(card.subtopic)?.title : undefined;
  const isReverse = card.id.endsWith("~r");

  return (
    <div className="fixed inset-0 z-10 mx-auto flex max-w-2xl flex-col bg-paper px-4 pt-[calc(0.5rem+env(safe-area-inset-top))] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      {/* same two-row header as full cards: back, ring and title; then direction and count */}
      <div className="glass space-y-1.5 rounded-2xl p-1.5">
        {header}
        <div className="flex items-center justify-between gap-2">
          {directionPicker}
          <span className="pr-1 font-mono text-xs text-ink-soft tabular-nums">
            {i + 1}/{cards.length} · streak <b className="text-teal">{streak}</b>
          </span>
        </div>
      </div>

      <div className="relative mt-4 min-h-0 flex-1">
        <SwipeDeck
          card={card}
          next={cards[i + 1]}
          revealed={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onSkip={() => {
            setFlipped(false);
            setCards((c) => [...c.slice(0, i), ...c.slice(i + 1), c[i]]);
          }}
          onRate={grade}
          intervals={NO_INTERVALS}
          swipe={settings.swipe}
          haptics={settings.haptics}
          band={settings.swipeBand}
          edge={settings.swipeEdge}
          showZone={settings.swipeZoneVisible}
          render={(revealed) => (
            <div className="flex min-h-full flex-col">
              <div className="flex items-center justify-between gap-3 px-5 pt-2 font-mono text-[10px] tracking-wide text-porcelain-soft uppercase">
                <span>
                  {topicById.get(card.topicId)?.title}
                  {sub ? ` / ${sub}` : ""}
                </span>
                <span className="shrink-0">{isReverse ? "Reversed" : isList ? "List all" : "Recall"}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center px-6 py-6 text-center">
                <p className="font-serif text-[1.7rem] leading-snug">{card.front}</p>
                {revealed ? (
                  <div className="mt-6 border-t border-porcelain-rule pt-5">
                    {answerItems && !isReverse ? (
                      <ul className="flex flex-wrap justify-center gap-1.5">
                        {answerItems.map((a, k) => (
                          <li key={k} className="rounded-full bg-porcelain-2 px-3 py-1 text-[15px]">
                            {a}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xl font-semibold text-[#1f5c48]">{card.back}</p>
                    )}
                    <p className="mt-4 font-mono text-[10px] text-porcelain-soft">{card.refs?.join(", ")}</p>
                  </div>
                ) : (
                  <p className="mt-6 font-mono text-xs text-porcelain-soft">Tap to flip</p>
                )}
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex h-9 shrink-0 items-center justify-center" role="status" aria-live="polite">
        {log.length > 0 && (
          <span className="flex items-center gap-2 text-xs text-ink-soft">
            Last: <b style={{ color: log.at(-1)!.knew ? "var(--color-strong)" : "var(--color-weak)" }}>{log.at(-1)!.knew ? "Knew it" : "Didn't know"}</b>
            <button onClick={undoLast} className="btn min-h-8 rounded-full bg-teal-wash px-3 text-xs text-teal">
              Undo
            </button>
          </span>
        )}
      </div>

      <div className="glass rounded-2xl p-2">
        {flipped ? (
          <GradeDock />
        ) : (
          <p className="flex h-16 items-center justify-center font-mono text-xs text-ink-soft">Tap card to flip · double tap to skip</p>
        )}
      </div>
    </div>
  );
}
