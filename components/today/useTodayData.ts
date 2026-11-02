"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { dailyNewTarget, isRapid, loadStudyCards, startOfDay } from "@/lib/store";

export interface SessionPoint {
  at: number;
  avg: number; // mean of the rated topic scores in that snapshot, 0–100
}

/** Everything the Today screen reads from Dexie, computed in one live query. */
export interface TodayData {
  dueTotal: number; // study cards due now (overdue + due today)
  overdue: number; // due before today started
  dueToday: number; // due since today started
  newToday: number; // new cards still allowed today (dailyNewTarget minus done)
  queueTotal: number; // what "Start daily review" will serve: due + new
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

      const newLimit = await dailyNewTarget(cards, stateIds);
      const newDone = new Set(weekReviews.filter((r) => r.at >= todayStart && r.mode === "daily-new").map((r) => r.cardId)).size;
      const unseen = cards.filter((c) => !stateIds.has(c.id)).length;
      const newToday = Math.min(Math.max(0, newLimit - newDone), unseen);

      const studyWeek = weekReviews.filter((r) => studyIds.has(r.cardId));
      const n = studyWeek.length;
      const avgSeconds = n ? studyWeek.reduce((a, r) => a + r.ms, 0) / n / 1000 : null;
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
        queueTotal: dueTotal + newToday,
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
