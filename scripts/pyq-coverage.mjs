// Past-question coverage: for every distinct question in content/pyq/questions.json, find the study card
// whose text shares the most keywords with it. A question is "covered" when that card holds at least
// COVER of the question's keywords. Prints a summary; with --json writes the uncovered list to stdout.
// Run: node scripts/pyq-coverage.mjs [--json]
import { readFileSync } from "node:fs";
import { join } from "node:path";

const COVER = 0.6;
const root = join(process.cwd(), "content");
const STOP = new Set(
  ("about above after again against also among and any are because been before being below between both but " +
    "can could did does doing done each few for from further had has have having her here hers him his how into " +
    "its itself just more most must not now off once only other our out over own same she should some such than " +
    "that the their them then there these they this those through too under until upon very was were what when " +
    "where which while who whom why will with would you your write short note notes describe discuss explain " +
    "define enumerate mention outline give list role brief account detail details briefly various types basis " +
    "principle principles uses use used drug drugs agents agent management treatment clinical significance " +
    "comment marks pharmacology classify classification mechanism action actions adverse effects effect").split(" "),
);
const words = (s) =>
  new Set(
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length >= 4 && !STOP.has(w))
      .map((w) => w.replace(/(ies|es|s)$/, "")),
  );

const all = JSON.parse(readFileSync(join(root, "all.json"), "utf8")).filter((c) => c.type !== "rapid");
const cards = all.map((c) => ({
  id: c.id,
  topicId: c.topicId,
  w: words([c.front, c.back, c.text, ...(c.sections ?? []).flatMap((s) => [s.h, ...s.points])].join(" ")),
}));

// Question papers are full of misspellings ("Fluroquinolones", "Pharmacovigilence"): map each question word
// to the closest card word (same first 3 letters, edit distance <= 2) before matching.
const vocab = new Set(cards.flatMap((c) => [...c.w]));
const byPrefix = new Map();
for (const v of vocab) byPrefix.set(v.slice(0, 3), [...(byPrefix.get(v.slice(0, 3)) ?? []), v]);
function dist(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const fixCache = new Map();
function fix(w) {
  if (vocab.has(w)) return w;
  if (!fixCache.has(w)) {
    let best = w, bd = 3;
    for (const v of byPrefix.get(w.slice(0, 3)) ?? []) {
      const dd = dist(w, v);
      if (dd < bd) [best, bd] = [v, dd];
    }
    fixCache.set(w, best);
  }
  return fixCache.get(w);
}

const qs = JSON.parse(readFileSync(join(root, "pyq", "questions.json"), "utf8"));
const distinct = new Map();
for (const q of qs) {
  const k = q.q.trim().toLowerCase().replace(/\s+/g, " ");
  const e = distinct.get(k) ?? { q: q.q.trim(), papers: 0 };
  e.papers++;
  distinct.set(k, e);
}

const uncovered = [];
let covered = 0;
for (const e of distinct.values()) {
  const qw = [...new Set([...words(e.q)].map(fix))];
  if (!qw.length) continue;
  let best = null;
  let bestScore = -1;
  for (const c of cards) {
    const hit = qw.filter((w) => c.w.has(w)).length / qw.length;
    if (hit > bestScore) [best, bestScore] = [c, hit];
  }
  if (bestScore >= COVER) covered++;
  else uncovered.push({ q: e.q, papers: e.papers, score: Math.round(bestScore * 100) / 100, nearestTopic: best?.topicId, nearestCard: best?.id });
}

const total = covered + uncovered.length;
if (process.argv.includes("--json")) console.log(JSON.stringify(uncovered.sort((a, b) => b.papers - a.papers || a.score - b.score)));
else {
  console.log(`distinct questions: ${total}, covered: ${covered} (${Math.round((covered / total) * 100)}%), uncovered: ${uncovered.length}`);
  const byTopic = {};
  for (const u of uncovered) byTopic[u.nearestTopic] = (byTopic[u.nearestTopic] ?? 0) + 1;
  console.log(Object.entries(byTopic).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join("\n"));
}
