"use client";

import { useEffect, useRef, useState } from "react";
import { APP_VERSION } from "@/lib/changelog";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { isNewer, latestVersion } from "@/lib/updates";

const DISMISS_KEY = "pharmacards:updateDismissed";
const PAGE = "https://github.com/aswanthwuhan/Pharma-Cards/releases/latest";

/** Checks GitHub for a newer release on each launch; the user can dismiss it until the app restarts. */
export function UpdateCheck() {
  const [latest, setLatest] = useState<string>();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latestVersion().then((v) => {
      if (v && isNewer(v, APP_VERSION) && sessionStorage.getItem(DISMISS_KEY) !== v) setLatest(v);
    });
  }, []);

  const close = () => {
    if (latest) sessionStorage.setItem(DISMISS_KEY, latest);
    setLatest(undefined);
  };
  useDialogFocus(!!latest, panel, close);

  if (!latest) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-6" role="presentation" onClick={close}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="update-title" className="glass w-full max-w-sm rounded-2xl p-6 outline-none" onClick={(e) => e.stopPropagation()}>
        <h2 id="update-title" className="font-serif text-2xl">
          Update available
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Version {latest} is out; you have {APP_VERSION}. Download the new APK and install it over this one. Your progress is kept.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={close} className="btn min-h-11 border border-rule bg-sheet px-4 text-sm text-ink-soft">
            Later
          </button>
          <a href={PAGE} target="_blank" rel="noopener noreferrer" className="btn inline-flex min-h-11 items-center bg-teal px-4 text-sm font-semibold text-on-teal">
            Get update
          </a>
        </div>
      </div>
    </div>
  );
}
