"use client";

import { useEffect } from "react";

// Registers the offline service worker. Production builds only, so dev-server
// HMR is never served from a stale cache.
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failure just means no offline support; the app still works online.
    });
  }, []);
  return null;
}
