# Rapid Fire review: p2-nsaids

Deck: `content/rapid/p2-nsaids.json` (518 cards, 20 class cards).
Sources: KD Tripathi 8e ch14 and ch15 (chapter PDFs, read in full via `pdftotext`).

## Corrected cases

None.

## Omitted

| statement in book | status | reason |
|---|---|---|
| KD ch15: azathioprine is converted to 6-MP by the enzyme TPMT | omitted | Web check (WebSearch) shows TPMT is a competing inactivation route, not the conversion step; the conversion is glutathione-dependent. Goodman & Gilman 14e, Rang & Dale 9e and Katzung 16e were searched for TPMT and no owner-book statement was found. Card keeps only "converted to 6-mercaptopurine". |
| KD ch15: probenecid blocks transport by "OATP", and URAT-1 is "a member of the OATP family" | omitted family claim | Web check (WebSearch) shows URAT-1 is SLC22 (organic ion transporter family), not OATP. No owner-book statement found in the searched books. Cards keep "URAT-1" only. |
| KD ch15: azathioprine is a "purine synthase inhibitor" | wording not used | Not a precise term; card uses the printed mechanism of conversion to 6-MP. |

## Notes on book statements (kept as printed)

- KD ch14 interaction table: the OCR reads "blocker" for the beta-blocker row. Card reads "beta-blockers" from table context. Not verified against the printed page.
- KD ch14 paracetamol FDA 2009 limits (650 mg per unit, 2600 mg per day) are kept as printed and labelled "per book". Not independently verified.
- KD ch14 dated national bans and withdrawals (nimesulide in Spain, Ireland, Singapore, Turkey, Portugal, Israel, India; pediatric aspirin in India and UK) are kept as printed. These may be out of date.
- Garbled extraction: where the pdftotext output was unreadable (for example the Table 14.1 grid), only clearly readable entries were carded.

## Count

| subtopic | cards |
|---|---|
| p2-nsaids-cox-classification | 116 |
| p2-nsaids-aspirin | 88 |
| p2-nsaids-paracetamol | 54 |
| p2-nsaids-coxibs | 69 |
| p2-nsaids-gi-special-patients | 41 |
| p2-nsaids-dmards | 48 |
| p2-nsaids-biologic-dmards | 24 |
| p2-nsaids-gout | 78 |

## Reconciled with study deck

- rf-p2-nsaids-0235 -> induced vomiting/lavage removed; activated charcoal within 4 h, lavage not recommended -> KDT8 ch14, GG14 ch42, GG12 ch34
- rf-p2-nsaids-0237 -> IV NAC: standard 3-bag regimen (GG12) added beside KDT scheme -> KDT8 ch14, GG12 ch34, GG14 ch42
- rf-p2-nsaids-0238 -> oral NAC: standard 140/70 mg/kg x17 regimen added beside KDT scheme -> KDT8 ch14, GG12 ch34, GG14 ch42
- rf-p2-nsaids-0459 -> colchicine: GG14 low-dose regimen (1.2 mg then 0.6 mg) as current, KDT as older -> KDT8 ch15, GG14 ch42
- rf-p2-nsaids-0508 -> febuxostat: GG14 boxed CV-death warning added -> KDT8 ch15, GG14 ch42
- rf-p2-nsaids-0519 -> added: JAK inhibitors for RA list -> KDT8 ch15, GG14 ch39, GG14 ch55

| id | status | source |
|---|---|---|
| rf-p2-nsaids-0528 | new | KDT8 ch14-15 |
| rf-p2-nsaids-0529 | new | KDT8 ch14-15 |
| rf-p2-nsaids-0530 | new | KDT8 ch14-15 |
| rf-p2-nsaids-0531 | new | KDT8 ch14-15 |
| rf-p2-nsaids-0532 | new | KDT8 ch14-15 |


## Expansion pass (2026-11-03)

Chapters read: KD Tripathi 8e ch14 and ch15. Existing 532 rapid cards were listed and checked attribute by attribute before writing (a drug name appearing elsewhere was not counted as covered).

Counts: rapid +142, ids rf-p2-nsaids-0533 to rf-p2-nsaids-0674, deck total 674. Study +34 (see study review).

Duplicates: candidate facts already carded were not re-added, for example aspirin in RA, pregnancy and breastfeeding aspirin, aspirin antiplatelet dose, paracetamol antidote regimens, coxib cardiovascular trial results, and the existing NSAID-drug interaction cards.

Book conflicts:
- Early paracetamol overdose: KDT8 ch14 says induce vomiting or gastric lavage if the patient is brought early. GG14 (gastric lavage section, PDF p184-185) says lavage reduces absorption only about one-third and is not routine. Existing rf-p2-nsaids-0235 follows GG14. New rf-p2-nsaids-0592 keeps the KDT8 wording. The newer GG14 wins, so 0592 should be deleted or corrected by the owner. It was not removed because the helper can only append.
- Pre-existing, unchanged: IV N-acetylcysteine regimen (rf-0237, KDT8 vs GG12); colchicine acute dose (rf-0459, KDT8 0.5 mg vs GG14 1.2 mg); febuxostat boxed warning (rf-0508, GG14 only, not in KDT8).
- Not carded: KDT8 ch15 names thiopurine methyltransferase (TPMT) as the enzyme that converts azathioprine to 6-mercaptopurine. Verify in GG14 before adding.

