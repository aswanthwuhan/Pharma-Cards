"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    /** Set by ExitGuard; MainActivity calls it on the Android back key and falls back to native behaviour when it returns false. */
    __nativeBack?: () => boolean;
    /** Exposed by MainActivity; closes the app. Absent in the browser and Electron. */
    PharmaNative?: { exit: () => void };
  }
}

/** One step back in the app's own history; home when the page was opened directly. */
function goBack(router: ReturnType<typeof useRouter>) {
  if (window.history.length > 1) window.history.back();
  else router.push("/");
}

const BACK_BTN =
  "flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-rule bg-sheet text-ink-soft transition-colors hover:text-ink";

/** Header back button, shown on every page except home. */
export function NavBack({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => goBack(router)} aria-label="Go back" className={`${BACK_BTN} ${className}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

/**
 * Android back key: steps back in app history; on home it asks before closing the app.
 * Mounted once in the root layout.
 */
export function ExitGuard() {
  const path = usePathname();
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    window.__nativeBack = () => {
      if (asking) {
        setAsking(false);
        return true;
      }
      if (path === "/") {
        setAsking(true);
        return true;
      }
      goBack(router);
      return true;
    };
    return () => {
      window.__nativeBack = undefined;
    };
  }, [path, router, asking]);

  if (!asking) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-6" role="presentation" onClick={() => setAsking(false)}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="exit-title" className="glass w-full max-w-sm rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 id="exit-title" className="font-serif text-2xl">
          Close Pharmacards?
        </h2>
        <p className="mt-2 text-sm text-ink-soft">Are you sure you want to close the app?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setAsking(false)} className="btn min-h-11 border border-rule bg-sheet px-4 text-sm text-ink-soft">
            Stay
          </button>
          <button
            type="button"
            onClick={() => {
              setAsking(false);
              window.PharmaNative?.exit();
            }}
            className="btn min-h-11 bg-teal px-4 text-sm font-semibold text-on-teal"
          >
            Close app
          </button>
        </div>
      </div>
    </div>
  );
}
