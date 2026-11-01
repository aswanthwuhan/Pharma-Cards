# Content work queue

Run at most 4 agents at once (2 Opus validators + 2 Haiku rapid writers) to stay under the usage limit.

## Book-grounding validation (Opus, medium effort; rules in GROUNDING-RULES.md)
- [x] Paper I (p1-*)
- [x] p2-cholinergic, p2-adrenergic, p2-autacoids, p2-nsaids
- [x] p2-respiratory, p2-anaesthetics, p2-sedatives-aed, p2-psych
- [x] p2-opioids, p2-ras-hf, p2-arrhythmia-angina-htn
- [x] p2-renal, p2-blood, p3-calcium, p3-endocrine
- [x] p3-steroids, p3-git, p3-amr-general
- [x] p3-amr-other, p3-antifungal-viral, p3-antiparasitic
- [x] p3-cancer-immuno, p3-misc, p4-rational-use
- [x] p4-clinical-trials, p4-pharmacogenomics, p4-biologics, p4-experimental, p4-recent (now restoring Indian regulatory cards from Sarkar OCR)

## Rapid Fire decks (Haiku; brief in RAPID-AGENT-BRIEF.md)
Done: p2-cholinergic (350), p2-respiratory (307), p2-autacoids (631), p2-adrenergic (457), p2-nsaids (518), p2-psych (503), p2-opioids (595), p2-anaesthetics, p2-sedatives-aed, p2-ras-hf (610), p2-arrhythmia-angina-htn (642), p2-renal (377), p2-blood (629), p3-endocrine (549), p3-steroids (464), p3-calcium (266), p3-git (511), p3-amr-general (510), p3-amr-other (408), p3-tb-leprosy (385), p3-antifungal-viral (311), p3-antiparasitic (509)

- [ ] p3-cancer-immuno (in progress), p3-misc (in progress)
- [ ] p1-intro-routes, p1-pk-absorption, p1-pk-elimination, p1-pd, p1-adr, p1-interactions, p1-drug-dev

## New NMC 2022 topics (no cards yet; write only from the books)
Done (draft, 102 cards): p1-history-molecular 32, p1-special-populations 35, p1-drug-delivery 25, p1-biochemical 10 (books lack analytical-method principles; gaps in review logs)
Done (draft, 144 cards): p2-ocular 39, p2-toxicology 48, p2-herbal 24, p3-pv-economics 33
In progress (Opus): p3-clinical-services, p3-national-programmes, p3-research-biostats, p3-ethics-education
p1-history-molecular, p1-special-populations, p1-drug-delivery, p1-biochemical, p2-ocular, p2-toxicology,
p2-herbal, p3-pv-economics, p3-clinical-services, p3-national-programmes, p3-research-biostats, p3-ethics-education

## Then
- Reconcile earlier Rapid decks with GG14 corrections in their validated study decks (rule 4; brief step 3 added after p3-git)
- Functional check of every screen, fixing issues one by one
- MD practicals section (NMC practical exam: long and short exercises, OSPE stations, teaching assessment)
- Book images: needs the owner's decision (copyright, since the app is public)

## Scanned books (OCR)
`scripts/ocr-books.py` runs the local MinerU API and writes `C:\Pharmacology Book\ocr\<rapid-revision|sarkar|prep>\pNNNN-NNNN.md` (resumable; about 70 s/page on CPU). Use these as grounding sources (cite `RR5`, `Sarkar`, `Prep` with PDF page) once a chapter's files exist.
