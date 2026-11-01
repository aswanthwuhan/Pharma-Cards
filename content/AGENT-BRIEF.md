# Brief for deck-drafting agents

You are writing ONE flashcard deck for Pharmacards, an MD Pharmacology (India) theory-exam app. Project root: `C:\CLAUDE\A Flashcard App`.

## Read first
1. `content/FORMAT.md`: the exact JSON format, plus the "Subtopics and tags" rules.
2. One finished example: `content/decks/p2-cholinergic.json` and its `content/subtopics/p2-cholinergic.json`.

## Sources
The user's own PDFs are in `C:\Pharmacology Book\`. KD Tripathi 8e is split per chapter in `C:\Pharmacology Book\KD Tripathi 8e - Chapters\`.
- The Read tool cannot render PDFs here. Extract text with `pdftotext "<file>" -`, to stdout only.
- For the big single-file books (Goodman & Gilman 14e, Katzung, Rang & Dale), extract just a page range: `pdftotext -f <first> -l <last> "<file>" -`. Find the pages with a quick `pdftotext ... - | grep -n` over the contents pages first.
- Never write extracted text into the project folder.

## What to produce (two files only)
1. `content/subtopics/<topicId>.json`: 5–8 subtopics in teaching order, ids `<topicId>-<short-kebab>`, aiming for at least 3 cards each.
2. `content/decks/<topicId>.json`: the cards.
   - Ids are `<topicId>-001`, `-002`…, numbered chapter by chapter.
   - Every card has `"status": "draft"`, a `subtopic` from your list, 1–3 `tags` from the fixed vocabulary in FORMAT.md, and `refs` (e.g. `"KDT8 ch52"`). Use `"refs": []` only for content not in the supplied books.

**Mix per chapter:** about 50% `basic`, 20% `shortnote` (5-mark skeletons), 10% `essay` (10-mark outlines with 5–7 sections) and 20% `cloze` (classifications/lists). Unless told otherwise, write about 20 cards per chapter. Focus on the high-yield topics that MD theory papers ask.

## Hard rules
- **Own words only.** Write concise exam-style points. Never copy sentences, tables or figures; the app is public.
- **Accuracy over coverage.** If extracted text is garbled or you are unsure of a fact or dose, leave it out.
- **No book wording for brands.** Use generic names only.
- **Do not run `scripts/validate-content.mjs`**, because other agents are writing decks at the same time. Check only your own files:
  `node -e "const d=require(process.argv[1]),s=new Set(require(process.argv[2]).map(x=>x.id)),T=new Set(['mechanism','classification','pk','uses','adr','interactions','contraindications','poisoning','newer-drugs','dosing']),ids=new Set();for(const c of d.cards){if(ids.has(c.id))throw 'dup '+c.id;ids.add(c.id);if(!s.has(c.subtopic))throw 'subtopic '+c.id;if(!c.tags||!c.tags.length||c.tags.length>3||c.tags.some(t=>!T.has(t)))throw 'tags '+c.id;if(c.type==='cloze'&&!/\{\{.+?\}\}/.test(c.text))throw 'cloze '+c.id;if((c.type==='shortnote'||c.type==='essay')&&!(c.sections||[]).length)throw 'sections '+c.id;if(c.type==='basic'&&!c.back)throw 'back '+c.id}console.log('ok',d.cards.length)" "<abs path to deck>" "<abs path to subtopics>"`
- Create ONLY your two files.

## Report back (under 12 lines)
Card count by type, your subtopic list with card counts, and any facts the owner should verify (doses, contradictions in the source, anything taken from outside the books).
