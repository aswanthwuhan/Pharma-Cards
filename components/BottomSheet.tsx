"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReduceMotion } from "@/lib/settings";

/**
 * Bottom sheet (drawer from the bottom on phones, centred panel on desktop).
 * Closes on backdrop tap, Escape, or dragging the sheet down.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const reduce = useReduceMotion();
  const panel = useRef<HTMLDivElement>(null);
  // While the sheet is dragged, drop its backdrop blur: blur under a moving layer stutters on Android.
  const [dragging, setDragging] = useState(false);

  // Parents pass a fresh onClose each render; a ref keeps the effect below from re-running (and stealing focus) on every keystroke.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // Where focus goes back to on close. Read during render: an autoFocus child takes focus before effects run.
  const returnTo = useRef<HTMLElement | null>(null);
  if (open && !returnTo.current && typeof document !== "undefined") returnTo.current = document.activeElement as HTMLElement | null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeRef.current();
      const p = panel.current;
      if (e.key !== "Tab" || !p) return;
      // Trap Tab inside the sheet.
      const items = [...p.querySelectorAll<HTMLElement>('button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      const first = items[0] ?? p;
      const last = items.at(-1) ?? p;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === p)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !p.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // An autoFocus child keeps its focus; otherwise focus the panel.
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) return;
    returnTo.current?.focus?.();
    returnTo.current = null;
  }, [open]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
            <m.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <m.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className="glass-strong relative max-h-[85dvh] w-full overflow-hidden rounded-t-2xl outline-none sm:max-w-lg sm:rounded-2xl"
              style={dragging ? { backdropFilter: "none", WebkitBackdropFilter: "none" } : undefined}
              initial={reduce ? { opacity: 0 } : { transform: "translateY(100%)" }}
              animate={reduce ? { opacity: 1 } : { transform: "translateY(0%)" }}
              exit={reduce ? { opacity: 0 } : { transform: "translateY(100%)" }}
              transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 380, damping: 38 }}
              drag={reduce ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragStart={() => setDragging(true)}
              onDragEnd={(_, info) => {
                setDragging(false);
                if (info.offset.y > 120 || info.velocity.y > 600) onClose();
              }}
            >
              <div className="flex justify-center pt-2.5 pb-1" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-rule" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3">
                <h2 className="font-serif text-xl">{title}</h2>
                <button onClick={onClose} className="btn min-h-9 px-3 text-ink-soft hover:text-ink" aria-label="Close">
                  Close
                </button>
              </div>
              <div className="max-h-[calc(85dvh-4.5rem)] overflow-y-auto overscroll-contain pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {children}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
