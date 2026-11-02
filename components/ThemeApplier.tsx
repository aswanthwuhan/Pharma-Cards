"use client";

import { useEffect } from "react";
import { DEFAULT_SETTINGS, useSettings } from "@/lib/settings";

/**
 * Applies the chosen mode, palette and motion setting to <html data-theme data-palette data-motion>.
 * "auto" follows the device's light/dark setting and updates live when it changes.
 */
export function ThemeApplier() {
  const settings = useSettings();
  const { theme, palette, motion } = settings;
  const loaded = settings !== DEFAULT_SETTINGS; // useSettings hands back the defaults object until Dexie answers
  useEffect(() => {
    if (!loaded) return; // the inline script in <head> has already applied the saved theme
    try {
      localStorage.setItem("pharmacards:theme", JSON.stringify({ theme, palette })); // read by that script on next load
    } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      const mode = theme === "auto" ? (mq.matches ? "light" : "dark") : theme;
      const root = document.documentElement;
      root.dataset.theme = mode;
      root.dataset.palette = palette;
      root.dataset.motion = motion;
      // Browser chrome colour = the page background of the active palette.
      const bg = getComputedStyle(root).getPropertyValue("--color-paper").trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg || (mode === "light" ? "#ecfcff" : "#091a1d"));
    };
    apply();
    if (theme !== "auto") return;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [loaded, theme, palette, motion]);
  return null;
}
