"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { CardView } from "@/components/CardView";
import { db } from "@/lib/db";
import { useAllCards } from "@/lib/store";
import { TOPICS } from "@/lib/syllabus";
import type { FlashCard } from "@/lib/types";

export default function Saved() {
  const cards = useAllCards();
  const bookmarks = useLiveQuery(() => db.bookmarks.orderBy("at").reverse().toArray(), []);
  const notes = useLiveQuery(() => db.notes.toArray(), []);
  const byId = new Map(cards?.map((c) => [c.id, c]));
  const noteBy = new Map(notes?.map((n) => [n.cardId, n.text]));
  const marked = new Set((bookmarks ?? []).map((b) => b.cardId));
  const ids = [...new Set([...(bookmarks ?? []).map((b) => b.cardId), ...(notes ?? []).map((n) => n.cardId)])];

  // Group by syllabus topic, in syllabus order.
  const groups = TOPICS.map((t) => ({
    topic: t,
    cards: ids.map((id) => byId.get(id)).filter((c): c is FlashCard => !!c && c.topicId === t.id),
  })).filter((g) => g.cards.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Saved</h1>
          {!!bookmarks?.length && <p className="eyebrow mt-1">{bookmarks.length} saved</p>}
        </div>
        {!!bookmarks?.length && (
          <Link href="/study?mode=bookmarks" className="btn-primary">
            Study saved cards
          </Link>
        )}
      </div>

      {bookmarks !== undefined && cards !== undefined && !groups.length && (
        <div className="sheet p-6 text-center">
          <h2 className="font-serif text-xl font-semibold">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-ink-soft">
            While you study, tap "Save" on any card to keep it here. Add a note to remember why it mattered.
          </p>
          <Link href="/study?mode=daily" className="btn-ghost mt-5">
            Start today&apos;s cards
          </Link>
        </div>
      )}

      {groups.map(({ topic, cards: list }) => (
        <section key={topic.id} className="space-y-4">
          <h2 className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2 text-sm font-semibold text-ink-soft">
            <span>{topic.title}</span>
            <span className="font-mono text-xs">{list.length} saved</span>
          </h2>

          {list.map((c) => {
            const note = noteBy.get(c.id);
            return (
              <div key={c.id} className="space-y-3">
                <CardView card={c} revealed />

                {note && (
                  <div className="sheet relative overflow-hidden px-5 py-4">
                    <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-moderate" />
                    <p className="eyebrow text-moderate">Your note</p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{note}</p>
                  </div>
                )}

                {marked.has(c.id) && (
                  <div className="flex justify-end">
                    <button
                      className="btn-ghost"
                      onClick={() => db.bookmarks.delete(c.id)}
                      aria-label={`Remove "${c.front}" from saved`}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
