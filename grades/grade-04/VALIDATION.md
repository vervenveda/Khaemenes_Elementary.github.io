# Grade 04 Hardening Validation

## Curriculum inventory

- Weeks: 36
- Subject halls: 8
- Lesson blocks: 1,440
- Weekly plans: 36
- Printable packets: 36
- Weekly assessments: 36
- Midterm: present
- Final exam: present
- Certificate: present
- Teacher / Family Tools: present
- Attribution: Jennifer Kay Pearl only

## Architecture

PASS — Grade 04 follows the unified Elementary authority model on `hardening/archaemenes-elementary`.

```text
Academy Family Registry → Elementary continuity → NAIB → Archaemenes → Grade 04
```

- Family Registry owns learner identity.
- Grade 04 requires the active learner to resolve to `grade-04` for formal records.
- Archaemenes is the mentor.
- Young Scholar is the Elementary presentation mode.
- Grade 04 does not define alternate local mentor authority.

## Record isolation

PASS — `assets/khaemenes-grade4-continuity.js` provides learner-scoped Grade 04 records.

- legacy shared Grade 04 state is compatibility data only;
- migration is a non-destructive copy;
- formal state is stored by learner ID;
- learner nickname comes from Academy identity rather than a free-form Grade 04 identity field.

## Mastery authority

PASS — student-side direct score entry was removed from the landing page.

Teacher / Family Tools now records verified:

- weekly mastery result;
- midterm result;
- final result;
- portfolio approval.

Controls remain disabled until an eligible Grade 04 learner is active.

## Certificate

PASS — certificate rendering uses the active learner-scoped Grade 04 record.

Requirements:

- active eligible Grade 04 learner;
- 36/36 weekly results at 80%+;
- midterm 80%+;
- final 80%+;
- portfolio approved.

## Preserved systems

- all eight subject halls;
- 36-week structure;
- 1,440 lesson blocks;
- weekly plans;
- printables;
- assessments;
- A++ research and capstone expectations;
- local-first course records;
- 80% completion rule.

## Status

**Grade 04 identity, mentor, record, mastery, and certification authority unified on the hardening branch.**
