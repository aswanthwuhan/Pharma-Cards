"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { useRef, useState } from "react";
import { useDialogFocus } from "@/lib/useDialogFocus";
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
  useDialogFocus(open, panel, onClose);

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
