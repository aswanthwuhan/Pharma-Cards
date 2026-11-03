# Rapid review log: p3-research-biostats

Rapid deck built from the study deck `content/decks/p3-research-biostats.json` and checked against the cited passages: Sarkar OCR p181-185, p196-210, p356-390, p506-515; Rang and Dale 9e (NNT passage, p. 1-400 text layer); Katzung16 appendix 2 (PH 1.2 evidence-based medicine).

Cards: 122 total, 15 class, 0 deleted. Per subtopic: descriptive 24, epi-measures 19, inference 16, tests 25, evidence 19, protocol 19. The control-group types list was not repeated because p1-drug-dev already carries it (card 0122).

Corrections: none to the study deck facts. Most card wording was checked against the OCR text (descriptive statistics, epidemiological measures, P values and error types, t test and ANOVA details, non-parametric choice, forest plot, reporting guidelines). A few standard-definition cards rest on the study deck wording and were not found line by line in the OCR: the hypothesis-testing steps list, the P value definition, and the chi-square attribution to Karl Pearson. Two cards were narrowed to what the OCR text states (meta-analysis strengths and disadvantages). One awkward question was reworded (randomisation for a very small study).

Coverage limits: the protocol and control-group cards (p181-210) were checked against the OCR text for the main items (control-group types and definitions, randomisation methods, cluster sampling numbers, industry-funding conflict, CONSORT 25 items). The protocol component lists come from the study deck and were not re-verified line by line.

## Omitted: review-log gaps (not written)

- Correlation and regression; named non-parametric tests (Mann-Whitney, Wilcoxon, Kruskal-Wallis).
- Sample-size formulae.
- Sensitivity, specificity and predictive values.
- Survival analysis.
- Statistical software.
- Authorship criteria, plagiarism, duplicate publication.
- Literature search strategy (only database names are carded, inside the meta-analysis steps).

## Omitted: other points

- Sarkar p376-380: the claim that type I error is "more serious" and the description of changing the significance level were carded only as the standard definition and decision table. The "interpret at 3% level" sentence was not carded.
- Sarkar p386-390: the chi-square formula is garbled in OCR, so no formula is printed on any card.
- Sarkar p356-365: the statement that nominal and ordinal data use "histogram" tools was not carded.
- Sarkar p366-370: worked numeric examples (breast cancer, uterine cancer, lung cancer prevalence) were not carded as numeric cards.
- Sarkar p371-375 probability rules (addition, multiplication, binomial, conditional probability, apple example): not carded in this deck; the study deck does not cover them, and the NMC list in the review log does not require them.

## Cross-references: overlap with other rapid decks

- Trial design points (phases, randomisation rationale, stratified randomisation, bias, blinding, type I and II error definitions, power, sample-size determinants) are in `content/decks/p4-clinical-trials.json`. This deck's cards on randomisation methods and control groups are phrased as the statistics and protocol detail, not as trial design. No card was copied from another rapid deck.
- No card in `content/rapid/p3-tb-leprosy.json`, `content/rapid/p3-antiparasitic.json` or `content/rapid/p1-drug-dev.json` was repeated.

## Node check

`ok 122 15 class` (brief check run on `content/rapid/p3-research-biostats.json`).

## Completion pass

New study cards (not in HEAD) were checked against their cited sources. Rapid cards added: 3 (rf-p3-research-biostats-0123 to rf-p3-research-biostats-0125).

- rf-p3-research-biostats-0123: Central value and spread pairs reported in results: list all | Sarkar p511-515
- rf-p3-research-biostats-0124: Kaplan-Meier plot: axes in the rizatriptan example | RangDale9 ch16
- rf-p3-research-biostats-0125: Kaplan-Meier rizatriptan example: groups compared | RangDale9 ch16

Skipped or handled elsewhere:
- None skipped.

## Gap closure (term scan)

Rapid cards added (reversible pairs): 14, rf-p3-research-biostats-0126 to rf-p3-research-biostats-0139. Study cards 040-047 cover the same facts.

- rf-p3-research-biostats-0126: Standard error of the mean as sample size rises | Sarkar p361-365
- rf-p3-research-biostats-0127: Where the sample size calculation is stated in a trial report | Sarkar p511-515
- rf-p3-research-biostats-0128: Result of an inadequate sample size calculation | Sarkar p511-515
- rf-p3-research-biostats-0129: Power usually accepted for a clinical trial | RangDale9 ch8
- rf-p3-research-biostats-0130: Relative seriousness of type II vs type I error | RangDale9 ch8
- rf-p3-research-biostats-0131: Subjects needed to detect a 50% to 40% mortality fall | RangDale9 ch8
- rf-p3-research-biostats-0132: Patients exposed before the first case of a 1-in-10,000 toxicity | Katzung16 ch1
- rf-p3-research-biostats-0133: Where rare drug toxicities are first detected | Katzung16 ch1
- rf-p3-research-biostats-0134: Effect of a larger trial on the smallest detectable relative risk | GG14 ch8
- rf-p3-research-biostats-0135: Mann-Whitney test (two independent groups) | Sarkar p381-385
- rf-p3-research-biostats-0136: Kruskal-Wallis test (more than two independent groups) | Sarkar p381-385
- rf-p3-research-biostats-0137: Wilcoxon test (two repeated conditions) | Sarkar p381-385
- rf-p3-research-biostats-0138: Friedman's test (more than two repeated conditions) | Sarkar p381-385
- rf-p3-research-biostats-0139: Spearman correlation (parametric: Pearson) | Sarkar p381-385

