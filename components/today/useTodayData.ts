"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { isOpen, unlockedLevels } from "@/lib/levels";
import { dailyNewTarget, isRapid, levelSignals, loadStudyCards, MAX_DUE_PER_SESSION, startOfDay } from "@/lib/store";
import { MAX_ANSWER_MS } from "@/lib/srs";

export interface SessionPoint {
  at: number;
  avg: number; // mean of the rated topic scores in that snapshot, 0–100
}

/** Everything the Today screen reads from Dexie, computed in one live query. */
export interface TodayData {
  dueTotal: number; // study cards due now (overdue + due today)
  overdue: number; // due before today started
  dueToday: number; // due since today started
  newToday: number; // new cards still allowed today (dailyNewTarget minus done), 0 while the due backlog exceeds one session
  queueTotal: number; // what "Start daily review" will serve: due (capped at MAX_DUE_PER_SESSION) + new
  avgSeconds: number | null; // mean time per answer, last 7 days
  accuracy: number | null; // share of answers rated Good or Easy, last 7 days, 0–1
  reviewsWeek: number;
  seen: number; // study cards seen at least once
  total: number; // study cards
  sessions: SessionPoint[];
  diagnosed: boolean; // a diagnostic test has been taken
}

const DAY_MS = 86_400_000;

/** Mirrors the daily queue logic in lib/store.ts buildQueue() so the numbers match the session. */
export function useTodayData(): TodayData | undefined {
  return useLiveQuery(
    async (): Promise<TodayData> => {
      const now = Date.now();
      const todayStart = startOfDay(new Date(now));
      const [allCards, allStates, weekReviews, snapshots, diagnostic] = await Promise.all([
        loadStudyCards(),
        db.cardStates.toArray(),
        db.reviews.where("at").aboveOrEqual(now - 7 * DAY_MS).toArray(),
        db.snapshots.orderBy("at").toArray(),
        db.reviews.filter((r) => r.mode === "diagnostic").first(), // stops at the first match, no full count
      ]);

      // Rapid cards (and their "~r" reverse states) have their own queue; the daily numbers ignore them.
      const cards = allCards.filter((c) => !isRapid(c));
      const studyIds = new Set(cards.map((c) => c.id));
      const states = allStates.filter((s) => studyIds.has(s.cardId));
      const stateIds = new Set(states.map((s) => s.cardId));

      const due = states.filter((s) => s.due <= now);
      const overdue = due.filter((s) => s.due < todayStart).length;
      const dueTotal = due.length;

      // Same three rules as the daily session in lib/store.ts buildQueue, so the count matches what it serves.
      const doneToday = new Set(weekReviews.filter((r) => r.at >= todayStart && r.mode === "daily-new").map((r) => r.cardId));
      const newLimit = await dailyNewTarget(cards, { has: (id) => stateIds.has(id) && !doneToday.has(id) });
      const unlocked = unlockedLevels(cards, levelSignals(states, new Date(now)));
      const openUnseen = cards.filter((c) => !stateIds.has(c.id) && isOpen(c, unlocked)).length;
      // A due backlog larger than one session leaves no room for new cards (same rule as buildQueue).
      const newToday = dueTotal > MAX_DUE_PER_SESSION ? 0 : Math.min(Math.max(0, newLimit - doneToday.size), openUnseen);

      const studyWeek = weekReviews.filter((r) => studyIds.has(r.cardId));
      const n = studyWeek.length;
      // Older records were stored uncapped, so cap here too.
      const avgSeconds = n ? studyWeek.reduce((a, r) => a + Math.min(MAX_ANSWER_MS, r.ms), 0) / n / 1000 : null;
      const accuracy = n ? studyWeek.filter((r) => r.rating >= 3).length / n : null;

      const sessions = snapshots.flatMap((s) => {
        const vals = Object.values(s.scores).filter((v): v is number => v != null);
        return vals.length ? [{ at: s.at, avg: vals.reduce((a, b) => a + b, 0) / vals.length }] : [];
      });

      return {
        dueTotal,
        overdue,
        dueToday: dueTotal - overdue,
        newToday,
        queueTotal: Math.min(dueTotal, MAX_DUE_PER_SESSION) + newToday,
        avgSeconds,
        accuracy,
        reviewsWeek: n,
        seen: cards.filter((c) => stateIds.has(c.id)).length,
        total: cards.length,
        sessions,
        diagnosed: diagnostic !== undefined,
      };
    },
    [],
    undefined,
  );
}
