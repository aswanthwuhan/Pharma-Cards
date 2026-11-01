"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/settings";

/**
 * Applies the chosen mode, palette and motion setting to <html data-theme data-palette data-motion>.
 * "auto" follows the device's light/dark setting and updates live when it changes.
 */
export function ThemeApplier() {
  const { theme, palette, motion } = useSettings();
  useEffect(() => {
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
  }, [theme, palette, motion]);
  return null;
}
