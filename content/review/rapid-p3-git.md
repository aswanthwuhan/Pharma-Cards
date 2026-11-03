| rf-p3-git-0553 | corrected (checker: diet-diversity claim not found; replaced with arginine-digoxin fact) | GG14 ch6 || rf-p3-git-0543 | deleted (checker: ramosetron IBS indication not in owner books) | none || rf-p3-git-0539 | corrected (checker: TCA dose removed; not in book) | GG14 ch54 |# Rapid Fire review: p3-git

Deck: `content/rapid/p3-git.json` (511 cards, 41 class cards).
Sources: KD Tripathi 8e ch47 (peptic ulcer, GERD), ch48 (antiemetic, prokinetic, digestant, gallstone), ch49 (laxatives, diarrhoea, IBD). Chapter PDFs read in full via `pdftotext`.
Owner-book checks: the OCR of Rapid Revision 5e, Sarkar and Prep was grepped for GI terms (ulcer, pylori, ondansetron, misoprostol, sucralfate, loperamide, C. difficile). Nothing was added from them, because KDT8 covers every point. Only one conflict was found (below).
Goodman & Gilman, Katzung and Rang & Dale were not used for this deck.
Web search: not run. No statement was corrected from the web.

## Card status

| ids | subtopic | status | source |
|---|---|---|---|
| rf-p3-git-0001 to 0057 | p3-git-acid-control | ok (57) | KDT8 ch47 |
| rf-p3-git-0058 to 0112 | p3-git-ppi | ok (55) | KDT8 ch47 |
| rf-p3-git-0113 to 0162 | p3-git-ulcer-therapy | ok (50) | KDT8 ch47 |
| rf-p3-git-0163 to 0205 | p3-git-antacids-gerd | ok (43) | KDT8 ch47 |
| rf-p3-git-0206 to 0274 | p3-git-antiemetics | ok (69) | KDT8 ch48 |
| rf-p3-git-0275 to 0334 | p3-git-prokinetics | ok (60), includes gallstone and digestant cards | KDT8 ch48 |
| rf-p3-git-0335 to 0396 | p3-git-laxatives | ok (62) | KDT8 ch49 |
| rf-p3-git-0397 to 0511 | p3-git-diarrhoea-ibd | ok (115) | KDT8 ch49 |

No card was corrected or deleted.

## Corrected cases

None corrected.

## Omitted

| item | source | reason |
|---|---|---|
| C. difficile: RR5 names oral fidaxomicin as drug of choice, vancomycin as alternative | RR5 p26-35 (OCR) | Conflicts with KDT8 ch49, which names oral metronidazole as drug of choice and oral vancomycin as alternative. Textbook wins, so the KDT8 version is used. Fidaxomicin not carded. |
| Colloidal bismuth subcitrate dosing time before meals | KDT8 ch47 | Printed value garbled in extraction (dose timing symbol unreadable). Card gives the dose and the meal/bedtime schedule only. |
| Anti-H. pylori two-week triple regimen and quadruple-therapy doses in the regimen table | KDT8 ch47 | Table extraction is scrambled. Only the one-week triple regimen and the FDA-approved regimen (both stated in running text) and the quadruple rescue line are carded. |
| Anti-H. pylori kit brand names (HP-Kit, Lansi Kit, etc.) | KDT8 ch47 | Brand names, not exam content. |
| Laxative latency table (Table 49.1) | KDT8 ch49 | Table layout lost in extraction. Latencies taken from running text instead (bisacodyl, picosulfate, anthraquinones, lactulose, saline, bulk, docusates). |
| Amoebiasis/giardiasis line | KDT8 ch49 | Line garbled. Only amoebiasis drugs (metronidazole, diloxanide furoate) carded, with the chapter cross-reference. Giardiasis drug not carded. |
| Dhaka i.v. fluid glucose alternative (5% glucose) | KDT8 ch49 | Alternative line garbled; NaCl, KCl and NaHCO3 values kept. |
| Problem-directed study cases (ch47 47.1, ch48 48.1, ch49 49.1) | KDT8 chapters | Case scenarios, not facts; answers are in the book's appendix, which was not extracted. |
| Trade-name lists and small brand-product dose lines | KDT8 chapters | Not exam content. |

- Orchestrator: rf-p3-git-0445 updated to GG14 ch57 (oral vancomycin or fidaxomicin preferred), per rule 4 newest book; matches study decks p3-git and p3-amr-general.

## Expansion pass

Added 2 rapid cards (rf-p3-git-0520, 0521) from KDT8 ch47: lafutidine dose, and the stress-erosion mechanism (mucosal ischaemia with acid). Each has one tag. Deck is near saturation for ch47-49.

Book conflicts noted: none in this pass.

## Ladder pass: new rapid cards
| ids | status | source |
|---|---|---|
| rf-p3-git-0522 to 0525 | new | KDT8 ch47 |
| rf-p3-git-0526 to 0527 | new | KDT8 ch49 |

## Checker
Spot-checked 30+ study/rapid cards (levels 2-3, numeric doses and potencies) against KDT8 ch47-49 text: all matched (H2 potency ratios, PPI plateau 3-4 d, misoprostol ~3 h, ondansetron/palonosetron/aprepitant doses, FDA H. pylori regimen 86-92%, ORS osmolarity, itopride, bran, anthraquinone). No Prep/RR5 refs. Ladder OK in all 8 subtopics (>=3 L1, 2 L2, 1 L3). Drug-list gap scan vs ch47-49 found nothing missing. No cards changed or deleted.

## Gap questions rapid pairs (added)
| id | status | source |
|---|---|---|
| rf-p3-git-0528 | new | KDT8 ch47 |
| rf-p3-git-0529 | new | KDT8 ch47 |
| rf-p3-git-0530 | new | KDT8 ch49 |
| rf-p3-git-0531 | new | KDT8 ch49 |
| rf-p3-git-0532 | new | KDT8 ch23 |
| rf-p3-git-0533 | new | GG14 ch44 |
| rf-p3-git-0534 | new | GG14 ch54 |
| rf-p3-git-0535 | new | GG14 ch54 |
| rf-p3-git-0536 | new | GG14 ch54 |
| rf-p3-git-0537 | new | GG14 ch54 |
| rf-p3-git-0538 | new | GG14 ch54 |
| rf-p3-git-0539 | new | GG14 ch54 |
| rf-p3-git-0540 | new | KDT8 ch49 |
| rf-p3-git-0541 | new | KDT8 ch49 |
| rf-p3-git-0542 | new | KDT8 ch49 |
| rf-p3-git-0543 | new | KDT8 ch48 |
| rf-p3-git-0544 | new | GG14 ch6 |
| rf-p3-git-0545 | new | GG14 ch6 |
| rf-p3-git-0546 | new | GG14 ch6 |
| rf-p3-git-0547 | new | GG14 ch6 |
| rf-p3-git-0548 | new | GG14 ch6 |
| rf-p3-git-0549 | new | GG14 ch6 |
| rf-p3-git-0551 | new | GG14 ch6 |
| rf-p3-git-0552 | new | GG14 ch6 |
| rf-p3-git-0553 | new | GG14 ch6 |


Checker (PYQ gap pass): verified new rapid cards against owner books. Corrected rf-p3-git-0539 and rf-p3-git-0553, deleted rf-p3-git-0543. Validator check ok.
