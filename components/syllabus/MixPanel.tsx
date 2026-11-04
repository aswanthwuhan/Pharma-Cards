"use client";

import Link from "next/link";
import { PAPERS } from "@/lib/syllabus";
import { TAGS, TAG_LABEL, type CardType, type FlashCard, type Tag } from "@/lib/types";

export const CARD_TYPES: [CardType, string][] = [
  ["basic", "Recall"],
  ["shortnote", "Short notes"],
  ["essay", "Essays"],
  ["cloze", "Fill the blanks"],
];

export const SIZES = [20, 50, 100] as const;
export type Size = (typeof SIZES)[number];
const SIZE_NOTE: Record<Size, string> = { 20: "Quick", 50: "Standard", 100: "Long" };

export interface MixState {
  topics: string[];
  types: CardType[];
  tag: Tag | null;
  pyq: boolean;
  size: Size;
}

export const EMPTY_MIX: MixState = { topics: [], types: [], tag: null, pyq: false, size: 50 };

function toggle<T>(xs: T[], x: T): T[] {
  return xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x];
}

/** Cards that match the chosen topics, types, question type and previously-asked switch. */
export function mixPool(cards: FlashCard[], mix: MixState): FlashCard[] {
  return cards.filter(
    (c) =>
      c.type !== "rapid" && // Rapid Fire has its own mode
      (!mix.topics.length || mix.topics.includes(c.topicId)) &&
      (!mix.types.length || mix.types.includes(c.type)) &&
      (!mix.tag || !!c.tags?.includes(mix.tag)) &&
      (!mix.pyq || !!c.pyq?.length),
  );
}

/** Study link for the mix. Built by hand so the commas in topic=a,b and types=x,y stay literal, as the study page expects. */
export function mixHref(mix: MixState): string {
  const parts = [`mode=random`, `n=${mix.size}`];
  if (mix.topics.length) parts.push(`topic=${mix.topics.join(",")}`);
  if (mix.types.length) parts.push(`types=${mix.types.join(",")}`);
  if (mix.tag) parts.push(`tag=${mix.tag}`);
  if (mix.pyq) parts.push("pyq=1");
  return `/study?${parts.join("&")}`;
}

/** The custom mix builder. Used in the mobile sheet and the desktop side column. */
export function MixPanel({
  cards,
  countByTopic,
  mix,
  onChange,
}: {
  cards: FlashCard[];
  countByTopic: Map<string, number>;
  mix: MixState;
  onChange: (patch: Partial<MixState>) => void;
}) {
  const pool = mixPool(cards, mix);
  const n = pool.length;
  const picked = mix.topics.length;

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="eyebrow mb-1">Topics</legend>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">{picked ? `${picked} picked` : "None picked, so all topics are used"}</p>
          {picked > 0 && (
            <button
              type="button"
              onClick={() => onChange({ topics: [] })}
              className="min-h-11 px-2 font-mono text-xs text-teal hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        {PAPERS.map((p) => {
          const topics = p.topics.filter((t) => countByTopic.get(t.id));
          if (!topics.length) return null;
          return (
            <div key={p.id} className="space-y-1.5">
              <p className="font-serif text-base leading-snug">{p.title}</p>
              <ul className="sheet divide-y divide-rule overflow-hidden">
                {topics.map((t) => (
                  <li key={t.id}>
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-teal-wash">
                      <input
                        type="checkbox"
                        className="h-5 w-5 shrink-0 accent-teal"
                        checked={mix.topics.includes(t.id)}
                        onChange={() => onChange({ topics: toggle(mix.topics, t.id) })}
                      />
                      <span className="min-w-0 flex-1">{t.title}</span>
                      <span className="font-mono text-[11px] tabular-nums text-ink-soft">{countByTopic.get(t.id)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="eyebrow mb-2">Card types</legend>
        <div className="grid grid-cols-2 gap-2">
          {CARD_TYPES.map(([k, l]) => {
            const on = mix.types.includes(k);
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ types: toggle(mix.types, k) })}
                className={`${on ? "btn-chip-on" : "btn-chip"} !min-h-11 justify-center`}
              >
                {on && <span aria-hidden>✓</span>}
                {l}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="eyebrow mb-2">Question type (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tg) => (
            <button
              key={tg}
              type="button"
              aria-pressed={mix.tag === tg}
              onClick={() => onChange({ tag: mix.tag === tg ? null : tg })}
              className={`${mix.tag === tg ? "btn-chip-on" : "btn-chip"} !min-h-11`}
            >
              {TAG_LABEL[tg]}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        role="switch"
        aria-checked={mix.pyq}
        onClick={() => onChange({ pyq: !mix.pyq })}
        className="sheet flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="block text-[15px]">Previously asked only</span>
          <span className="block text-xs text-ink-soft">Cards from past university exams</span>
        </span>
        <span
          aria-hidden
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ${mix.pyq ? "bg-teal" : "bg-unseen"}`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform duration-150 ${
              mix.pyq ? "translate-x-5 bg-on-teal" : "bg-ink-soft"
            }`}
          />
        </span>
      </button>

      <fieldset className="space-y-2">
        <legend className="eyebrow mb-2">Cards in this mix</legend>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-well p-1">
          {SIZES.map((s) => {
            const on = mix.size === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ size: s })}
                className={`flex min-h-12 flex-col items-center justify-center rounded-full transition-colors ${
                  on ? "bg-teal text-on-teal" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="font-mono text-sm font-semibold tabular-nums">{s}</span>
                <span className="text-[11px] leading-none">{SIZE_NOTE[s]}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-3 rounded-xl border border-rule bg-well p-4">
        <p className="eyebrow">Matching cards</p>
        <p className="flex items-baseline gap-2">
          <span className="font-mono text-3xl tabular-nums">{n}</span>
          <span className="text-sm text-ink-soft">{n === 1 ? "card matches" : "cards match"} these choices</span>
        </p>
        <p className="text-xs text-ink-soft">
          {n === 0
            ? "Nothing matches yet. Untick a filter to widen the mix."
            : n < mix.size
              ? `Only ${n} match, so this session will be shorter than ${mix.size}.`
              : `Your session will use ${mix.size} of them.`}
        </p>
        {n > 0 ? (
          <Link href={mixHref(mix)} className="btn-primary w-full">
            Start {Math.min(mix.size, n)} cards
          </Link>
        ) : (
          <button type="button" disabled className="btn-primary w-full">
            No cards match these choices
          </button>
        )}
      </div>
    </div>
  );
}
