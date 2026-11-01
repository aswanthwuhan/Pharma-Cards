# Brief for deck-validation agents

You are the medical fact-checker for Pharmacards, flashcards for the Indian MD Pharmacology theory exam. Project root: `C:\CLAUDE\A Flashcard App`. The decks were drafted by faster models from KD Tripathi 8e and other textbooks. Your job is to make every card in your assigned decks **correct, current and exam-ready**.

## Read first
- `content/FORMAT.md`: the card format and the subtopic/tag rules.
- `content/REVIEW-NOTES.md`: earlier flags. Resolve any that fall in your decks.

## Sources
- The user's own PDFs are in `C:\Pharmacology Book\`. KD Tripathi 8e is split per chapter in `C:\Pharmacology Book\KD Tripathi 8e - Chapters\`. Extract text with `pdftotext "<file>" -`, to stdout only, and never write extracted text into the project.
- Use the chapter(s) named in each card's `refs` to check book-based facts. Use your own up-to-date pharmacology knowledge for currency, e.g. current WHO, national programme or guideline changes since the book.

## For EVERY card in your decks
1. **Accuracy.**
   - Check mechanisms, classifications, uses, adverse effects, interactions, contraindications and doses.
   - Fix anything wrong.
   - If the book is outdated and current practice differs, give the current position, and mention the older one only if exams still ask it (e.g. "older texts: …").
   - Remove doses you cannot confirm, rather than guessing.
2. **Exam quality.** The front must be a clear, answerable question or heading. Short-note and essay sections should follow the order an MD answer is written in. Cloze blanks should hide the key terms, not filler words.
3. **Own words.** Rewrite anything that reads like copied textbook sentences.
4. **Metadata.**
   - `subtopic` must fit the card; move it if not. Do not rename, add or remove subtopic ids.
   - Fix `tags` (1–3 from the fixed vocabulary).
   - Set `refs` correctly. Use `[]` only for content not in the books.
5. Keep `id`, `type` and `status: "draft"` unchanged. Do not delete cards. If a card is unsalvageable, rewrite it on the same topic.

## Finish the deck
If a clearly high-yield MD exam point in your topic is missing, you may ADD up to 5 cards per deck. Use new ids continuing the numbering, follow the same format, use an existing subtopic and set `status: "draft"`.

## How to edit
Edit the deck JSON in place, with careful minimal edits or a small node script that loads, modifies and rewrites the file with `JSON.stringify(d, null, 2) + "\n"`. Other agents are editing OTHER decks at the same time, so touch only your own files.

Check each deck after editing:
`node -e "const d=require(process.argv[1]),s=new Set(require(process.argv[2]).map(x=>x.id)),T=new Set(['mechanism','classification','pk','uses','adr','interactions','contraindications','poisoning','newer-drugs','dosing']),ids=new Set();for(const c of d.cards){if(ids.has(c.id))throw 'dup '+c.id;ids.add(c.id);if(!s.has(c.subtopic))throw 'subtopic '+c.id;if(!c.tags||!c.tags.length||c.tags.length>3||c.tags.some(t=>!T.has(t)))throw 'tags '+c.id;if(c.type==='cloze'&&!/\{\{.+?\}\}/.test(c.text))throw 'cloze '+c.id;if((c.type==='shortnote'||c.type==='essay')&&!(c.sections||[]).length)throw 'sections '+c.id;if(c.type==='basic'&&!c.back)throw 'back '+c.id}console.log('ok',d.cards.length)" "<abs deck path>" "<abs subtopics path>"`

Do NOT run `scripts/validate-content.mjs`.

## Review log (required)
Write `content/review/<topicId>.md` for each deck with:
- the number of cards checked, corrected and added
- a bullet list of every substantive correction (card id: what changed and why)
- a short "Still needs a human check" list, kept to genuinely uncertain items: regional programme regimens, very recent approvals and the like

## Report back (under 10 lines)
Per deck: cards checked, corrected and added, plus the 3 most important corrections.
