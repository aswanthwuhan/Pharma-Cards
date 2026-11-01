"use client";

import { useState } from "react";
import { CardView } from "@/components/CardView";
import { db, patchOverride } from "@/lib/db";
import { useAllCards } from "@/lib/store";
import { subtopicById, topicById, TOPICS } from "@/lib/syllabus";
import { TAG_LABEL, type Deck, type FlashCard } from "@/lib/types";

// Review queue for Claude-drafted cards. Approvals and edits are stored as
// local overrides; export them to merge back into content/decks.
const chip = "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors";
const chipOff = `${chip} border-rule bg-sheet text-ink-soft hover:border-teal hover:text-ink`;
const chipOn = `${chip} border-teal bg-teal font-semibold text-on-teal`;
const field =
  "min-h-11 w-full min-w-0 rounded-xl border border-rule bg-well px-4 text-base text-ink disabled:opacity-50 sm:w-auto";
const mono = "rounded-full border border-rule bg-well px-2 py-0.5 font-mono text-[11px] text-ink-soft";

export default function Admin() {
  const cards = useAllCards();
  const [filter, setFilter] = useState<"draft" | "approved" | "all">("draft");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const subtopics = topic ? (topicById.get(topic)?.subtopics ?? []) : [];
  const list = (cards ?? []).filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      (!topic || c.topicId === topic) &&
      (!subtopic || c.subtopic === subtopic),
  );
  const total = cards?.length ?? 0;
  const approved = cards?.filter((c) => c.status === "approved").length ?? 0;
  const drafts = cards?.filter((c) => c.status === "draft").length ?? 0;
  const pct = total ? Math.round((approved / total) * 100) : 0;

  async function importDeck(file: File) {
    try {
      const deck = JSON.parse(await file.text()) as Deck;
      if (!topicById.has(deck.topicId)) throw new Error(`Unknown topicId ${deck.topicId}`);
      await db.customCards.bulkPut(deck.cards.map((c) => ({ ...c, topicId: deck.topicId, status: c.status ?? "draft" }) as FlashCard));
      setMsg(`Imported ${deck.cards.length} cards into ${deck.topicId}`);
    } catch (e) {
      setMsg(`Import failed: ${(e as Error).message}`);
    }
  }

  async function exportOverrides() {
    const rows = await db.overrides.toArray();
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "card-overrides.json";
    a.click();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Review</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {drafts} draft cards waiting for review. Check facts against the textbook, edit if needed, then approve.
        </p>
      </div>

      <div className="card-surface space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-ink-soft">
            <span className="font-mono text-ink">{approved}</span> of <span className="font-mono text-ink">{total}</span> cards approved
          </p>
          <div
            role="progressbar"
            aria-label="Cards approved"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={approved}
            className="h-1 overflow-hidden rounded-full bg-well"
          >
            <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["draft", "approved", "all"] as const).map((f) => (
            <button key={f} className={filter === f ? chipOn : chipOff} onClick={() => setFilter(f)}>
              {f === "draft" ? "Waiting for review" : f === "approved" ? "Approved" : "All cards"}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-ink-soft">
            Topic
            <select
              className={field}
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setSubtopic("");
              }}
            >
              <option value="">All topics</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-soft">
            Subtopic
            <select className={field} value={subtopic} disabled={!topic} onChange={(e) => setSubtopic(e.target.value)}>
              <option value="">All subtopics</option>
              {subtopics.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filter === "draft" && list.length > 0 && (
          <button
            className="btn-ghost"
            onClick={() => confirm(`Approve all ${list.length} cards shown?`) && Promise.all(list.map((c) => patchOverride({ id: c.id, status: "approved" })))}
          >
            Approve all on this page
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-rule pt-4">
          <label className="btn-ghost cursor-pointer">
            Import deck JSON
            <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && importDeck(e.target.files[0])} />
          </label>
          <button className="btn-ghost" onClick={exportOverrides}>
            Export approvals and edits
          </button>
          {msg && (
            <span role="status" className="text-sm text-ink-soft">
              {msg}
            </span>
          )}
        </div>
      </div>

      {list.slice(0, 50).map((c) => {
        if (editing === c.id) return <Editor key={c.id} card={c} onClose={() => setEditing(null)} />;
        const subTitle = c.subtopic ? subtopicById.get(c.subtopic)?.title : undefined;
        return (
          <div key={c.id} className="space-y-2">
            {(subTitle || c.tags?.length) && (
              <div className="flex flex-wrap gap-1.5">
                {subTitle && <span className={mono}>{subTitle}</span>}
                {c.tags?.map((t) => (
                  <span key={t} className={mono}>
                    {TAG_LABEL[t]}
                  </span>
                ))}
              </div>
            )}
            <CardView card={c} revealed />
            <div className="flex flex-wrap items-center gap-2">
              {c.status !== "approved" ? (
                <button className="btn-primary" onClick={() => patchOverride({ id: c.id, status: "approved" })}>
                  Approve
                </button>
              ) : (
                <button className="btn-ghost" onClick={() => patchOverride({ id: c.id, status: "draft" })}>
                  Back to draft
                </button>
              )}
              <button className="btn-ghost" onClick={() => setEditing(c.id)}>
                Edit
              </button>
              <span className="font-mono text-[11px] text-ink-soft/70">{c.id}</span>
            </div>
          </div>
        );
      })}
      {list.length > 50 && <p className="text-sm text-ink-soft">Showing 50 of {list.length}. Filter by topic to see more.</p>}
      {cards && !list.length && <p className="text-sm text-ink-soft">No cards match these filters.</p>}
    </div>
  );
}

function Editor({ card, onClose }: { card: FlashCard; onClose: () => void }) {
  const editable = { front: card.front, back: card.back, sections: card.sections, text: card.text, refs: card.refs, pyq: card.pyq };
  const [json, setJson] = useState(JSON.stringify(editable, null, 2));
  const [err, setErr] = useState("");
  return (
    <div className="card-surface space-y-3">
      <p className="text-xs text-ink-soft">
        Edit as JSON. Add PYQ tags like <code className="font-mono">{'{"university":"RGUHS","year":2022,"marks":10}'}</code>
      </p>
      <textarea
        className="h-80 w-full rounded-xl border border-rule bg-well p-3 font-mono text-xs text-ink"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      {err && <p className="text-sm text-weak">{err}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          className="btn-primary"
          onClick={async () => {
            try {
              await patchOverride({ id: card.id, ...JSON.parse(json) });
              onClose();
            } catch (e) {
              setErr((e as Error).message);
            }
          }}
        >
          Save
        </button>
        <button className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