Still uncovered: sample-size formula for a trial; correlation coefficient concept and regression; diagnostic sensitivity and specificity (see study log).

## Web-sourced cards (owner approved)

| id | status | source URL |
|---|---|---|
| rf-p3-research-biostats-0140 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |
| rf-p3-research-biostats-0141 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |
| rf-p3-research-biostats-0142 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |
| rf-p3-research-biostats-0143 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |
| rf-p3-research-biostats-0144 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |
| rf-p3-research-biostats-0145 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |
| rf-p3-research-biostats-0146 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK557491/ |

## Web-sourced cards, second pass (owner approved)

| id | status | source URL |
|---|---|---|
| rf-p3-research-biostats-0147 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK606101/ |
| rf-p3-research-biostats-0148 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK606101/ |
| rf-p3-research-biostats-0149 | web | https://www.ncbi.nlm.nih.gov/sites/books/NBK606101/ |


## Gap closure: web-sourced cards (owner approved, 2026-11-01)

Cards written from official or authoritative web sources (Europe PMC open-access articles) under the GROUNDING-RULES exception. Status `web` for owner review; all `draft`.

| id | status | source |
|---|---|---|
| rf-p3-research-biostats-0150 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0151 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0152 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0153 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0154 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0155 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0156 | web | https://europepmc.org/article/PMC/PMC13562950 |
| rf-p3-research-biostats-0157 | web | https://europepmc.org/article/PMC/PMC13562950 |

## Unsourced cards (owner approved, 2026-11-02)

Gap from SOURCE-GAPS.md: Sample-size formulas (two means, two proportions, single proportion) and Z values. Written under the GROUNDING-RULES "unsourced" exception; all `draft`. Rows marked `unsourced` cite "UNSOURCED - owner must verify" and need the owner's check; rows marked `ok` are fully book-sourced.

| id | status | source |
|---|---|---|
| rf-p3-research-biostats-0158 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0159 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0160 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0161 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0162 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0163 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0164 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0165 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0166 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0167 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0168 | unsourced | UNSOURCED - owner must verify |
| rf-p3-research-biostats-0169 | unsourced | UNSOURCED - owner must verify |

## Ladder pass
- rf-p3-research-biostats-0182 | new | Sarkar p366-370
- rf-p3-research-biostats-0183 | new | RangDale9 ch8
- rf-p3-research-biostats-0184 | new | WEB StatPearls NBK557491

## Checker (independent pass)

Deleted 11 Rapid cards whose only source was StatPearls (outside the web exception in GROUNDING-RULES.md): rf-p3-research-biostats-0140 to 0149 (diagnostic accuracy formulas, Pearson r, regression variable types) and rf-p3-research-biostats-0184 (prevalence effect on test values). Same gap as the study deck: no owner book found covering these.

Rapid Sarkar-cited cards (0001 to 0040) were read but not line-checked against the OCR; the study-deck checks cover the same facts. Non-owner refs and UNSOURCED rows that remain are the SOURCE-GAPS sample-size items only.

## Gap fill: Rapid pairs for PYQ entries 34, 60, 82, 137, 352, 355, 360, 393, 573 (writer, 2026-11-03)

Added 78 pairs (0184-0261) covering the same chapters as the study cards 077-109. No pair cites PrepLadder material.

