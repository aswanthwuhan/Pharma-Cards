"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";

/**
 * WAI-ARIA radiogroup keys: arrows step (wrapping), Home/End jump. Calls select(i) and
 * returns the new index so the caller can move focus; returns null for other keys.
 */
export function radioKeyNav(
  e: { key: string; preventDefault: () => void },
  index: number,
  count: number,
  select: (i: number) => void,
): number | null {
  let next: number | null = null;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % count;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + count) % count;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = count - 1;
  if (next === null) return null;
  e.preventDefault();
  select(next);
  return next;
}

/** A settings group: mono eyebrow heading, then rows separated by hairlines. */
export function Panel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="sheet px-5">
      <h2 id={id} className="eyebrow pt-5 pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** One setting: label and one-line description on the left, control on the right. */
export function Row({ title, description, control }: { title: string; description: string; control: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-rule py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-ink">{title}</p>
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">{control}</div>
    </div>
  );
}

/** Real switch: 44px hit area around a 48x28 track. */
export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 min-w-14 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-150 ${
          checked ? "border-teal bg-teal" : "border-rule bg-well"
        }`}
      >
        <span
          className={`absolute left-[3px] size-5 rounded-full transition-transform duration-150 ${
            checked ? "translate-x-5 bg-on-teal" : "translate-x-0 bg-ink-soft"
          }`}
          style={{ transitionTimingFunction: "var(--ease-out)" }}
        />
      </span>
    </button>
  );
}

/** Two or more mutually exclusive options, shown as a pill group. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  // Roving tabindex: only the selected option is in the Tab order (first one if none matches).
  const anyOn = options.some((o) => o.value === value);
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-rule bg-well p-1">
      {options.map((o, idx) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={disabled}
            tabIndex={on || (!anyOn && idx === 0) ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              const n = radioKeyNav(e, idx, options.length, (i) => onChange(options[i].value));
              if (n !== null) refs.current[n]?.focus();
            }}
            className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors duration-150 disabled:opacity-40 ${
              on ? "bg-teal text-on-teal" : "text-ink-soft hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Input that keeps what the user is typing locally and only saves valid values.
 * Stops half-typed values (an empty number box, a partial date) from reaching the database.
 */
export function DraftInput({
  value,
  valid,
  onCommit,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  valid?: (s: string) => boolean;
  onCommit: (s: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <input
      {...rest}
      value={draft}
      onChange={(e) => {
        const s = e.target.value;
        setDraft(s);
        if (!valid || valid(s)) onCommit(s);
      }}
      onBlur={() => setDraft(value)}
    />
  );
}
