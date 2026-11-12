"use client";

import { useEffect } from "react";

// Registers the offline service worker. Production builds only, so dev-server
// HMR is never served from a stale cache.
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    navigator.serviceWorker.register(`${base}/sw.js?v=${process.env.NEXT_PUBLIC_APP_VERSION}`, { scope: `${base}/` }).catch(() => {
      // Registration failure just means no offline support; the app still works online.
    });
    // Lazily loaded chunks (e.g. the card deck) are named in no page HTML, so tell the worker which ones this page loaded.
    let timer: ReturnType<typeof setTimeout> | undefined;
    let unmounted = false;
    navigator.serviceWorker.ready.then((registration) => {
      if (unmounted) return;
      // shortcut: chunks loaded later than 8 s after launch are only cached by the normal fetch handler, not this message; upgrade by posting on each dynamic import.
      timer = setTimeout(() => {
        const urls = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((name) => name.includes("/_next/static/"));
        registration.active?.postMessage({ type: "cache-urls", urls });
      }, 8000);
    });
    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
  }, []);
  return null;
}