Ranges (id range | status | source):

| id range | status | source |
|---|---|---|
| rf-p2-nsaids-0533 to 0555 | draft (ok) | KDT8 ch14 |
| rf-p2-nsaids-0556 | draft (ok) | KDT8 ch14 and ch15 (naproxen indications) |
| rf-p2-nsaids-0557 | draft (ok) | KDT8 ch15 |
| rf-p2-nsaids-0558 to 0580 | draft (ok) | KDT8 ch14 |
| rf-p2-nsaids-0581 | draft (ok) | KDT8 ch15 (sulfinpyrazone) |
| rf-p2-nsaids-0582 to 0607 | draft (ok) | KDT8 ch14 |
| rf-p2-nsaids-0608 to 0674 | draft (ok) | KDT8 ch15 |

Conflict card: rf-p2-nsaids-0592 (see book conflicts above). Status should be "corrected" or "deleted" by the owner.

- Orchestrator: rf-p2-nsaids-0592 deleted (KDT8 lavage/emesis view contradicts rf-p2-nsaids-0235, which follows GG14: activated charcoal, lavage not routine). rf-p2-blood-0579 (TG >1000 mg/dL) kept: matches GG14 PDF p756/p759.

## Checker (independent pass, 2026-11-03)

Sampled about 90 Rapid cards, including all numeric cards that are not part of a class list and every card that cites a non-KDT book (rf-0235, 0237, 0238, 0459, 0508, 0519-0527).

Checked and OK against sources: half-lives and doses for propionic acids, oxicams, ketorolac, indomethacin, nabumetone, mephenamic acid, aspirin/salicylate PK, the ketorolac 5-day rule, paracetamol NAC regimens (GG12 p1009, GG14 p860), and the pKa, 1971, ion-trapping and occult-blood-loss facts.

Corrected:
| id | status | change |
|---|---|---|
| rf-p2-nsaids-0459 | corrected | "older (KDT)" relabelled "KDT"; GG14 1.2 mg / 0.6 mg dose verified (GG14 ch42 p867) |
| rf-p2-nsaids-0523 | corrected | answer "81 to 325 mg once daily" not found in Katzung ch36 (only 81 mg/d appears); now "81 mg once daily (Katzung); 75 to 150 mg/day (KDT8)" |

No Prep / RR5 / RapidRev refs in the deck (grep clean). Deleted: none. Added: none (coverage spot-check found the chapter points present).

## Gap pass: COX-2 inhibitors and thrombogenicity (UHSR 2025)
id | new | source
---|---|---
rf-p2-nsaids-0675 to 0693 | new (19 pairs) | KDT8 ch13; KDT8 ch14; GG14 ch42

## Checker (PYQ gap pass)
rf-p2-nsaids-0686: removed "sudden cardiac death" (not in books; now vascular death per GG14 ch42). rf-p2-nsaids-0692: ch45 ref replaced with KDT8 ch13. Other pairs verified against KDT8 ch13/ch14 and GG14 ch42.


## Gap pass: anti-inflammatory assay methods
Added rf-p2-nsaids-0694 to 0714 (21 pairs), subtopic p2-nsaids-cox-classification. Sources: Sarkar p336-350, Satoskar p287-288. No deletions. Phases, models, mediators, dyes, ulcer index and granuloma pellet facts are covered. Glass rod, sponge and formalin models are named only.

## Checker pass: anti-inflammatory assay methods (rf-p2-nsaids-0694 to 0714)
- 0695 | corrected | added oxazolone ear oedema to the acute list (Sarkar p336-340)
- 0697 | corrected | ref Sarkar p341-345 -> Sarkar p336-340 (list is on p336-340)
- 0707 | corrected | removed Freund's/tubercle detail; now "Adjuvant arthritis" (Satoskar p288)
- 0709, 0710 | corrected | ref Sarkar p346-350 -> Sarkar p341-345
- 0712 | corrected | answer "Carrageenan" only (croton oil not in the pouch method)
- 0694-0706, 0708, 0711, 0713, 0714 | ok

## Recheck (all new cards, chunk 2/3)
Scope: rf-p2-nsaids-0567 to 0687 (119 cards in the deck; chunk id 0684 has no card and was not created). Sources: KDT8 ch13, ch14, ch15 (pdftotext); GG14 ch42 (pdf p837, p853, p861) for 0686-0687.
Result: 119 checked, 0 corrected, 0 deleted, 0 unverifiable (no UNSOURCED or WEB refs in this chunk).
- Corrected: none.
- Deleted: none.
- Checked against book, no change: all 119 (answers match the printed text; refs are KDT8 ch13/ch14/ch15 or GG14 ch42).
- Note: rf-p2-nsaids-0609 answer says "(proposed)" for monocyte IL-1 reduction; KDT8 ch15 states it as found. Left as is (not a wrong fact).
- Note: rf-p2-nsaids-0677 and rf-p2-nsaids-0001 share the answer COX-1 but ask different things (platelet TXA2 maker vs housekeeping isoform). Kept both. Not duplicates.
- Note: rf-p2-nsaids-0581 (sulfinpyrazone) sits in subtopic p2-nsaids-cox-classification; left as is.

