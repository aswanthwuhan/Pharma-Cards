"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useReducedMotion } from "motion/react";
import { db, setSetting } from "./db";

/** Every user-adjustable setting, with its default. Stored in the Dexie `settings` table. */
export interface Settings {
  examDate: string | null; // ISO date
  examName: string; // e.g. "MD Pharmacology theory exam"
  newPerDay: number; // new cards per day when no exam date is set
  retention: number; // FSRS target recall probability, 0.80–0.97
  showDrafts: boolean; // include unreviewed draft cards in study
  swipe: boolean; // swipe-to-grade on the study card
  swipeBand: number; // px height of the up/down swipe zone; elsewhere up/down scrolls
  swipeEdge: "bottom" | "top" | "both"; // which card edge(s) hold the up/down swipe zone
  swipeZoneVisible: boolean; // draw the zone outline (off: invisible)
  haptics: boolean; // vibrate on grade (where supported)
  theme: "dark" | "light" | "auto"; // Night mode / Day mode / follow the device
  motion: MotionSetting; // full = always animate, system = follow the phone, reduced = never
  essayStyle: "ladder" | "rail"; // long-essay answers: heading ladder (B) or progress rail (A)
  palette: Palette;
  appIcon: string; // home-screen icon id, "original" or an APP_ICONS id
  customColors: Partial<Record<CustomColor, string>>; // user overrides (hex) on top of the palette
}

/** Home-screen icon choices. "original" = public/icons/icon-*.png; the rest live in public/icons/choices. */
export const APP_ICONS: { id: string; label: string }[] = [
  { id: "original", label: "Default (teal & coral)" },
  { id: "01-teal-coral", label: "Teal & coral" },
  { id: "02-indigo-amber", label: "Indigo & amber" },
  { id: "03-teal-amber", label: "Teal & amber" },
  { id: "04-indigo-coral", label: "Indigo & coral" },
  { id: "05-teal-coral-check", label: "Teal & coral, check" },
  { id: "06-indigo-amber-spark", label: "Indigo & amber, spark" },
  { id: "07-teal-coral-blister", label: "Teal & coral, blister" },
  { id: "08-indigo-amber-blister", label: "Indigo & amber, blister" },
  { id: "09-teal-amber-check", label: "Teal & amber, check" },
  { id: "10-indigo-coral-spark", label: "Indigo & coral, spark" },
];

/** Icon URL for an app icon id at 180 (apple-touch) or 512 px. */
export function appIconHref(id: string, size: 180 | 512): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (id === "original") return `${base}/icons/icon-${size === 180 ? 192 : 512}.png`;
  return `${base}/icons/choices/${id}-${size}.png`;
}

/** User-overridable colours: key -> CSS variable it sets on <html>. */
export const CUSTOM_COLORS = {
  paper: { cssVar: "--color-paper", label: "Background" },
  sheet: { cssVar: "--color-sheet", label: "Panels" },
  ink: { cssVar: "--color-ink", label: "Text" },
  inkSoft: { cssVar: "--color-ink-soft", label: "Secondary text" },
  accent: { cssVar: "--color-teal", label: "Accent" },
  cardBg: { cssVar: "--color-porcelain", label: "Card background" },
  cardText: { cssVar: "--color-porcelain-ink", label: "Card text" },
  cardSoft: { cssVar: "--color-porcelain-soft", label: "Card secondary text" },
} as const;
export type CustomColor = keyof typeof CUSTOM_COLORS;

export type MotionSetting = "full" | "system" | "reduced";

export type Palette = "petrol" | "ocean" | "plum" | "graphite" | "sepia";

/** Colour palettes. `swatch` = [background, panel, accent] for the picker preview in each mode. */
export const PALETTES: { id: Palette; name: string; note: string; night: string[]; day: string[] }[] = [
  { id: "petrol", name: "Petrol", note: "The default lab look", night: ["#091a1d", "#112b30", "#b7f5d8"], day: ["#ecfcff", "#ffffff", "#0d3b42"] },
  { id: "ocean", name: "Ocean", note: "Cool blues", night: ["#0a1424", "#13213a", "#9ccaff"], day: ["#eef5ff", "#ffffff", "#1d4f91"] },
  { id: "plum", name: "Plum", note: "Soft violet", night: ["#160f1c", "#22182b", "#e3c2ff"], day: ["#fbf5ff", "#ffffff", "#5b2a86"] },
  { id: "graphite", name: "Graphite", note: "Neutral, no tint", night: ["#111214", "#1b1d21", "#e6e8eb"], day: ["#f6f6f4", "#ffffff", "#1f2328"] },
  { id: "sepia", name: "Sepia", note: "Warm paper for long reading", night: ["#1a1510", "#261f17", "#f1d39c"], day: ["#f7f1e3", "#fffaf0", "#7a4b12"] },
];

export const DEFAULT_SETTINGS: Settings = {
  examDate: null,
  examName: "MD Pharmacology theory exam",
  newPerDay: 20,
  retention: 0.9,
  showDrafts: true,
  swipe: true,
  swipeBand: 72,
  swipeEdge: "bottom",
  swipeZoneVisible: false,
  haptics: true,
  theme: "dark",
  motion: "system",
  essayStyle: "ladder",
  palette: "petrol",
  appIcon: "original",
  customColors: {},
};

export async function loadSettings(): Promise<Settings> {
  const rows = await db.settings.toArray();
  const out = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
  for (const r of rows) if (r.key in DEFAULT_SETTINGS && r.value !== undefined) out[r.key] = r.value;
  return out as unknown as Settings;
}

/** Live settings (defaults while loading). */
export function useSettings(): Settings {
  return useLiveQuery(loadSettings, [], DEFAULT_SETTINGS) ?? DEFAULT_SETTINGS;
}

/**
 * Whether to skip motion. "full" always animates (even when the phone's battery saver or
 * "Remove animations" asks for less), "reduced" never does, "system" follows the OS setting.
 */
export function useReduceMotion(): boolean {
  const { motion } = useSettings();
  const system = useReducedMotion() ?? false;
  if (motion === "reduced") return true;
  if (motion === "full") return false;
  return system;
}

export function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  return setSetting(key, value);
}
