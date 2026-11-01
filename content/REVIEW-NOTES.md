# Cards to check first

Open **Review** in the app, pick the topic, and find the card by its id (shown under each card). Everything else can be approved after a normal read-through.

## Doses / numbers where the book and current guidance may differ
- `p2-blood-025`: INR target bands (table was garbled)
- `p2-anaesthetics-040`: maximum plain doses (lignocaine 300 mg, bupivacaine 150 mg, ropivacaine 200 mg)
- `p2-psych-033`, `p2-psych-040`: lithium levels
- `p2-psych-032`: clozapine agranulocytosis rate and monitoring
- `p2-renal-035`: tolvaptan (correction-rate wording added by Claude)
- `p2-opioids-027`: methadone substitution ratio and maintenance dose
- `p2-opioids-006`: fomepizole availability in India
- `p2-respiratory` stepwise asthma card: the book's step numbering is inconsistent
- Autacoids deck: sumatriptan, carboprost, mifepristone/misoprostol doses

## Built from garbled tables
- `p2-sedatives-aed-041`: choice of antiepileptic by seizure type
- `p2-anaesthetics-012`: succinylcholine histamine release

## Beyond KD Tripathi 8e (from current knowledge)
- `p2-ras-hf-046`: SGLT2 inhibitors in HFrEF
- `p2-blood-033`, `p2-blood-036`: andexanet alfa
- `p2-blood-062`: PCSK9 inhibitors
- `p2-psych-052`: antidepressant washout periods; cyproheptadine for serotonin syndrome
- `p2-arrhythmia-angina-htn-013`, `-029`: magnesium for torsades, tadalafil–nitrate gap

## Agent-flagged, checked by Claude (correct)
Labetalol β:α ratio, ivabradine thresholds, JNC 8 cutoff for people aged 60 and over, the cholinergic facts (BuChE, rivastigmine, quaternary antimuscarinics).

## Saving your review
Approvals and edits are stored in your browser. When you finish a batch, click **Export approvals and edits** on the Review page and give me the `card-overrides.json` file. I'll merge it into the deck files so the approvals are permanent.
