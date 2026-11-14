# Elementary Historical Archaemenes Branch Retirement Audit
**Date:** 2026-11-14  
**Repository:** `vervenveda/Khaemenes_Elementary.github.io`  
**Branch audited:** `hardening/archaemenes-elementary`  
**Branch head:** `6a0d126274579fa073e5c9b14564aac2ee411c47`  
**Current main at audit start:** `ba929015da740c49d48861845e8ab1830b70aa10`  
**Merge base:** `f0c724ca83f6f6353dbb2f8638955e2180e3bd3b`

## Topology
The historical branch is:
- 84 commits ahead of its August 2026 merge base;
- 1,096 commits behind current production main;
- 55 changed files relative to the merge base.

Three-way blob classification:
- 13 branch-only additions;
- 8 documentation files changed only on the historical branch while main kept the merge-base version;
- 34 true conflicts where both historical branch and current main evolved independently;
- 0 branch-changed files are byte-identical to current main.

This is therefore **not mergeable as a branch**. Any preservation must be selective.

## What the 84 commits were trying to accomplish
The August hardening line established:
- Academy Family Registry as learner/placement authority;
- NAIB as router/delegator rather than educational mentor;
- Archaemenes as the Academy mentor;
- learner-scoped Grade 01–05 records;
- prevention of sibling/legacy record bleed;
- certificate ownership checks;
- separation between mentor guidance and mastery authority;
- adult/teacher verification surfaces;
- a Grade 05 → Middle School readiness/preview bridge.

Those architectural goals are valid. Most are now implemented more strongly on current main.

## Branch-only additions

### Historical documentation — superseded but worth retaining as audit context
- `ARCHAEMENES_MENTOR_LOGIC.md`
- `HARDENING_VALIDATION.md`

Their authority model is now represented more explicitly by current:
- `mentor-contract.json` v3;
- `mentor-manifest.json` v4;
- learner-scoped Grade 01–05 continuity;
- formal assessment and retention regressions;
- family/forensic guardrail tests;
- current branch-reconciliation audit records.

No runtime dependency requires these historical files.

### Root presentation/runtime — do not merge
- `assets/elementary-home.css`
- `assets/elementary-home.js`
- `assets/khaemenes-elementary-continuity.js`
- `assets/khaemenes-elementary-family-adapter.js`

Reasons:
- current main has a newer Family Registry / family-school bridge model;
- current main has stronger learner and family membership verification;
- current main separates formative ledger, formal assessment authority, and continuation publication;
- current main uses the current VNV / Khaemenes visual standards and shared header/menu infrastructure;
- the August CSS uses obsolete large radii and 800–900 font weights that conflict with current design standards;
- the old family adapter still writes a legacy compatibility object and dynamically manages the older NAIB router seam.

### Grade 01 presentation — do not merge
- `grades/grade-01/assets/first-grade-landing-v4.css`
- `grades/grade-01/assets/first-grade-landing-v4.js`

Current Grade 01 has since been hardened around the canonical learning engine, learner-scoped mastery, formal-boundary tests, profile continuity, and current visual standards. The v4 landing runtime is an old presentation/controller layer.

### Manual record controllers — explicitly reject
- `grades/grade-01/assets/grade1-records.js`
- `grades/grade-02/assets/grade2-records.js`
- `grades/grade-03/assets/grade3-records.js`
- `grades/grade-04/assets/grade4-records.js`
- `grades/grade-05/assets/grade5-records.js`

These expose manual week/midterm/final/portfolio entry or update functions through grade record helpers.

Current production policy is stronger:
- formal scores come from verified assessment attempts;
- formative evidence does not award mastery;
- learner/course ownership is validated;
- writes require readback verification;
- certificate gates use verified learner-scoped course state.

Reintroducing these historical helpers would recreate a second score-authority seam.

## Files that changed on both branch and main
The 34 conflicting files include root/grade indexes, grade apps, certificates, continuity modules, teacher tools, and current README/validation surfaces.

Current main versions must win. Since August, they have accumulated:
- canonical Grade 01–05 authority;
- 557 legacy-route redirects;
- randomized assessment authority;
- learner and family envelope verification;
- retention/readback tests;
- read-only family reports;
- current profile/browser regression coverage;
- newer visual/header/tooling standards;
- current certificate and portfolio gates.

No conflict file from the August branch should replace its current-main counterpart wholesale.

## Grade 05 → Grade 06 preview finding
This is the one historical feature idea that current Elementary Grade 05 does not expose as richly.

The August branch offered:
- an Advanced Grade 06 Preview;
- a formal-transition pathway;
- academic crosswalk language for ELA, mathematics, science, social studies, technology/projects, and world languages.

However the old URL used:
`https://vervenveda.com/Khaemenes_Middle.github.io/?entry=grade05-advanced-preview#bridge-entry`

Current Middle School main has no `#bridge-entry` or matching `entry=grade05-advanced-preview` handler.

The **concept remains safe to reimplement** because current Grade 06 explicitly supports preview mode:
- Grade 06 is viewable when placement does not match;
- its continuity layer reports `placement-mismatch`;
- formal record writes are blocked in mismatch mode;
- Grade 06 certificate issuance requires actual Grade 06 placement.

If restored later, the modern preview should link directly to:
`https://vervenveda.com/Khaemenes_Middle.github.io/grades/grade-06/`

and clearly state that preview does not change placement or create Grade 06 formal records.

## Mentor authority equivalence
The historical branch's core statement:
**NAIB delegates; Archaemenes mentors; grade curriculum measures mastery; families/educators retain human authority**

is already represented on main through the current mentor contract and manifest.

Current main additionally makes the boundaries more explicit:
- Family Registry: learner identity and placement;
- course engine: verified assessment attempts, mastery, progression, portfolio gates and certification;
- NAIB: routing/matching/navigation;
- Archaemenes: educational mentorship, clues, strategy, reflection and support handoff;
- mentor evidence cannot expose protected questions/answer keys or alter mastery.

Therefore `ARCHAEMENES_MENTOR_LOGIC.md` is historical context, not missing production authority.

## Retirement classification
**Branch classification: RETIREABLE AFTER HISTORICAL RECORD PRESERVATION.**

No branch runtime file is approved for direct merge.

Preserve before deletion:
1. this audit record;
2. the historical branch head SHA;
3. optionally archive the two historical documentation files if full verbatim preservation inside main is desired.

Optional future enhancement, independent of branch retirement:
- add a modern Grade 05 “Preview Grade 6” bridge pointing directly to current Grade 06 in safe preview mode.

## Safety conclusion
Deleting the branch after historical record preservation would not remove current curriculum, learner records, authority logic, certificate rules, family isolation, or mentor governance from production.

The branch should **not** be merged wholesale.
