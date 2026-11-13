"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { DraftInput, Panel, Row, Segmented, Toggle } from "@/components/settings/controls";
import { DataPanel } from "@/components/settings/DataPanel";
import { APP_ICONS, CUSTOM_COLORS, PALETTES, appIconHref, updateSetting, useSettings, type CustomColor, type Settings } from "@/lib/settings";
import { useAllCards } from "@/lib/store";

/** Whole days from today to an ISO date (local calendar days). */
function daysUntil(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

/** WCAG relative luminance of a #rgb / #rrggbb colour, or null when unparseable. */
function luminance(hex: string): number | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  const n = parseInt(h, 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Colour pickers over the palette. Each shows the effective colour (custom or palette) read from <html>. */
function CustomColors({ s }: { s: Settings }) {
  const custom = s.customColors ?? {};
  const [effective, setEffective] = useState<Record<string, string>>({});
  useEffect(() => {
    // next task: ThemeApplier (a parent, so its effect runs after this one) has applied the theme by then.
    // Not requestAnimationFrame: it never fires in a hidden tab, leaving every picker black.
    const id = setTimeout(() => {
      const cs = getComputedStyle(document.documentElement);
      setEffective(Object.fromEntries(Object.values(CUSTOM_COLORS).map(({ cssVar }) => [cssVar, cs.getPropertyValue(cssVar).trim()])));
    });
    return () => clearTimeout(id);
  }, [s.theme, s.palette, JSON.stringify(custom)]); // eslint-disable-line react-hooks/exhaustive-deps
  const timers = useRef<Partial<Record<CustomColor, ReturnType<typeof setTimeout>>>>({});
  // dragging fires many input events: preview the colour at once, save once the drag pauses
  const [draft, setDraft] = useState<Partial<Record<CustomColor, string>>>({});
  const preview = (k: CustomColor, v: string) => {
    setDraft((d) => ({ ...d, [k]: v }));
    document.documentElement.style.setProperty(CUSTOM_COLORS[k].cssVar, v);
    clearTimeout(timers.current[k]);
    timers.current[k] = setTimeout(() => set(k, v), 250);
  };
  const set = (k: CustomColor, v?: string) => {
    const next = { ...custom };
    if (v) next[k] = v;
    else {
      delete next[k];
      setDraft(({ [k]: _, ...d }) => d);
    }
    updateSetting("customColors", next);
  };
  const keys = Object.keys(CUSTOM_COLORS) as CustomColor[];
  const shown = keys.filter((k) => s.palette === "bold" || !k.startsWith("tile")); // Paper tiles only show in Bold
  // The colour a picker is showing right now (unsaved drag preview first, then the applied theme).
  const effectiveFor = (cssVar: string) => {
    const key = keys.find((k) => CUSTOM_COLORS[k].cssVar === cssVar);
    return (key && draft[key]) || effective[cssVar] || "";
  };
  const lowContrast = [
    ["text on background", "--color-ink", "--color-paper"],
    ["card text on card", "--color-porcelain-ink", "--color-porcelain"],
  ]
    .filter(([, fg, bg]) => {
      const ratio = contrastRatio(effectiveFor(fg), effectiveFor(bg));
      return ratio !== null && ratio < 4.5;
    })
    .map(([label]) => label);
  return (
    <div className="border-t border-rule px-4 py-4 sm:px-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">Custom colours</p>
          <p className="text-sm text-ink-soft">Override any colour of the theme above. Applies in Night and Day mode.</p>
        </div>
        <button
          onClick={() => {
            setDraft({});
            updateSetting("customColors", {});
          }}
          disabled={!keys.some((k) => custom[k])}
          className="min-h-11 shrink-0 rounded-lg border border-rule px-3 text-sm hover:border-teal disabled:opacity-40 disabled:hover:border-rule"
        >
          Reset all
        </button>
      </div>
      {lowContrast.length > 0 && (
        <p role="status" className="mb-3 rounded-lg border border-moderate/50 bg-moderate/10 px-3 py-2 text-sm text-moderate">
          Low contrast ({lowContrast.join(", ")}): aim for 4.5:1 or more so text stays readable.
        </p>
      )}
      <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-6">
        {shown.map((k) => {
          const { cssVar, label } = CUSTOM_COLORS[k];
          const value = draft[k] ?? custom[k] ?? effective[cssVar] ?? "";
          return (
            <li key={k} className="flex min-h-11 items-center gap-3">
              <input
                type="color"
                aria-label={`${label} colour`}
                value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
                onChange={(e) => preview(k, e.target.value)}
                className="h-11 w-11 shrink-0 cursor-pointer rounded-md border border-rule bg-transparent"
              />
              <span className="flex-1 text-sm">
                {label}
                {custom[k] && <span className="ml-2 font-mono text-xs text-ink-soft">custom</span>}
              </span>
              {custom[k] && (
                <button onClick={() => set(k)} aria-label={`Reset ${label} colour`} className="min-h-11 px-2 text-sm text-ink-soft hover:text-ink">
                  Reset
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function daysLeftText(n: number) {
  if (n > 1) return `${n} days left`;
  if (n === 1) return "1 day left";
  if (n === 0) return "Exam today";
  return "Exam date has passed";
}

/** Roving focus for role="radio" groups: arrows and Home/End move focus and select, like native radios. */
function onRadioKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  const i = items.indexOf(document.activeElement as HTMLButtonElement);
  if (i < 0) return;
  const perRow = items.findIndex((b) => b.offsetTop !== items[0].offsetTop); // grid columns, read from layout
  const cols = perRow < 0 ? items.length : perRow;
  const next =
    e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" ? i - cols : i + cols;
  if (next < 0 || next >= items.length) return;
  e.preventDefault();
  items[next].focus();
  items[next].click();
}

export default function SettingsPage() {
  const s = useSettings();
  const cards = useAllCards();
  const approved = useMemo(() => cards?.filter((c) => c.status === "approved").length, [cards]);
  const retentionPct = Math.round(s.retention * 100);
  // Palette previews follow what Auto actually shows, not just an explicit Day choice.
  const [systemLight, setSystemLight] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setSystemLight(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const dayPreview = s.theme === "light" || (s.theme === "auto" && systemLight);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="eyebrow">Pharmacards</p>
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="text-sm text-ink-soft">Exam plan, review pace, study screen and your data.</p>
        <Link href="/help" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-teal">
          How to use the study screen
          <span aria-hidden>→</span>
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <Panel id="settings-exam" title="Exam">
            <Row
              title="Exam name"
              description="The exam you are preparing for."
              control={
                <DraftInput
                  type="text"
                  aria-label="Exam name"
                  className="min-h-11 w-full rounded-lg border border-rule bg-well px-3 text-ink sm:w-64"
                  value={s.examName}
                  valid={(v) => v.trim().length > 0}
                  onCommit={(v) => updateSetting("examName", v)}
                />
              }
            />
            <Row
              title="Exam date"
              description="Spreads new cards across the days you have left. Leave empty if you have no date."
              control={
                <div id="exam" className="flex flex-wrap items-center gap-3">
                  <DraftInput
                    type="date"
                    aria-label="Exam date"
                    className="min-h-11 rounded-lg border border-rule bg-well px-3 font-mono text-ink"
                    value={s.examDate ?? ""}
                    valid={(v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v)}
                    onCommit={(v) => updateSetting("examDate", v || null)}
                  />
                  {s.examDate ? (
                    <>
                      <span className="font-mono text-sm tabular-nums text-teal">{daysLeftText(daysUntil(s.examDate))}</span>
                      <button type="button" className="btn-chip" onClick={() => updateSetting("examDate", null)}>
                        Clear
                      </button>
                    </>
                  ) : null}
                </div>
              }
            />
            <Row
              title="New cards per day"
              description="Used only when no exam date is set. With a date, the planner spreads unseen cards to finish 10 days before the exam."
              control={
                <div className="flex items-center gap-2">
                  <DraftInput
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={500}
                    aria-label="New cards per day"
                    className="min-h-11 w-24 rounded-lg border border-rule bg-well px-3 text-right font-mono tabular-nums text-ink"
                    value={String(s.newPerDay)}
                    valid={(v) => /^\d+$/.test(v) && Number(v) <= 500}
                    onCommit={(v) => updateSetting("newPerDay", Number(v))}
                  />
                  <span className="font-mono text-sm text-ink-soft">cards/day</span>
                </div>
              }
            />
          </Panel>

          <Panel id="settings-sr" title="Spaced repetition">
            <div className="space-y-4 border-t border-rule py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p id="retention-label" className="text-base font-semibold text-ink">
                    Target retention
                  </p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    The chance you can recall a card when it comes due. A higher target means more reviews. It is used for every new answer.
                  </p>
                </div>
                <p className="shrink-0 font-mono text-4xl tabular-nums text-ink">
                  {retentionPct}
                  <span className="text-lg text-ink-soft">%</span>
                </p>
              </div>
              <input
                type="range"
                min={0.8}
                max={0.97}
                step={0.01}
                value={s.retention}
                aria-labelledby="retention-label"
                aria-valuetext={`${retentionPct}% target retention`}
                onChange={(e) => updateSetting("retention", Math.round(Number(e.target.value) * 100) / 100)}
                className="min-h-11 w-full cursor-pointer accent-teal"
              />
              <div className="flex justify-between gap-2 font-mono text-[11px] text-ink-soft">
                <span>80% lighter load</span>
                <span className="text-center">90% standard</span>
                <span className="text-right">97% heavy revision</span>
              </div>
            </div>
            <Row
              title="Scheduler"
              description="Free Spaced Repetition Scheduler. Decides when each card comes back."
              control={<span className="rounded-full border border-rule bg-well px-3 py-1 font-mono text-sm text-ink">FSRS</span>}
            />
          </Panel>

          <Panel id="settings-study" title="Study screen">
            <Row
              title="Swipe to grade"
              description="Left Forgot, right Good, up Easy, down Hard"
              control={<Toggle label="Swipe to grade" checked={s.swipe} onChange={(v) => updateSetting("swipe", v)} />}
            />
            <div className="space-y-2 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p id="band-label" className="text-base font-semibold text-ink">
                    Up / down swipe zone
                  </p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    Up (Easy) and down (Hard) swipes count only when they start in this strip at the card&apos;s edge. Anywhere else, up and down scrolls the answer, so a scroll never grades by accident.
                  </p>
                </div>
                <p className="shrink-0 font-mono text-2xl tabular-nums text-ink">{s.swipeBand}px</p>
              </div>
              <input
                type="range"
                min={40}
                max={200}
                step={8}
                value={s.swipeBand}
                disabled={!s.swipe}
                aria-labelledby="band-label"
                aria-valuetext={`${s.swipeBand} pixels`}
                onChange={(e) => updateSetting("swipeBand", Number(e.target.value))}
                className="min-h-11 w-full cursor-pointer accent-teal disabled:opacity-40"
              />
            </div>
            <Row
              title="Swipe zone edge"
              description="Where on the card up/down swipes start."
              control={
                <Segmented
                  label="Swipe zone edge"
                  value={s.swipeEdge}
                  options={[
                    { value: "bottom", label: "Bottom" },
                    { value: "top", label: "Top" },
                    { value: "both", label: "Both" },
                  ]}
                  onChange={(v) => updateSetting("swipeEdge", v)}
                  disabled={!s.swipe}
                />
              }
            />
            <Row
              title="Show swipe zone"
              description="Draw a dashed outline around the zone. Off keeps it invisible."
              control={
                <Toggle label="Show swipe zone" checked={s.swipeZoneVisible} onChange={(v) => updateSetting("swipeZoneVisible", v)} disabled={!s.swipe} />
              }
            />
            <Row
              title="Haptic feedback"
              description="Short vibration when you grade a card, on devices that support it."
              control={<Toggle label="Haptic feedback" checked={s.haptics} onChange={(v) => updateSetting("haptics", v)} />}
            />
          </Panel>

          <Panel id="settings-appearance" title="Appearance">
            <Row
              title="Mode"
              description="Night mode for low light, Day mode for daylight. Auto follows your device."
              control={
                <Segmented
                  label="Mode"
                  value={s.theme}
                  options={[
                    { value: "dark", label: "Night" },
                    { value: "light", label: "Day" },
                    { value: "auto", label: "Auto" },
                  ]}
                  onChange={(v) => updateSetting("theme", v)}
                />
              }
            />
            <Row
              title="Motion"
              description="Full keeps swipe animations even if your phone's battery saver turns animations off."
              control={
                <Segmented
                  label="Motion"
                  value={s.motion}
                  options={[
                    { value: "full", label: "Full" },
                    { value: "system", label: "Follow system" },
                    { value: "reduced", label: "Reduced" },
                  ]}
                  onChange={(v) => updateSetting("motion", v)}
                />
              }
            />
            <Row
              title="Long essay cards"
              description="Ladder: all headings as rows; open each after recalling it and mark it ✓ or ✗. Rail: headings appear one by one, with a progress bar."
              control={
                <Segmented
                  label="Long essay cards"
                  value={s.essayStyle}
                  options={[
                    { value: "ladder", label: "Ladder" },
                    { value: "rail", label: "Rail" },
                  ]}
                  onChange={(v) => updateSetting("essayStyle", v)}
                />
              }
            />
            <div className="px-4 pb-4 sm:px-5">
              <p className="mb-1 font-semibold">Colour theme</p>
              <p className="mb-3 text-sm text-ink-soft">Mastery colours (weak, moderate, strong) stay the same in every theme.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Colour theme" onKeyDown={onRadioKeyDown}>
                {PALETTES.map((p) => {
                  const on = s.palette === p.id;
                  const sw = dayPreview ? p.day : p.night;
                  return (
                    <button
                      key={p.id}
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => updateSetting("palette", p.id)}
                      className={`flex min-h-11 flex-col gap-2 rounded-xl border p-3 text-left transition-colors ${on ? "border-teal bg-teal-wash" : "border-rule bg-well hover:border-teal"}`}
                    >
                      <span className="flex h-8 overflow-hidden rounded-lg border border-rule" aria-hidden>
                        <span className="flex-[3]" style={{ background: sw[0] }} />
                        <span className="flex-[2]" style={{ background: sw[1] }} />
                        <span className="flex-1" style={{ background: sw[2] }} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{p.name}</span>
                        <span className="block text-xs text-ink-soft">{p.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-4 pb-4 sm:px-5">
              <p className="mb-3 font-semibold">App icon</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="App icon" onKeyDown={onRadioKeyDown}>
                {APP_ICONS.map((ic) => {
                  const on = s.appIcon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      role="radio"
                      aria-checked={on}
                      aria-label={ic.label}
                      tabIndex={on ? 0 : -1}
                      onClick={() => updateSetting("appIcon", ic.id)}
                      className={`rounded-xl p-1.5 transition-colors ${on ? "ring-2 ring-teal" : "hover:bg-teal-wash"}`}
                    >
                      <img src={appIconHref(ic.id, 180)} alt="" loading="lazy" className="aspect-square w-full rounded-[22%]" />
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                On iPhone, the new icon shows after you Add to Home Screen again. Installed Android and desktop apps keep their original icon.
              </p>
            </div>
            <CustomColors s={s} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel id="settings-cards" title="Cards">
            <Row
              title="Include unreviewed draft cards"
              description="Draft cards are study-ready but not yet approved. Turn off to study approved cards only."
              control={
                <Toggle
                  label="Include unreviewed draft cards"
                  checked={s.showDrafts}
                  onChange={(v) => updateSetting("showDrafts", v)}
                />
              }
            />
            <div className="border-t border-rule">
              <Link
                href="/admin"
                className="-mx-2 flex min-h-11 items-center justify-between gap-4 rounded-lg px-2 py-4 transition-colors duration-150 hover:bg-teal-wash"
              >
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-ink">Review and approve cards</span>
                  <span className="block text-sm text-ink-soft">Check draft cards before they are marked approved.</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-sm tabular-nums text-ink-soft">
                  {cards === undefined ? "Loading" : `${approved} of ${cards.length} approved`}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </div>
          </Panel>

          <DataPanel />
        </div>
      </div>

      <footer className="space-y-1 pt-2 text-center">
        <p className="font-mono text-[11px] tracking-[0.06em] text-ink-soft uppercase">Pharmacards · MD Pharmacology</p>
        <p className="text-sm text-ink-soft">All progress is stored on this device.</p>
      </footer>
    </div>
  );
}
