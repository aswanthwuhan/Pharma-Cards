# Rapid Fire deck format

One file per topic: `content/rapid/<topicId>.json`. These are short, reversible recall pairs meant to cover EVERY fact in the chapter. They are studied in Rapid Fire mode only.

```json
{
  "topicId": "p2-cholinergic",
  "cards": [
    { "id": "rf-p2-cholinergic-0001", "subtopic": "p2-cholinergic-anticholinesterases", "kind": "fact",
      "q": "Drug that reactivates phosphorylated cholinesterase", "a": "Pralidoxime", "refs": ["KDT8 ch7"] },
    { "id": "rf-p2-cholinergic-0002", "subtopic": "p2-cholinergic-anticholinesterases", "kind": "class",
      "q": "Reversible carbamate anticholinesterases: list all", "a": "Physostigmine, neostigmine, pyridostigmine, edrophonium, rivastigmine, donepezil, galantamine",
      "refs": ["KDT8 ch7"] }
  ]
}
```

## Rules
- **`q` and `a` are both SHORT** (`a` ideally at most 15 words) and must make sense BOTH ways round. In Reverse mode, `a` is shown as the prompt and `q` becomes the answer. So write `q` as a name or description, never as "What is…?". For example:
  - `"q": "Drug of choice for absence seizures"`, `"a": "Ethosuximide (or valproate)"`
  - Reversed, that reads: "Ethosuximide (or valproate)" → "Drug of choice for absence seizures".
- **`kind: "class"` cards list EVERY drug the book lists in that class**, comma-separated, in the book's order. One card per class or subclass.
- **Coverage.** Turn every fact in the chapter into a card: classifications, mechanisms, drugs of choice, adverse effects, contraindications, interactions, pharmacokinetic facts, antidotes, notable numbers. Expect roughly 60–200 cards per chapter.
- **Grounding** (see `content/GROUNDING-RULES.md`): every pair must come from the owner's books, and `refs` is mandatory and precise. No general knowledge or training data.
  - If something in the book looks WRONG, you may cross-check it on the web.
  - If the web confirms an error, write the card from whichever of the owner's OTHER books has the correct fact, cited. If none of them has it, leave the card out.
  - Log every such case in `content/review/rapid-<topicId>.md`.
- `subtopic` must be an id from `content/subtopics/<topicId>.json`.
- Ids are `rf-<topicId>-NNNN`, unique and stable.
- Optional `tags`: 1–3 from mechanism, classification, pk, uses, adr, interactions, contraindications, poisoning, newer-drugs, dosing.
