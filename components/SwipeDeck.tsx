"use client";

import { animate, LazyMotion, domAnimation, m, useMotionValue, useTransform } from "motion/react";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AXIS_LOCK_PX, classifySwipe, swipeIntent, type SwipeGrade } from "@/lib/swipe";
import { useTaps } from "@/lib/doubleTap";
import { useReduceMotion } from "@/lib/settings";
import type { FlashCard } from "@/lib/types";
import { CardView } from "./CardView";

export const GRADE_META: Record<SwipeGrade, { label: string; color: string; dir: string }> = {
  1: { label: "Forgot", color: "var(--color-weak)", dir: "left" },
  2: { label: "Hard", color: "var(--color-moderate)", dir: "down" },
  3: { label: "Good", color: "var(--color-strong)", dir: "right" },
  4: { label: "Easy", color: "var(--color-teal)", dir: "up" },
};

const MemoCard = memo(CardView);

interface Gesture {
  id: number;
  x0: number;
  y0: number;
  scroll0: number;
  axis: "x" | "y" | null;
  inBand: boolean; // started in the top or bottom swipe zone: up/down grades instead of scrolling
  samples: { t: number; x: number; y: number }[]; // card offset samples, for release velocity
  scrollSamples: { t: number; s: number }[];
}

/**
 * The study card stack. Touch handling is our own (touch-action: none) so a swipe can start
 * anywhere on the card, in any direction:
 * - A tap flips the card between question and answer; a double tap skips it. Vertical drags scroll long text.
 * - After: left = Forgot, right = Good, anywhere on the card. Up = Easy and down = Hard only from
 *   the swipe zone at the card's edge (bottom by default; edge, height and visibility set by the user);
 *   elsewhere up/down scrolls.
 */
