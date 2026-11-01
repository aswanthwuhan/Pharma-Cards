"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { MasteryPill } from "@/components/MasteryPill";
import { SubtopicList } from "@/components/SubtopicList";
import type { TopicMastery } from "@/lib/mastery";
import type { MasteryReport } from "@/lib/store";
import { topicById } from "@/lib/syllabus";
import type { Paper } from "@/lib/types";

/**
 * A paper's topics in a bottom sheet. Tapping a topic shows its subtopics (SubtopicList);
 * "Back to topics" returns to the list.
 */
export function PaperSheet({
  paper,
  open,
  onClose,
  mastery,
}: {
  paper: Paper;
  open: boolean;
  onClose: () => void;
  mastery?: MasteryReport;
}) {
  const [topicId, setTopicId] = useState<string | null>(null);
  const topic = topicId ? topicById.get(topicId) : undefined;

  const close = () => {
    setTopicId(null);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={close} title={topic?.title ?? paper.title}>
      {topic ? (
        <div className="space-y-5 px-5 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setTopicId(null)} className="btn-chip min-h-11 text-ink-soft hover:text-ink">
              ← Back to topics
            </button>
            <MasteryPill m={mastery?.topic.get(topic.id)} />
          </div>
          <div className="overflow-hidden rounded-xl border border-rule">
            <SubtopicList topicId={topic.id} mastery={mastery?.subtopic} order="weakest" />
          </div>
          <div className="grid gap-2">
            {weakestSubtopicId(topic.id, mastery?.subtopic) && (
              <Link href={`/study?mode=topic&subtopic=${weakestSubtopicId(topic.id, mastery?.subtopic)}`} className="btn-primary w-full">
                Practise weakest subtopic
              </Link>
            )}
            <Link href={`/study?mode=topic&topic=${topic.id}`} className="btn-ghost w-full">
              Whole topic
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-rule">
          {paper.topics.map((t) => {
            const m = mastery?.topic.get(t.id);
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTopicId(t.id)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-teal-wash"
                >
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-[15px] leading-snug">{t.title}</span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                      {m ? `${m.cards} cards` : "No cards yet"}
                    </span>
                  </span>
                  <MasteryPill m={m} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </BottomSheet>
  );
}

/** The subtopic to drill first: the lowest rated one, or the first one if none are rated yet. */
function weakestSubtopicId(topicId: string, subtopic?: Map<string, TopicMastery>): string | undefined {
  const subs = topicById.get(topicId)?.subtopics ?? [];
  if (!subs.length) return undefined;
  let best: { id: string; score: number } | undefined;
  for (const s of subs) {
    const score = subtopic?.get(s.id)?.score;
    if (score != null && (!best || score < best.score)) best = { id: s.id, score };
  }
  return best?.id ?? subs[0].id;
}
