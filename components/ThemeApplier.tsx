"use client";

import { useEffect } from "react";
import { CUSTOM_COLORS, DEFAULT_SETTINGS, appIconHref, useSettings, type CustomColor } from "@/lib/settings";

/**
 * Applies the chosen mode, palette and motion setting to <html data-theme data-palette data-motion>.
 * "auto" follows the device's light/dark setting and updates live when it changes.
 */
export function ThemeApplier() {
  const settings = useSettings();
  const { theme, palette, motion, appIcon } = settings;
  // var -> hex for every set custom colour; a string so the effect reruns only on real changes
  const colorsJson = JSON.stringify(
    Object.fromEntries(Object.entries(settings.customColors ?? {}).map(([k, v]) => [CUSTOM_COLORS[k as CustomColor]?.cssVar, v]).filter(([k, v]) => k && v)),
  );
  const loaded = settings !== DEFAULT_SETTINGS; // useSettings hands back the defaults object until Dexie answers
  useEffect(() => {
    if (!loaded) return; // the inline script in <head> has already applied the saved theme
    try {
      localStorage.setItem("pharmacards:theme", JSON.stringify({ theme, palette, appIcon, colors: JSON.parse(colorsJson) })); // read by that script on next load
    } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      const mode = theme === "auto" ? (mq.matches ? "light" : "dark") : theme;
      const root = document.documentElement;
      root.dataset.theme = mode;
      root.dataset.palette = palette;
      root.dataset.motion = motion;
      const colors: Record<string, string> = JSON.parse(colorsJson);
      for (const { cssVar } of Object.values(CUSTOM_COLORS)) {
        if (colors[cssVar]) root.style.setProperty(cssVar, colors[cssVar]);
        else root.style.removeProperty(cssVar);
      }
      // Browser chrome colour = the page background of the active palette.
      const bg = getComputedStyle(root).getPropertyValue("--color-paper").trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg || (mode === "light" ? "#ecfcff" : "#091a1d"));
      // Home-screen icon: the link tags exist in the static head, but create them if missing.
      for (const rel of ["icon", "apple-touch-icon"]) {
        let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.append(link);
        }
        link.href = appIconHref(appIcon, 180);
      }
    };
    apply();
    if (theme !== "auto") return;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [loaded, theme, palette, motion, colorsJson, appIcon]);
  return null;
}
