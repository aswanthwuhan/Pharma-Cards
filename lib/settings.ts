"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, setSetting } from "./db";

/** Every user-adjustable setting, with its default. Stored in the Dexie `settings` table. */
export interface Settings {
  examDate: string | null; // ISO date
  examName: string; // e.g. "MD Pharmacology theory exam"
  newPerDay: number; // new cards per day when no exam date is set
  retention: number; // FSRS target recall probability, 0.80–0.97
  showDrafts: boolean; // include unreviewed draft cards in study
  swipe: boolean; // swipe-to-grade on the study card
  haptics: boolean; // vibrate on grade (where supported)
  theme: "dark" | "light" | "auto"; // Night mode / Day mode / follow the device
  palette: Palette;
}

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
  haptics: true,
  theme: "dark",
  palette: "petrol",
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

export function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  return setSetting(key, value);
}
