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

## Completion pass

New study cards (not in HEAD) were checked against their cited sources. Rapid cards added: 21 (rf-p2-toxicology-0689 to rf-p2-toxicology-0709).

- rf-p2-toxicology-0689: Datura (dhatura) poisoning: other name | Sarkar p6-10; Prep p96-100; Prep p101-105
- rf-p2-toxicology-0690: Datura: phytochemicals of the atropine-source plant | Sarkar p6-10; Prep p96-100; Prep p101-105
- rf-p2-toxicology-0691: Datura poisoning: toxicity type and antidote | Sarkar p6-10; Prep p96-100; Prep p101-105
- rf-p2-toxicology-0692: Scorpion venom: receptor stimulated and haemodynamic result | Prep p131-135; Prep p136-140; RR5 p11-15
- rf-p2-toxicology-0693: Scorpion sting: drug of choice for the hypertension | Prep p131-135; Prep p136-140; RR5 p11-15
- rf-p2-toxicology-0694: Prazosin in scorpion sting: first-dose precaution | Prep p131-135; Prep p136-140; RR5 p11-15
- rf-p2-toxicology-0695: Scorpion sting: drug for seizures | Prep p136-140
- rf-p2-toxicology-0696: Scorpion sting: drug for muscle spasm and pain | Prep p136-140
- rf-p2-toxicology-0697: Scorpion sting: intramuscular adrenaline is given for | Prep p136-140
- rf-p2-toxicology-0698: Cobra and krait venom: mechanism of paralysis | Prep p91-95
- rf-p2-toxicology-0699: Cobra and krait bite: drug of choice | Prep p91-95
- rf-p2-toxicology-0700: Neostigmine added for paralysis after cobra or krait bite: why | Prep p91-95
- rf-p2-toxicology-0701: Atropine added with neostigmine for snake paralysis: why | Prep p91-95
- rf-p2-toxicology-0702: US rattlesnake bite: field remedies to avoid: list all | Katzung16 ch58
- rf-p2-toxicology-0703: Rattlesnake bite: how to limit spread of venom | Katzung16 ch58
- rf-p2-toxicology-0704: Rattlesnake bite: definitive treatment | Katzung16 ch58
- rf-p2-toxicology-0705: Bedside clue: corrosive poisoning | Katzung16 ch58
- rf-p2-toxicology-0706: Bedside clue: hydrocarbon solvent poisoning | Katzung16 ch58
- rf-p2-toxicology-0707: Chest radiograph finding after hydrocarbon poisoning | Katzung16 ch58
- rf-p2-toxicology-0708: Halogenated hydrocarbon solvents: organs injured | Katzung16 ch56
- rf-p2-toxicology-0709: PFOA: persistence and endocrine effect | Katzung16 ch56

Skipped or handled elsewhere:
- p2-toxicology-055 (iron-containing prenatal multivitamins, 10-12 tablets) already covered by an existing card. Not repeated.

## Gap closure (term scan)

Rapid cards added: 6, rf-p2-toxicology-0710 to rf-p2-toxicology-0715.

- rf-p2-toxicology-0710: Induced emesis contraindicated in: list all | KDT8 ch6; Prep p586-590
- rf-p2-toxicology-0711: Hydrocarbons and organic solvents: bound by activated charcoal? | KDT8 ch6
- rf-p2-toxicology-0712: Plants with digoxin-like cardiac glycosides: list all | Katzung16 ch13
- rf-p2-toxicology-0713: Inhalant abuse substances: list all | Katzung16 ch32
- rf-p2-toxicology-0714: Chronic aromatic hydrocarbon exposure: CNS lesion | Katzung16 ch32
- rf-p2-toxicology-0715: Inhalant overdose treatment | Katzung16 ch32

Still uncovered: aluminium phosphide (absent from books).

## Web-sourced cards (owner approved)

Added 2026-11-01 under the web exception in GROUNDING-RULES.md. Status for owner review: web.

| id | status | source |
|---|---|---|
| rf-p2-toxicology-0716 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0717 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0718 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0719 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0720 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0721 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0722 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0723 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0724 | web | https://pmc.ncbi.nlm.nih.gov/articles/PMC6996659/ |
| rf-p2-toxicology-0725 | web | https://www.aiims.edu/index.php/en/npic_intro |
| rf-p2-toxicology-0726 | web | https://www.aiims.edu/index.php/en/npic_intro |
| rf-p2-toxicology-0727 | web | https://development.delhi.gov.in/sites/default/files/development/pdf_files/the_insecticidesact-1968.pdf |
| rf-p2-toxicology-0728 | web | https://development.delhi.gov.in/sites/default/files/development/pdf_files/the_insecticidesact-1968.pdf |
| rf-p2-toxicology-0729 | web | https://development.delhi.gov.in/sites/default/files/development/pdf_files/the_insecticidesact-1968.pdf |
| rf-p2-toxicology-0730 | web | https://development.delhi.gov.in/sites/default/files/development/pdf_files/the_insecticidesact-1968.pdf |

## PrepLadder removal and PDF re-grounding (2026-11-02)

| id | status | new refs | note
| rf-p2-toxicology-0689 | corrected | KDT8 PDF p148 | Belladonna poisoning is the broader category, not a name |
| rf-p2-toxicology-0690 | regrounded | GG14 PDF p232 | |
| rf-p2-toxicology-0691 | regrounded | KDT8 PDF p148; KDT8 PDF p138 | |
| rf-p2-toxicology-0692 | corrected | Padmaja Medical Pharmacology 7e PDF p738 | Alpha-1 receptor claim not printed; removed |
| rf-p2-toxicology-0693 | corrected | Padmaja Medical Pharmacology 7e PDF p738; KDT8 PDF p171 | Prazosin or nifedipine (Padmaja p738); not drug of choice |
| rf-p2-toxicology-0694 | corrected | KDT8 PDF p171 | Night-dose advice not printed; kept early postural hypotension |
| rf-p2-toxicology-0695 | unsourced | none | Diazepam for scorpion seizures not found |
| rf-p2-toxicology-0696 | unsourced | none | Lignocaine for scorpion spasm not found |
| rf-p2-toxicology-0697 | unsourced | none | IM adrenaline for scorpion anaphylaxis not found |
| rf-p2-toxicology-0698 | regrounded | KDT8 PDF p138; GG14 PDF p254 | Limited to cobra venom |
| rf-p2-toxicology-0699 | corrected | KDT8 PDF p138 | Specific antivenom serum is primary treatment; "drug of choice" for cobra and krait not supported |
| rf-p2-toxicology-0700 | corrected | KDT8 PDF p138; KDT8 PDF p132 | Limited to cobra; krait not covered |
| rf-p2-toxicology-0701 | regrounded | KDT8 PDF p148; KDT8 PDF p138 | Limited to cobra |
| rf-p2-toxicology-0710 | regrounded | KDT8 PDF p722; KDT8 PDF p112; Satoskar PDF p117 | KDT8 ch6 kept |
