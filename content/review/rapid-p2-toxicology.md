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

## Expansion pass (2026-11-02)

Rapid deck: +123 cards (rf-p2-toxicology-0731 to 0853). Refs: Katzung16 ch57, Katzung16 ch58, KDT8 ch68. No WEB or UNSOURCED refs added. 51 candidate pairs were dropped as duplicates or near-duplicates of cards already in the deck.

Book conflicts: none found. KDT8 ch68 chelator doses are used only for the chelator cards, and Katzung16 ch57 and ch58 are used for the rest.

> Note (2026-11-02): Prep/RR5 page refs mentioned above are historical. PrepLadder sources are banned; those refs were removed from the cards and re-grounded elsewhere or marked UNSOURCED.

| rf-p2-toxicology-0854 to 0857 | new | Katzung16 ch56-58 |

## Checker (independent pass)

| id | status | source | note |
| rf-p2-toxicology-0854 | ok | Katzung16 ch58 (p1081) | CO antidote: 100% O2, hyperbaric option |
| rf-p2-toxicology-0855 | ok | Katzung16 ch56 (p1080) | CO about 220 times haemoglobin affinity |
| rf-p2-toxicology-0856 | corrected | KDT8 ch68 (p977) | Wilson disease chelator: ref changed from Katzung16 ch57 (not verified) to KDT8 ch68 |
| rf-p2-toxicology-0857 | ok | Katzung16 ch58 (p1119) | Physostigmine avoided in TCA overdose (heart block, asystole) |

Numbering check: 0854-0857 follow max existing 0853; no duplicates. Validator --check: ok.

## Exam-gap additions (PYQ batch)

id | new | source
--- | --- | ---
rf-p2-toxicology-0858 | new | Katzung16 ch56
rf-p2-toxicology-0859 | new | Sarkar p16-20
rf-p2-toxicology-0860 | new | Katzung16 ch56
rf-p2-toxicology-0861 | new | Katzung16 ch56
rf-p2-toxicology-0862 | new | Sarkar p16-20
rf-p2-toxicology-0863 | new | Sarkar p16-25
rf-p2-toxicology-0864 | new | Sarkar p16-20
rf-p2-toxicology-0865 | new | Sarkar p16-20
rf-p2-toxicology-0866 | new | Katzung16 ch56
rf-p2-toxicology-0867 | new | GG14 ch76
rf-p2-toxicology-0868 | new | GG14 ch76; Katzung16 ch56
rf-p2-toxicology-0869 | new | GG14 ch76
rf-p2-toxicology-0870 | new | GG14 ch76
rf-p2-toxicology-0871 | new | Katzung16 ch56
rf-p2-toxicology-0872 | new | GG14 ch76
rf-p2-toxicology-0873 | new | GG14 ch9
rf-p2-toxicology-0874 | new | Katzung16 ch56
rf-p2-toxicology-0875 | new | Katzung16 ch56
rf-p2-toxicology-0876 | new | KDT8 ch6
rf-p2-toxicology-0877 | new | KDT8 ch6
rf-p2-toxicology-0878 | new | GG14 ch1
rf-p2-toxicology-0879 | new | KDT8 ch6
rf-p2-toxicology-0880 | new | Katzung16 ch56
rf-p2-toxicology-0881 | new | GG14 ch76
rf-p2-toxicology-0882 | new | GG14 ch5
rf-p2-toxicology-0883 | new | GG14 ch24
rf-p2-toxicology-0884 | new | GG14 ch24
rf-p2-toxicology-0885 | new | GG14 ch5
rf-p2-toxicology-0886 | new | GG14 ch24
rf-p2-toxicology-0887 | new | GG14 ch24
rf-p2-toxicology-0888 | new | GG14 ch70
rf-p2-toxicology-0889 | new | GG14 ch70
rf-p2-toxicology-0890 | new | GG14 ch70
rf-p2-toxicology-0891 | new | KDT8 ch14
rf-p2-toxicology-0892 | new | KDT8 ch14
rf-p2-toxicology-0893 | new | KDT8 ch14
rf-p2-toxicology-0894 | new | KDT8 ch14