export function SwipeDeck({
  card,
  next,
  revealed,
  onFlip,
  onSkip,
  onRate,
  intervals,
  swipe = true,
  haptics = true,
  band = 72,
  edge = "bottom",
  showZone = false,
  aside,
  history,
  render,
}: {
  swipe?: boolean;
  haptics?: boolean;
  band?: number;
  edge?: "bottom" | "top" | "both";
  showZone?: boolean;
  aside?: React.ReactNode;
  history?: string;
  render?: (revealed: boolean) => React.ReactNode; // custom card face (Rapid Fire); default is CardView
  card: FlashCard;
  next?: FlashCard;
  revealed: boolean;
  onFlip: () => void; // tap: question <-> answer
  onSkip: () => void; // double tap: skip to the next card without grading
  onRate: (g: SwipeGrade) => void;
  intervals: Record<number, string>;
}) {
  const reduce = useReduceMotion();
  const tap = useTaps(onFlip, onSkip);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const strength = useMotionValue(0); // 0–1, how close the drag is to committing
  const rotate = useTransform(x, [-320, 320], reduce ? [0, 0] : [-7, 7]);
  const labelOpacity = useTransform(strength, [0, 0.4, 1], [0, 0.55, 1]);
  const ringOpacity = useTransform(strength, [0, 1], [0, 1]);
  // 0 → 1 as the top card leaves; the card behind rises from 0.96 to 1 and fades in.
  const lift = useTransform([x, y], ([a, b]) => Math.min(1, Math.hypot(a as number, b as number) / 160));
  const peekTransform = useTransform(lift, (p) => `translateY(${(1 - p) * 12}px) scale(${0.96 + 0.04 * p})`);
  const peekOpacity = useTransform(lift, [0, 1], [0.6, 1]);
  const frame = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const momentum = useRef<{ stop: () => void } | null>(null);
  const leaving = useRef(false);
  // Only re-render when the *direction* being approached changes, not every frame.
  const [intentGrade, setIntentGrade] = useState<SwipeGrade | null>(null);
  const intentRef = useRef<SwipeGrade | null>(null);

  useLayoutEffect(() => {
    // jump() also stops any animation still running on the value (e.g. the previous card's fly-out),
    // which otherwise keeps writing its target after the new card has mounted.
    x.jump(0);
    y.jump(0);
    strength.jump(0);
    leaving.current = false;
    intentRef.current = null;
    setIntentGrade(null);
    momentum.current?.stop();
    scroller.current?.scrollTo({ top: 0 });
  }, [card.id, x, y, strength]);

  const size = () => ({ width: frame.current?.clientWidth ?? 360, height: frame.current?.clientHeight ?? 600 });
  const maxScroll = () => {
    const el = scroller.current;
    return el ? Math.max(0, el.scrollHeight - el.clientHeight) : 0;
  };

  function setIntent(g: SwipeGrade | null, s: number) {
    strength.set(s);
    if (g !== intentRef.current) {
      intentRef.current = g;
      setIntentGrade(g);
    }
  }

  /**
   * Fly the card out in the grade's direction, then hand the grade up. Also used by buttons and keys.
   * `release` is the finger's velocity (px/s) at release, carried into the spring so a flick keeps its speed.
   */
  async function commit(g: SwipeGrade, release = { x: 0, y: 0 }) {
    if (leaving.current) return;
    leaving.current = true;
    momentum.current?.stop();
    if (haptics && navigator.vibrate) navigator.vibrate(8);
    if (reduce) {
      onRate(g);
      return;
    }
    const { width, height } = size();
    setIntent(g, 1);
    const horizontal = g === 1 || g === 3;
    const value = horizontal ? x : y;
    const target = horizontal ? (g === 1 ? -1 : 1) * width * 1.3 : (g === 4 ? -1 : 1) * height * 1.1;
    const fly = animate(value, target, { type: "spring", stiffness: 500, damping: 44, velocity: horizontal ? release.x : release.y });
    // Never let the grade depend on the animation finishing: browsers pause animation
    // frames in background tabs and battery-saver modes.
    await Promise.race([fly, new Promise((r) => setTimeout(r, 320))]);
    onRate(g);
  }

  function springBack() {
    setIntent(null, 0);
    const spring = { type: "spring" as const, stiffness: 400, damping: 32 };
    animate(x, 0, { ...spring, velocity: x.getVelocity() });
    animate(y, 0, { ...spring, velocity: y.getVelocity() });
  }

  /** Coast a fast scroll flick to a stop, like native scrolling. */
  function coast(velocity: number) {
    const el = scroller.current;
    if (!el || Math.abs(velocity) < 80) return;
    const start = el.scrollTop;
    const target = Math.min(maxScroll(), Math.max(0, start + velocity * 0.35));
    momentum.current = animate(start, target, {
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => (el.scrollTop = v),
    });
  }

  // Grade buttons and keyboard trigger the same fly-out.
  useEffect(() => {
    const handler = (e: Event) => commit((e as CustomEvent<SwipeGrade>).detail);
    window.addEventListener("pharmacards:grade", handler);
    return () => window.removeEventListener("pharmacards:grade", handler);
  });

  function onPointerDown(e: React.PointerEvent) {
    if (leaving.current || gesture.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    // Let buttons inside the card (essay "next heading") work normally.
    if ((e.target as HTMLElement).closest("button, a, textarea, input")) return;
    momentum.current?.stop();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // some browsers refuse capture for synthetic or already-released pointers; the gesture still works
    }
    const top = frame.current?.getBoundingClientRect().top ?? 0;
    const local = e.clientY - top;
    gesture.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      scroll0: scroller.current?.scrollTop ?? 0,
      axis: null,
      inBand: (edge !== "bottom" && local < band) || (edge !== "top" && local > size().height - band),
      samples: [{ t: e.timeStamp, x: 0, y: 0 }],
      scrollSamples: [{ t: e.timeStamp, s: scroller.current?.scrollTop ?? 0 }],
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (!g.axis) {
      if (Math.hypot(dx, dy) < AXIS_LOCK_PX) return;
      g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    const { width, height } = size();
    let cx = 0;
    let cy = 0;
    const live = revealed && swipe; // with swipe off, drags only scroll / nudge
    if (g.axis === "x") {
      cx = live ? dx : dx * 0.15; // before reveal the card only nudges
    } else if (live && g.inBand) {
      cy = dy; // swipe zone: the card itself moves, nothing scrolls
    } else {
      // Outside the swipe zones up/down only scrolls; at the ends the card gives a small elastic nudge.
      const want = g.scroll0 - dy;
      const max = maxScroll();
      const scrollTo = Math.min(max, Math.max(0, want));
      if (scroller.current) scroller.current.scrollTop = scrollTo;
      cy = -(want - scrollTo) * 0.15;
      g.scrollSamples.push({ t: e.timeStamp, s: scrollTo });
      if (g.scrollSamples.length > 6) g.scrollSamples.shift();
    }
    x.set(cx);
    y.set(cy);
    g.samples.push({ t: e.timeStamp, x: cx, y: cy });
    if (g.samples.length > 6) g.samples.shift();
    if (live) {
      const it = swipeIntent({ dx: cx, dy: cy, width, height, allowVertical: g.inBand });
      setIntent(it?.grade ?? null, it?.strength ?? 0);
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    gesture.current = null;
    // A tap (no axis chosen) flips the card; a double tap skips it.
    if (!g.axis) {
      if (e.type === "pointerup") tap();
      return;
    }
    const v = velocity(g.samples);
    const { width, height } = size();
    // Vertical grades only from the swipe zones, so scrolling a long answer never grades it.
    const grade =
      revealed && swipe && e.type === "pointerup" && (g.axis === "x" || g.inBand)
        ? classifySwipe({ dx: x.get(), dy: y.get(), vx: v.x, vy: v.y, width, height, allowVertical: g.inBand })
        : null;
    if (grade) {
      commit(grade, { x: v.x, y: v.y });
      return;
    }
    springBack();
    if (g.axis === "y" && Math.abs(y.get()) < 4) coast(scrollVelocity(g.scrollSamples));
  }

  return (
    <LazyMotion features={domAnimation}>
      {/* Pointer handlers live on this plain div (not the motion element) so they always see current props. */}
      <div
        ref={frame}
        className="relative h-full"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* next card peeking from behind */}
        {next && <m.div aria-hidden className="porcelain pointer-events-none absolute inset-0 origin-top" style={{ transform: peekTransform, opacity: peekOpacity }} />}

        <m.div
          key={card.id}
          className={`porcelain absolute inset-0 flex flex-col overflow-hidden ${revealed ? "cursor-grab select-none active:cursor-grabbing" : "cursor-pointer"}`}
          style={{ x, y, rotate, touchAction: "none" }}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onFlip())}
          role="button"
          tabIndex={0}
          aria-label={revealed ? "Flip back to the question" : "Show answer"}
        >
          {/* Each side turns in on the Y axis when the card flips. */}
          <m.div
            key={revealed ? "back" : "front"}
            className="flex min-h-0 flex-1 flex-col"
            initial={reduce ? { opacity: 0 } : { rotateY: revealed ? -90 : 90, opacity: 0.4 }}
            animate={reduce ? { opacity: 1 } : { rotateY: 0, opacity: 1 }}
            transition={reduce ? { duration: 0.12 } : { duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ transformPerspective: 1000 }}
          >
          <div className="flex shrink-0 justify-center pt-2.5 pb-1" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-porcelain-rule" />
          </div>

          {/* Scrolls by mouse wheel natively; touch scrolling is driven by the gesture handler above. */}
          <div
            ref={scroller}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            // Room below the answer so its last lines can scroll clear of the bottom swipe zone.
            style={{ touchAction: "none", paddingBottom: revealed && swipe && edge !== "top" ? band : 0 }}
          >
            {/* Question side sits centred on the card; the answer side reads from the top. */}
            <div className={revealed ? "" : "flex min-h-full flex-col justify-center"}>
              {render ? render(revealed) : <MemoCard card={card} revealed={revealed} bare aside={aside} history={history} />}
            </div>
            {!revealed && <p className="pb-6 text-center font-mono text-xs text-porcelain-soft">Tap the card to see the answer</p>}
          </div>
          </m.div>

          {/* up/down swipe zones: invisible unless the user turns the outline on */}
          {revealed && swipe && showZone && edge !== "bottom" && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-center rounded-t-2xl border-b border-dashed border-porcelain-rule bg-gradient-to-b from-porcelain-2 to-transparent pt-1.5"
              style={{ height: band }}
            >
              <span className="font-mono text-[10px] whitespace-pre text-porcelain-soft">{`↑ Easy${intervals[4] ? ` · ${intervals[4]}` : ""}   ↓ Hard${intervals[2] ? ` · ${intervals[2]}` : ""}`}</span>
            </div>
          )}
          {revealed && swipe && showZone && edge !== "top" && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center rounded-b-2xl border-t border-dashed border-porcelain-rule bg-gradient-to-t from-porcelain-2 to-transparent pb-1.5"
              style={{ height: band }}
            >
              <span className="font-mono text-[10px] whitespace-pre text-porcelain-soft">{`↑ Easy${intervals[4] ? ` · ${intervals[4]}` : ""}   ↓ Hard${intervals[2] ? ` · ${intervals[2]}` : ""}`}</span>
            </div>
          )}

          {/* live grade feedback while dragging (opacity driven by motion values, no re-render per frame) */}
          {intentGrade && (
            <>
              <m.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ boxShadow: `inset 0 0 0 3px ${GRADE_META[intentGrade].color}`, opacity: ringOpacity }}
              />
              <m.span
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 font-mono text-sm font-semibold whitespace-nowrap text-on-teal"
                style={{ background: GRADE_META[intentGrade].color, opacity: labelOpacity }}
              >
                {GRADE_META[intentGrade].label}
                {intervals[intentGrade] ? ` · ${intervals[intentGrade]}` : ""}
              </m.span>
            </>
          )}
        </m.div>
      </div>
    </LazyMotion>
  );
}

