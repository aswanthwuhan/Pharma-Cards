import json
P='p4-clinical-trials'
f='decks/%s.json'%P
d=json.load(open(f,encoding='utf8'))
L={'001':2,'002':1,'003':1,'004':1,'005':1,'006':1,'008':1,'009':2,'010':1,'011':2,'012':2,'013':1,'014':1,'016':2,'017':2,'018':3,'019':2,'020':1,'021':1,'022':2,'023':2,'028':1,'032':1,'033':2,'035':2,'036':1,'037':2,'038':1,'039':1,'040':3,'043':2,'044':1,'045':1,'046':1,'047':2,'048':2,'049':1,'050':2,'051':2,'052':2,'053':3,'054':2,'055':2}
for c in d['cards']:c['level']=L[c['id'][-3:]]
def N(n,t,st,lv,front,refs,tags,**k):
    return {'id':'%s-%03d'%(P,n),'type':t,'front':front,**k,'refs':refs,'pyq':[],'status':'draft','subtopic':'%s-%s'%(P,st),'tags':tags,'level':lv}
K=['KDT8 ch5']
S=lambda h,*p:{'h':h,'points':list(p)}
new=[
N(56,'basic','design',1,'What is blinding in a clinical trial, and who is blinded in single and double blind designs?',K,['mechanism'],back="Concealing whether a subject gets the test or the control treatment. Single blind: the subject is unaware. Double blind: both subject and investigator are unaware. The two medicines must look, weigh and taste alike and come in unlabelled numbered packets; the allocation code is held by an uninvolved third party (data management) and broken only after the trial. Why: knowing the treatment can bias reporting and assessment. Trials without concealment are open trials."),
N(57,'basic','design',1,'Why does a trial need a control group, and what can the control receive?',K,['mechanism'],back="Without a comparator you cannot tell drug effect from natural course or expectation. The control group should resemble the test group as closely as possible and gets either a placebo (only if ethically permissible) or the existing standard treatment (active control). Test and control may run side by side (parallel group) or the same subjects may get both in turn (crossover)."),
N(58,'basic','design',1,'Why are inclusion and exclusion criteria and the dosage regimen fixed before a trial starts?',K,['mechanism'],back="Subject features (age, sex, disease severity and duration, other diseases, other drugs) are specified in advance because results hold only for the population so defined. Likewise the dose, frequency and duration are chosen beforehand, so conclusions apply only to that regimen; nothing can be said about higher or lower doses, which need separate dose-ranging studies."),
N(59,'essay','design',3,'Essay: Planning a randomised, double-blind, controlled trial of a new drug',K+['RangDale9 ch8'],['uses'],sections=[S('Introduction','RCT is the most credible way to judge efficacy, safety or comparative value','Greatest challenge is eliminating bias'),S('Who is studied','Inclusion and exclusion criteria set in advance; results apply only to that population'),S('Comparison','Placebo if ethical, or active control resembling test group','Parallel or crossover; crossover suits stable chronic disease and needs both orders to offset order effect, but carry-over may remain','Fixed regimen; dose-ranging is separate'),S('Bias control','Randomisation by random number table or computer; stratify by age, sex or severity if needed','Blinding with look-alike drugs; code kept by third party'),S('Size and end points','Primary and secondary end points pre-specified','Sample size from significance, power, expected difference and variability'),S('Oversight','Interim analysis by independent committee; early stop if decisive','Code broken at end; pre-specified statistics')]),
N(60,'basic','design',2,'What is a sequential trial and when is it practicable?',K,['uses'],back="Matched pairs of subjects are compared and each pair scored as A better, B better or no difference; the running score is plotted until a pre-set boundary for superiority, inferiority or no difference is crossed, then the trial stops. It reaches a decision with the fewest subjects. Limits: only for drugs and diseases where clinical end points appear quickly and paired comparison is possible, and matched pairs are hard to recruit."),
N(61,'basic','design',2,'Why are many phase III trials multicentric?',K,['uses'],back="More centres and teams recruit more patients in less time, the results apply to a wider population (several ethnic groups or countries), the regulatory demands of several countries can be met, and credibility improves. Phase III trials are generally multicentric."),
N(62,'basic','endpoints',1,'Define type I and type II error in a trial and link them to significance and power.',K,['classification'],back="Type I (alpha): finding a difference when none exists; its probability is the significance level (0.05 = 5% chance the finding is not real). Type II (beta): missing a difference that does exist; power is the ability to detect a real one (power 0.9 = 10% chance of missing it). Both are set in advance because they drive the sample size."),
N(63,'shortnote','endpoints',3,'Short note: Meta-analysis',K,['uses'],sections=[S('What','Pools data from several similar randomised trials of the same drug or class on the same end point','Enlarges numbers, raising significance and power; settles discordant small trials'),S('Criticisms','Selection bias in choosing trials','Publication bias: negative results less often published','Non-uniform methods between trials'),S('To be reliable','Comprehensive literature search','Objective inclusion criteria','Only randomised trials of assured quality','Proper statistical pooling'),S('Example','Supported beta blockers in heart failure and statins to lower coronary risk')]),
N(64,'basic','endpoints',2,'Rank the grades of strength of evidence used in therapeutics.',K,['classification'],back="Grade I: systematic reviews and meta-analysis (most reliable, can base decisions). Grade II: well-powered RCT or more than one trial (reliable, may be supported or refuted by similar studies). Grade III: open-label or pilot trials, cohort and case-control studies (less reliable, need rigorous testing). Grade IV: case reports, anecdotes, clinical experience (least reliable, only pointers to start formal studies)."),
N(65,'basic','gcp-roles',1,'What does Good Clinical Practice protect, and which documents form its ethical base?',K,['uses'],back="GCP (ICH standards) covers design, conduct, monitoring, recording, analysis and reporting so that data are credible and the rights, integrity and confidentiality of subjects are protected. Its ethical base is the Declaration of Helsinki, with the ICMR guidelines in India. Every trial needs prior independent ethics committee approval."),
N(66,'essay','gcp-roles',3,'Essay: Safeguards that make a clinical trial ethical and credible',K+['GG14 ch1','Sarkar p226-230'],['uses'],sections=[S('Framework','GCP of ICH; Declaration of Helsinki; ICMR guidelines'),S('Sponsor and CRO','Sponsor files IND, applies for NDA or BLA','CRO can take over sponsor duties: monitoring by CRAs, data management, regulatory submissions'),S('Ethics committee','Independent review of science and ethics; protects autonomy, beneficence, non-maleficence, justice','NDCT 2019: at least 7 members, lay person, woman, legal expert, independent member; at least half unaffiliated; quorum 5'),S('Subject protection','Voluntary, informed, written consent; right to withdraw','Extra care for vulnerable groups'),S('Credibility','Randomisation, blinding, pre-specified end points and analysis; independent interim review')]),
N(67,'essay','consent-safety',3,'Essay: A trial participant dies during a trial under the NDCT Rules 2019: what happens?',['Sarkar p246-250','Sarkar p226-230','KDT8 ch5'],['adr'],sections=[S('Why consent matters','Subjects told of risks and free to withdraw; informed consent is written'),S('Is it an SAE','Death is a serious adverse event as defined (also hospitalisation, disability, birth defect, life-threatening events)'),S('Reporting','Investigator reports to CLA, sponsor and EC within 24 hours','Analysed reports within 14 days; EC opinion on compensation within 30 days'),S('Decision','Expert committee recommends cause and quantum within 60 days','CLA orders compensation within 90 days using the Seventh Schedule formula'),S('Payment','Sponsor pays within 30 days and reports to CLA','Free medical management also provided for injury')]),
N(68,'essay','india-regulation',3,'Essay: Pathways under the NDCT Rules 2019 for a regulatory trial, an academic trial and an orphan drug',['Sarkar p221-225','Sarkar p226-230','Sarkar p36-40'],['uses'],sections=[S('Framework','NDCT Rules 2019 replaced Schedule Y; CLA is DCGI'),S('Regulatory trial','CLA decision in 90 days (drug from abroad) or 30 days (made in India); no reply is deemed approval','Permission valid 2 years; 6-monthly status reports; post-trial free access'),S('Academic trial','Solely academic; EC approval alone suffices; results not for promotion or regulatory approval'),S('Orphan drug','Condition affecting not more than five lakh persons','Fee waiver, fast track, possible waiver of local study and phase IV; still needs CDSCO authorisation'),S('Common','All need EC approval; ECs registered for 5 years')]),
N(69,'basic','pharmacovigilance',2,'What are cohort studies used for in drug safety, and what are their limits?',K,['adr'],back="An observational study (no intervention) comparing events in users and non-users of a drug, prospectively or retrospectively; prescription event monitoring is a cohort study. Its main value is to find uncommon adverse effects missed in trials, which are small and exclude susceptible patients. Limits: controls may be inappropriate, long follow-up needed, and it is less credible for therapeutic outcomes."),
]
d['cards']+=new
st=[s['id'] for s in json.load(open('subtopics/%s.json'%P))]
d['cards'].sort(key=lambda c:(st.index(c['subtopic']),c['level']))
json.dump(d,open(f,'w',encoding='utf8'),ensure_ascii=False,indent=2)
from collections import Counter
cn=Counter((c['subtopic'],c['level']) for c in d['cards'])
for s in st:print(s,[cn[(s,l)] for l in (1,2,3)])
rf='rapid/%s.json'%P
r=json.load(open(rf,encoding='utf8'))
n=13
def R(sub,q,a,refs,tags=None):
    global n
    x={'id':'rf-%s-%04d'%(P,n),'subtopic':'%s-%s'%(P,sub),'kind':'fact','q':q,'a':a,'refs':refs}
    if tags:x['tags']=tags
    r['cards'].append(x);n+=1
