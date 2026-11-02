// Validates content/decks/*.json and content/subtopics/*.json, then bundles
// them into content/all.json and content/subtopics.json, which the app imports.
// Runs automatically before dev/build/test.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "content");
const deckDir = join(root, "decks");
const subDir = join(root, "subtopics");
for (const d of [deckDir, subDir]) if (!existsSync(d)) mkdirSync(d, { recursive: true });

const TYPES = new Set(["basic", "shortnote", "essay", "cloze"]);
const TAGS = new Set([
  "mechanism", "classification", "pk", "uses", "adr",
  "interactions", "contraindications", "poisoning", "newer-drugs", "dosing",
]);
const STATUSES = new Set(["draft", "approved"]);
const blank = (v) => typeof v !== "string" || !v.trim();
// Topic ids the app knows (lib/syllabus.ts is TS, so read the ids from its tuple rows).
const TOPIC_IDS = new Set(
  [...readFileSync(join(process.cwd(), "lib", "syllabus.ts"), "utf8").matchAll(/^\s*\["([a-z0-9-]+)",/gm)].map((m) => m[1]),
);
const errors = [];

/** Checks shared by study and rapid cards. */
function commonErrors(c, where) {
  const out = [];
  if (typeof c.id === "string" && c.id.includes("~")) out.push(`${where}: id must not contain ~ (reserved for reversed rapid cards)`);
  if (c.status !== undefined && !STATUSES.has(c.status)) out.push(`${where}: bad status ${c.status}`);
  if (c.refs !== undefined && (!Array.isArray(c.refs) || !c.refs.length || c.refs.some(blank))) out.push(`${where}: refs must be non-empty strings`);
  if (c.pyq !== undefined) {
    if (!Array.isArray(c.pyq)) out.push(`${where}: pyq must be an array`);
    else
      for (const q of c.pyq)
        if (blank(q?.university) || typeof q.year !== "number" || (q.marks !== undefined && typeof q.marks !== "number"))
          out.push(`${where}: pyq needs string university, number year, optional number marks`);
  }
  return out;
}
const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${file}: invalid JSON (${e.message})`);
    return null;
  }
};

// Subtopic lists, one file per topic.
const subtopics = {};
for (const file of readdirSync(subDir).filter((f) => f.endsWith(".json")).sort()) {
  const topicId = file.replace(/\.json$/, "");
  const list = readJson(join(subDir, file));
  if (!Array.isArray(list)) continue;
  const seen = new Set();
  for (const s of list) {
    if (!s.id?.startsWith(topicId + "-")) errors.push(`subtopics/${file}: id ${s.id} must start with ${topicId}-`);
    if (!s.title) errors.push(`subtopics/${file}: ${s.id} needs a title`);
    if (seen.has(s.id)) errors.push(`subtopics/${file}: duplicate ${s.id}`);
    seen.add(s.id);
  }
  subtopics[topicId] = list.map(({ id, title }) => ({ id, title }));
}

const ids = new Set();
const cards = [];
for (const file of readdirSync(deckDir).filter((f) => f.endsWith(".json")).sort()) {
  const deck = readJson(join(deckDir, file));
  if (!deck) continue;
  if (!deck.topicId) errors.push(`${file}: missing topicId`);
  else if (!TOPIC_IDS.has(deck.topicId)) errors.push(`${file}: topic ${deck.topicId} not in lib/syllabus.ts`);
  const subIds = new Set((subtopics[deck.topicId] ?? []).map((s) => s.id));
  if (!subIds.size) errors.push(`${file}: no content/subtopics/${deck.topicId}.json`);
  for (const c of deck.cards ?? []) {
    const where = `${file}:${c.id ?? "?"}`;
    if (!c.id) errors.push(`${where}: missing id`);
    else if (ids.has(c.id)) errors.push(`${where}: duplicate id`);
    ids.add(c.id);
    if (!TYPES.has(c.type)) errors.push(`${where}: bad type ${c.type}`);
    if (blank(c.front)) errors.push(`${where}: missing front`);
    if (c.type === "basic" && blank(c.back)) errors.push(`${where}: basic needs back`);
    if ((c.type === "shortnote" || c.type === "essay") && !c.sections?.length)
      errors.push(`${where}: ${c.type} needs sections`);
    for (const sec of c.sections ?? []) if (!Array.isArray(sec?.points)) errors.push(`${where}: section "${sec?.h}" needs a points array`);
    errors.push(...commonErrors(c, where));
    if (c.type === "cloze" && !/\{\{.+?\}\}/.test(c.text ?? "")) errors.push(`${where}: cloze needs {{blanks}}`);
    if (subIds.size && !subIds.has(c.subtopic)) errors.push(`${where}: unknown subtopic ${c.subtopic}`);
    if (!Array.isArray(c.tags) || !c.tags.length || c.tags.length > 3) errors.push(`${where}: needs 1-3 tags`);
    for (const t of c.tags ?? []) if (!TAGS.has(t)) errors.push(`${where}: unknown tag ${t}`);
    cards.push({ ...c, topicId: deck.topicId, status: c.status ?? "draft" });
  }
}

// Rapid Fire decks: short reversible q/a pairs, studied only in Rapid Fire mode.
const rapidDir = join(root, "rapid");
if (!existsSync(rapidDir)) mkdirSync(rapidDir, { recursive: true });
let rapidCount = 0;
for (const file of readdirSync(rapidDir).filter((f) => f.endsWith(".json")).sort()) {
  const deck = readJson(join(rapidDir, file));
  if (!deck) continue;
  const subIds = new Set((subtopics[deck.topicId] ?? []).map((s) => s.id));
  if (!subIds.size) errors.push(`rapid/${file}: unknown topic ${deck.topicId}`);
  if (!TOPIC_IDS.has(deck.topicId)) errors.push(`rapid/${file}: topic ${deck.topicId} not in lib/syllabus.ts`);
  const seenQ = new Map();
  for (const c of deck.cards ?? []) {
    const where = `rapid/${file}:${c.id ?? "?"}`;
    if (!c.id?.startsWith(`rf-${deck.topicId}-`)) errors.push(`${where}: id must start with rf-${deck.topicId}-`);
    else if (ids.has(c.id)) errors.push(`${where}: duplicate id`);
    ids.add(c.id);
    if (blank(c.q) || blank(c.a)) errors.push(`${where}: needs q and a`);
    else {
      const q = c.q.trim().toLowerCase().replace(/[:\s]+/g, " ");
      if (q === c.a.trim().toLowerCase()) errors.push(`${where}: q and a are the same`);
      if (seenQ.has(q)) errors.push(`${where}: same q as ${seenQ.get(q)}`);
      else seenQ.set(q, c.id);
      // A class card is a list; with one item it renders as a single chip and reverses badly.
      if (c.kind === "class" && c.a.replace(/\([^)]*\)/g, "").split(/\s*;\s*|,\s*|\s+and\s+|\s+or\s+/).filter((s) => s.trim()).length < 2)
        errors.push(`${where}: class card needs at least 2 items (or kind "fact")`);
    }
    errors.push(...commonErrors(c, where));
    if (!subIds.has(c.subtopic)) errors.push(`${where}: unknown subtopic ${c.subtopic}`);
    if (!Array.isArray(c.refs) || !c.refs.length) errors.push(`${where}: refs required`);
    for (const t of c.tags ?? []) if (!TAGS.has(t)) errors.push(`${where}: unknown tag ${t}`);
    cards.push({
      id: c.id,
      topicId: deck.topicId,
      subtopic: c.subtopic,
      type: "rapid",
      front: c.q,
      back: c.a,
      kind: c.kind ?? "fact",
      tags: c.tags?.length ? c.tags : [c.kind === "class" ? "classification" : "uses"],
      refs: c.refs,
      status: c.status ?? "draft",
    });
    rapidCount++;
  }
}

if (errors.length) {
  console.error(`Content errors (${errors.length}):\n` + errors.slice(0, 50).map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
writeFileSync(join(root, "all.json"), JSON.stringify(cards));
writeFileSync(join(root, "subtopics.json"), JSON.stringify(subtopics));
console.log(`content: ${cards.length - rapidCount} study cards + ${rapidCount} rapid-fire cards, ${Object.values(subtopics).flat().length} subtopics bundled`);
