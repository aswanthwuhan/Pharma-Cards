"use client";

import { animate, LazyMotion, domAnimation, m, useMotionValue, useTransform } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Grade } from "ts-fsrs";
import { recordReview, undoReview, type ReviewUndo } from "@/lib/srs";
import { useReduceMotion, useSettings } from "@/lib/settings";
import type { RapidDirection } from "@/lib/store";
import { subtopicById, topicById } from "@/lib/syllabus";
import type { FlashCard } from "@/lib/types";

const KNEW: Grade = 3;
const MISSED: Grade = 1;

/**
 * Rapid Fire: short reversible q/a pairs, two-way grading, built for speed.
 * Tap / Space flips. Swipe right or → = knew it; swipe left or ← = didn't know.
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
  const reduce = useReduceMotion();
  const [cards, setCards] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState<{ card: FlashCard; knew: boolean; undo: ReviewUndo }[]>([]);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const shownAt = useRef(Date.now());
  const busy = useRef(false);
  const card = cards[i];
  const done = i >= cards.length;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], reduce ? [0, 0] : [-6, 6]);
  const knewOpacity = useTransform(x, [20, 110], [0, 1]);
  const missOpacity = useTransform(x, [-110, -20], [1, 0]);
  const drag = useRef<{ id: number; x0: number; y0: number; moved: boolean } | null>(null);

  useEffect(() => setCards(initial), [initial]);
  useEffect(() => {
    x.jump(0);
    shownAt.current = Date.now();
  }, [i, x]);

  const grade = useCallback(
    async (knew: boolean) => {
      if (!card || busy.current) return;
      busy.current = true;
      try {
        if (settings.haptics && navigator.vibrate) navigator.vibrate(knew ? 6 : [6, 40, 6]);
        if (!reduce) {
          const fly = animate(x, (knew ? 1 : -1) * 480, { type: "spring", stiffness: 500, damping: 44, velocity: x.getVelocity() });
          await Promise.race([fly, new Promise((r) => setTimeout(r, 320))]);
        }
        const undo = await recordReview(card, knew ? KNEW : MISSED, Date.now() - shownAt.current, "rapid");
        setLog((l) => [...l, { card, knew, undo }]);
        setStreak((s) => {
          const n = knew ? s + 1 : 0;
          setBest((b) => Math.max(b, n));
          return n;
        });
        setFlipped(false);
        setI((n) => n + 1);
      } finally {
        busy.current = false;
      }
    },
    [card, reduce, settings.haptics, x],
  );

  const undoLast = useCallback(async () => {
    const last = log.at(-1);
    if (!last || busy.current) return;
    busy.current = true;
    try {
      await undoReview(last.undo);
      setLog((l) => l.slice(0, -1));
      setStreak(0);
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
      } else if (flipped && (e.key === "ArrowRight" || e.key === "3")) grade(true);
      else if (flipped && (e.key === "ArrowLeft" || e.key === "1")) grade(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, grade, undoLast, done]);

  // Horizontal swipe from anywhere on the card; a tap flips.
  const onDown = (e: React.PointerEvent) => {
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (Math.abs(dx) > 8 || Math.abs(e.clientY - d.y0) > 8) d.moved = true;
    if (flipped && settings.swipe) x.set(dx);
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const dx = x.get();
    if (!d.moved) return setFlipped((f) => !f);
    if (flipped && settings.swipe && Math.abs(dx) > 90) return void grade(dx > 0);
    animate(x, 0, { type: "spring", stiffness: 400, damping: 32, velocity: x.getVelocity() });
  };

  const knewCount = log.filter((l) => l.knew).length;
  const missed = log.filter((l) => !l.knew).map((l) => l.card);

  const header = (
    <div className="flex items-center gap-2">
      <Link href="/" aria-label="End session" className="btn min-h-11 w-11 border border-rule bg-sheet px-0 text-ink-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </Link>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-teal">Rapid fire</p>
        <p className="truncate font-serif text-lg leading-tight">{title}</p>
      </div>
      <Link href={fullCardsHref} role="switch" aria-checked="true" aria-label="Rapid fire mode on; switch to full cards" className="flex min-h-11 items-center gap-2 rounded-full border border-teal bg-teal-wash px-3 text-xs font-semibold text-teal">
        <span className="relative h-4 w-7 rounded-full bg-teal">
          <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-on-teal" />
        </span>
        Rapid
      </Link>
    </div>
  );

  const directionPicker = (
    <div className="glass flex rounded-full p-0.5 text-xs" role="radiogroup" aria-label="Direction">
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
                setStreak(0);
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
  const answerItems = isList && card.back ? card.back.split(/,\s*/) : null;
  const sub = card.subtopic ? subtopicById.get(card.subtopic)?.title : undefined;
  const isReverse = card.id.endsWith("~r");

  return (
    <div className="fixed inset-0 z-10 mx-auto flex max-w-2xl flex-col bg-paper px-4 pt-[calc(0.5rem+env(safe-area-inset-top))] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      {header}
      <div className="mt-3 flex items-center justify-between gap-2">
        {directionPicker}
        <span className="font-mono text-xs text-ink-soft tabular-nums">
          {i + 1}/{cards.length} · streak <b className="text-teal">{streak}</b>
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-rule">
        <div className="h-full bg-teal transition-[width] duration-200" style={{ width: `${(i / cards.length) * 100}%` }} />
      </div>

      <LazyMotion features={domAnimation}>
        <div className="relative mt-4 min-h-0 flex-1" style={{ touchAction: "none" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <m.div key={card.id} style={{ x, rotate }} className="porcelain absolute inset-0 flex cursor-pointer flex-col overflow-hidden select-none">
            <div className="flex items-center justify-between px-5 pt-4 font-mono text-[10px] tracking-wide text-porcelain-soft uppercase">
              <span className="truncate">
                {topicById.get(card.topicId)?.title}
                {sub ? ` / ${sub}` : ""}
              </span>
              <span>{isReverse ? "Reversed" : isList ? "List all" : "Recall"}</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-6 text-center" style={{ touchAction: "pan-y" }}>
              <p className="font-serif text-[1.7rem] leading-snug">{card.front}</p>
              {flipped ? (
                <m.div
                  className="mt-6 border-t border-porcelain-rule pt-5"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 400, damping: 32 }}
                >
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
                </m.div>
              ) : (
                <p className="mt-6 font-mono text-xs text-porcelain-soft">Tap to flip</p>
              )}
            </div>
            {/* swipe feedback */}
            <m.span style={{ opacity: knewOpacity }} className="pointer-events-none absolute top-4 right-4 rounded-full bg-strong px-3 py-1 font-mono text-xs font-bold text-on-teal">
              Knew it
            </m.span>
            <m.span style={{ opacity: missOpacity }} className="pointer-events-none absolute top-4 left-4 rounded-full bg-weak px-3 py-1 font-mono text-xs font-bold text-on-teal">
              Didn&apos;t know
            </m.span>
          </m.div>
        </div>
      </LazyMotion>

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

      <div className="glass grid grid-cols-2 gap-2 rounded-2xl p-2">
        {flipped ? (
          <>
            <button onClick={() => grade(false)} className="flex min-h-14 flex-col items-center justify-center rounded-xl border bg-sheet font-semibold" style={{ borderColor: "color-mix(in srgb, var(--color-weak) 45%, transparent)" }}>
              <span>Didn&apos;t know</span>
              <span className="font-mono text-[10px] font-normal text-ink-soft">← swipe left</span>
            </button>
            <button onClick={() => grade(true)} className="flex min-h-14 flex-col items-center justify-center rounded-xl border bg-sheet font-semibold" style={{ borderColor: "color-mix(in srgb, var(--color-strong) 45%, transparent)" }}>
              <span>Knew it</span>
              <span className="font-mono text-[10px] font-normal text-ink-soft">swipe right →</span>
            </button>
          </>
        ) : (
          <button onClick={() => setFlipped(true)} className="btn-primary col-span-2 min-h-14 text-base">
            Flip
          </button>
        )}
      </div>
    </div>
  );
}