k=['KDT8 ch5'];sk=['Sarkar p246-250'];sr=['Sarkar p226-230'];sn=['Sarkar p221-225']
for s,q,a,rr,t in [
('phases','Phase I trial: number of subjects (KDT)','About 20-80, open label',k,None),
('phases','Phase I starting dose','1/100 to 1/10 of highest non-toxic animal dose',k,['dosing']),
('phases','Phase I subjects','Healthy volunteers (patients if drug is toxic, e.g. cancer)',k,None),
('phases','Phase II: setting and centres','Controlled, randomised; about 2-4 centres',k,None),
('phases','Phase III: size','About 500-3000 patients, many centres',k,None),
('phases','Phase III completion leads to','New drug application (NDA) to licensing authority',k,None),
('phases','Restricted marketing permission given for','Toxic drugs useful in serious or incurable disease',k,None),
('phases','Phase IV: what it detects','Uncommon/idiosyncratic ADRs, long-term effects, unsuspected interactions',k,['adr']),
('phases','Phase 0: tools used to measure ultra-low drug levels','Accelerator mass spectrometry (radiolabelled) or LC-MS/MS',k,['pk']),
('phases','Main objection to phase 0','Microdose PK may differ from pharmacological-dose PK',k,None),
('design','Trial design where subjects serve as own controls','Crossover design',k,None),
('design','Problem remaining in crossover design','Carry-over effect',k,None),
('design','Why both orders (A then B, B then A) in crossover','Cancels effect of order of treatment',k,None),
('design','Two basic strategies to minimise bias','Randomisation and blinding',k,None),
('design','Single blind','Subject unaware of treatment',k,None),
('design','Double blind','Subject and investigator both unaware',k,None),
('design','Holder of allocation code in double blind','Third-party data management',k,None),
('design','Trial with no concealment of treatment','Open trial',k,None),
('design','Most credible method of testing efficacy','Randomised controlled double-blind trial (RCT)',k,None),
('design','Stratified randomisation: strata used','Age, sex, disease severity, other patient variables',k,None),
('design','Design that stops when a boundary is crossed, using matched pairs','Sequential trial',k,None),
('design','Advantages of multicentric trial','More patients faster, wider population, meets several regulators, more credible',k,None),
('endpoints','Type I error','Difference found when none exists (alpha); the significance level',k,None),
('endpoints','Type II error','Real difference missed (beta); related to power',k,None),
('endpoints','Power 0.9 means','10% chance of missing a real difference',k,None),
('endpoints','Smaller expected difference: sample size effect','Needs larger sample',k,None),
('endpoints','Greater variability of response: sample size effect','Needs larger sample',k,None),
('endpoints','Who orders early termination of a large trial','Independent interim-analysis committee',k,None),
('endpoints','Why stop a trial early on decisive result','Unethical to give remaining patients the inferior treatment',k,None),
('endpoints','Trial proving new drug is not worse than existing','Non-inferiority trial',k,None),
('endpoints','Pooling several similar RCTs','Meta-analysis',k,None),
('endpoints','Criticisms of meta-analysis','Selection bias, publication bias, non-uniform methods',k,None),
('endpoints','Strongest grade of evidence','Grade I: systematic review / meta-analysis',k,None),
('endpoints','Grade IV evidence','Case reports, anecdotes, clinical experience',k,None),
('gcp-roles','Ethical declaration underlying GCP','Declaration of Helsinki',k,None),
('gcp-roles','Indian ethical guidelines for human research','ICMR guidelines',k,None),
('gcp-roles','Body that sets GCP standards','International Conference on Harmonization (ICH)',k,None),
('consent-safety','Consent must be','Voluntary, informed and written',k,None),
('consent-safety','SAE report by investigator: time limit','Within 24 hours',sk,None),
('consent-safety','Compensation formula found in','Seventh Schedule of NDCT Rules',sk,None),
('consent-safety','Expert committee time to recommend cause and compensation','60 days',sk,None),
('consent-safety','CLA time to order compensation','90 days of SAE report',sk,None),
('consent-safety','Sponsor pays compensation within','30 days of order',sk,None),
('india-regulation','Orphan drug in India: affected persons','Not more than five lakh',['Sarkar p36-40'],None),
('india-regulation','Academic trial needs approval from','Ethics committee only, not DCGI',sr,None),
('india-regulation','NDCT trial decision time: drug developed abroad / in India','90 days / 30 days',sn,None),
('india-regulation','NDCT trial permission validity','2 years',sn,None),
('india-regulation','Ethics committee registration validity','5 years',sn,None),
('pharmacovigilance','Cohort study compares','Event rates in drug users vs non-users',k,None),
('pharmacovigilance','Prescription event monitoring is a type of','Cohort study',k,None),
('pharmacovigilance','Cohort studies mainly find','Uncommon adverse effects missed in trials',k,['adr']),
('pharmacovigilance','International pharmacovigilance collaborating centre','Uppsala Monitoring Centre (Sweden)',['KDT8 ch6'],None),
]:R(s,q,a,rr,t)
json.dump(r,open(rf,'w',encoding='utf8'),ensure_ascii=False,indent=2)
ids=[c['id'] for c in d['cards']];assert len(ids)==len(set(ids))
with open('review/%s.md'%P,'a',encoding='utf8') as w:
    w.write("\n## Difficulty ladder pass (2026-11-03)\n\n- 001-055 | corrected | explicit level set, deck reordered L1-L3 per subtopic\n")
    for c in new:w.write("- %s | new | %s\n"%(c['id'],', '.join(c['refs'])))
with open('review/rapid-%s.md'%P,'a',encoding='utf8') as w:
    w.write("\n## Ladder-pass additions (2026-11-03)\n\n- rf-%s-0013..%04d | new | KDT8 ch5, KDT8 ch6, Sarkar p36-40, p221-225, p226-230, p246-250\n"%(P,n-1))
