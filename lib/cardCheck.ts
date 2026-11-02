import type { FlashCard } from "./types";

const blank = (v: unknown) => typeof v !== "string" || !v.trim();

/**
 * Why a card cannot be rendered, or null if it is fine. Browser copy of the card checks in
 * scripts/validate-content.mjs (that script uses node:fs, so it cannot be bundled).
 */
export function cardError(c: Partial<FlashCard>): string | null {
  if (blank(c.id)) return "missing id";
  if (c.id!.includes("~")) return "id must not contain ~";
  if (!["basic", "shortnote", "essay", "cloze", "rapid"].includes(c.type as string)) return `bad type ${c.type}`;
  if (blank(c.front)) return "missing front";
  if ((c.type === "basic" || c.type === "rapid") && blank(c.back)) return `${c.type} needs back`;
  if ((c.type === "shortnote" || c.type === "essay") && !c.sections?.length) return `${c.type} needs sections`;
  if (c.sections !== undefined && (!Array.isArray(c.sections) || c.sections.some((s) => !Array.isArray(s?.points))))
    return "every section needs a points array";
  if (c.type === "cloze" && !/\{\{.+?\}\}/.test(c.text ?? "")) return "cloze needs {{blanks}}";
  if (c.status !== undefined && c.status !== "draft" && c.status !== "approved") return `bad status ${c.status}`;
  if (c.refs !== undefined && (!Array.isArray(c.refs) || !c.refs.length || c.refs.some(blank))) return "refs must be non-empty strings";
  if (c.pyq !== undefined && (!Array.isArray(c.pyq) || c.pyq.some((q) => blank(q?.university) || typeof q.year !== "number" || (q.marks !== undefined && typeof q.marks !== "number"))))
    return "bad pyq";
  return null;
}
