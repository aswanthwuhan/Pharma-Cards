"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Dialog focus handling: Escape calls onClose, Tab stays inside the panel,
 * focus moves into the panel on open and returns to the previous element on close.
 * The panel element needs tabIndex={-1} so it can take focus itself.
 */
export function useDialogFocus(open: boolean, panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
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
      const p = panelRef.current;
      if (e.key !== "Tab" || !p) return;
      // Trap Tab inside the dialog.
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
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, panelRef]);

  useEffect(() => {
    if (open) return;
    returnTo.current?.focus?.();
    returnTo.current = null;
  }, [open]);
}
