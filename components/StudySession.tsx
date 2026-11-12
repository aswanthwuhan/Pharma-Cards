"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Grade } from "ts-fsrs";
import { db } from "@/lib/db";
import { previewIntervals, recordReview, undoReview, type ReviewUndo } from "@/lib/srs";
import { computeMastery, type MasteryReport } from "@/lib/store";
import type { SwipeGrade } from "@/lib/swipe";
import type { FlashCard } from "@/lib/types";
import { BottomSheet } from "./BottomSheet";
import { NavBack } from "./NavBack";
import { ProgressRing } from "./ProgressRing";
import { SessionSummary } from "./SessionSummary";
import { GRADE_META, GradeDock, gradeCurrentCard, SwipeDeck } from "./SwipeDeck";
import { useSettings } from "@/lib/settings";

// Rating dock order matches Anki: Forgot, Hard, Good, Easy.
const ARROW: Record<string, SwipeGrade> = { ArrowLeft: 1, ArrowDown: 2, ArrowRight: 3, ArrowUp: 4 };
/** The grade on the far side of the card, used to bring the previous card back. */
const OPPOSITE: Record<SwipeGrade, SwipeGrade> = { 1: 3, 3: 1, 2: 4, 4: 2 };

interface Done {
  undo: ReviewUndo;
  grade: SwipeGrade;
  ms: number;
  requeued?: boolean;
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

export function StudySession({ cards: initial, mode, title, rapidHref }: { cards: FlashCard[]; mode: string; title: string; rapidHref?: string }) {
  // Skipped cards move to the end of the queue, so the order is state.
  const [cards, setCards] = useState(initial);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState<Done[]>([]);
  const [toast, setToast] = useState<SwipeGrade | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [before, setBefore] = useState<MasteryReport>();
  const [after, setAfter] = useState<MasteryReport>();
  const started = useRef(Date.now());
  const busy = useRef(false);
  // Cards already appended again after a "Forgot", so each comes back at most once per session.
  const requeuedIds = useRef(new Set<string>());
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

  // Notes save on a short debounce; the pending write is flushed on close, card change and unmount.
  const [noteText, setNoteText] = useState(note?.text ?? "");
  const noteSave = useRef<number | null>(null);
  const notePending = useRef<{ id: string; text: string } | null>(null);
  const noteDirty = useRef(false);

  const flushNote = useCallback(() => {
    if (noteSave.current !== null) {
      window.clearTimeout(noteSave.current);
      noteSave.current = null;
    }
    const p = notePending.current;
    notePending.current = null;
    if (!p) return;
    if (p.text.trim()) db.notes.put({ cardId: p.id, text: p.text, updatedAt: Date.now() });
    else db.notes.delete(p.id);
  }, []);

  const queueNote = useCallback(
    (text: string) => {
      setNoteText(text);
      if (!card) return;
      noteDirty.current = true;
      notePending.current = { id: card.id, text };
      if (noteSave.current !== null) window.clearTimeout(noteSave.current);
      noteSave.current = window.setTimeout(() => {
        noteSave.current = null;
        const p = notePending.current;
        notePending.current = null;
        if (p) {
          if (p.text.trim()) db.notes.put({ cardId: p.id, text: p.text, updatedAt: Date.now() });
          else db.notes.delete(p.id);
        }
      }, 400);
    },
    [card],
  );

  // Load the stored note when it arrives; typing wins over later live-query updates.
  useEffect(() => {
    noteDirty.current = false;
  }, [card?.id]);
  useEffect(() => {
    if (noteDirty.current) return;
    if (note && card && note.cardId !== card.id) {
      setNoteText("");
      return;
    }
    setNoteText(note?.text ?? "");
  }, [note, card?.id]);
  useEffect(() => () => flushNote(), [card?.id, flushNote]);

  useEffect(() => {
    computeMastery().then(setBefore);
  }, []);

  // One snapshot per session: an undo from the summary and a re-grade replace it instead of adding another.
  useEffect(() => {
    if (!done) {
      // Back on a card (undo from the summary): the stored snapshot would show pre-undo scores, so drop it.
      if (snapshotId.current !== undefined) {
        void db.snapshots.delete(snapshotId.current);
        snapshotId.current = undefined;
      }
      return;
    }
    if (!cards.length) return;
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
      // The grade buttons unmount after a grade; keep keyboard focus on the next card's flip button only if it was on a button.
      const hadFocus = document.activeElement instanceof HTMLButtonElement;
      try {
        const ms = Date.now() - started.current; // recordReview caps idle time
        const undo = await recordReview(card, g as Grade, ms, mode);
        // Re-testing a miss in the same sitting, so it is not left until another day.
        const requeue = g === 1 && mode !== "diagnostic" && !requeuedIds.current.has(card.id);
        if (requeue) {
          requeuedIds.current.add(card.id);
          setCards((c) => [...c, card]);
        }
        setHistory((h) => [...h, { undo, grade: g, ms, requeued: requeue }]);
        setToast(g);
        setRevealed(false);
        started.current = Date.now();
        setI((x) => x + 1);
        if (hadFocus) requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-flip]")?.focus({ preventScroll: true }));
      } finally {
        busy.current = false;
      }
    },
    [card, mode],
  );

  const undoLast = useCallback(async () => {
    const last = history.at(-1);
    if (!last || busy.current) return;
    busy.current = true;
    try {
      await undoReview(last.undo);
      setHistory((h) => h.slice(0, -1));
      setToast(null);
      if (last.requeued) {
        // Remove the appended copy (always past the current index) and allow a future re-queue.
        const id = last.undo.cardId;
        requeuedIds.current.delete(id);
        setCards((c) => {
          const k = c.map((x) => x.id).lastIndexOf(id);
          return k < 0 ? c : [...c.slice(0, k), ...c.slice(k + 1)];
        });
      }
      setI((x) => x - 1);
      setRevealed(true);
      started.current = Date.now();
    } finally {
      busy.current = false;
    }
  }, [history]);

