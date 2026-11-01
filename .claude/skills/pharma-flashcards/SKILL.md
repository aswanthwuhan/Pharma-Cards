---
name: pharma-flashcards
description: Rules and workflow for writing, validating or editing Pharmacards MD Pharmacology flashcards (study decks and Rapid Fire decks). Use whenever creating, checking, correcting or extending any file in content/decks, content/rapid or content/subtopics, or when asked to make, fix or verify flashcards, drug classifications, or chapter coverage.
---

# Pharmacards flashcards

Every card must be **100% grounded in the owner's textbooks** in `C:\Pharmacology Book\`. Nothing may be invented or taken from memory.

## Read before touching any card
1. `content/GROUNDING-RULES.md`: what counts as a source, and how to cite it. This overrides everything else.
2. `content/FORMAT.md`: the study deck format (basic / shortnote / essay / cloze), subtopics and tags.
3. `content/RAPID-FORMAT.md`: the Rapid Fire format (short reversible q/a pairs and full drug-class lists).
4. `content/subtopics/<topicId>.json`: the only valid subtopic ids for a topic.

## Workflow
1. Find the topic's chapters: see `refs` on the topic in `lib/syllabus.ts`.
2. Extract the source with `pdftotext "<pdf>" -` (stdout only). For big single-file books, extract a page range only (`-f N -l M`). The scanned review books (Sarkar, Rapid Revision, Prep) are already OCR'd to markdown in `C:\Pharmacology Book\ocr\`; grep there. `scripts/ocr-books.py` (local MinerU API on port 8005) produces these files and is resumable.
3. Write or verify cards in your own words, each with a precise `refs` (e.g. `KDT8 ch52`, `GG14 ch7`).
4. If the book looks wrong, you may cross-check with a web search. Only correct it from ANOTHER of the owner's books, cited. Otherwise omit the card. Log the case in `content/review/`.
5. Check your files with the per-file node check given in the format docs. Run `node scripts/validate-content.mjs` only when no other agent is editing decks.
6. Record changes in `content/review/<topicId>.md` (study decks) or `content/review/rapid-<topicId>.md` (Rapid Fire).

## Hard rules
- No `refs: []`. No general knowledge, guidelines, doses or approvals unless printed in a book.
- Classification cards list EVERY drug the book lists, in the book's order.
- Never copy sentences, tables or figures verbatim; the app is public.
- Keep ids stable. Only delete a card that cannot be grounded, and log it.
