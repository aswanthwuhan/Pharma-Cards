# Rapid Fire review: p2-arrhythmia-angina-htn

Sources: KDT8 ch39, ch40, ch41 (chapter PDFs, read in full). Cross-check: GG14 ch34 (Antiarrhythmic drugs). OCR books not used. Web search not used.

Deck: `content/rapid/p2-arrhythmia-angina-htn.json`, 642 cards (28 class), ids rf-p2-arrhythmia-angina-htn-0001 to -0642.

## Corrections (book statement looked wrong; fixed from GG14 ch34)

| id | card | book says | corrected to | source |
|---|---|---|---|---|
| rf-p2-arrhythmia-angina-htn-0183 | Sotalol class III mechanism | blocks "inward rectifier K+ channels" (KDT8 ch39) | blocks IKr, rapid delayed rectifier K+ current | GG14 ch34 |
| rf-p2-arrhythmia-angina-htn-0190 | Ibutilide mechanism | blocks "rapid inward rectifier K+ current (Ikr)" (KDT8 ch39) | blocks IKr (rapid delayed rectifier), also activates inward Na+ current | GG14 ch34 |

Card 0178 (sotalol type) keeps the KDT8 wording and does not restate the channel.

## Omissions (not grounded or unreadable in the book text)

- Table 39.1 (CCB electrophysiology arrows) and Table 40.2/40.3 layouts: arrow symbols lost in extraction; only the numeric PK values in Table 40.3 were used (read clearly).
- WPW maintenance table row (narrow vs wide QRS drug pairing): column layout ambiguous in extraction; omitted. Only the text rule used (verapamil contraindicated in broad-QRS WPW).
- Quinidine and dose-related numbers garbled in extraction are not used.
- Renal dosing threshold for high-ceiling diuretics ("Clcr 30 mg/ml") is garbled; card states the qualitative rule only.
- Procainamide, GTN patch and similar dosing taken only where text is clear; conflicting table values (GTN patch 14-16 h per table vs 24 h in text) omitted; card uses the text (24 h, remove 8-10 h daily).
- Appendix problem solutions (chapter end) not used; the problem-directed case text was not converted into cards.

## Reconciled with study deck

| id | change | ref |
|---|---|---|
| rf-p2-arrhythmia-angina-htn-0037 | amiodarone mortality benefit qualified (SCD-HeFT) (study card 017) | KDT8 ch39, GG14 ch34 |
| rf-p2-arrhythmia-angina-htn-0160 | same qualification on amiodarone long-term benefit (study card 007) | KDT8 ch39, GG14 ch34 |
| rf-p2-arrhythmia-angina-htn-0268 | beta blockers no longer "only antianginals that prolong life"; benefit after MI and in HF (study card 030) | KDT8 ch40, Katzung16 ch12 |
| rf-p2-arrhythmia-angina-htn-0372 | nicorandil: PDE-5 inhibitors contraindicated (study card 033) | KDT8 ch40, GG14 ch31 |
| rf-p2-arrhythmia-angina-htn-0384 | trimetazidine: EMA second-line add-on only (study card 032) | KDT8 ch40, GG14 ch31 |
| rf-p2-arrhythmia-angina-htn-0437, 0438 | stage I/II labelled as NICE 2011 (study card 045) | KDT8 ch41, GG14 ch32 |
| rf-p2-arrhythmia-angina-htn-0466 | step 4: NICE 2011 plus ESC 2018 spironolactone step (study card 058) | KDT8 ch41, GG14 ch32 |
| rf-p2-arrhythmia-angina-htn-0587 | low-dose aspirin in pregnancy: KDT plus GG14 81/100 mg early (study card 057) | KDT8 ch41, GG14 ch32, GG14 ch42 |
| rf-p2-arrhythmia-angina-htn-0643 | added: IV magnesium sulfate 1-2 g for torsades (study card 013) | KDT8 ch39, GG14 ch34 |
| rf-p2-arrhythmia-angina-htn-0644 | added: ACC/AHA 2017 threshold and target 130/80 (study card 045) | KDT8 ch41, GG14 ch32 |
| rf-p2-arrhythmia-angina-htn-0645 | added: ESC 2018 single-pill two-drug start (study card 058) | KDT8 ch41, GG14 ch32 |

## Expansion pass (2026-11-02)

- Source read: KDT8 ch39 (antiarrhythmics), ch40 (antianginals), ch41 (antihypertensives) in full. No other book searched in this pass.
- Coverage check: see p2-arrhythmia-angina-htn.md.
- Rapid: +4 cards (rf-p2-arrhythmia-angina-htn-0679 to rf-p2-arrhythmia-angina-htn-0682). Target of +120 to +180 not reached: the existing 677 cards already cover the chapters.
- Book conflicts: none found in KDT8 ch39-41.

| id | status | source |
|---|---|---|
| p2-arrhythmia-angina-htn-074 to p2-arrhythmia-angina-htn-086 | added | KDT8 ch39, ch40, ch41 |
| rf-p2-arrhythmia-angina-htn-0679 to rf-p2-arrhythmia-angina-htn-0682 | added | KDT8 ch40, ch41 |

Ladder pass: no rapid cards added; audit of 681 cards found chapter facts already covered (all rows ok).

## Checker (independent pass, 2026-11-03)

About 18 rapid cards checked against KDT8 ch39-41 and GG14 (pharm-tools search.py): 0037, 0160, 0268, 0372, 0384, 0437, 0438, 0466, 0587, 0643, 0644, 0645, 0680, 0681, 0682.

