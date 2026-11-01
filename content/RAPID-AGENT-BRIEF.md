# Brief: write one Rapid Fire deck

Project: `C:\CLAUDE\A Flashcard App`. Follow these files exactly:
- `content/RAPID-FORMAT.md`: format and rules
- `content/GROUNDING-RULES.md`: strict book grounding, NO training-data facts

A finished example to match in style and depth: `content/rapid/p2-cholinergic.json`. It has about 175 cards per chapter, every class list complete, short q and a, and reads well in both directions.

## Steps
1. Read `content/subtopics/<topicId>.json`. Use only these subtopic ids.
2. Extract each source chapter with `pdftotext "<file>" -`. KD Tripathi chapter PDFs are in `C:\Pharmacology Book\KD Tripathi 8e - Chapters\`. Work through the chapter section by section, and make sure every classification, drug, mechanism, use, adverse effect, contraindication, interaction, drug of choice and antidote is captured.
   - **Readable books:** KD Tripathi 8e, Goodman & Gilman 12e/14e, Katzung and Rang & Dale 9e.
   - **Scanned books:** Sarkar, Rapid Revision and Pharmacology Prep are available as OCR text in `C:\Pharmacology Book\ocr\` (see GROUNDING-RULES rule 1). Use them only to check or add exam-relevant points; the textbook wins on any conflict.
3. **Outdated KDT points:** if the validated study deck `content/decks/<topicId>.json` cites GG14/Katzung for a newer position (drug of choice, regimen, withdrawn drug), the Rapid card must follow it with the same refs (GROUNDING-RULES rule 4).
4. **If a statement looks wrong:** cross-check with WebSearch, then correct it ONLY from another owner book and cite it. Otherwise omit it. Log every case in `content/review/rapid-<topicId>.md`.
5. Write `content/rapid/<topicId>.json`, with ids `rf-<topicId>-0001` onwards.
6. Check it:
   `node -e "const d=require(process.argv[1]),s=new Set(require(process.argv[2]).map(x=>x.id)),ids=new Set();for(const c of d.cards){if(ids.has(c.id))throw 'dup '+c.id;ids.add(c.id);if(!c.id.startsWith('rf-'+d.topicId+'-'))throw 'id '+c.id;if(!s.has(c.subtopic))throw 'sub '+c.id;if(!c.q||!c.a)throw 'qa '+c.id;if(!c.refs||!c.refs.length)throw 'refs '+c.id}console.log('ok',d.cards.length,d.cards.filter(c=>c.kind==='class').length,'class')" "<abs path to deck>" "<abs path to subtopics>"`
7. Do NOT run `scripts/validate-content.mjs` and do not touch any other file.

## Report (under 8 lines)
Total cards, class cards, cards per subtopic, and any corrections or omissions.
