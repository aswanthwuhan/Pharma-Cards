# Deck file format

One file per topic: `content/decks/<topicId>.json`. The topic id must exist in `lib/syllabus.ts`.

```json
{
  "topicId": "p1-pk-absorption",
  "source": "KDT8 ch2",
  "cards": [
    {
      "id": "p1-pk-absorption-001",
      "type": "basic",
      "front": "What is bioavailability?",
      "back": "Fraction of an administered dose that reaches systemic circulation unchanged (IV = 100%).",
      "refs": ["KDT8 ch2"],
      "pyq": [],
      "status": "draft"
    },
    {
      "id": "p1-pk-absorption-002",
      "type": "shortnote",
      "front": "Short note: P-glycoprotein",
      "sections": [
        { "h": "What", "points": ["ATP-dependent efflux transporter (ABCB1)"] },
        { "h": "Sites", "points": ["Intestine", "BBB", "Kidney", "Liver"] },
        { "h": "Clinical relevance", "points": ["Limits oral bioavailability", "Drug interactions e.g. verapamil + digoxin"] }
      ],
      "refs": ["KDT8 ch2", "Katzung16 ch4"]
    },
    {
      "id": "p1-pk-absorption-003",
      "type": "essay",
      "front": "Essay: Factors affecting drug absorption",
      "sections": [
        { "h": "Introduction", "points": ["Definition of absorption"] },
        { "h": "Drug factors", "points": ["Lipid solubility", "pKa / ionisation", "Particle size"] }
      ]
    },
    {
      "id": "p1-pk-absorption-004",
      "type": "cloze",
      "front": "Classify: routes of drug administration",
      "text": "Local routes include {{topical}} and {{deeper tissues}}; systemic routes include {{oral}}, {{sublingual}} and {{parenteral}}."
    }
  ]
}
```

## Subtopics and tags

Each topic is split into 5–8 **subtopics**, listed in syllabus order in `content/subtopics/<topicId>.json`:

```json
[
  { "id": "p2-cholinergic-op-poisoning", "title": "Organophosphate poisoning" },
  { "id": "p2-cholinergic-myasthenia", "title": "Myasthenia gravis" }
]
```

Every card has:
- `"subtopic"`: one subtopic id from its topic's list (the id starts with the topicId).
- `"tags"`: 1–3 values from this fixed list, describing the kind of question:
  `mechanism`, `classification`, `pk`, `uses`, `adr`, `interactions`, `contraindications`, `poisoning`, `newer-drugs`, `dosing`.

Rules
- `type`: `basic` (front/back), `shortnote` (5-mark structured headings), `essay` (10-mark outline, revealed one section at a time), `cloze` (each `{{...}}` is a blank).
- Write cards **in your own words**. Do not copy paragraphs, tables or figures from any textbook. Reference the source in `refs`.
- `pyq`: optional list like `{ "university": "RGUHS", "year": 2022, "marks": 10 }`.
- `status`: `draft` until the owner approves it in Admin. It defaults to `draft` if left out.
- Ids must be unique and stable: `<topicId>-NNN`.
