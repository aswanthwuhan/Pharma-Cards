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
