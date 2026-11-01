"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useMemo, useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { OverviewPanel, type OverviewCounts } from "@/components/syllabus/OverviewPanel";
import { EMPTY_MIX, MixPanel, type MixState } from "@/components/syllabus/MixPanel";
import { TopicCard } from "@/components/syllabus/TopicCard";
import { db } from "@/lib/db";
import { useMastery, useStudyCards } from "@/lib/store";
import { PAPERS } from "@/lib/syllabus";
import type { Topic } from "@/lib/types";

/** "Paper I — General Pharmacology" -> "Paper I" */
const shortPaper = (title: string) => title.split(" — ")[0];
/** "Paper I — General Pharmacology" -> "General Pharmacology" */
const paperName = (title: string) => title.split(" — ")[1] ?? title;
/** "Paper I — General Pharmacology" -> "General" */
const paperChipName = (title: string) => paperName(title).split(" (")[0];

/** Every token must appear somewhere in the text (case-insensitive). */
const matches = (text: string, tokens: string[]) => {
  const hay = text.toLowerCase();
  return tokens.every((tok) => hay.includes(tok));
};

export default function Syllabus() {
  const cards = useStudyCards();
  const mastery = useMastery();
  const states = useLiveQuery(() => db.cardStates.toArray(), [], undefined);

  const [query, setQuery] = useState("");
  const [paper, setPaper] = useState("all");
  const [openTopics, setOpenTopics] = useState<Set<string>>(() => new Set());

  const [mix, setMix] = useState<MixState>(EMPTY_MIX);
  const patchMix = useCallback((patch: Partial<MixState>) => setMix((m) => ({ ...m, ...patch })), []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const tokens = useMemo(() => query.trim().toLowerCase().split(/\s+/).filter(Boolean), [query]);

  const countByTopic = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cards ?? []) m.set(c.topicId, (m.get(c.topicId) ?? 0) + 1);
    return m;
  }, [cards]);

  const progress = useMemo(() => {
    const now = Date.now();
    const seen = new Map<string, number>();
    const due = new Map<string, number>();
    for (const s of states ?? []) {
      seen.set(s.topicId, (seen.get(s.topicId) ?? 0) + 1);
      if (s.due <= now) due.set(s.topicId, (due.get(s.topicId) ?? 0) + 1);
    }
    return { seen, due };
  }, [states]);

  const subtopicCounts = useMemo<OverviewCounts>(() => {
    const c: OverviewCounts = { strong: 0, moderate: 0, weak: 0, unassessed: 0 };
    mastery?.subtopic.forEach((m) => {
      c[m.label] += 1;
    });
    return c;
  }, [mastery]);

  // Search matches topic names, subtopic names and textbook refs.
  const visibleSections = useMemo(() => {
    const topicMatches = (t: Topic) =>
      !tokens.length || matches([t.title, ...t.refs, ...t.subtopics.map((s) => s.title)].join(" "), tokens);
    return PAPERS.filter((p) => paper === "all" || p.id === paper)
      .map((p) => ({ paper: p, topics: p.topics.filter(topicMatches) }))
      .filter((s) => s.topics.length > 0);
  }, [paper, tokens]);

  const toggleTopic = (id: string) =>
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const mixPanel = (
    <MixPanel cards={cards ?? []} countByTopic={countByTopic} mix={mix} onChange={patchMix} />
  );

  return (
    <div className="space-y-6 pb-32 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 lg:space-y-0 lg:pb-12">
      <div className="min-w-0 space-y-6">
        <header className="space-y-1">
          <h1 className="font-serif text-3xl">Syllabus</h1>
          <p className="text-sm text-ink-soft">Every topic in the syllabus, and how well you know each one.</p>
        </header>

        {/* search */}
        <div className="relative">
          <label htmlFor="syllabus-search" className="sr-only">
            Search topics, subtopics and refs
          </label>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          <input
            id="syllabus-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, subtopics or refs"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-rule bg-sheet pr-4 pl-11 text-ink placeholder:text-ink-soft focus:border-teal focus:outline-none"
          />
        </div>

        {/* paper chips */}
        <div
          role="group"
          aria-label="Filter by paper"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {[{ id: "all", label: "All papers" }, ...PAPERS.map((p) => ({ id: p.id, label: `${shortPaper(p.title)}: ${paperChipName(p.title)}` }))].map(
            (f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={paper === f.id}
                onClick={() => setPaper(f.id)}
                className={`${paper === f.id ? "btn-chip-on" : "btn-chip"} shrink-0 !min-h-11 whitespace-nowrap`}
              >
                {f.label}
              </button>
            ),
          )}
        </div>

        <OverviewPanel totalCards={cards?.length ?? 0} counts={subtopicCounts} />

        {/* papers and topic cards */}
        {visibleSections.length === 0 ? (
          <div className="sheet space-y-3 p-5 text-center">
            <p>No topics match &ldquo;{query.trim()}&rdquo;.</p>
            <p className="text-sm text-ink-soft">Try a shorter word, a topic name, or a textbook ref such as KDT8.</p>
            <button type="button" onClick={() => setQuery("")} className="btn-ghost">
              Clear search
            </button>
          </div>
        ) : (
          visibleSections.map(({ paper: p, topics }) => (
            <section key={p.id} aria-labelledby={`paper-${p.id}`} className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 rounded-md border border-rule px-2 py-0.5 font-mono text-[11px] tracking-[0.06em] text-ink-soft uppercase">
                  {shortPaper(p.title)}
                </span>
                <h2 id={`paper-${p.id}`} className="min-w-0 flex-1 font-serif text-2xl leading-tight">
                  {paperName(p.title)}
                </h2>
                <span className="shrink-0 font-mono text-[11px] tracking-[0.06em] text-ink-soft uppercase">
                  {p.topics.length} {p.topics.length === 1 ? "topic" : "topics"}
                </span>
              </div>
              <ul className="grid items-start gap-3 lg:grid-cols-2">
                {topics.map((t) => {
                  const n = countByTopic.get(t.id) ?? 0;
                  return (
                    <TopicCard
                      key={t.id}
                      topic={t}
                      cardCount={n}
                      mastery={mastery?.topic.get(t.id)}
                      subtopicMastery={mastery?.subtopic}
                      seen={progress.seen.get(t.id) ?? 0}
                      due={progress.due.get(t.id) ?? 0}
                      open={openTopics.has(t.id)}
                      onToggle={() => toggleTopic(t.id)}
                      matched={tokens.length ? t.subtopics.filter((s) => matches(s.title, tokens)).map((s) => s.title) : []}
                    />
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      {/* desktop: custom mix docked as a sticky side column */}
      <aside aria-label="Custom mix" className="hidden lg:sticky lg:top-8 lg:block">
        <div className="sheet max-h-[calc(100dvh-4rem)] space-y-5 overflow-y-auto p-5">
          <h2 className="font-serif text-2xl">Build a custom mix</h2>
          {mixPanel}
        </div>
      </aside>

      {/* mobile: floating button above the tab dock opens the mix sheet */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="btn-primary pointer-events-auto shadow-lg shadow-black/40"
        >
          Build a custom mix
        </button>
      </div>

      <BottomSheet open={sheetOpen} onClose={closeSheet} title="Build a custom mix">
        <div className="px-5 pb-2">{mixPanel}</div>
      </BottomSheet>
    </div>
  );
}
