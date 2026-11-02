# Brief: expand a Paper II topic (study + Rapid Fire)

Project `C:\CLAUDE\A Flashcard App`. Rules: `content/GROUNDING-RULES.md`, formats: `content/FORMAT.md`, `content/RAPID-FORMAT.md`.
**Never** use PrepLadder sources (Prep, Prep Xi, Rapid Revision, RR5, RapidRev). Never `git add`/commit. Own temp folder, delete at end.

## Sources
- Topic chapters: `refs` of the topic in `lib/syllabus.ts`; KDT8 chapter PDFs in `C:\Pharmacology Book\KD Tripathi 8e - Chapters\`.
- Full-text search across 20 allowed books: `python C:\Users\albit\pharm-tools\search.py "<query>"` (book + PDF page + snippet; PDF paths in `C:\Users\albit\pharm-index\books.json`; read pages with `pdftotext -f N -l N`). Prefer KDT8, GG14, Katzung16, Rang & Dale 9, Satoskar, Golan, Padmaja; Harrison 21 / Davidson 24 for therapeutics.
- Exam priority: questions for this topic in `content/pyq/questions.json` (match on topic keywords).

## Steps per topic
1. Read the existing study deck `content/decks/<id>.json` and rapid deck `content/rapid/<id>.json`; list what is already covered (fronts / q's).
2. Walk the source chapter section by section. List every drug class, drug, mechanism, PK point, use, ADR, contraindication, interaction, drug of choice, antidote, newer drug and therapeutic regimen not yet carded.
3. **Study cards (target +30 to +40 per topic):** mix of `shortnote` (5-mark: 4-6 headed sections), `essay` (10-mark outline, for frequent PYQ topics), `basic`, `cloze`. Own words, precise refs (`"KDT8 ch40"`, `"GG14 PDF p638"`, `"Satoskar PDF p210"`). Add `pyq` tags where a stored question matches. 1-3 vocab tags, valid subtopic from `content/subtopics/<id>.json` (add a subtopic only if truly needed), `status: "draft"`, ids continue after the deck's highest.
4. **Rapid cards (target +120 to +180 per topic):** short reversible q/a facts not already in the rapid deck (grep first). Class cards (`kind: "class"`) list every member in book order and need 2+ items; no duplicate `q` in a deck; `q !== a`; refs copied from the source. Ids continue after the highest.
5. Append a section "Expansion pass" to `content/review/<id>.md` and `content/review/rapid-<id>.md`: counts + any book conflicts (newest book wins; note both).
6. Check: `node scripts/validate-content.mjs` must pass at the end (it also rebuilds content/all.json, fine). Also no ref matching `/RapidRev|RR5|Prep\b/`.

Report per topic: study +N, rapid +N, notable conflicts.
