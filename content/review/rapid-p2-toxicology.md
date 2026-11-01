# Rapid Fire review: p2-toxicology

Deck: `content/rapid/p2-toxicology.json` (688 cards, 71 class cards).

## Sources

- Katzung 16e ch56 (Occupational and environmental toxicology), ch57 (Heavy metals and chelators), ch58 (Management of the poisoned patient). Read in full via `pdftotext`.
- Goodman & Gilman 14e ch9 (Principles of clinical toxicology). Read from the chapter opening (book p156) to the bibliography, via `pdftotext` of the full book.
- KD Tripathi 8e ch68 (Chelating agents). Read in full. Used only for the two cards marked KDT8 ch68 (chelator choice and the disodium-salt warning). Chelator pharmacology was not re-carded.

## Corrected cases

None. No card was changed against a cross-check book. No statement was found wrong in the sources read.

## Notation and reading decisions

- Greek letters are dropped in the extracted text. Where a drug class could not be read with certainty, the item was omitted:
  - Katzung ch58 "hypotension with tachycardia" list: the final item (receptor agonist) is garbled, so only TCA, trazodone, quetiapine, vasodilators were kept.
  - Katzung ch58 hypokalaemia list: the "agonists" item is garbled, so only barium, caffeine, theophylline, thiazide and loop diuretics were kept.
  - Katzung ch58 hyperkalaemia list: "blockers" read as beta-blockers (Greek letter missing). This is an inference from context.
  - Katzung ch58 tricyclic mechanism list: the alpha-blocking item is garbled, so it was left out.
- Katzung ch57 prints "3,5-pyrimidine nucleotidase". Card keeps "pyrimidine nucleotidase" (standard name, no number).
- Serum osmolality formula: printed as "2 x Na + glucose/18 + BUN/3" (Katzung ch58). Kept as printed.
- GG14 Table 9-9 (toxidromes) and Table 9-10 are partly garbled in column order. Only the rows that are clear in running text or in the cleanly ordered lists were carded. Bradycardia list (Table 9-10) is taken from the printed order and is moderately confident.
- Katzung 58 Table 58-3 poison/antidote alignment is garbled in places. Mappings used: esmolol to theophylline, caffeine, metaproterenol; ethanol to methanol and ethylene glycol; glucagon to beta-blockers and CCBs (also in the running text). These match the running text.
- GG14 Table 9-14 (antidote list) is aligned line by line; mapping checked against the 34 antidotes and 34 indications printed.
- Charcoal and iron: Katzung ch58 says charcoal does not bind iron, lithium or potassium. Card kept.
- Sources give mixed ADI/PEL values in tables. Only values clearly legible in the table or text were used.

## Omitted

Points listed as GAP in `content/review/p2-toxicology.md` (no cards written, per brief):
- Snake envenomation. Katzung ch58 rattlesnake text, and the rattlesnake and North American coral snake antivenom entries in GG14 Table 9-14, are not carded. Spider (black widow) and scorpion antivenom cards are kept, because they are not snake envenomation. Caller may decide whether to keep the rattlesnake passage.
- Oleander. The digoxin antibody card does not name oleander (only digitoxin).
- Corrosive acid and alkali poisoning: charcoal-not-useful-for-corrosives, neutralisation not recommended (GG14), and corrosive mouth burns (Katzung ch58 exam) not carded.
- Kerosene and hydrocarbon pneumonia (Katzung ch58 chest film item): not carded.
- Aluminium/zinc phosphide, datura, Indian poison control services, Insecticides Act: not in the books read.
- Iron toxicity in detail: only antidote, WBI, charcoal non-binding, radiopacity, OTC prenatal vitamin dose, and anion gap were carded. KDT8 ch44 and Katzung ch33 were not used.

Other omissions:
- GG14 Table 9-6 (most common fatal substances): not carded, because the extracted list order could not be confirmed as table order.
- Katzung ch56 background (Deepwater Horizon, microplastics, climate and policy detail, reference lists): not carded as not exam facts.
- Solvents, nanomaterials, perfluoro compounds, dioxins: covered in Katzung 56 but not carded in the study deck. They are carded here (not GAP).

## Chelator cross-reference (p3-misc)

`content/rapid/p3-misc.json` (subtopic p3-misc-chelators) already carries KDT8 ch68 pharmacology for dimercaprol, succimer, penicillamine, edetate, desferrioxamine, deferiprone and deferasirox. Those cards were not repeated.

Cards written here only for the poisoning-management angle that p3-misc lacks: lead encephalopathy regimen and rebound, CDC chelation threshold, succimer dose and approval, arsenic chelation dose and timing, arsine (no chelator value), chronic mercury (dimercaprol avoided), unithiol (absent from p3), Prussian blue (absent), DTPA (absent), EDTA in anuria and nephrotoxicity limits, EDTA disodium trial, penicillamine penicillin-allergy caution, desferrioxamine with dialysis for aluminium, deferiprone neutropenia rates, essential metal loss with chelators, redistribution examples, and chelation timing for metals. Zinc with CaNa2EDTA and DTPA is the only trace-metal point not in p3-misc; it is carded.

## Cross-reference (p2-cholinergic)

Not repeated: OP poisoning presentation, atropine regimen and effects, pralidoxime dose and carbamate restriction, oxime list, OP delayed neuropathy basics, physostigmine absorption and eye use, muscarinic mushroom reversal (already in p2-cholinergic rf-...-0175 to 0188).

Added only where absent from p2-cholinergic: OP intermediate syndrome, OPIDP mechanism, chronic OP neurotoxin list, G-series nerve agents, VX potency, carbamate therapeutic index and persistence, carbamate list, physostigmine dose and TCA contraindication (poisoning angle, in the antidotes subtopic).

## Count by subtopic

| subtopic | cards |
|---|---|
| p2-toxicology-principles | 77 |
| p2-toxicology-management | 129 |
| p2-toxicology-antidotes | 52 |
| p2-toxicology-drug-overdose | 91 |
| p2-toxicology-heavy-metals | 159 |
| p2-toxicology-gases | 98 |
| p2-toxicology-pesticides | 82 |
| **total** | **688 (71 class)** |

Brief validation check: `ok 688 71 class`. Two answers are 16 words (within the "where possible" limit).
