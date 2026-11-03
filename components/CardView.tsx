"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { useReduceMotion, useSettings } from "@/lib/settings";
import { EssayLadder, EssayRail } from "./EssayCard";
import { subtopicById, topicById } from "@/lib/syllabus";
import type { FlashCard, Section } from "@/lib/types";

// Each card type has its own colour and name, like the strip on a drug label.
export const CARD_TYPE: Record<string, { label: string; color: string }> = {
  basic: { label: "Recall", color: "#1f7a5c" },
  shortnote: { label: "Short note, 5 marks", color: "#4c5bd4" },
  essay: { label: "Long essay · 10 marks", color: "#a63d73" },
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
  const { essayStyle } = useSettings();
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
            essayStyle === "rail" ? (
              <EssayRail key={card.id} sections={card.sections ?? []} />
            ) : (
              <EssayLadder key={card.id} cardId={card.id} sections={card.sections ?? []} />
            )
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
