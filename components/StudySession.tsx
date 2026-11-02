"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Grade } from "ts-fsrs";
import { db } from "@/lib/db";
import { labelFor } from "@/lib/mastery";
import { previewIntervals, recordReview, undoReview, type ReviewUndo } from "@/lib/srs";
import { computeMastery, type MasteryReport } from "@/lib/store";
import { subtopicById, topicById } from "@/lib/syllabus";
import type { SwipeGrade } from "@/lib/swipe";
import type { FlashCard } from "@/lib/types";
import { BottomSheet } from "./BottomSheet";
import { SessionSummary } from "./SessionSummary";
import { MasteryPill } from "./MasteryPill";
import { GRADE_META, gradeCurrentCard, SwipeDeck } from "./SwipeDeck";
import { useSettings } from "@/lib/settings";

// Rating dock order matches Anki: Forgot, Hard, Good, Easy.
const DOCK: SwipeGrade[] = [1, 2, 3, 4];
const ARROW: Record<string, SwipeGrade> = { ArrowLeft: 1, ArrowDown: 2, ArrowRight: 3, ArrowUp: 4 };

interface Done {
  undo: ReviewUndo;
  grade: SwipeGrade;
  ms: number;
}

const GRADE_WORD: Record<number, string> = { 1: "Forgot", 2: "Hard", 3: "Good", 4: "Easy" };

/** "Reviewed 3 times, last: Good" from the card's FSRS state. */
function historyLine(state: { fsrs: { reps: number; lapses: number }; lastRating: number } | undefined) {
  if (!state || !state.fsrs.reps) return "First time";
  const r = state.fsrs.reps;
  return `Reviewed ${r} time${r > 1 ? "s" : ""}${state.fsrs.lapses ? `, forgot ${state.fsrs.lapses}x` : ""}, last: ${GRADE_WORD[state.lastRating]}`;
}

/** mm:ss on the card. Reads the same start time as the recorded answer time, so hidden time is left out of both. */
function CardTimer({ started }: { started: { current: number } }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const sec = Math.max(0, Math.floor((now - started.current) / 1000));
  return (
    <span className="font-mono text-[11px] text-porcelain-soft tabular-nums" aria-label="Time on this card">
      {String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}
    </span>
  );
}

