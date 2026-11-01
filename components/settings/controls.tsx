"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";

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
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 min-w-14 shrink-0 items-center justify-center rounded-full"
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
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full border border-rule bg-well p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors duration-150 ${
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
