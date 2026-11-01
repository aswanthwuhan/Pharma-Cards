"use client";

import { useState } from "react";
import { db, type Bookmark, type CardOverride, type CardState, type Note, type MasterySnapshot, type Setting, type StoredReview } from "@/lib/db";
import { Panel, Row } from "./controls";

const BACKUP_TABLES = ["cardStates", "reviews", "bookmarks", "notes", "settings", "snapshots", "overrides"] as const;

function localDate(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function rowsOf<T>(data: Record<string, unknown>, key: string): T[] {
  return Array.isArray(data[key]) ? (data[key] as T[]) : [];
}

/** Your data: backup export, restore, and a scoped reset. */
export function DataPanel() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function exportProgress() {
    setBusy(true);
    try {
      const [cardStates, reviews, bookmarks, notes, settings, snapshots, overrides] = await Promise.all([
        db.cardStates.toArray(),
        db.reviews.toArray(),
        db.bookmarks.toArray(),
        db.notes.toArray(),
        db.settings.toArray(),
        db.snapshots.toArray(),
        db.overrides.toArray(),
      ]);
      const payload = {
        app: "pharmacards",
        exportedAt: new Date().toISOString(),
        cardStates,
        reviews,
        bookmarks,
        notes,
        settings,
        snapshots,
        overrides,
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `pharmacards-backup-${localDate()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("Progress exported.");
    } catch {
      setStatus("Export failed. Try again.");
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
    const total = BACKUP_TABLES.reduce((n, t) => n + rowsOf(data, t).length, 0);
    if (!total) {
      setStatus("No Pharmacards progress found in that file.");
      return;
    }
    if (!window.confirm(`Import ${total} records from "${file.name}"? Records with the same ID are replaced. Everything else on this device is kept.`)) {
      setStatus("Import cancelled.");
      return;
    }
    setBusy(true);
    try {
      await db.transaction(
        "rw",
        [db.cardStates, db.reviews, db.bookmarks, db.notes, db.settings, db.snapshots, db.overrides],
        async () => {
          await db.cardStates.bulkPut(rowsOf<CardState>(data, "cardStates"));
          await db.reviews.bulkPut(rowsOf<StoredReview>(data, "reviews"));
          await db.bookmarks.bulkPut(rowsOf<Bookmark>(data, "bookmarks"));
          await db.notes.bulkPut(rowsOf<Note>(data, "notes"));
          await db.settings.bulkPut(rowsOf<Setting>(data, "settings"));
          await db.snapshots.bulkPut(rowsOf<MasterySnapshot>(data, "snapshots"));
          await db.overrides.bulkPut(rowsOf<CardOverride>(data, "overrides"));
        },
      );
      setStatus(`Imported ${total} records.`);
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
    await db.transaction("rw", [db.cardStates, db.reviews, db.snapshots], async () => {
      await db.cardStates.clear();
      await db.reviews.clear();
      await db.snapshots.clear();
    });
    setStatus("Study progress reset.");
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
        description="Restore a backup file. Records with the same ID are replaced."
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