/** Velocity (px/s) from the last ~100 ms of samples. */
function velocity(samples: Gesture["samples"]) {
  const last = samples[samples.length - 1];
  const first = samples.find((s) => last.t - s.t <= 100) ?? samples[0];
  const dt = (last.t - first.t) / 1000;
  return dt > 0 ? { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt } : { x: 0, y: 0 };
}

function scrollVelocity(samples: Gesture["scrollSamples"]) {
  const last = samples[samples.length - 1];
  const first = samples.find((s) => last.t - s.t <= 100) ?? samples[0];
  const dt = (last.t - first.t) / 1000;
  return dt > 0 ? (last.s - first.s) / dt : 0;
}

/** The four grade buttons under the card: tinted by grade, interval on top, a colour bar under the label. */
export function GradeDock({ intervals }: { intervals?: Record<number, string> }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {([1, 2, 3, 4] as SwipeGrade[]).map((g) => {
        const meta = GRADE_META[g];
        return (
          <button
            key={g}
            onClick={() => gradeCurrentCard(g)}
            className="flex h-16 flex-col items-center justify-center gap-0.5 rounded-xl border transition-[transform,background-color] duration-100 active:scale-[0.97]"
            style={{
              borderColor: `color-mix(in srgb, ${meta.color} 45%, transparent)`,
              background: `color-mix(in srgb, ${meta.color} 14%, var(--color-sheet))`,
            }}
          >
            {intervals?.[g] ? (
              <span className="font-mono text-[11px]" style={{ color: meta.color }}>
                {intervals[g]}
              </span>
            ) : null}
            <span className="text-sm font-semibold">{meta.label}</span>
            <span aria-hidden className="h-0.5 w-5 rounded-full" style={{ background: meta.color }} />
          </button>
        );
      })}
    </div>
  );
}

/** Ask the deck to fly the current card out with this grade (used by buttons and keys). */
export function gradeCurrentCard(g: SwipeGrade) {
  window.dispatchEvent(new CustomEvent("pharmacards:grade", { detail: g }));
}