export function StudySession({ cards, mode, title, rapidHref }: { cards: FlashCard[]; mode: string; title: string; rapidHref?: string }) {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState<Done[]>([]);
  const [toast, setToast] = useState<SwipeGrade | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [before, setBefore] = useState<MasteryReport>();
  const [after, setAfter] = useState<MasteryReport>();
  const started = useRef(Date.now());
  const busy = useRef(false);
  const snapshotId = useRef<number | undefined>(undefined);
  const card = cards[i];
  const done = i >= cards.length;
  // The card on screen now; a fly-out that finishes after an undo must not grade a different card.
  const currentId = useRef(card?.id);
  useEffect(() => {
    currentId.current = card?.id;
  }, [card?.id]);

  const state = useLiveQuery(() => (card ? db.cardStates.get(card.id) : undefined), [card?.id]);
  const bookmarked = useLiveQuery(() => (card ? db.bookmarks.get(card.id) : undefined), [card?.id]);
  const note = useLiveQuery(() => (card ? db.notes.get(card.id) : undefined), [card?.id]);
  const settings = useSettings();
  const intervals = previewIntervals(state, settings.retention);

  useEffect(() => {
    computeMastery().then(setBefore);
  }, []);

  // One snapshot per session: an undo from the summary and a re-grade replace it instead of adding another.
  useEffect(() => {
    if (!done || !cards.length) return;
    computeMastery().then(async (m) => {
      setAfter(m);
      const snap = { at: Date.now(), label: mode, scores: Object.fromEntries([...m.subtopic].map(([k, v]) => [k, v.score])) };
      if (snapshotId.current !== undefined) await db.snapshots.put({ ...snap, id: snapshotId.current });
      else snapshotId.current = await db.snapshots.add(snap);
    });
  }, [done, cards.length, mode]);

  // Answer time leaves out time the app spent hidden (switched away, screen off).
  useEffect(() => {
    let hiddenAt = document.hidden ? Date.now() : 0;
    const onVis = () => {
      if (document.hidden) hiddenAt = Date.now();
      else if (hiddenAt) started.current += Date.now() - hiddenAt;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // The undo toast disappears after 5 s.
  useEffect(() => {
    if (toast === null) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast, history.length]);

  const rate = useCallback(
    async (g: SwipeGrade) => {
      if (!card || busy.current || card.id !== currentId.current) return;
      busy.current = true;
      try {
        const isNew = !state;
        const ms = Math.min(120_000, Date.now() - started.current); // cap idle time
        const undo = await recordReview(card, g as Grade, ms, isNew && mode === "daily" ? "daily-new" : mode);
        setHistory((h) => [...h, { undo, grade: g, ms }]);
        setToast(g);
        setRevealed(false);
        started.current = Date.now();
        setI((x) => x + 1);
      } finally {
        busy.current = false;
      }
    },
    [card, state, mode],
  );

  const undoLast = useCallback(async () => {
    const last = history.at(-1);
    if (!last || busy.current) return;
    busy.current = true;
    try {
      await undoReview(last.undo);
      setHistory((h) => h.slice(0, -1));
      setToast(null);
      setI((x) => x - 1);
      setRevealed(true);
      started.current = Date.now();
    } finally {
      busy.current = false;
    }
  }, [history]);

  // Keyboard: Space/Enter reveal; 1-4 or arrow keys grade; Ctrl/Cmd+Z undo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (noteOpen || el.closest?.("input, textarea, select, [contenteditable]")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoLast();
        return;
      }
      if (done) return;
      // Enter/Space on a focused control is that control's (e.g. "End session" must follow its link).
      const activate = e.code === "Space" || e.key === "Enter";
      if (activate && el.closest?.("button, a, [role=radio]")) return;
      if (!revealed && activate) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ["1", "2", "3", "4"].includes(e.key)) gradeCurrentCard(Number(e.key) as SwipeGrade);
      else if (revealed && ARROW[e.key]) {
        e.preventDefault();
        gradeCurrentCard(ARROW[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, undoLast, noteOpen, done]);

  if (!cards.length)
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-serif text-2xl">Nothing to study here right now</p>
        <p className="max-w-sm text-sm text-ink-soft">
          {mode === "weak"
            ? "No subtopic is rated weak or moderate yet. Take the diagnostic so the app can find your weak areas."
            : "Try another mode, or come back when cards are due."}
        </p>
        <Link href={mode === "weak" ? "/study?mode=diagnostic" : "/"} className="btn-primary mt-2">
          {mode === "weak" ? "Start diagnostic" : "Back to Today"}
        </Link>
      </div>
    );

  if (done) return <SessionSummary cards={cards} history={history} before={before} after={after} title={title} onUndo={undoLast} />;

  const progress = (i / cards.length) * 100;
  return (
    <div className="fixed inset-0 z-10 mx-auto flex max-w-2xl flex-col bg-paper px-4 pt-[calc(0.5rem+env(safe-area-inset-top))] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {/* header */}
      <div className="glass flex items-center gap-2 rounded-2xl p-1.5">
        <Link href="/" aria-label="End session" className="btn min-h-11 w-11 border border-rule bg-sheet px-0 text-ink-soft">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight">{title}</p>
          <p className="font-mono text-[11px] text-ink-soft">
            Card {i + 1} of {cards.length} · {Math.round(progress)}% complete
          </p>
        </div>
        {rapidHref && (
          <Link
            href={rapidHref}
            role="switch"
            aria-checked="false"
            aria-label="Rapid fire mode off; switch to rapid fire"
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-rule bg-sheet px-2.5 text-xs text-ink-soft"
          >
            <span className="relative h-4 w-7 rounded-full bg-rule">
              <span className="absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-ink-soft" />
            </span>
            Rapid
          </Link>
        )}
        {history.length > 0 && (
          <button onClick={undoLast} aria-label="Undo last answer" className="btn min-h-11 border border-rule bg-sheet px-3 text-xs text-ink-soft">
            Undo
          </button>
        )}
        <button
          onClick={() => setNoteOpen(true)}
          className={`btn min-h-11 border bg-sheet px-3 text-xs ${note ? "border-moderate text-moderate" : "border-rule text-ink-soft"}`}
        >
          Note
        </button>
        <button
          aria-pressed={!!bookmarked}
          onClick={() => (bookmarked ? db.bookmarks.delete(card.id) : db.bookmarks.put({ cardId: card.id, at: Date.now() }))}
          className={`btn min-h-11 border px-3 text-xs ${bookmarked ? "border-teal bg-teal-wash text-teal" : "border-rule bg-sheet text-ink-soft"}`}
        >
          {bookmarked ? "Saved" : "Save"}
        </button>
      </div>
      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-rule"
        role="progressbar"
        aria-valuenow={i}
        aria-valuemax={cards.length}
        aria-label="Session progress"
      >
        <div className="h-full bg-teal transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* card stack */}
      <div className="relative mt-4 min-h-0 flex-1">
        <SwipeDeck
          card={card}
          next={cards[i + 1]}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onRate={rate}
          intervals={intervals}
          swipe={settings.swipe}
          haptics={settings.haptics}
          aside={<CardTimer key={card.id} started={started} />}
          history={historyLine(state)}
        />
      </div>

      {/* status strip: last grade + undo, or the swipe hint. Fixed height, so it never covers the card or shifts layout. */}
      <div className="flex h-9 shrink-0 items-center justify-center" role="status" aria-live="polite">
        {toast !== null && history.length > 0 ? (
          <span className="glass flex items-center gap-2 rounded-full py-0.5 pr-0.5 pl-3 text-xs">
            Marked <b style={{ color: GRADE_META[toast].color }}>{GRADE_META[toast].label}</b>
            <button onClick={undoLast} className="btn min-h-8 rounded-full bg-teal-wash px-3 text-xs text-teal">
              Undo
            </button>
          </span>
        ) : revealed && settings.swipe ? (
          <span className="font-mono text-[10px] text-ink-soft">Swipe: ← Forgot · ↓ Hard · → Good · ↑ Easy</span>
        ) : null}
      </div>

      {/* rating dock, at thumb level */}
      <div className="glass rounded-2xl p-2">
        {revealed ? (
          <>
            <div className="grid grid-cols-4 gap-1.5">
              {DOCK.map((g) => {
                const meta = GRADE_META[g];
                return (
                  <button
                    key={g}
                    onClick={() => gradeCurrentCard(g)}
                    className="flex min-h-14 flex-col items-center justify-center rounded-xl border bg-sheet transition-[transform,background-color] duration-100 active:scale-[0.97]"
                    style={{ borderColor: `color-mix(in srgb, ${meta.color} 40%, transparent)` }}
                  >
                    <span className="font-mono text-[11px]" style={{ color: meta.color }}>
                      {intervals[g]}
                    </span>
                    <span className="text-sm font-semibold">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <button onClick={() => setRevealed(true)} className="btn-primary min-h-14 w-full text-base">
            Show answer
          </button>
        )}
      </div>

      <BottomSheet open={noteOpen} onClose={() => setNoteOpen(false)} title="Your note">
        <div className="space-y-3 px-5">
          <p className="text-sm text-ink-soft">A mnemonic or correction for this card. It saves as you type.</p>
          <textarea
            key={card.id}
            rows={5}
            autoFocus
            defaultValue={note?.text ?? ""}
            aria-label="Note for this card"
            className="w-full rounded-xl border border-rule bg-well p-3 text-ink"
            onChange={(e) =>
              e.target.value.trim()
                ? db.notes.put({ cardId: card.id, text: e.target.value, updatedAt: Date.now() })
                : db.notes.delete(card.id)
            }
          />
        </div>
      </BottomSheet>
    </div>
  );
}