## Recheck (all new cards, chunk 3/3)
Scope: rf-p2-nsaids-0688 to 0714 (27 cards). Sources: GG14 ch42 (pdftotext pp850-880, paragraphs on CV risk and COX-2 use); KDT8 ch13 and ch14 (pdftotext); Sarkar OCR p336-340, p341-345 (assay models, ulcer index, aspirin ulcer); Satoskar p287-288 (search.py).
Result: 27 checked, 3 corrected, 0 deleted, 0 unverifiable (no UNSOURCED or WEB refs in this chunk). No duplicates. Level and basic-why checks not applicable (rapid cards have no level or back text).
- rf-p2-nsaids-0691 | corrected | question was broader than the book. KDT8 ch14 states paracetamol is the safest analgesic in pregnancy (low-dose aspirin second). Now q "Analgesic that is safest in pregnancy", a "Paracetamol (low-dose aspirin second best)".
- rf-p2-nsaids-0701 | corrected | "24 hours if needed" added a condition not in Sarkar p336-340. Now "3 and 6 hours (also 24 hours)".
- rf-p2-nsaids-0704 | corrected | "works through substance P" overstated Sarkar p336-340 ("partially associated with the substance P"). Now "partly mediated by substance P".
- Checked against book, no change: 0688, 0689, 0690 (GG14 ch42: dose, t1/2, COX-2 selectivity, potency, duration; lowest dose for shortest period; COX-2 selective agents for high GI-risk patients), 0692, 0693 (KDT8 ch13 TXA2/PGI2; KDT8 ch14 COX-2 inhibitors reduce PGI2 without affecting platelet TXA2), 0694-0700, 0702, 0703, 0705-0714 (Sarkar p336-345 and Satoskar p287-288).

## Recheck (all new cards, chunk 2/3), re-verified
Supersedes the earlier chunk 2/3 block above, which marked 0609 "left as is". Scope: rf-p2-nsaids-0567 to 0687 (119 cards; 0592 and 0684 are not in this chunk). Sources: KDT8 ch13, ch14, ch15 (pdftotext, every card line-checked); GG14 ch42 (pdftotext) for 0686-0687.
Result: 119 checked, 2 corrected, 0 deleted, 0 unverifiable (no UNSOURCED or WEB refs in this chunk). No duplicates. Level and basic-why checks not applicable (rapid cards have no level or back text).
- rf-p2-nsaids-0609 | corrected | the book says antimalarials "have been found to reduce monocyte IL-1" (KDT8 ch15). The "(proposed)" label was wrong. Now q "Antimalarial effect on monocytes in RA", a "Reduces monocyte IL-1".
- rf-p2-nsaids-0612 | corrected | "list all" omitted retinal damage and corneal opacity, which KDT8 ch15 names as the most disturbing antimalarial toxicity. Added to the answer.
- Checked against book, no change: all other 117 cards (0567-0591, 0593-0683, 0685-0687). 0686 keeps "vascular death", which GG14 ch42 states (MI, stroke, vascular death, ~1.4-fold). 0687 diclofenac is supported by GG14 ch42.

## Recheck (all new cards, chunk 3/3)

Scope: rf-p2-nsaids-0688 to rf-p2-nsaids-0714 (27 cards, added since v0.5.5). Sources: GG14 PDF p854 (ch42), KDT8 PDF p215, p236, p241 (ch13, ch14), Sarkar OCR p336-340 and p341-345, Satoskar PDF p287-288.

Checked and kept as written: rf-p2-nsaids-0688, 0692, 0693, 0694, 0695, 0696, 0697, 0698, 0699, 0700, 0701, 0702, 0703, 0704, 0705, 0706, 0707, 0708, 0709, 0710, 0711, 0713, 0714.

Corrected:
- rf-p2-nsaids-0712: ref narrowed to `Sarkar p336-340`. Satoskar PDF p287 names croton oil for the granuloma pouch, so it does not support carrageenan for this card. Carrageenan is stated in Sarkar p336-340.

Deleted (duplicates, same fact already carded elsewhere in this deck):
- rf-p2-nsaids-0689 (lowest possible dose, shortest period): duplicate of rf-p2-nsaids-0277.
- rf-p2-nsaids-0690 (COX-2 selective NSAIDs for high GI-risk patients): duplicate of rf-p2-nsaids-0276.
- rf-p2-nsaids-0691 (paracetamol safest in pregnancy): duplicate of rf-p2-nsaids-0358.

Flagged for the chunk owners (outside chunk 3, not edited here):
- rf-p2-nsaids-0262 and rf-p2-nsaids-0681 both restate the coxib cardioprotection point covered by kept rf-p2-nsaids-0693. One of the two sets should go.

Unverifiable: none in this chunk.

Chunk 3 result: 27 checked, 1 corrected, 3 deleted (duplicates), 0 unsourced.