- rf-p3-research-biostats-0184 | new | Ghosh FEP PDF p218
- rf-p3-research-biostats-0185 | new | Ghosh FEP PDF p218
- rf-p3-research-biostats-0186 | new | Ghosh FEP PDF p218
- rf-p3-research-biostats-0187 | new | Ghosh FEP PDF p215
- rf-p3-research-biostats-0188 | new | Ghosh FEP PDF p215
- rf-p3-research-biostats-0189 | new | Ghosh FEP PDF p216
- rf-p3-research-biostats-0190 | new | Ghosh FEP PDF p216
- rf-p3-research-biostats-0191 | new | Ghosh FEP PDF p216
- rf-p3-research-biostats-0192 | new | Ghosh FEP PDF p216
- rf-p3-research-biostats-0193 | new | Ghosh FEP PDF p216
- rf-p3-research-biostats-0194 | new | Sarkar p356-360
- rf-p3-research-biostats-0195 | new | Sarkar p361-365
- rf-p3-research-biostats-0196 | new | Sarkar p361-365
- rf-p3-research-biostats-0197 | new | Sarkar p361-365
- rf-p3-research-biostats-0198 | new | Sarkar p361-365
- rf-p3-research-biostats-0199 | new | Sarkar p81-85; Bennett PDF p76
- rf-p3-research-biostats-0200 | new | Sarkar p206-210
- rf-p3-research-biostats-0201 | new | Sarkar p206-210
- rf-p3-research-biostats-0202 | new | Sarkar p371-375
- rf-p3-research-biostats-0203 | new | Sarkar p371-375
- rf-p3-research-biostats-0204 | new | Sarkar p371-375
- rf-p3-research-biostats-0205 | new | RangDale9 PDF p119
- rf-p3-research-biostats-0206 | new | RangDale9 PDF p119
- rf-p3-research-biostats-0207 | new | RangDale9 PDF p119
- rf-p3-research-biostats-0208 | new | Sarkar p371-375
- rf-p3-research-biostats-0209 | new | RangDale9 PDF p119
- rf-p3-research-biostats-0210 | new | RangDale9 PDF p119
- rf-p3-research-biostats-0211 | new | RangDale9 PDF p119
- rf-p3-research-biostats-0212 | new | Sarkar p21-25
- rf-p3-research-biostats-0213 | new | Sarkar p21-25
- rf-p3-research-biostats-0214 | new | Bioequivalence & Statistics PDF p36
- rf-p3-research-biostats-0215 | new | Bioequivalence & Statistics PDF p36
- rf-p3-research-biostats-0216 | new | Bioequivalence & Statistics PDF p36
- rf-p3-research-biostats-0217 | new | Bioequivalence & Statistics PDF p36
- rf-p3-research-biostats-0218 | new | GG14 PDF p1527
- rf-p3-research-biostats-0219 | new | Medhi PMECP p119
- rf-p3-research-biostats-0220 | new | Medhi PMECP p119
- rf-p3-research-biostats-0221 | new | Medhi PMECP p352
- rf-p3-research-biostats-0222 | new | Medhi PMECP p352
- rf-p3-research-biostats-0223 | new | Medhi PMECP p353
- rf-p3-research-biostats-0224 | new | Medhi PMECP p353
- rf-p3-research-biostats-0225 | new | Sarkar p151-155
- rf-p3-research-biostats-0226 | new | Sarkar p151-155
- rf-p3-research-biostats-0227 | new | Sarkar p156-160
- rf-p3-research-biostats-0228 | new | Sarkar p156-160
- rf-p3-research-biostats-0229 | new | Sarkar p156-160
- rf-p3-research-biostats-0230 | new | Sarkar p156-160
- rf-p3-research-biostats-0231 | new | Sarkar p196-200
- rf-p3-research-biostats-0232 | new | Sarkar p196-200
- rf-p3-research-biostats-0233 | new | Sarkar p196-200
- rf-p3-research-biostats-0234 | new | Sarkar p196-200
- rf-p3-research-biostats-0235 | new | Sarkar p196-200
- rf-p3-research-biostats-0236 | new | Sarkar p196-200
- rf-p3-research-biostats-0237 | new | Sarkar p196-200
- rf-p3-research-biostats-0238 | new | Sarkar p156-160
- rf-p3-research-biostats-0239 | new | KDT8 ch3
- rf-p3-research-biostats-0240 | new | KDT8 ch3
- rf-p3-research-biostats-0241 | new | KDT8 ch3
- rf-p3-research-biostats-0242 | new | KDT8 ch3
- rf-p3-research-biostats-0243 | new | Ghosh FEP PDF p104
- rf-p3-research-biostats-0244 | new | Ghosh FEP PDF p107
- rf-p3-research-biostats-0245 | new | Ghosh FEP PDF p107
- rf-p3-research-biostats-0246 | new | Ghosh FEP PDF p107
- rf-p3-research-biostats-0247 | new | Ghosh FEP PDF p110
- rf-p3-research-biostats-0248 | new | Ghosh FEP PDF p110
- rf-p3-research-biostats-0249 | new | Ghosh FEP PDF p110
- rf-p3-research-biostats-0250 | new | Ghosh FEP PDF p109
- rf-p3-research-biostats-0251 | new | Ghosh FEP PDF p104
- rf-p3-research-biostats-0252 | new | Ghosh FEP PDF p107
- rf-p3-research-biostats-0253 | new | Sarkar p386-390
- rf-p3-research-biostats-0254 | new | Medhi PMECP p351
- rf-p3-research-biostats-0255 | new | Sarkar p286-290
- rf-p3-research-biostats-0256 | new | Sarkar p286-290
- rf-p3-research-biostats-0257 | new | Sarkar p131-135
- rf-p3-research-biostats-0258 | new | Sarkar p286-290
- rf-p3-research-biostats-0259 | new | Sarkar p356-360
- rf-p3-research-biostats-0260 | new | Sarkar p356-360
- rf-p3-research-biostats-0261 | new | Ghosh FEP PDF p218

- rf-p3-research-biostats-0262 | new | Medhi PMECP p153-154
- rf-p3-research-biostats-0263 | new | Medhi PMECP p153-154
- rf-p3-research-biostats-0264 | new | Sarkar p86-90
- rf-p3-research-biostats-0265 | new | KDT8 ch5
- rf-p3-research-biostats-0266 | new | RangDale9 ch8

Checker pass: rf-0265 question reworded to the Sarkar p86-90 ADR definition. rf-0262 to rf-0266 re-checked against Medhi, Sarkar, KDT8 and RangDale9.
