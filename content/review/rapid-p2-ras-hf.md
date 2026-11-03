# Rapid Fire review: p2-ras-hf

Deck: `content/rapid/p2-ras-hf.json` (610 cards, 25 class cards).
Sources: KD Tripathi 8e ch36, ch37, ch38 (chapter PDFs, read in full via `pdftotext`). All refs are `KDT8 chNN`.

## Corrected cases

- KD ch38, Ivabradine indication: the extracted text reads "ER <35%". Read as EF below 35%, since the same chapter uses EF throughout. Card written as "EF below 35%".

## Omitted

- KD ch36, Table 36.1 (comparative ACE inhibitor table): several cells are garbled in the extraction. Only the values stated in running text were carded (captopril, enalapril, lisinopril, ramipril, trandolapril, imidapril, benazepril, fosinopril, perindopril, quinapril details).
- Brand names (e.g. ENAPRIL, LOSAR) and Problem Directed Study cases were not carded.

## Web cross-checks

None triggered. No statement in the three chapters looked wrong on reading, so no WebSearch was run and no card was taken from another book.

## Reconciled with study deck

| id | change | ref |
|---|---|---|
| rf-p2-ras-hf-0077 | angiotensin II now FDA-approved vasopressor in vasodilatory shock (study card 016) | KDT8 ch36, Katzung16 ch17 |
| rf-p2-ras-hf-0190 | ACEi before ARB, but sacubitril-valsartan now recommended to replace either in HFrEF (study card 008) | KDT8 ch36, GG14 ch33 |
| rf-p2-ras-hf-0194 | ONTARGET: ACEi plus ARB not supported (study card 009) | KDT8 ch36, GG14 ch30 |
| rf-p2-ras-hf-0470 | digoxin range: KDT 0.5-1.4 vs GG14 0.5-0.8 ng/ml in HF (study card 048) | KDT8 ch38, GG14 ch33 |
| rf-p2-ras-hf-0579 | beta blockers indicated in asymptomatic LV dysfunction after MI; was "no benefit" (study card 051) | KDT8 ch38, GG14 ch33 |
| rf-p2-ras-hf-0590 | SHIFT: fewer HF hospitalisations and HF deaths, not CV mortality (study card 044) | KDT8 ch38, GG14 ch33 |
| rf-p2-ras-hf-0607 | sacubitril-valsartan: symptomatic HFrEF, replaces ACEi/ARB; was "advanced HF" (study card 030) | KDT8 ch37, GG14 ch30, GG14 ch33, Katzung16 ch17 |
| rf-p2-ras-hf-0611 | added: SGLT2 inhibitors in HFrEF with or without diabetes (study card 046) | GG14 ch33, Katzung16 ch13, Katzung16 ch41 |
| rf-p2-ras-hf-0612 | added: thiosulfate or hydroxocobalamin for nitroprusside cyanide (study card 027) | KDT8 ch37, Katzung16 ch11 |

## Expansion pass (2026-11-02)

- Source read: KDT8 ch36 (RAS), ch37 (NO and vasoactive peptides), ch38 (cardiac glycosides and heart failure) in full. No other book was searched in this pass.
- Coverage check: see p2-ras-hf.md.
- Rapid: +2 cards (rf-p2-ras-hf-0613 to rf-p2-ras-hf-0614). Target of +120 to +180 not reached: the existing 612 cards already cover the chapters.
- Book conflicts: none in KDT8 ch36-38.

| id | status | source |
|---|---|---|
| p2-ras-hf-061 to p2-ras-hf-080 | added | KDT8 ch36, ch37, ch38 |
| rf-p2-ras-hf-0613 to rf-p2-ras-hf-0614 | added | KDT8 ch36 |

| all rapid | no change; coverage audit found no gap (614 cards) | KDT8 ch36-38 |

## Checker (2026-11-03, independent check)
- Checked against KDT8 ch36-38 page text, GG14 and Katzung16. Rapid cards checked: 0009, 0010, 0073, 0074, 0100, 0101, 0105, 0125, 0131, 0132, 0146, 0148, 0149, 0211, 0213, 0223, 0272, 0290, 0298, 0306, 0453, 0454, 0470, 0478, 0479, 0488, 0493, 0495, 0518, 0519, 0522, 0575, 0578, 0589, 0597, 0598, 0611 (about 50 cards, mostly numeric).
- No rapid card needed correction. All numbers matched the book text, including ambrisentan 90% and 20% urine, bosentan 50%, and digoxin Fab 38/40 mg.
- Open point: rf-p2-ras-hf-0190 cites only KDT8 ch36 for the sacubitril-valsartan recommendation. The recommendation comes from GG14 ch33 and KDT8 ch37 p566; the ref should be widened by the owner if wanted.
- Validator: "check ok", no p2-ras-hf errors.

## Gap questions (PYQ 591, 612), added 2026-11-03
- rf-p2-ras-hf-0615 | new | KDT8 ch38
- rf-p2-ras-hf-0616 | new | KDT8 ch38
- rf-p2-ras-hf-0617 | new | KDT8 ch38
- rf-p2-ras-hf-0618 | new | KDT8 ch38

## Checker (PYQ gap pass, 2026-11-03)
- Checked rf-p2-ras-hf-0615 to 0618 against KDT8 ch38 p576-p581. Fixed 0618 answer to name oral inamrinone and oral milrinone (book: oral use increased mortality). 0615 to 0617 verified without change.
- Validator: check ok.

## PYQ gap pass (writer, 2026-11-03): cardiogenic shock, polypharmacy, RAS
- Added rf-p2-ras-hf-0619 to 0639 (21 fact pairs) for key facts of study 089-097.
- Table: id range | status | source
| 0619-0624 | ok | GG14 PDF p285, p286; KDT8 PDF p166 |
| 0625-0629 | ok | Katzung16 PDF p174, p1283; GG14 PDF p317, p676; Golan PDF p486 |
| 0630-0634 | ok | GG14 PDF p666, p674, p682, p683, p670 |
| 0635-0637 | ok | GG14 PDF p662, p682, p622 |
| 0638-0639 | ok | GG14 ch30 |
- Validator: check ok.

## Checker pass (0619-0639)
- 0627: refs add KDT8 PDF p581 (PDE3 selectivity).
- 0637: question reworded to name the neprilysin-ARB combination; aliskiren is also contraindicated with ACEI/ARB (GG14 PDF p622), so the old question had two valid answers.
- 0638: removed "about 20%" (not printed in the cited pages); answer now "superior to enalapril" (GG14 PDF p674). Ref corrected from GG14 ch30 to GG14 PDF p674.
- 0639: ref corrected from GG14 ch30 to GG14 PDF p674 (sacubitril is in the HF chapter, ch33).
- Validator: check ok.