Checker (PYQ gap pass): deleted rf-p2-toxicology-0870 (Sweden 1970 / US 1972 DDT ban dates not found in owner books), rf-p2-toxicology-0874 (maternal PFAS infant adiposity not found in owner books), rf-p2-toxicology-0894 (paracetamol antidote 16 h timing not found in KDT8 ch14). All other new rapid cards checked against GG14, Katzung16 ch56, KDT8 and Sarkar p16-25 and kept. Validator --check ok.

Gap pass (PYQ entries 398, p2-toxicology): added rf-p2-toxicology-0895 to 0911 covering saturated elimination, modified-release absorption, protein binding, tramadol M1, haemodialysis removal factors, and CCB overdose pattern, calcium, insulin, decontamination and rescue options. All cited to GG14 ch9 or Katzung16 ch58 (grounded from the book text read this pass). Validator --check ok.

rf-p2-toxicology-0895 | new | GG14 ch9
rf-p2-toxicology-0896 | new | GG14 ch9
rf-p2-toxicology-0897 | new | GG14 ch9
rf-p2-toxicology-0898 | new | GG14 ch9
rf-p2-toxicology-0899 | new | GG14 ch9
rf-p2-toxicology-0900 | new | GG14 ch9
rf-p2-toxicology-0901 | new | GG14 ch9
rf-p2-toxicology-0902 | new | GG14 ch9
rf-p2-toxicology-0903 | new | Katzung16 ch58
rf-p2-toxicology-0904 | new | Katzung16 ch58
rf-p2-toxicology-0905 | new | Katzung16 ch58
rf-p2-toxicology-0906 | new | Katzung16 ch58
rf-p2-toxicology-0907 | new | Katzung16 ch58
rf-p2-toxicology-0908 | new | Katzung16 ch58
rf-p2-toxicology-0909 | new | Katzung16 ch58
rf-p2-toxicology-0910 | new | Katzung16 ch58
rf-p2-toxicology-0911 | new | Katzung16 ch58

## Recheck (all new cards, chunk 1/3)

Checked 48 Rapid Fire cards (rf-p2-toxicology-0731 to 0778) against Katzung16 ch58 (and ch56 where cited). Result: 46 kept, 1 corrected, 1 deleted, 0 unverifiable.

Corrected:
- rf-p2-toxicology-0749: question rewritten. Katzung Table 58-2 lists drugs for which haemodialysis may be indicated, not serum-level monitoring; answer now lists all nine.

Deleted:
- rf-p2-toxicology-0766: esmolol infusion dose (25-50 mcg/kg/min) is not printed in the owner books (Katzung ch58 gives propranolol or esmolol for beta-mediated hypotension, no dose).

## Recheck (all new cards, chunk 2/3)

Checked all 120 Rapid Fire cards in chunk 2 (rf-p2-toxicology-0779 to 0901, as listed in .tmp/recheck.json). Sources: Katzung16 ch56, ch57, ch58; KDT8 ch6, ch14, ch68; GG14 ch1, ch5, ch9, ch24, ch70, ch76; Sarkar OCR p16-20. This pass replaces the earlier chunk 2/3 section for the same ids. Its corrections (0794, 0803, 0805, 0825, 0830, 0831, 0863, 0869, 0879) were re-read against the sources and still hold.

Result: 110 kept, 10 corrected, 0 deleted, 0 unverifiable (no UNSOURCED or WEB refs in this chunk).

Corrected:
- rf-p2-toxicology-0801: the old question ("main danger") and answer overstated Katzung16 ch58. Question now asks for causes of death; answer lists the three causes the book gives (airway obstruction by flaccid tongue, aspiration of gastric contents, respiratory arrest).
- rf-p2-toxicology-0808: wording now follows Katzung16 ch58 ("far more damaging than useful").
- rf-p2-toxicology-0821: Katzung16 ch57 gives the minutes-to-hours timing from animal studies; answer now says so.
- rf-p2-toxicology-0828: content supported by Katzung16 ch58 (longer metal half-life in an organ means less effective chelation), not ch57; ref corrected.
- rf-p2-toxicology-0838: zinc and copper depletion is in Katzung16 ch57, not KDT8 ch68; refs now cite both.
- rf-p2-toxicology-0867: definition reworded to GG14 ch76 wording (modulating hormone production and/or signalling).
- rf-p2-toxicology-0868: GG14 ch76 names DDT, phthalates and bisphenol A as the EDC examples. Brominated flame retardants and PCBs are not on the cited pages and were removed.
- rf-p2-toxicology-0875: Katzung16 ch56 says modified endocrine responses have been observed in reptiles and marine invertebrates; the "seen early" wording was not in the book, so the question was reworded.
- rf-p2-toxicology-0884: the book's list of reducing agents includes iron (GG14 ch24); added.
- rf-p2-toxicology-0891: NAPQI is not named in the KDT8 ch14 text checked; added GG14 ch5 (abbreviation list, N-acetyl-p-benzoquinone imine).

