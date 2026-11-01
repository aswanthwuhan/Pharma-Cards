"use client";

import { animate, LazyMotion, domAnimation, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AXIS_LOCK_PX, classifySwipe, swipeIntent, type SwipeGrade } from "@/lib/swipe";
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
  samples: { t: number; x: number; y: number }[]; // card offset samples, for release velocity
  scrollSamples: { t: number; s: number }[];
}

/**
 * The study card stack. Touch handling is our own (touch-action: none) so a swipe can start
 * anywhere on the card, in any direction:
 * - Before the answer is shown: tap to reveal. Vertical drags scroll a long question.
 * - After: left = Forgot, right = Good. Vertical drags first scroll a long answer; once it
 *   reaches its top or bottom, the same drag carries on into the card: up = Easy, down = Hard.
 */
export function SwipeDeck({
  card,
  next,
  revealed,
  onReveal,
  onRate,
  intervals,
  swipe = true,
  haptics = true,
  aside,
  history,
}: {
  swipe?: boolean;
  haptics?: boolean;
  aside?: React.ReactNode;
  history?: string;
  card: FlashCard;
  next?: FlashCard;
  revealed: boolean;
  onReveal: () => void;
  onRate: (g: SwipeGrade) => void;
  intervals: Record<number, string>;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const strength = useMotionValue(0); // 0–1, how close the drag is to committing
  const rotate = useTransform(x, [-320, 320], reduce ? [0, 0] : [-7, 7]);
  const labelOpacity = useTransform(strength, [0, 0.4, 1], [0, 0.55, 1]);
  const ringOpacity = useTransform(strength, [0, 1], [0, 1]);
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

  /** Fly the card out in the grade's direction, then hand the grade up. Also used by buttons and keys. */
  async function commit(g: SwipeGrade) {
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
    const ease = [0.23, 1, 0.32, 1] as const;
    const fly =
      g === 1 || g === 3
        ? animate(x, (g === 1 ? -1 : 1) * width * 1.3, { duration: 0.22, ease })
        : animate(y, (g === 4 ? -1 : 1) * height * 1.1, { duration: 0.22, ease });
    // Never let the grade depend on the animation finishing: browsers pause animation
    // frames in background tabs and battery-saver modes.
    await Promise.race([fly, new Promise((r) => setTimeout(r, 300))]);
    onRate(g);
  }

  function springBack() {
    setIntent(null, 0);
    animate(x, 0, { type: "spring", duration: 0.4, bounce: 0.2 });
    animate(y, 0, { type: "spring", duration: 0.4, bounce: 0.2 });
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
    gesture.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      scroll0: scroller.current?.scrollTop ?? 0,
      axis: null,
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
    } else {
      // Scroll the answer first; whatever is left over moves the card.
      const want = g.scroll0 - dy;
      const max = maxScroll();
      const scrollTo = Math.min(max, Math.max(0, want));
      if (scroller.current) scroller.current.scrollTop = scrollTo;
      const overflow = want - scrollTo; // >0 pushed past bottom (finger up), <0 pulled past top (finger down)
      cy = live ? -overflow : -overflow * 0.15;
      g.scrollSamples.push({ t: e.timeStamp, s: scrollTo });
      if (g.scrollSamples.length > 6) g.scrollSamples.shift();
    }
    x.set(cx);
    y.set(cy);
    g.samples.push({ t: e.timeStamp, x: cx, y: cy });
    if (g.samples.length > 6) g.samples.shift();
    if (live) {
      const it = swipeIntent({ dx: cx, dy: cy, width, height, allowVertical: true });
      setIntent(it?.grade ?? null, it?.strength ?? 0);
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    gesture.current = null;
    // A tap (no axis chosen) reveals the answer.
    if (!g.axis) {
      if (!revealed && e.type === "pointerup") onReveal();
      return;
    }
    const v = velocity(g.samples);
    const { width, height } = size();
    const grade =
      revealed && swipe && e.type === "pointerup"
        ? classifySwipe({ dx: x.get(), dy: y.get(), vx: v.x, vy: v.y, width, height, allowVertical: true })
        : null;
    if (grade) {
      commit(grade);
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
        {next && <div aria-hidden className="porcelain pointer-events-none absolute inset-0 origin-top translate-y-3 scale-[0.95] opacity-60" />}

        <m.div
          key={card.id}
          className={`porcelain absolute inset-0 flex flex-col overflow-hidden ${revealed ? "cursor-grab select-none active:cursor-grabbing" : "cursor-pointer"}`}
          style={{ x, y, rotate, touchAction: "none" }}
          onKeyDown={(e) => !revealed && (e.key === "Enter" || e.key === " ") && onReveal()}
          role={revealed ? undefined : "button"}
          tabIndex={revealed ? -1 : 0}
          aria-label={revealed ? undefined : "Show answer"}
        >
          <div className="flex shrink-0 justify-center pt-2.5 pb-1" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-porcelain-rule" />
          </div>

          {/* Scrolls by mouse wheel natively; touch scrolling is driven by the gesture handler above. */}
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ touchAction: "none" }}>
            <MemoCard card={card} revealed={revealed} bare aside={aside} history={history} />
            {!revealed && <p className="pb-6 text-center font-mono text-xs text-porcelain-soft">Tap the card to see the answer</p>}
          </div>

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
                {GRADE_META[intentGrade].label} · {intervals[intentGrade]}
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

/** Ask the deck to fly the current card out with this grade (used by buttons and keys). */
export function gradeCurrentCard(g: SwipeGrade) {
  window.dispatchEvent(new CustomEvent("pharmacards:grade", { detail: g }));
}
