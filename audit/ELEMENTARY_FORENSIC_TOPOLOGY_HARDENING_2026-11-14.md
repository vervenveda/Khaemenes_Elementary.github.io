# Khaemenes Academy Elementary — Forensic Topology Hardening Record
**Date:** 2026-11-14  
**Repository:** `vervenveda/Khaemenes_Elementary.github.io`  
**Production branch:** `main` only  
**Scope:** repository topology, canonical curriculum authority, learner record integrity, profile regression, legacy-route compatibility, and production automation authority.

## Starting condition
The audit began from `main` at `a314176710fcd0b2dc249a35054753c191d221e1`.

The canonical Grade 01–05 program was structurally strong, but historical public routes and branch/workflow topology still created multiple authority seams:
- root Grade 01 lesson, assessment, printable, certificate, and teacher routes remained live and divergent;
- two additional historical Grade 02 subject trees remained public and divergent;
- the old root Grade 01 assessment path could identify itself as Grade 01 and write the same learner storage key using a different envelope shape;
- the root Grade 01 certificate used an older unscoped record and weaker average-based completion rule;
- the Elementary profile browser regression had been red since October because its test no longer matched the intentionally folded profile UI and its shared dependencies were not pinned;
- tested family/record-retention hardening remained stranded on an integration branch;
- three historical repair workflows still had direct write permission to `main`.

## Canonical authority repairs

### Grade 01 historical routes
Commit `d3b24d6d3f6dd9948923fefbe64f92f4b2f4d7ee` converted the historical root Grade 01 lesson/assessment/certificate/teacher routes into compatibility redirects.

The shared formal assessment engine now recognizes Grade 01 only through canonical `/grades/grade-01/` paths. The learning-engine injector and validator use the same canonical-only classification.

The old root certificate script no longer reads or issues from `khaemenes_grade1_36_aplus_v1`; it forwards to the canonical Grade 01 certificate.

### Grade 02 historical routes
Commit `4e74b80ccb8b968ca5d17f6bebd6e4571a86bcf5` converted 444 divergent historical Grade 02 subject pages into compatibility redirects:
- 296 pages in the old root `subjects/` tree;
- 148 pages in the extra top-level Arts/Music, Health/PE/SEL, Social Studies, and Technology trees.

Commit `094c39a15c583b8980e189076e48fc6ccc866a63` repaired the new validator-loop syntax and restored the full regression matrix.

### Grade 01 historical printables
Commit `7787c7f7fc94c893b0e05eca2a68f4bbb3613505` converted the remaining 36 historical root Grade 01 printable packets into canonical redirects.

**Result:** all 557 legacy duplicate HTML surfaces identified by the audit are now compatibility routes rather than alternate instructional authorities.

## Canonical curriculum regression result
After canonicalization, the full learning-engine regression passed with:
- 1,152 canonical lesson/review engine surfaces;
- 190 canonical formal assessment surfaces;
- 2,880 generated-question samples;
- 844 large-pool questions;
- 1,008 full-year non-civic subject pages;
- 140 Weeks 08–12 topic-aware depth surfaces;
- 36/36 + midterm + final + portfolio certificate requirements;
- Week 06–07 evidence checks;
- learner isolation across Grades 01–05;
- formal assessment boundary checks.

The reduced lesson/assessment counts are intentional: historical root Grade 01 lesson and formal-assessment authorities are no longer counted as live engines.

## Student Profile browser regression
The profile UI itself was not reverted. The regression was updated to follow the current intentional accordion hierarchy:
- Pinned Subject Halls;
- Learning Compass & Evidence Passport;
- Next Milestone;
- Original Picture, Garden Colors & Backup Tools.

The profile workflow now pins the audited shared repositories:
- Academy profile assets: `fff9d4852d71ef9288e6fbd631112d7930f52f6e`;
- VNV shared assets: `200b1cb1fe3c55e4b1dc3137a83bba1d93a94417`.

Profile browser run `43619114857` passed the complete Grades 01–05 smoke path, including:
- guest/learner identity boundaries;
- grade-scoped Today/Next;
- learner-specific subject pins;
- appearance persistence;
- class pins and next-grade preview without placement mutation;
- Grade 01 / Grade 03 sibling isolation;
- learner-specific goals, photos, and subjects;
- Kindergarten visual handoff without placement changes;
- cross-child backup rejection;
- Grade 02/04/05 grade-specific routes;
- unpin behavior;
- mobile overflow;
- zero uncaught browser errors.

## Learner-record retention hardening
Commit `400935cd560fe3ae1da179d087f1b144f0af19c4` selectively reconciled the tested retention changes from the integration line without merging that branch wholesale.

Hardening now includes:
- exact localStorage write/readback confirmation;
- active-family membership checks;
- rejection of mismatched or self-directed adult learner records where applicable;
- strict learner ID and course ID envelope validation;
- preservation of historical unassigned preview records;
- Grade 01 deliberate legacy-copy verification;
- learner-scoped certificate record validation.

The normal learning-engine CI now runs `tests/elementary-grade1-5-lesson-retention.test.cjs`.

Run `43619362345` passed:
- full learning-engine validation;
- Week 06–07 evidence;
- Grades 01–05 learner isolation;
- formal assessment boundaries;
- all 8 synthetic retention/readback tests.

Dedicated learner-isolation run `43619362407` also passed.

## Production automation authority
Commit `5fb321e631c8610d2fe6054ba6d8c0086e165ba9` hardened workflow authority.

The historical repair workflows are now read-only compatibility verifiers:
- legacy Grade 01 printable routes;
- legacy Grade 02 subject indexes;
- legacy Grade 02 subject-week routes.

They no longer have `contents: write` and cannot commit repairs directly to production.

The learning-engine rollout now runs the full curriculum/identity/retention test matrix **before** any automated commit.

The VNV toolbar normalizer now:
- skips HTTP-refresh compatibility redirects;
- validates the normalized working tree before any commit;
- preserves the canonical route boundary.

All five automation workflows passed on the hardening commit. The normalizer's only follow-up change was `.vnv-toolbar-normalization.json`, producing `be3f61a63e826aa46254c615e7b59cac6e62c2af`.

## Remaining topology items
1. GitHub reports `main` as **not protected**. The available repository connector does not expose branch-protection administration, so this was not changed.
2. Several historical branches still contain unique commit ancestry and must not be deleted merely because selected changes have been reconciled manually.
3. `hardening/archaemenes-elementary-v2`, `-v3`, and `-v4` currently report zero commits ahead of main and are historical-ref cleanup candidates, but no branch refs were deleted in this pass.
4. The integration/family and profile branches require content-level reconciliation rather than a blind merge; current `main` contains newer canonical-route, retention, browser-test, and workflow hardening that those branches do not.
5. The profile depends on pinned first-party Academy/VNV shared assets. Updating those pins must be deliberate and followed by the browser regression.

## Authority statement
As of this record:
- canonical academic authority resides under `grades/grade-01` through `grades/grade-05`;
- historical duplicate URLs are compatibility redirects only;
- formative learning-ledger evidence remains non-mastery;
- formal progression remains at the Academy 80% threshold;
- certificates remain gated by 36/36 weekly mastery, midterm, final, and portfolio requirements;
- learner records remain learner-scoped and family-validated;
- no real learner records were read or modified during this audit.
