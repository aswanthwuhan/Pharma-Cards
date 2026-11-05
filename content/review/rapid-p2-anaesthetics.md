# Rapid Fire review: p2-anaesthetics

Deck: `content/rapid/p2-anaesthetics.json` (496 cards, 24 class cards).
Sources: KD Tripathi 8e ch25 (Skeletal Muscle Relaxants), ch26 (Local Anaesthetics), ch27 (General Anaesthetics). Each chapter PDF extracted with `pdftotext` and read in full. No other book was used, and no web check was needed.

## Corrected or omitted cases

| case | status | source | note |
|---|---|---|---|
| Bupivacaine onset | kept as text | KDT8 ch26 | Table 26.2 says "Interm." but the text says "slow onset". The card follows the text. |
| Epidural motor level ("motor paralysis is 4-5 segments caudal") | omitted | KDT8 ch26 | Wording ambiguous in the extracted text, so no card. |
| Remifentanil infusion dose | omitted | KDT8 ch27 | Printed as "mg/kg/min", which looks like a unit error. No card. |
| Sugammadex cyclodextrin type | kept without the Greek letter | KDT8 ch25 | Symbol garbled in extraction. The card says "modified cyclodextrin". |
| Table 26.3 site-to-drug rows | partly used | KDT8 ch26 | Row alignment is garbled. Only unambiguous rows (eye, anal canal, intact skin, oesophagus) are carded. |
| Table 27.2 (i.v. agents vs vital functions) | not used | KDT8 ch27 | Arrows did not extract. Text used instead. |
| Table 25.2 succinylcholine histamine grade | kept as printed | KDT8 ch25 | Table gives "++". Text says it causes histamine release. |

No WebSearch cross-checks were needed. No statement was corrected from another owner book.

## Reconciled with study deck

Checked against the GG14/Katzung corrections in `review/p2-anaesthetics.md`. Deck now 497 cards (24 class).

| id | change | ref |
|---|---|---|
| rf-p2-anaesthetics-0109 | Sugammadex dose now Katzung 2/4/16 mg/kg by depth of block | KDT8 ch25, GG14 ch13, Katzung16 ch27 |
| rf-p2-anaesthetics-0110 | Sugammadex ADRs: occasional anaphylaxis (about 0.3% at 16 mg/kg); contraceptive binding | KDT8 ch25, GG14 ch13, Katzung16 ch27 |
| rf-p2-anaesthetics-0085 | Cisatracurium histamine release "none" changed to "much less likely than atracurium" | KDT8 ch25, Katzung16 ch27 |
| rf-p2-anaesthetics-0040 | KDT histamine grading kept; added that flushing is clinically mainly d-TC, atracurium, mivacurium | KDT8 ch25, Katzung16 ch27, GG14 ch13 |
| rf-p2-anaesthetics-0380 | Halothane hepatitis about 1 in 10,000, about 50% fatal (GG14); KDT range noted | KDT8 ch27, GG14 ch24 |
| rf-p2-anaesthetics-0192 | Ring-block adrenaline ban marked as classical teaching, now questioned (Katzung) | KDT8 ch26, Katzung16 ch26 |
| rf-p2-anaesthetics-0497 | Added: etomidate 11-beta-hydroxylase inhibition, cortisol suppressed 4-8 h | KDT8 ch27, Katzung16 ch25 |

## Expansion pass (2026-11-02)
- Rapid: +5 (see deck). Refs KDT8 ch26.
- Target (+120 to +180) NOT met: chapter already carded; only name-level gaps found were added.

## Expansion pass 2 (2026-11-02)
- Rapid: +117 (rf-p2-anaesthetics-0511 onward; three duplicates removed): LA receptor and kinetics, pKa and onset, fibre sensitivity, adrenaline adjunct, systemic toxicity, amide vs ester, drug-specific synonyms and doses (lignocaine, amethocaine, cinchocaine, proparacaine, EMLA, bupivacaine, levobupivacaine, ropivacaine, cocaine), MAC and stages, inhalational agent properties, N2O, halothane, isoflurane, desflurane, ether, malignant hyperthermia treatment. Deck now 625.
- Target (+120) almost met: +117 added.

## Difficulty ladder pass
No rapid changes; audit found chapter facts already covered (623 cards).

## Checker
- No rapid changes this pass; rapid file grep clean of Prep/RR5 refs. Not re-read card by card.

## Checker
- Verified 20+ cards (009,010,022-029,045,089-097) against KDT8 ch25-26-27 text.
- Corrected 094: cisatracurium is not hydrolysed by plasma cholinesterase (KDT8 ch25); added rocuronium liver-clearance caveat.
- No Prep/RR5 refs. Ladder OK (every subtopic >=3 L1, 2 L2, 1 L3). No deletions.
- Not verified: 009 sugammadex 16 mg/kg (Katzung16 ref, not re-read).

## Gap pass: past-exam questions 191, 207, 572
- Added rf-p2-anaesthetics-0632 to 0645 (14 pairs) for the TOF, double-burst, PTC, in vitro NMB preparations, and the LA screening readouts. Sources as cited per pair in the deck log rows 099-111.

