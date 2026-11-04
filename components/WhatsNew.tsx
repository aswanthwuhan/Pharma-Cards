"use client";

import { useEffect, useRef, useState } from "react";
import { APP_VERSION, CHANGELOG } from "@/lib/changelog";
import { useDialogFocus } from "@/lib/useDialogFocus";

const SEEN_KEY = "pharmacards:changelogSeen";

/** Shows the change log once per version, on the first open after an update. */
export function WhatsNew() {
  const [entry, setEntry] = useState<(typeof CHANGELOG)[number]>();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_KEY);
    if (seen === APP_VERSION) return;
    const current = CHANGELOG.find((c) => c.version === APP_VERSION);
    if (current) setEntry(current);
    else localStorage.setItem(SEEN_KEY, APP_VERSION);
  }, []);

  const close = () => {
    localStorage.setItem(SEEN_KEY, APP_VERSION);
    setEntry(undefined);
  };
  useDialogFocus(!!entry, panel, close);

  if (!entry) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-6" role="presentation" onClick={close}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="whats-new-title" className="glass w-full max-w-sm rounded-2xl p-6 outline-none" onClick={(e) => e.stopPropagation()}>
        <h2 id="whats-new-title" className="font-serif text-2xl">
          What's new in {entry.version}
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {entry.changes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={close} className="btn min-h-11 bg-teal px-4 text-sm font-semibold text-on-teal">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
