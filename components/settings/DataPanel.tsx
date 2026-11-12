"use client";

import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { BACKUP_TABLES, db, exportBackup, importBackup } from "@/lib/db";
import { Panel, Row } from "./controls";

function localDate(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Save a text file for the user. In the Android WebView a blob download does nothing, so the
 * file is written to the app cache and handed to the share sheet. Throws if it was not saved.
 */
export async function saveTextFile(name: string, text: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: name, files: [uri] }); // rejects if the user cancels
    return;
  }
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Your data: backup export, restore, and a scoped reset. */
export function DataPanel() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function exportProgress() {
    setBusy(true);
    try {
      await saveTextFile(`pharmacards-backup-${localDate()}.json`, JSON.stringify(await exportBackup()));
      setStatus("Progress exported.");
    } catch (e) {
      setStatus(/cancel/i.test(String((e as Error)?.message)) ? "Export cancelled." : "Export failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function importProgress(file: File) {
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(await file.text());
    } catch {
      setStatus("That file is not a valid backup.");
      return;
    }
    if (!data || typeof data !== "object") {
      setStatus("That file is not a valid backup.");
      return;
    }
    const total = BACKUP_TABLES.reduce((n, t) => n + (Array.isArray(data[t]) ? (data[t] as unknown[]).length : 0), 0);
    if (!total) {
      setStatus("No Pharmacards progress found in that file.");
      return;
    }
    if (
      !window.confirm(
        `Import ${total} records from "${file.name}"? Review history is merged (duplicates skipped). Schedules and notes are replaced unless this device changed them more recently. Bookmarks, settings, card approvals/edits and imported cards with the same ID are replaced by the file's version. Everything else on this device is kept.`,
      )
    ) {
      setStatus("Import cancelled.");
      return;
    }
    setBusy(true);
    try {
      const { added, invalid, duplicates } = await importBackup(data);
      setStatus(
        `Imported ${added} records.` +
          (duplicates ? ` ${duplicates} already on this device.` : "") +
          (invalid ? ` ${invalid} damaged records skipped.` : ""),
      );
    } catch {
      setStatus("Import failed. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  async function resetProgress() {
    const ok = window.confirm(
      "Reset study progress? This deletes every card's review schedule (cardStates), your review history (reviews) and your mastery snapshots (snapshots). Cards, approvals, notes and bookmarks are kept. This cannot be undone.",
    );
    if (!ok) return;
    try {
      await db.transaction("rw", [db.cardStates, db.reviews, db.snapshots], async () => {
        await db.cardStates.clear();
        await db.reviews.clear();
        await db.snapshots.clear();
      });
      setStatus("Study progress reset.");
    } catch {
      setStatus("Reset failed.");
    }
  }

  return (
    <Panel id="settings-data" title="Your data">
      <Row
        title="Export progress"
        description="Download a backup file with your study progress, notes, bookmarks and settings."
        control={
          <button type="button" className="btn-ghost" disabled={busy} onClick={exportProgress}>
            Export progress
          </button>
        }
      />
      <Row
        title="Import progress"
        description="Restore a backup file. Review history is merged. Schedules and notes are replaced unless this device changed them more recently."
        control={
          <label className="btn-ghost cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal">
            Import progress
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void importProgress(f);
              }}
            />
          </label>
        }
      />
      <Row
        title="Reset study progress"
        description="Clears review schedules, review history and mastery snapshots. Cards, approvals, notes and bookmarks are kept."
        control={
          <button type="button" className="btn border border-weak bg-sheet text-weak hover:bg-well" disabled={busy} onClick={resetProgress}>
            Reset study progress
          </button>
        }
      />
      <p role="status" aria-live="polite" className="min-h-6 border-t border-rule py-3 text-sm text-ink-soft">
        {status}
      </p>
    </Panel>
  );
}
