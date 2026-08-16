# Grade 01 Validation Report

## Curriculum inventory

- Units / weeks: 36
- Lessons per week: 5
- Daily lessons: 180
- Weekly mastery checks: 36
- Printable packets: present
- Midterm: present
- Final exam: present
- Teacher tools: present
- Certificate: present
- Attribution: Jennifer Kay Pearl only

## Identity and mentor architecture

PASS on `hardening/archaemenes-elementary`.

Canonical runtime:

`Academy Family Registry → Elementary continuity → NAIB → Archaemenes → Grade 01`

- Grade 01 requires an explicitly selected `grade-01` Academy learner for formal progress.
- Archaemenes is the current mentor.
- Presentation mode: Young Scholar.
- Pip / Miri / Nova / Sage local mentor selection removed from the Grade 01 landing runtime.
- Custom local avatar assignment removed from current Grade 01 authority.
- Future Mentor Adoption remains deferred.

## Grade 01 continuity

PASS.

`assets/khaemenes-grade1-continuity.js` now:

- reads the unified Elementary learner;
- requires Grade 01 eligibility;
- preserves one Archaemenes mentor identity;
- scopes records by learner ID;
- copies legacy Grade 01 state forward non-destructively when needed;
- keeps course state separate from learner identity;
- prevents certificate readiness without an eligible Grade 01 learner.

## Landing page

PASS.

The root Grade 01 portal has been replaced with a clean Wonderverse landing page that:

- uses the unified Academy learner path;
- presents Archaemenes directly;
- has no local alternate mentor table;
- has no broken `first-grade-landing-v3.js` reference;
- has no missing legacy continuity reference;
- has one valid closing `</body></html>` sequence;
- loads externalized Grade 01 presentation/runtime files;
- uses CSP, referrer policy, and restrictive Permissions Policy.

## Assessment authority

PASS for current static-site model.

- Weekly mastery remains 80%+.
- The learner-facing landing page no longer provides free-form score entry.
- Printable mastery checks remain the evidence source.
- Adult-reviewed score recording lives in `teacher-tools/index.html`.
- Archaemenes does not write grades or certify mastery.
- Certificate logic reads the learner-scoped Grade 01 record.

## Certificate rule

Certificate readiness requires:

- all 36 weekly mastery checks at 80%+;
- midterm at 80%+;
- final at 80%+;
- approved portfolio evidence;
- an eligible active Grade 01 Academy learner.

## Compatibility

`assets/app.js` is retained as a compatibility shim for older Grade 01 pages that may still reference it. It no longer owns learner identity or mentor identity and directs formal recording toward the unified continuity layer.

## Remaining follow-up

- Inspect individual lesson pages for duplicated identity/profile logic.
- Inspect all 36 assessment pages for consistency and accessibility.
- Confirm every resource link resolves after branch deployment.
- Apply the same continuity pattern to Grades 02–05.

**Current status: Grade 01 identity, mentor, landing, learner-scoped records, adult review, and certificate flow are unified on the hardening branch.**
