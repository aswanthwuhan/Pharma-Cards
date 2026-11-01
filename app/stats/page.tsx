"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BottomSheet } from "@/components/BottomSheet";
import { MasteryRing, labelColor } from "@/components/mastery/bits";
import {
  FILTERS,
  PAPER_CAPSULE,
  PAPER_TAB,
  breakdown,
  labelOf,
  paperTitle,
  parentTopicId,
  weightedScore,
  type Filter,
  type Row,
  type Sort,
} from "@/components/mastery/model";
import { RankedTable } from "@/components/mastery/RankedTable";
import { TopicInspector } from "@/components/mastery/TopicInspector";
import { TopicTile, type TileData } from "@/components/mastery/TopicTile";
import { db } from "@/lib/db";
import { labelFor, type TopicMastery } from "@/lib/mastery";
import { useMastery, useStudyCards, weakest } from "@/lib/store";
import { PAPERS } from "@/lib/syllabus";
import { TAGS, TAG_LABEL, type FlashCard } from "@/lib/types";

type Sizing = "equal" | "cards";
type View = "map" | "ranked";

/** Unrated topics always sort last; rated ones follow the chosen order. */
function orderRows(list: Row[], sort: Sort): Row[] {
  const rated = list.filter((r) => r.m?.score != null);
  const unrated = list.filter((r) => r.m?.score == null);
  if (sort === "weakest") rated.sort((a, b) => a.m!.score! - b.m!.score!);
  if (sort === "strongest") rated.sort((a, b) => b.m!.score! - a.m!.score!);
  return [...rated, ...unrated];
}

