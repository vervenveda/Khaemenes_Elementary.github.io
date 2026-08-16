# Grade 05 Hardening Validation

## Curriculum inventory

- Weeks: 36
- Subject halls: 8
- Lesson blocks: 1,440
- Weekly plans: 36
- Printable packets: 36
- Weekly assessments: 36
- Midterm: present
- Final: present
- Teacher / Family Tools: present
- Certificate: present
- Middle-school readiness portfolio / capstone: present
- Attribution: Jennifer Kay Pearl only

## Architecture

PASS — Grade 05 follows the unified Elementary authority model on `hardening/archaemenes-elementary`.

```text
Academy Family Registry → Elementary continuity → NAIB → Archaemenes → Grade 05
```

- Family Registry owns learner identity.
- Formal Grade 05 records require the active learner to resolve to `grade-05`.
- Archaemenes is the current mentor.
- Young Scholar is the Elementary presentation.
- Grade 05 defines no alternate mentor authority.

## Record isolation

PASS — `assets/khaemenes-grade5-continuity.js` stores formal records by learner ID.

- legacy shared browser data remains migration-only;
- migration is a non-destructive copy;
- learner nickname is supplied by Academy identity;
- Grade 05 course state remains local-first and course-owned.

## Mastery authority

PASS — learner-facing score entry has been removed from the Grade 05 landing page.

Teacher / Family Tools now records verified:

- weekly mastery score;
- midterm score;
- final score;
- portfolio / capstone approval.

Controls remain locked without an eligible Grade 05 learner.

## Certificate

PASS — certificate uses the active learner-scoped Grade 05 record.

Requirements:

- active eligible Grade 05 learner;
- 36/36 weeks at 80%+;
- midterm 80%+;
- final 80%+;
- portfolio / capstone approved.

## Middle School boundary

PASS — Grade 05 completion does not auto-promote, create, or silently change a learner into Grade 06. Middle School transition remains explicit and separate.

## Preserved systems

- all eight subject halls;
- 36-week structure;
- 1,440 lesson blocks;
- weekly plans;
- printables;
- assessments;
- research/capstone expectations;
- middle-school readiness work;
- local-first records;
- 80% mastery rule.

## Status

**Grade 05 identity, mentor, record, mastery, certificate, and transition boundary unified on the hardening branch.**
