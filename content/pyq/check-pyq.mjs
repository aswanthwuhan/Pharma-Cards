// Checks content/decks/*.json: every card's pyq entries are well formed, and every deck parses.
// Run: node content/pyq/check-pyq.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const decksDir = join(dirname(fileURLToPath(import.meta.url)), "..", "decks");
const errors = [];
let decks = 0, tagged = 0;

for (const f of readdirSync(decksDir).filter((n) => n.endsWith(".json"))) {
  let deck;
  try {
    deck = JSON.parse(readFileSync(join(decksDir, f), "utf8"));
    decks++;
  } catch (e) {
    errors.push(`${f}: does not parse (${e.message})`);
    continue;
  }
  for (const card of deck.cards ?? []) {
    if (card.pyq === undefined) continue;
    if (!Array.isArray(card.pyq)) {
      errors.push(`${f} ${card.id}: pyq is not an array`);
      continue;
    }
    card.pyq.forEach((t, i) => {
      const where = `${f} ${card.id} pyq[${i}]`;
      if (typeof t.university !== "string") errors.push(`${where}: university must be a string`);
      if (typeof t.year !== "number") errors.push(`${where}: year must be a number`);
      if (t.marks !== undefined && typeof t.marks !== "number") errors.push(`${where}: marks must be a number when present`);
      tagged++;
    });
  }
}

console.log(`decks parsed: ${decks}, pyq entries checked: ${tagged}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("OK");
