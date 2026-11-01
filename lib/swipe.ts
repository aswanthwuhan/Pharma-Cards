// Pure swipe classification for the study card, so it can be unit-tested.
// Left = Forgot (1), right = Good (3), up = Easy (4), down = Hard (2).

export type SwipeGrade = 1 | 2 | 3 | 4;

export interface SwipeInput {
  dx: number; // drag offset, px (right positive)
  dy: number; // drag offset, px (down positive)
  vx: number; // release velocity, px/s
  vy: number;
  width: number; // card size, px
  height: number;
  allowVertical: boolean; // false while a long answer owns vertical scrolling
}

// Tuned for thumbs on a phone: a quarter of the card's width, or a quick flick, commits.
export const COMMIT_FRACTION = 0.26;
export const COMMIT_VELOCITY = 400; // px/s
export const AXIS_LOCK_PX = 8; // movement before a drag picks its axis (shorter = taps)
const MIN_TRAVEL = 28; // a fast flick still has to move this far

/** Which axis a drag belongs to, decided by the dominant direction. */
export function dragAxis(dx: number, dy: number, allowVertical: boolean): "x" | "y" {
  return allowVertical && Math.abs(dy) > Math.abs(dx) ? "y" : "x";
}

/** Grade a drag would give if released now, or null to snap back. */
export function classifySwipe(s: SwipeInput): SwipeGrade | null {
  if (dragAxis(s.dx, s.dy, s.allowVertical) === "x") {
    const far = Math.abs(s.dx) >= s.width * COMMIT_FRACTION;
    const flick = Math.abs(s.vx) >= COMMIT_VELOCITY && Math.abs(s.dx) >= MIN_TRAVEL && Math.sign(s.vx) === Math.sign(s.dx);
    if (!far && !flick) return null;
    return s.dx < 0 ? 1 : 3;
  }
  const far = Math.abs(s.dy) >= s.height * COMMIT_FRACTION * 0.6; // cards are tall; vertical needs less travel
  const flick = Math.abs(s.vy) >= COMMIT_VELOCITY && Math.abs(s.dy) >= MIN_TRAVEL && Math.sign(s.vy) === Math.sign(s.dy);
  if (!far && !flick) return null;
  return s.dy < 0 ? 4 : 2;
}

/** Live preview while dragging: which grade is being approached, and how close (0–1). */
export function swipeIntent(s: Omit<SwipeInput, "vx" | "vy">): { grade: SwipeGrade; strength: number } | null {
  const axis = dragAxis(s.dx, s.dy, s.allowVertical);
  const d = axis === "x" ? s.dx : s.dy;
  if (Math.abs(d) < 12) return null;
  const limit = axis === "x" ? s.width * COMMIT_FRACTION : s.height * COMMIT_FRACTION * 0.6;
  const grade: SwipeGrade = axis === "x" ? (d < 0 ? 1 : 3) : d < 0 ? 4 : 2;
  return { grade, strength: Math.min(1, Math.abs(d) / limit) };
}