| id | status | source |
|---|---|---|
| rf-p2-arrhythmia-angina-htn-0384 | corrected | KDT8 ch40. Removed "EMA: second-line add-on only" (not printed). Kept the Europe/India/not UK or USA statement |
| rf-p2-arrhythmia-angina-htn-0682 | corrected | KDT8 ch41. Removed "half-life 40-50 hours" (not printed; the book gives about 48 hours) |
| rf-p2-arrhythmia-angina-htn-0037, 0160, 0268, 0372, 0437, 0438, 0466, 0587, 0643, 0644, 0645, 0680, 0681 | ok | KDT8 ch39-41; GG14 p638, p641, p645-646, p652, p704, p708, p852 |

Deletions: none. Prep/RR5 grep: no matches. Validator: no errors for this topic.

## Gap-fill PYQ additions (2026-11-03)

id | new | source

rf-p2-arrhythmia-angina-htn-0683-0694 | new (angina index, Langendorff, tail-cuff, DOCA, isoprenaline, placebo, crossover, CCB/diuretic/digoxin/minoxidil facts) | Satoskar p626-627; Medhi PMECP p192, p223, p230; Bennett & Brown p55, p64; KDT8 ch40-42; GG14 ch33-34
rf-p2-arrhythmia-angina-htn-0696-0724 | new (trimetazidine class label, nicorandil, acetazolamide, spironolactone, digoxin, vasodilator, comorbidity facts); 0695, 0697, 0698 dropped as duplicates of 0380, 0385, 0386 | KDT8 ch40-42; GG14 ch33-34

Checker (PYQ gap pass) 2026-11-03: rapid 0683-0724 checked. rf-p2-arrhythmia-angina-htn-0717 corrected: beta blocker plus diuretic avoidance not in books; now thiazide glucose effect (KDT8 ch41). Deleted: none. Prep/RR5 refs: none. Validator --check: ok.

## PYQ gap fill, EP (2026-11-03)

id | new | source
rf-p2-arrhythmia-angina-htn-0725 to 0741 | new (phase-4, pacemaker, Na+/Ca2+ phase 0, conduction velocities, ERP recovery, -55 mV, vagal and sympathetic effects, slow- and fast-channel blockers, ERP/APD, latent pacemakers) | KDT8 p521-523 (Section 8 intro)

Checker (PYQ gap pass) 2026-11-03: rapid 0725-0741 checked against KDT8 pp 521-523 (Section 8 intro; the EP passage is not in the ch39 PDF). Citation fixed from ch39. Deleted: none. Prep/RR5 refs: none. Validator --check: ok.

## Thin-coverage PYQ cards (2026-11-05)

id | new | source
rf-p2-arrhythmia-angina-htn-0742 | new (phase-1 notch = Ito) | GG14 ch34; Katzung16 ch14
rf-p2-arrhythmia-angina-htn-0743 | new (IKr is the hERG/Kv11.1 current blocked by most class III drugs) | Katzung16 ch14; GG14 ch34
rf-p2-arrhythmia-angina-htn-0744 | new (IK1 holds the resting potential) | Katzung16 ch14; GG14 ch34
rf-p2-arrhythmia-angina-htn-0745 | new (IKur = Kv1.5, atrial ultra-rapid delayed rectifier) | Katzung16 ch14; GG14 ch34
rf-p2-arrhythmia-angina-htn-0746 | new (vernakalant: IV, recent-onset AF) | Katzung16 ch14
rf-p2-arrhythmia-angina-htn-0747 | new (vernakalant: mild QT prolongation, no torsades) | Katzung16 ch14

Thin-coverage pass 2026-11-05 (cov-1 idx 111, 170). No individual cardiac K+ current and no vernakalant pair existed in the deck before; the class III and dofetilide/ibutilide pairs (0052, 0184-0193, 0658-0661) were re-read and left unchanged. Deleted: none. Prep/RR5 refs: none. Validator --check: ok.

## Fact-check pass, thin-coverage pairs (2026-11-05)

id | corrected | source
rf-p2-arrhythmia-angina-htn-0742 | refs page-precise (Ito notch GG14 p688; Kv4.2/4.3 and Kv1.4 Katzung p252) | GG14 ch34 PDF p688; Katzung16 ch14 PDF p252
rf-p2-arrhythmia-angina-htn-0743 | refs page-precise; "most class III drugs prolong AP by blocking IKr" verified (GG14 ch34 p697) | Katzung16 ch14 PDF p252; GG14 ch34 PDF p688, p697
rf-p2-arrhythmia-angina-htn-0744 | refs page-precise (IK1/Kir2.1 and resting potential) | Katzung16 ch14 PDF p252; GG14 ch34 PDF p687
rf-p2-arrhythmia-angina-htn-0745 | refs page-precise (ultra-rapid atrial IKur, Kv1.5) | Katzung16 ch14 PDF p252, p254; GG14 ch34 PDF p688
rf-p2-arrhythmia-angina-htn-0746 | corrected: "recent-onset" dropped (Katzung says rapid termination of AF, not recent-onset); ref page-precise | Katzung16 ch14 PDF p269
rf-p2-arrhythmia-angina-htn-0747 | ref page-precise; mild QT prolongation and no torsades verified verbatim in substance | Katzung16 ch14 PDF p269

Deleted: none. No q starts "What is"; all six are short reversible facts. Validator --check: ok.
