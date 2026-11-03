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