## Recheck (all new cards, chunk 2/2)
Checked rf-p2-anaesthetics-0576 to 0645 (67 ids) against KDT8 ch27, Katzung16 ch27 and Medhi PMECP (pp. 169-172, 228-230). 63 ok, 4 corrected, 0 deleted, 0 web or unsourced.
- rf-p2-anaesthetics-0637 corrected: the "large ACh release" mechanism is not printed in Katzung16 ch27; answer now "Posttetanic facilitation of transmission (during partial block)" (Katzung16 ch27).
- rf-p2-anaesthetics-0639 corrected: Medhi p169-170 describes the rat phrenic nerve-diaphragm as an ACh bioassay, and says NMBs "may be used" in it; question reworded to match (Medhi PMECP p169-170).
- rf-p2-anaesthetics-0641 ref narrowed: the rabbit corneal-reflex screen is Experiment 24A on p230, not p229-230 (Medhi PMECP p230).
- rf-p2-anaesthetics-0642 corrected: procaine 1% is placed in the abdominal cavity to reach the sciatic nerve; the old answer said "on sciatic nerve" (Medhi PMECP p229).

## Recheck (all new cards, chunk 2/2), second pass
Checked the 67 ids in chunk 2/2 (rf-p2-anaesthetics-0576 to 0645) again against KDT8 ch27 (text read in full), Katzung16 ch27 (pdftotext of the chapter parts) and Medhi PMECP. Medhi citations use printed page numbers (PDF page = printed + 16): exp. 16D p169-170, 16E p171-172, 23A p228, 23B p229, 24A p230.
Result: 58 ok, 1 corrected, 8 deleted (duplicates), 0 web or unsourced.

- rf-p2-anaesthetics-0637 corrected: the previous pass said the ACh-release mechanism is not in Katzung16 ch27. That was wrong: Katzung16 ch27 says tetanic stimulation "releases a large quantity of acetylcholine" and is followed by posttetanic facilitation. Answer now: "Tetanus releases a large quantity of ACh: posttetanic facilitation (partial block)" (Katzung16 ch27).
- Deleted as duplicates (the older partner kept; ids of other cards unchanged):
  - rf-p2-anaesthetics-0580 (same as 0341: electrical silence above 2 MAC)
  - rf-p2-anaesthetics-0585 (same as 0320: spinal cord, immobility)
  - rf-p2-anaesthetics-0586 (same as 0319: cortex and hippocampus, amnesia)
  - rf-p2-anaesthetics-0588 (same as 0322: GABA-A potentiators)
  - rf-p2-anaesthetics-0597 (same as 0346: low blood solubility agents)
  - rf-p2-anaesthetics-0627 (same as 0312: Simpson, chloroform, 1847)
  - rf-p2-anaesthetics-0628 (same as 0314: halothane 1956)
  - rf-p2-anaesthetics-0636 (same as 0013: fade)
- Kept but flagged for the chunk 1 owner (outside this chunk, not edited): rf-p2-anaesthetics-0035 duplicates rf-p2-anaesthetics-0635, which is the better card (it states the tetanus-then-single-twitch method), so 0035 should be deleted. Also 0346 and 0322 use "list all" for lists that KDT8 ch27 gives as examples ("e.g.") or as "many" agents; reword them to examples.
- Checked and left as written: 0576-0631 (KDT8 ch27 facts: MAC, plane signs, agent properties, dates); 0598 halothane metabolism "about 20%" (text gives ~20% and >20% in two places); 0632-0637 (Katzung16 ch27 monitoring definitions); 0638-0645 (Medhi exp. 16D/16E, 23A/23B, 24A; procedure and times match the printed text).
- Study-deck fields (level, why-line) do not apply to rapid cards.


## Thin-coverage pass (cov-2 idx 230, 201)
| id | status | source |
|---|---|---|
| rf-p2-anaesthetics-0646 | new | Katzung16 PDF p482, KDT8 PDF p421 |
| rf-p2-anaesthetics-0647 | new | Katzung16 PDF p488, GG14 PDF p498 |
| rf-p2-anaesthetics-0648 | new | GG14 PDF p495 |
Added only for facts not already in the rapid deck (desflurane metabolism, compound A, remimazolam); the existing iso/des/sevo pairs (0383-0404, 0582, 0609-0614) were left alone.

## Independent fact-check (0646-0648), 2026-11-05
| id | status | source |
|---|---|---|
| rf-p2-anaesthetics-0646 | ok | Katzung16 PDF p482 (metabolism <0.05%), KDT8 PDF p421 (exhaled unchanged) |
| rf-p2-anaesthetics-0647 | corrected | Katzung16 PDF p488, GG14 PDF p498 |
| rf-p2-anaesthetics-0648 | ok | GG14 PDF p495 |

- 0647 corrected: answer is now "Compound A; no renal impairment in large human studies". GG14 p498 records transient biochemical renal injury in volunteers, so the earlier "no human renal injury reported" was too absolute. Question unchanged.
- 0646 and 0648 checked word by word on the cited pages; both pass. No q starts "What is"; subtopics valid; no Prep/RR5 refs; no deletions.