  const skip = useCallback(() => {
    if (!card) return;
    setRevealed(false);
    setCards((c) => [...c.slice(0, i), ...c.slice(i + 1), c[i]]);
  }, [card, i]);

  // Keyboard: Space/Enter flip both ways; 1-4 or arrow keys grade; U, Escape or Ctrl/Cmd+Z undo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (noteOpen || el.closest?.("input, textarea, select, [contenteditable]")) return;
      if (document.querySelector('[aria-modal="true"]')) return; // a dialog owns the keyboard
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoLast();
        return;
      }
      // Escape / U undo the last grade (not on the summary screen).
      if (!done && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "Escape" || e.key.toLowerCase() === "u")) {
        e.preventDefault();
        undoLast();
        return;
      }
      if (done) return;
      if (!e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        skip();
        return;
      }
      // Enter/Space on a focused control is that control's (e.g. "End session" must follow its link).
      const activate = e.code === "Space" || e.key === "Enter";
      if (activate && el.closest?.("button, a, [role=radio]")) return;
      if (activate) {
        // Flip both ways: Space/Enter show the answer, and the next press turns the card back over.
        e.preventDefault();
        setRevealed((r) => !r);
      } else if (revealed && ["1", "2", "3", "4"].includes(e.key)) gradeCurrentCard(Number(e.key) as SwipeGrade);
      else if (revealed && ARROW[e.key] && !el.closest?.("[data-card-scroller]")) {
        e.preventDefault();
        gradeCurrentCard(ARROW[e.key]);
      }
      // Arrows only grade a flipped card, so on a fresh card the opposite direction can bring the
      // previous one back: grade right, then left puts it back on the table.
      else if (!revealed && ARROW[e.key] && history.length && OPPOSITE[history.at(-1)!.grade] === ARROW[e.key]) {
        e.preventDefault();
        undoLast();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, undoLast, noteOpen, done, skip, history]);

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
      {/* header: back, progress ring and title on one row; card actions on the next, so nothing squeezes the title */}
      <div className="glass space-y-1.5 rounded-2xl p-1.5">
        <div className="flex items-center gap-2">
          <NavBack />
          <ProgressRing value={i} max={cards.length} />
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-base leading-snug">{title}</h1>
            <p className="font-mono text-[11px] text-ink-soft">
              Card {i + 1} of {cards.length} · {Math.round(progress)}%
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {rapidHref && (
            <Link
              href={rapidHref}
              aria-label="Rapid fire mode off; switch to rapid fire"
              className="mr-auto flex min-h-11 items-center gap-1.5 rounded-full border border-rule bg-sheet px-2.5 text-xs text-ink-soft"
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
          <button onClick={skip} className="btn min-h-11 border border-rule bg-sheet px-3 text-xs text-ink-soft">
            Skip
          </button>
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
      </div>

      {/* card stack */}
      <div className="relative mt-4 min-h-0 flex-1">
        {/* key={i}: a re-queued "Forgot" card can be the next card itself, so the deck must remount per position. */}
        <SwipeDeck
          key={i}
          card={card}
          next={cards[i + 1]}
          revealed={revealed}
          onFlip={() => setRevealed((r) => !r)}
          onSkip={skip}
          onRate={rate}
          intervals={intervals}
          swipe={settings.swipe}
          band={settings.swipeBand}
          edge={settings.swipeEdge}
          showZone={settings.swipeZoneVisible}
          haptics={settings.haptics}
          aside={<CardTimer key={card.id} started={started} />}
          history={historyLine(state)}
        />
      </div>

      {/* status strip: last grade + undo, or the swipe hint. Fixed height, so it never covers the card or shifts layout. */}
      <div className="flex min-h-9 shrink-0 items-center justify-center" role="status" aria-live="polite">
        {toast !== null && history.length > 0 ? (
          <span className="glass flex items-center gap-2 rounded-full py-0.5 pr-0.5 pl-3 text-xs">
            Marked <b style={{ color: GRADE_META[toast].color }}>{GRADE_META[toast].label}</b>
            <button onClick={undoLast} className="btn min-h-11 rounded-full bg-teal-wash px-3 text-xs text-teal">
              Undo
            </button>
          </span>
        ) : revealed && settings.swipe ? (
          <span className="font-mono text-[11px] whitespace-nowrap text-ink-soft">← Forgot · → Good · edge ↑ Easy · ↓ Hard</span>
        ) : null}
      </div>

      {/* rating dock, at thumb level */}
      <div className="glass rounded-2xl p-2">
        {revealed ? (
          <GradeDock intervals={intervals} />
        ) : (
          // Same height as the grade row, so the card does not resize when the answer appears.
          <p className="flex h-16 items-center justify-center font-mono text-xs text-ink-soft">Tap card to flip · double tap to skip</p>
        )}
      </div>

      <BottomSheet open={noteOpen} onClose={() => { flushNote(); setNoteOpen(false); }} title="Your note">
        <div className="space-y-3 px-5">
          <p className="text-sm text-ink-soft">A mnemonic or correction for this card. It saves as you type.</p>
          <textarea
            key={card.id}
            rows={5}
            autoFocus
            value={noteText}
            aria-label="Note for this card"
            className="w-full rounded-xl border border-rule bg-well p-3 text-ink"
            onChange={(e) => queueNote(e.target.value)}
          />
        </div>
      </BottomSheet>
    </div>
  );
}

