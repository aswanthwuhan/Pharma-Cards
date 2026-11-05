# Rapid Fire review: p2-renal

377 cards (20 class), all from KDT8 ch42 (diuretics) and ch43 (antidiuretics).

- Corrections: none.
- Omitted: named selective vasopressin V1a/V1b/V2 agonist and antagonist analogues (lines garbled in the extracted text).
- Spot-checked by orchestrator against KDT8 Table 42.1: thiazide list and order, daily dose ranges (0141–0146), CA inhibition (0147, chlorthalidone ++, the only "++"), duration range (0136): all match.

## Reconciled with study deck

| id | change | ref |
|---|---|---|
| rf-p2-renal-0109 | loop diuretics in ARF: fluid management only, no outcome change; was "may decrease need for dialysis" (study card 016) | KDT8 ch42, Katzung16 ch15, GG14 ch29 |
| rf-p2-renal-0033 | removed "rare with thiazides"; hyponatraemia is more common with thiazides (study card 017) | KDT8 ch42, Katzung16 ch15, GG14 ch29 |
| rf-p2-renal-0378 | added: acetazolamide renal stones and crystal AKI (study card 018) | KDT8 ch42, Katzung16 ch15 |
| rf-p2-renal-0379 | added: tolvaptan in ADPKD, 9% liver test abnormalities (study card 035) | KDT8 ch43, Katzung16 ch15 |
| rf-p2-renal-0380 | added: finerenone (study card 046) | GG14 ch29 |

## Expansion pass (2026-11-02)

- Source read: KDT8 ch42 (diuretics) and ch43 (antidiuretics) in full. GG14, Katzung16, Rang & Dale and the other owner books were not searched in this pass.
- Study: (study deck: see p2-renal.md).
- Rapid: +13 cards (rf-p2-renal-0392 to rf-p2-renal-0404). The existing deck (390 cards) already covers almost every fact in the two chapters, so the target of +120 to +180 was not reached without duplicating existing pairs.
- Corrections to existing rapid cards: rf-p2-renal-0019 and 0020 class answers changed to comma lists (were a single item with "and").
- Book conflicts: none found in KDT8 ch42-43 for the new cards.
- Ungrounded items not added: no dose or regimen outside KDT8 ch42-43 was used.

| id | status | source |
|---|---|---|
| p2-renal-049 to p2-renal-087 | added | KDT8 ch42, ch43 |
| rf-p2-renal-0392 to rf-p2-renal-0404 | added | KDT8 ch42, ch43 |
| rf-p2-renal-0019, 0020 | corrected (class list format) | KDT8 ch42 |
| rf-p2-renal-0405, 0406, 0408, 0409 | new | KDT8 ch42, ch43 |
| rf-p2-renal-0407 | dropped (duplicate of 0265) | KDT8 ch42 |

## Checker (independent pass, 2026-11-03)

| id | status | source |
|---|---|---|
| rf-p2-renal-0405, 0406, 0408, 0409 | ok | KDT8 ch42, ch43 (0408 wording "only drugs effective in nephrogenic DI" is printed in KDT8 ch42) |
| rf-p2-renal-0216 | corrected: answer now adds beta-blockers (KDT8 p649 lists ACE inhibitors/ARBs, beta-blockers, NSAIDs) | KDT8 ch42 |
| rf-p2-renal-0262 | corrected: KDT8 ch42 does not list isosorbide or glycerol; answer and ref changed to GG14 ch29 Table 29-3 (glycerin, isosorbide, mannitol, urea) | GG14 ch29 |
| rf-p2-renal-0391 | ref corrected: cyclosporine nephrotoxicity list is printed in KDT8 ch65 (not ch42, 54, 58, 64); answer kept | KDT8 ch65 |
| rf-p2-renal-0217, 0288, 0289, 0314, 0371, 0120, 0237, 0010, 0019, 0020 | ok | KDT8 ch42, ch43 |

Deletions: none in this pass.
Prep / RR5 / RapidRev refs: none found.
Validator: `node scripts/validate-content.mjs --check` reports no p2-renal errors.

## Gap pass: non-edematous uses
| rf-p2-renal-0410 to 0418 | new | KDT8 ch42 |
Note: PYQ year for the Q bank entry is unknown (recorded as 0).

Checker (PYQ gap pass), 2026-11-03: rf-p2-renal-0412 question reworded to "Diuretic added to i.v. saline in hypercalcaemia of malignancy" (KDT8 ch42 says furosemide is added after volume replacement, not that it is the diuretic of choice). Other 0410 to 0418 ok.

## Recheck (all new cards, chunk 1/1)
Checked 2026-11-04 against KDT8 ch42 and ch43. Ids rf-p2-renal-0392 to 0418 (26 pairs; 0407 is not in this chunk).
- ok: 0392, 0393, 0394, 0395, 0396, 0397, 0398, 0399, 0400, 0401, 0402, 0403, 0404, 0405, 0406, 0408, 0409, 0410, 0411, 0412, 0413, 0414, 0415, 0416, 0417, 0418 (KDT8 ch42 or ch43, text checked).
- corrected: none. Deleted: none. Unverifiable (UNSOURCED or WEB): none.
- Overlap with study cards kept on purpose (049, 070, 095): different formats, same facts.
Validator: check ok.


## Thin-coverage pass (cov-2 idx 253)
| id | status | source |
|---|---|---|
| rf-p2-renal-0419 | new | GG14 PDF p589 |
| rf-p2-renal-0420 | new | GG14 PDF p589 |
| rf-p2-renal-0421 | new | GG14 PDF p590 |
Added only for the SGLT2 facts, which were absent from the rapid deck; the CA inhibitor and mannitol pairs were already comprehensive (0237-0278).

## Independent fact-check (0419-0421), 2026-11-05
| id | status | source |
|---|---|---|
| rf-p2-renal-0419 | ok | GG14 PDF p589 (hybrid osmotic + proximal Na+ effect) |
| rf-p2-renal-0420 | ok | GG14 PDF p589 (about 5% of total renal Na+ reabsorption) |
| rf-p2-renal-0421 | ok | GG14 PDF p590 (sequential nephron blockade, diuretic resistance) |

All three checked on the printed pages; q's are not "What is" forms, subtopics valid, no Prep/RR5 refs. No corrections, no deletions.
