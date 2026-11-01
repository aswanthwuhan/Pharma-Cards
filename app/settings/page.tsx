"use client";

import Link from "next/link";
import { DraftInput, Panel, Row, Segmented, Toggle } from "@/components/settings/controls";
import { DataPanel } from "@/components/settings/DataPanel";
import { PALETTES, updateSetting, useSettings } from "@/lib/settings";
import { useAllCards } from "@/lib/store";

/** Whole days from today to an ISO date (local calendar days). */
function daysUntil(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

function daysLeftText(n: number) {
  if (n > 1) return `${n} days left`;
  if (n === 1) return "1 day left";
  if (n === 0) return "Exam today";
  return "Exam date has passed";
}

export default function SettingsPage() {
  const s = useSettings();
  const cards = useAllCards();
  const approved = cards?.filter((c) => c.status === "approved").length;
  const retentionPct = Math.round(s.retention * 100);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="eyebrow">Pharmacards</p>
        <h1 className="font-serif text-3xl">Settings</h1>
        <p className="text-sm text-ink-soft">Exam plan, review pace, study screen and your data.</p>
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
                    valid={(v) => /^\d{4}-\d{2}-\d{2}$/.test(v)}
                    onCommit={(v) => updateSetting("examDate", v)}
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
            <div className="px-4 pb-4 sm:px-5">
              <p className="mb-1 font-semibold">Colour theme</p>
              <p className="mb-3 text-sm text-ink-soft">Mastery colours (weak, moderate, strong) stay the same in every theme.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Colour theme">
                {PALETTES.map((p) => {
                  const on = s.palette === p.id;
                  const sw = s.theme === "light" ? p.day : p.night;
                  return (
                    <button
                      key={p.id}
                      role="radio"
                      aria-checked={on}
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
