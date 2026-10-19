# Grade 5 Social Studies · Fresh Forensic Audit & Hardening
## 2026-10-19

### Live-main audit before this pass
- 36/36 weeks and 180/180 Social Studies lessons present
- 504/504 unique current-week IDs and prompt strings
- 642 current + spiral bank records
- app, teacher tools, printable, and learner context compiled
- 80% weekly progression and Week 19 midterm gate present
- anti-repeat weekly retakes and unit-stratified cumulative forms present
- state/localization metadata present

### Bubbles found and pushed out

1. **Assessment specificity**
   Technically unique prompts were still over-templated: 281/504 current items used nine recurring meta-reasoning stems. This pass replaced four recurring generic items per week — **144 total** — with topic-specific historical/civic questions. Generic sourcing, causation, perspective, synthesis, and revision items remain as a minority disciplinary spiral.

2. **Florida overlay precision**
   The prior Florida crosswalk overclaimed direct coverage. Current Florida Grade 5 expectations also include modern voting-rights expansion, current Florida federal representatives, national symbols/documents, U.S./Florida court and constitutional relationships, amendment process, and Grade 5 Holocaust/antisemitism instruction. These now live in `STATE_PACK_FLORIDA.md`; the national core remains portable.

3. **Cumulative written evidence**
   Weekly learning required constructed historical arguments, but midterm/final were objective-only. Midterm and final now preserve teacher-supervised source-based cumulative written responses in the learner record and surface them in teacher tools. Automatic mastery remains the randomized objective score at 80%; the written response is additional cumulative portfolio evidence.

### Invariants preserved
- 36 weeks / 180 lessons
- 80% mastery threshold
- open-book weekly checks
- closed-book teacher-supervised midterm/final
- anti-repeat randomized forms and attempt snapshots
- unit-stratified cumulative objective exams
- required state/local overlay
- grade-wide A++ assessment remains portfolio evidence only
- first-party/static-site architecture


## Second bubble pass · integration hardening

4. **Localization became actionable**
   Required checkpoint weeks now expose a concrete state/local task in the student course. Teacher Tools stores a Generic or Florida pack selection, a state/local label, and checkpoint evidence in the learner's subject record.

5. **Academy learner duplication reduced**
   When the Family Registry has an active Grade 05 learner, the Social Studies course now auto-creates/selects that learner's subject record rather than requiring a second manual learner identity.

6. **Evidence review and dashboard visibility**
   Teacher Tools now records written-evidence review status for weekly, midterm, and final constructed responses. The Grade 5 home page shows a read-only Social Studies mastery summary on the subject card without altering the separate whole-grade A++ certificate record.
