"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { MAX_LEVEL, unlockedLevels } from "@/lib/levels";
import type { TopicMastery } from "@/lib/mastery";
import { levelSignals, loadStudyCards } from "@/lib/store";
import { topicById } from "@/lib/syllabus";
import { MasteryPill } from "./MasteryPill";

/**
 * A topic's subtopics as tappable rows: title, cards seen, capsule meter.
 * Tapping a row starts practice on just that subtopic.
 * `order="weakest"` sorts rated subtopics weakest first (unrated last), like pre-pg's sub-topic report.
 */
export function SubtopicList({
  topicId,
  mastery,
  order = "syllabus",
}: {
  topicId: string;
  mastery?: Map<string, TopicMastery>;
  order?: "syllabus" | "weakest";
}) {
  const topic = topicById.get(topicId);
  // Highest open difficulty level per subtopic, so the student sees what is unlocked next.
  const levels = useLiveQuery(
    async () => {
      const cards = (await loadStudyCards()).filter((c) => c.topicId === topicId);
      const states = await db.cardStates.toArray();
      return unlockedLevels(cards, levelSignals(states));
    },
    [topicId],
    new Map<string, number>(),
  );
  if (!topic) return null;
  let subs = topic.subtopics.map((s) => ({ ...s, m: mastery?.get(s.id), level: levels.get(s.id) ?? 1 }));
  if (order === "weakest")
    subs = [...subs].sort((a, b) => (a.m?.score ?? 101) - (b.m?.score ?? 101));
  return (
    <ul className="divide-y divide-rule">
      {subs.map((s) => (
        <li key={s.id}>
          <Link
            href={`/study?mode=topic&subtopic=${s.id}`}
            className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-teal-wash"
          >
            <span className="min-w-0">
              <span className="line-clamp-2 block text-[15px] leading-snug">{s.title}</span>
              <span className="font-mono text-[11px] text-ink-soft">
                {s.m ? `${Math.round(s.m.coverage * s.m.cards)} of ${s.m.cards} cards seen` : "No cards yet"}
                {` · level ${s.level} of ${MAX_LEVEL} open`}
              </span>
            </span>
            <MasteryPill m={s.m} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
