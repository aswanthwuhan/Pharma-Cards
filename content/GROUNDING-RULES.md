# Grounding rules (owner's instruction, overrides earlier briefs)

**Every flashcard must be 100% grounded in the owner's own books in `C:\Pharmacology Book\`. Do not invent anything.**

1. **Every fact on a card must be traceable to a passage in one of these books:**
   - KD Tripathi 8e (chapter PDFs)
   - Goodman & Gilman 12e or 14e
   - Katzung
   - Rang & Dale 9e
   - Pharma Rapid Revision 5e, Pharmacology Prep, PG Pharma Sarkar: these are scanned, so read the MinerU OCR text in `C:\Pharmacology Book\ocr\<rapid-revision|sarkar|prep>\pNNNN-NNNN.md` (one file per 5 PDF pages; grep it). Cite them by the OCR file's 5-page range, e.g. `"Sarkar p221-225"` (files have no page markers, so never guess a single page). They are review books, so a standard textbook (KDT8, GG, Katzung, Rang & Dale) wins whenever they disagree. OCR can garble numbers, so drop any number that is not clearly legible. If a book's OCR folder does not exist yet, skip that book.
2. **`refs` is mandatory and must be precise:** `"<book> <edition> ch<N>"`, e.g. `"KDT8 ch52"`, `"GG14 ch7"`, `"Katzung16 ch36"`, `"RangDale9 ch8"`. Never use `"refs": []`.
3. **General knowledge is NOT allowed**, even if you are confident. If no book supports a fact, remove that fact from the card. If nothing remains, delete the card from the deck.
4. **When the books disagree or are dated:**
   - Prefer the newest book that covers the point (GG14 is from 2023 and is the most recent).
   - If KD Tripathi says X and GG14 says a newer Y, the card states Y with `refs` ["GG14 chN"]. Mention X only if the card is about how practice changed, and cite both.
   - Never bring in a guideline, regimen, approval or number that is not printed in one of the books.
5. **Doses and numbers** only if printed in a book and read clearly. If the extracted text is garbled, leave them out.
6. **Wording must be your own.** Use concise paraphrase and exam-style points; never copy sentences.
7. **Deleting cards is allowed** for cards that cannot be grounded. Record each deletion in the deck's review log with the reason. Do not renumber the remaining ids.
8. **Review log:** `content/review/<topicId>.md` lists every card's grounding status. Keep it as a compact table: `id | ok / corrected / deleted | source`.

How to check a fact: extract the cited chapter with `pdftotext "<file>" -`. For the single-file big books, use `pdftotext -f <first> -l <last> "<file>" -`; locate pages first via the contents and `grep -n`. GG14 PDF page ≈ book page + 17.

- Orchestrator: single-page OCR refs (Sarkar/Prep/RR5 pN) converted to the 5-page file range that contains them (OCR files have no page markers).

## Exception: web sources for SOURCE-GAPS items (owner approved, 2026-11-01)
Only for the points listed in `content/SOURCE-GAPS.md` (no owner book covers them), cards may be written from official or authoritative web sources:
NMC (nmc.org.in), WHO, ICMR, CDSCO, Ministry of AYUSH, FSSAI, NTEP/NACO/NCVBDC (MoHFW), AIIMS/National Poisons Information Centre, NCBI Bookshelf (StatPearls), and peer-reviewed open-access journal articles via PMC / Europe PMC (e.g. Indian J Pharmacol). No blogs, forums or commercial sites.
- Paraphrase; never copy. Use only what the page states.
- `refs` format: `"WEB <org> <doc title or topic> <year if shown> <url>"`, e.g. `"WEB NMC AETCOM module 2018 https://..."`.
- Add the tag set as usual; keep `status: "draft"`; the review log marks these rows `web` for the owner's review.
- Everything else still follows the books-only rules above.

## Exception: unsourced cards for the last gaps and the practical exam (owner approved, 2026-11-02)
For the items still listed in `SOURCE-GAPS.md` and for the practical-exam topics (`pr-*`), the owner approved cards written from standard, well-established pharmacology knowledge.
- `refs` must be exactly `["UNSOURCED - owner must verify"]` (plus any real book/WEB ref that supports part of the card).
- Only uncontroversial, textbook-standard facts. No doses or numbers you are not certain of; prefer principles and steps.
- `status: "draft"`; the review log lists every such id under "Unsourced cards (owner approved)".

## Owner's added library (2026-11-02)
These are owner books too (same rules as above; cite as `"<Short title> <chapter/page>"`, e.g. `"Ghosh FEP p45"`, `"Medhi PMECP p120"`):
- `C:\CLAUDE\A Flashcard App\Database PDFs, Guidelines\` (Experimental & Clinical pharmacology: Ghosh, Medhi, Bennett & Brown, Bioequivalence & Statistics; Core Pharmacology: Golan, Padmaja, Satoskar, Shanbhag, Katzung 16e; Guidelines: national/GINA etc.)
- `C:\CLAUDE\A Flashcard App\Curriculum-related documents\` (NMC MD Pharmacology revised curriculum, PGMER 2023, RGUHS practical pattern)
- Question banks: `C:\CLAUDE\A Flashcard App\MD pharmacology Q banks\` (for PYQ tags only; store question wording, never the files).
These folders are gitignored and must never be committed.

## Excluded sources: PrepLadder (owner, 2026-11-02)
Never use or cite PrepLadder material: `Pharmacology Prep Xi A4.pdf` (refs `Prep ...`) and `Pharma Rapid Revision 5e.pdf` (refs `RR5 ...`), including their OCR folders `ocr\prep\` and `ocr\rapid-revision\`.
Cards that cited them were re-grounded in the other owner PDFs. Where no other PDF supports a card, its ref is `UNSOURCED - owner must verify`.
Searchable page text of the allowed PDFs: `python C:\Users\albit\pharm-tools\search.py "<regex>"` (cite as `<book> PDF p<N>`).