export default function MasteryMap() {
  const report = useMastery();
  const studyCards = useStudyCards();
  const extras = useLiveQuery(
    async () => {
      const [states, reviews] = await Promise.all([db.cardStates.toArray(), db.reviews.toArray()]);
      const now = Date.now();
      const due = new Map<string, number>();
      for (const s of states) if (s.due <= now) due.set(s.topicId, (due.get(s.topicId) ?? 0) + 1);
      const ms = new Map<string, { n: number; sum: number }>();
      for (const r of reviews) {
        const x = ms.get(r.topicId) ?? { n: 0, sum: 0 };
        ms.set(r.topicId, { n: x.n + 1, sum: x.sum + r.ms });
      }
      return { due, ms };
    },
    [],
    undefined,
  );

  const [filter, setFilter] = useState<Filter>("all");
  const [paperId, setPaperId] = useState("all");
  const [query, setQuery] = useState("");
  const [sizing, setSizing] = useState<Sizing>("equal");
  const [sort, setSort] = useState<Sort>("weakest");
  const [view, setView] = useState<View>("map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [picks, setPicks] = useState<Set<string>>(new Set());
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const rows: Row[] = useMemo(
    () => PAPERS.flatMap((paper) => paper.topics.map((topic) => ({ topic, paper, m: report?.topic.get(topic.id) }))),
    [report],
  );

  const subsByTopic = useMemo(() => {
    const out = new Map<string, TopicMastery[]>();
    for (const [key, m] of report?.subtopic ?? []) {
      const t = parentTopicId(key);
      out.set(t, [...(out.get(t) ?? []), m]);
    }
    return out;
  }, [report]);

  const tileData = useMemo(() => {
    const out = new Map<string, TileData>();
    for (const r of rows) {
      out.set(r.topic.id, {
        due: extras?.due.get(r.topic.id) ?? 0,
        seenPct: Math.round((r.m?.coverage ?? 0) * 100),
        seg: breakdown(r.m?.cards ?? 0, subsByTopic.get(r.topic.id) ?? []),
      });
    }
    return out;
  }, [rows, subsByTopic, extras]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: rows.length, weak: 0, moderate: 0, strong: 0, unassessed: 0, nocards: 0 };
    for (const r of rows) {
      if (!r.m || r.m.cards === 0) c.nocards++;
      else if (r.m.score == null) c.unassessed++;
      else c[labelOf(r.m)]++;
    }
    return c;
  }, [rows]);

  const passes = (r: Row) => {
    if (filter === "nocards" && (r.m && r.m.cards > 0)) return false;
    if (filter === "unassessed" && !(r.m && r.m.cards > 0 && r.m.score == null)) return false;
    if (filter === "weak" || filter === "moderate" || filter === "strong") {
      if (labelOf(r.m) !== filter) return false;
    }
    const q = query.trim().toLowerCase();
    if (q) {
      const hit =
        r.topic.title.toLowerCase().includes(q) || r.topic.subtopics.some((s) => s.title.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  };

  const sections = PAPERS.filter((p) => paperId === "all" || p.id === paperId)
    .map((paper) => {
      const all = rows.filter((r) => r.paper.id === paper.id);
      const shown = orderRows(all.filter(passes), sort);
      return { paper, all, shown };
    })
    .filter((s) => s.shown.length > 0);

  const overall = weightedScore(rows.map((r) => r.m));
  const ratedCount = rows.filter((r) => r.m?.score != null).length;
  const selectedRow = rows.find((r) => r.topic.id === (selectedId ?? weakest(report?.topic, 1)[0]?.topicId)) ?? rows[0];

  const rankedRows = useMemo(() => orderRows(rows, "weakest"), [rows]);
  const pickedCards: FlashCard[] = (studyCards ?? []).filter((c) => picks.has(c.topicId));

  const togglePick = (id: string) =>
    setPicks((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  const inspect = (id: string) => {
    setSelectedId(id);
    if (isDesktop()) document.getElementById("inspector")?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setSheetOpen(true);
  };

  const scrollTo = (id: string, v: View) => {
    setView(v);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tagRows = TAGS.flatMap((tag) => {
    const m = report?.tag.get(tag);
    return m ? [{ tag, m }] : [];
  }).sort((a, b) => (a.m.score ?? 101) - (b.m.score ?? 101));

  const selectedSubs = report?.subtopic ?? new Map<string, TopicMastery>();
  const selectedDue = selectedRow ? extras?.due.get(selectedRow.topic.id) ?? 0 : 0;
  const ms = selectedRow ? extras?.ms.get(selectedRow.topic.id) : undefined;
  const avgSeconds = ms && ms.n ? ms.sum / ms.n / 1000 : null;
  const overallLabel = overall == null ? "unassessed" : labelFor(overall);

  return (
    <div className="space-y-8">
      {/* Header and status panel */}
      <section className="space-y-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl">Your mastery map</h1>
          <p className="mt-2 text-sm text-ink-soft">Find a weak area. Practise it. Track what changes.</p>
        </div>

        <div className="glass rounded-xl flex flex-wrap items-center justify-between gap-4 p-4">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`${filter === f.id ? "btn-chip-on ring-2 ring-teal ring-offset-2 ring-offset-sheet" : "btn-chip"}`}
              >
                {f.label}
                <span className="font-mono text-xs tabular-nums opacity-80">{counts[f.id]}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <MasteryRing score={overall} label={overallLabel} size={56} />
            <p className="font-mono text-sm text-ink-soft">
              Overall syllabus mastery{" "}
              <span className="text-lg text-ink tabular-nums" style={{ color: overall == null ? undefined : labelColor(overallLabel) }}>
                {overall ?? "—"}
              </span>{" "}
              / 100
              <span className="block text-[11px]">{report === undefined ? "Loading…" : `From ${ratedCount} rated ${ratedCount === 1 ? "topic" : "topics"}`}</span>
            </p>
          </div>
        </div>

        {report !== undefined && overall === null && (
          <div className="glass rounded-xl flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="max-w-prose text-sm text-ink-soft">
              Nothing is rated yet. A topic gets a score after 3 answers. Practise a few cards and your map will start to fill in.
            </p>
            <Link href="/study?mode=daily" className="btn-primary">
              Start practising
            </Link>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-5">
          <div role="group" aria-label="Filter by paper" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={paperId === "all"} onClick={() => setPaperId("all")} className={paperId === "all" ? "btn-chip-on" : "btn-chip"}>
              All papers
            </button>
            {PAPERS.map((p) => (
              <button key={p.id} type="button" aria-pressed={paperId === p.id} onClick={() => setPaperId(p.id)} className={paperId === p.id ? "btn-chip-on" : "btn-chip"}>
                {PAPER_TAB[p.id]}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter topics or subtopics"
            aria-label="Filter topics or subtopics"
            className="min-h-9 w-full rounded-full border border-rule bg-sheet px-4 text-ink placeholder:text-ink-soft sm:w-64"
          />

          <div role="group" aria-label="Tile sizing" className="flex gap-2">
            {(["equal", "cards"] as const).map((s) => (
              <button key={s} type="button" aria-pressed={sizing === s} onClick={() => setSizing(s)} className={sizing === s ? "btn-chip-on" : "btn-chip"}>
                {s === "equal" ? "Equal" : "By cards"}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-9 rounded-full border border-rule bg-sheet px-3 text-sm text-ink">
              <option value="weakest">Weakest first</option>
              <option value="strongest">Strongest first</option>
              <option value="syllabus">Syllabus order</option>
            </select>
          </label>

          <div role="group" aria-label="View" className="ml-auto flex gap-2">
            <button type="button" aria-pressed={view === "map"} onClick={() => scrollTo("map", "map")} className={view === "map" ? "btn-chip-on" : "btn-chip"}>
              Map
            </button>
            <button type="button" aria-pressed={view === "ranked"} onClick={() => scrollTo("ranked", "ranked")} className={view === "ranked" ? "btn-chip-on" : "btn-chip"}>
              Ranked
            </button>
          </div>
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-6">
        {/* Paper sections */}
        <div id="map" className="min-w-0 scroll-mt-6 space-y-8">
          {report === undefined && <p className="text-sm text-ink-soft">Loading your map…</p>}
          {sections.map(({ paper, all, shown }) => {
            const avg = weightedScore(all.map((r) => r.m));
            const avgLabel = avg == null ? "unassessed" : labelFor(avg);
            const cards = all.reduce((a, r) => a + (r.m?.cards ?? 0), 0);
            return (
              <section key={paper.id} aria-labelledby={`paper-${paper.id}`} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: labelColor(avgLabel) }} aria-hidden="true" />
                    <h2 id={`paper-${paper.id}`} className="font-serif text-xl">
                      {paperTitle(paper)}
                    </h2>
                    {PAPER_CAPSULE[paper.id] && (
                      <span className="rounded-full border border-rule px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-soft">
                        {PAPER_CAPSULE[paper.id]}
                      </span>
                    )}
                    <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                      {all.length} {all.length === 1 ? "topic" : "topics"} · {cards} cards
                    </span>
                  </div>
                  <span className="rounded-full border border-rule px-3 py-1 font-mono text-xs tabular-nums" style={{ color: labelColor(avgLabel) }}>
                    Paper avg: {avg ?? "—"}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {shown.map((r) => (
                    <TopicTile
                      key={r.topic.id}
                      row={r}
                      data={tileData.get(r.topic.id)!}
                      selected={selectedRow?.topic.id === r.topic.id}
                      span={sizing === "cards" && (r.m?.cards ?? 0) >= 50}
                      onSelect={() => inspect(r.topic.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          {report !== undefined && sections.length === 0 && (
            <div className="glass rounded-xl p-5 text-sm text-ink-soft">
              No topics match these filters.{" "}
              <button
                type="button"
                className="text-teal underline underline-offset-4"
                onClick={() => {
                  setFilter("all");
                  setPaperId("all");
                  setQuery("");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Desktop inspector */}
        {selectedRow && (
          <aside id="inspector" className="hidden scroll-mt-6 lg:sticky lg:top-6 lg:block">
            <div className="glass rounded-xl overflow-hidden">
              <TopicInspector
                topic={selectedRow.topic}
                paper={selectedRow.paper}
                m={selectedRow.m}
                subs={selectedSubs}
                due={selectedDue}
                avgSeconds={avgSeconds}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Ranked table */}
      {report !== undefined && (
        <RankedTable
          rows={rankedRows}
          data={tileData}
          picks={picks}
          cards={pickedCards}
          onToggle={togglePick}
          onClear={() => setPicks(new Set())}
          onInspect={inspect}
        />
      )}

      {/* By question type */}
      {report !== undefined && (
        <section aria-labelledby="tags-heading" className="glass rounded-xl p-4 sm:p-5">
          <h2 id="tags-heading" className="font-serif text-xl">
            By question type
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Open a question type to practise only those cards.</p>
          {tagRows.length ? (
            <ul className="mt-4 divide-y divide-rule">
              {tagRows.map(({ tag, m }) => (
                <li key={tag}>
                  <Link
                    href={`/study?mode=topic&tag=${tag}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3 hover:bg-teal-wash sm:grid-cols-[12rem_minmax(0,1fr)_3rem]"
                  >
                    <span className="text-sm">{TAG_LABEL[tag]}</span>
                    <span className="order-last col-span-2 sm:order-none sm:col-span-1">
                      <span className="block h-2 overflow-hidden rounded-full bg-rule">
                        <span className="block h-full rounded-full" style={{ width: `${m.score ?? 0}%`, background: labelColor(m.label) }} />
                      </span>
                    </span>
                    <span className="text-right font-mono text-sm tabular-nums" style={{ color: labelColor(m.label) }}>
                      {m.score ?? "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">No question types rated yet. Answer a few cards to see them here.</p>
          )}
        </section>
      )}

      <section className="text-sm">
        <Link href="/settings" className="text-teal underline underline-offset-4">
          Exam date and study settings
        </Link>
      </section>

      {/* Mobile inspector */}
      {selectedRow && (
        <div className="lg:hidden">
          <BottomSheet open={sheetOpen} onClose={closeSheet} title={selectedRow.topic.title}>
            <TopicInspector
              topic={selectedRow.topic}
              paper={selectedRow.paper}
              m={selectedRow.m}
              subs={selectedSubs}
              due={selectedDue}
              avgSeconds={avgSeconds}
            />
          </BottomSheet>
        </div>
      )}
    </div>
  );
}
