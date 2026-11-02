"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { RapidFireSession } from "@/components/RapidFireSession";
import { StudySession } from "@/components/StudySession";
import { buildQueue, type RapidDirection, type StudyMode } from "@/lib/store";
import { subtopicById, topicById } from "@/lib/syllabus";
import { TAG_LABEL, type FlashCard, type Tag } from "@/lib/types";

const TITLES: Record<StudyMode, string> = {
  daily: "Daily review",
  diagnostic: "Diagnostic test",
  random: "Grand random",
  weak: "Weak-area practice",
  topic: "Topic practice",
  bookmarks: "Saved cards",
  rapid: "Rapid fire: all topics",
};

/** Same scope (topic / subtopic / tag), other mode: used by the Rapid fire toggle. */
function scopeHref(params: URLSearchParams, mode: StudyMode, extra: Record<string, string> = {}) {
  const q = new URLSearchParams({ mode });
  for (const k of ["topic", "subtopic", "tag"]) {
    const v = params.get(k);
    if (v) q.set(k, v);
  }
  for (const [k, v] of Object.entries(extra)) q.set(k, v);
  return `/study?${q.toString().replace(/%2C/g, ",")}`;
}

function Study() {
  const params = useSearchParams();
  const router = useRouter();
  const rawMode = params.get("mode") as StudyMode | null;
  const mode: StudyMode = rawMode && rawMode in TITLES ? rawMode : "daily";
  const topic = params.get("topic");
  const subtopic = params.get("subtopic");
  const rawTag = params.get("tag") as Tag | null;
  const tag = rawTag && rawTag in TAG_LABEL ? rawTag : null;
  const n = Number(params.get("n"));
  const size = Number.isInteger(n) && n > 0 ? n : undefined;
  const types = params.get("types")?.split(",").filter(Boolean);
  const pyqOnly = params.get("pyq") === "1";
  const direction = (params.get("dir") ?? "forward") as RapidDirection;
  const [cards, setCards] = useState<FlashCard[]>();

  useEffect(() => {
    let live = true;
    setCards(undefined);
    buildQueue({
      mode,
      size,
      topicIds: topic ? topic.split(",") : undefined,
      subtopicIds: subtopic ? subtopic.split(",") : undefined,
      tag: tag ?? undefined,
      types,
      pyqOnly,
      direction,
    }).then((c) => live && setCards(c), () => live && setCards([]));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  if (!cards) return <p className="py-10 text-center font-mono text-sm text-ink-soft">Building your session…</p>;
  const scopeTitle =
    (subtopic && subtopicById.get(subtopic.split(",")[0])?.title) ||
    (tag && `${TAG_LABEL[tag]} questions`) ||
    (topic && topicById.get(topic.split(",")[0])?.title);

  if (mode === "rapid")
    return (
      <RapidFireSession
        cards={cards}
        title={scopeTitle || TITLES.rapid}
        direction={direction}
        onDirection={(d) => router.replace(scopeHref(params, "rapid", { dir: d }))}
        fullCardsHref={scopeHref(params, topic || subtopic || tag ? "topic" : "daily")}
      />
    );
  return (
    <StudySession
      cards={cards}
      mode={mode}
      title={(mode === "topic" && scopeTitle) || scopeTitle || TITLES[mode]}
      rapidHref={scopeHref(params, "rapid")}
    />
  );
}

export default function StudyPage() {
  return (
    <Suspense>
      <Study />
    </Suspense>
  );
}
