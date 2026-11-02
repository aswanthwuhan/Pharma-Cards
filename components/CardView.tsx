"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { useReduceMotion } from "@/lib/settings";
import { subtopicById, topicById } from "@/lib/syllabus";
import type { FlashCard, Section } from "@/lib/types";

// Each card type has its own colour and name, like the strip on a drug label.
export const CARD_TYPE: Record<string, { label: string; color: string }> = {
  basic: { label: "Recall", color: "#1f7a5c" },
  shortnote: { label: "Short note, 5 marks", color: "#4c5bd4" },
  essay: { label: "Long essay, 10 marks", color: "#a63d73" },
  cloze: { label: "Fill the blanks", color: "#8a5a12" },
};

/**
 * Renders any of the 4 card types on the porcelain study surface.
 * `bare` drops the porcelain slab, for when a parent (the swipe deck) provides it.
 */
export function CardView({
  card,
  revealed,
  bare = false,
  aside,
  history,
}: {
  card: FlashCard;
  revealed: boolean;
  bare?: boolean;
  aside?: React.ReactNode; // top-right slot, e.g. the study timer
  history?: string; // e.g. "Reviewed 3 times, last: Good", shown after reveal
}) {
  const t = CARD_TYPE[card.type] ?? CARD_TYPE.basic;
  const sub = card.subtopic ? subtopicById.get(card.subtopic)?.title : undefined;
  const body = (
    <div className="px-5 pt-5 pb-6 sm:px-7 sm:pt-6">
      <div className="flex flex-wrap items-center gap-2">
        {aside && <span className="order-last ml-auto">{aside}</span>}
        <span className="rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold text-porcelain" style={{ background: t.color }}>
          {t.label}
        </span>
        {card.pyq?.map((p, i) => (
          <span key={i} className="rounded-full bg-porcelain-ink px-2 py-0.5 font-mono text-[11px] text-porcelain">
            {p.university} {p.year}
            {p.marks ? ` [${p.marks}M]` : ""}
          </span>
        ))}
        {card.status === "draft" && (
          <span className="rounded-full border border-porcelain-rule px-2 py-0.5 font-mono text-[11px] text-porcelain-soft">Unreviewed draft</span>
        )}
      </div>
      <p className="mt-3 font-mono text-[11px] tracking-wide text-porcelain-soft uppercase">
        {topicById.get(card.topicId)?.title}
        {sub ? ` / ${sub}` : ""}
      </p>

      <h2 className="mt-2 font-serif text-[1.65rem] leading-[1.25] sm:text-3xl">{card.front}</h2>

      {card.type === "cloze" ? (
        <Cloze text={card.text ?? ""} revealed={revealed} />
      ) : revealed ? (
        <Reveal className="mt-5 border-t border-porcelain-rule pt-5">
          {card.type === "basic" ? (
            <p className="whitespace-pre-line text-[17px] leading-relaxed">{card.back}</p>
          ) : card.type === "essay" ? (
            <EssayOutline key={card.id} sections={card.sections ?? []} />
          ) : (
            <Sections sections={card.sections ?? []} />
          )}
        </Reveal>
      ) : null}

      {revealed && (card.refs?.length || history) ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-porcelain-rule pt-3 font-mono text-[11px] text-porcelain-soft">
          <span>{card.refs?.length ? `Source: ${card.refs.join(", ")}` : ""}</span>
          {history && <span>{history}</span>}
        </div>
      ) : null}
    </div>
  );
  if (bare) return body;
  return <article className="porcelain overflow-hidden">{body}</article>;
}

/** The answer block slides up on a spring when revealed (opacity and transform only). */
function Reveal({ className, children }: { className: string; children: React.ReactNode }) {
  const reduce = useReduceMotion();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 400, damping: 32 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <section key={i} className="rounded-lg bg-porcelain-2/70 px-4 py-3">
          <h3 className="font-mono text-xs font-semibold tracking-wide text-[#1f5c48] uppercase">{s.h}</h3>
          <ul className="mt-1.5 ml-4 list-disc space-y-1 text-[16px] leading-snug marker:text-porcelain-soft">
            {s.points.map((p, j) => (
              <li key={j}>{p}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Essay answers as a heading ladder: every heading is a mini flashcard. Recall its points, tap to open,
 * then mark it recalled or missed; the tally at the bottom guides the grade for the whole card.
 */
function EssayOutline({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const [marks, setMarks] = useState<Record<number, boolean>>({});
  const recalled = Object.values(marks).filter(Boolean).length;
  const marked = Object.keys(marks).length;
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation(); // a tap here must not flip the card
    fn();
  };
  return (
    <div className="space-y-2">
      {sections.map((s, i) => {
        const isOpen = open.has(i);
        const mark = marks[i];
        return (
          <section key={i} className="overflow-hidden rounded-lg border border-porcelain-rule bg-porcelain-2/60">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={stop(() => setOpen((o) => new Set(o).add(i)))}
              className="flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left"
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-porcelain-rule"
                style={{ background: mark === undefined ? "transparent" : mark ? "var(--color-strong)" : "var(--color-weak)" }}
              />
              <span className="flex-1 font-mono text-xs font-semibold tracking-wide text-[#1f5c48] uppercase">{s.h}</span>
              {!isOpen && <span className="rounded-full bg-[#d9efe4] px-2 py-0.5 font-mono text-[10px] text-[#1f5c48]">recall, then tap</span>}
            </button>
            {isOpen && (
              <div className="px-4 pb-3">
                <ul className="ml-4 list-disc space-y-1 text-[16px] leading-snug marker:text-porcelain-soft">
                  {s.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  {([true, false] as const).map((ok) => (
                    <button
                      key={String(ok)}
                      type="button"
                      aria-pressed={mark === ok}
                      onClick={stop(() => setMarks((m) => ({ ...m, [i]: ok })))}
                      className="min-h-9 flex-1 rounded-full border px-3 font-mono text-xs"
                      style={{
                        borderColor: ok ? "var(--color-strong)" : "var(--color-weak)",
                        background: mark === ok ? `color-mix(in srgb, ${ok ? "var(--color-strong)" : "var(--color-weak)"} 18%, transparent)` : "transparent",
                      }}
                    >
                      {ok ? "✓ Recalled" : "✗ Missed"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
      <p className="pt-1 text-center font-mono text-[11px] text-porcelain-soft">
        {marked ? `Recalled ${recalled} of ${sections.length} headings` : `${sections.length} headings · open each after recalling it`}
      </p>
    </div>
  );
}

function Cloze({ text, revealed }: { text: string; revealed: boolean }) {
  const parts = text.split(/(\{\{.+?\}\})/g);
  return (
    <p className="mt-5 text-[17px] leading-9">
      {parts.map((p, i) => {
        const m = p.match(/^\{\{(.+?)\}\}$/);
        if (!m) return <span key={i}>{p}</span>;
        return revealed ? (
          <mark key={i} className="rounded bg-[#d6efe3] px-1 font-semibold text-[#14523f]">
            {m[1]}
          </mark>
        ) : (
          <span key={i} className="mx-0.5 inline-block w-20 translate-y-1 border-b-2 border-dotted border-porcelain-soft" aria-label="blank" />
        );
      })}
    </p>
  );
}