Deleted: none.

Notes: chunk 2 contains only Rapid Fire cards, so no study-deck cards were changed. Validator (node scripts/validate-content.mjs --check) is clean.

## Recheck (all new cards, chunk 3/3)

Checked the 10 Rapid Fire cards in chunk 3 (rf-p2-toxicology-0902 to 0911). Sources: Katzung16 ch58 (PDF p1112-1120, incl. the calcium channel blocker passage on p1120) and GG14 ch9 (PDF p174-177). Chunk 3 has no study-deck cards.

Result: 1 kept as is, 1 corrected, 8 deleted (all duplicates), 0 unverifiable (no UNSOURCED or WEB refs in this chunk).

Corrected:
- rf-p2-toxicology-0911: ref was Katzung16 ch58. The definition of a poison is in GG14 ch9 (chapter introduction, PDF p174), so the ref is now GG14 ch9 and the answer is reworded.

Deleted (duplicates of earlier cards with the same fact; the kept card was checked against the same passage):
- rf-p2-toxicology-0902: duplicate of 0007 (large volume of distribution limits haemodialysis).
- rf-p2-toxicology-0904: duplicate of 0291 (verapamil and diltiazem overdose pattern).
- rf-p2-toxicology-0905: duplicate of 0292 (dihydropyridine overdose pattern).
- rf-p2-toxicology-0906: duplicate of 0293 (loss of dihydropyridine selectivity in massive overdose).
- rf-p2-toxicology-0907: duplicate of 0220 (IV calcium 2-10 g).
- rf-p2-toxicology-0908: duplicate of 0296 (high-dose insulin 0.5-1 unit/kg/h).
- rf-p2-toxicology-0909: duplicate of 0294 (whole bowel irrigation and charcoal).
- rf-p2-toxicology-0910: duplicate of 0295 (other rescue options; lipid emulsion stays there as case reports).

Kept as is: rf-p2-toxicology-0903 (Katzung16 ch58 p1117 lists molecular weight, water solubility, protein binding, endogenous clearance and distribution).

Owner note: Katzung16 p1118 (antidote table) says "start with 15 mg/kg IV" for calcium in severe CCB overdose, while the p1120 text gives 2-10 g IV. The kept cards follow the p1120 text. Owner may want to check this.

## Added 2026-11-05: PYQ gap "Define clinical toxicity and enumerate the most common drugs and chemicals responsible in adults"

| id | change | ref |
|---|---|---|
| rf-p2-toxicology-0912 | new class list: substances most often causing poisoning in adults | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0913 | new class list: substances most often causing poisoning in children up to 5 years | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0914 | new class list: substances causing the most poisoning deaths | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0915 | new: poison exposures per 100,000 population (2019) => 643 | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0916 | new: usual intent behind adult poisoning exposures => mostly intentional exposures or adverse reactions | GG14 ch9 PDF p181 |

## Recheck 2026-11-05 (independent check, reviewer 2)

Scope: rf-p2-toxicology-0912 to 0916 against GG14 ch9 PDF p181 (book p162).

| id | change | ref |
|---|---|---|
| rf-p2-toxicology-0912 | ok: adult exposure list matches Table 9-5 in book order | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0913 | ok: paediatric <=5 years list matches Table 9-5 in book order | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0914 | ok: fatality list matches Table 9-6 in book order | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0915 | ok: 643 per 100,000 (2019 NPDS report) | GG14 ch9 PDF p181 |
| rf-p2-toxicology-0916 | ok: adult exposures mostly intentional or adverse reactions | GG14 ch9 PDF p181 |

No copies, no Prep/RR5 refs, no "What is" questions. Deleted: none.
