# Grade 02 Hardening Validation

## Curriculum inventory

- Weeks: 36
- Subjects: 8
- Lesson blocks: 1,440
- Printable packets: 36
- Weekly assessments: 36
- Midterm: present
- Final: present
- Teacher tools: present
- Certificate: present
- Attribution: Jennifer Kay Pearl only

## Architecture

PASS — Grade 02 now follows the unified Elementary authority model on `hardening/archaemenes-elementary`.

```text
Academy Family Registry → Elementary continuity → NAIB → Archaemenes → Grade 02
```

- Family Registry owns learner identity.
- Grade 02 requires the active learner to resolve to `grade-02` for formal records.
- Archaemenes is the mentor.
- Young Scholar is the Elementary presentation mode.
- Grade 02 does not define alternate local mentor authority.

## Record isolation

PASS — `assets/khaemenes-grade2-continuity.js` adds learner-scoped Grade 02 records.

- legacy key remains a compatibility source only;
- legacy data is copied non-destructively when first linked to an eligible learner;
- formal Grade 02 state is stored by learner ID;
- learner nickname comes from Academy identity rather than a free-form course identity field.

## Mastery authority

PASS — student-facing direct mastery entry has been removed from the Grade 02 landing page.

Teacher / Family Tools now records verified:

- weekly mastery result;
- midterm result;
- final result;
- portfolio approval.

These controls are disabled unless an eligible Grade 02 learner is active.

## Certificate

PASS — the certificate now uses the active learner-scoped Grade 02 record.

Certificate requirements:

- active eligible Grade 02 learner;
- 36/36 weekly results at 80%+;
- midterm 80%+;
- final 80%+;
- portfolio approved.

## Preserved systems

- all eight subject halls;
- 36-week structure;
- printables;
- assessments;
- teacher tools;
- standards/crosswalk data;
- local-first course records;
- 80% completion rule.

## Dependencies

The course uses first-party Academy Family Registry / continuity scripts. No third-party trackers, advertising, fonts, or curriculum services are required by the repaired Grade 02 portal.

## Status

**Grade 02 identity, mentor, record, and certification authority unified on the hardening branch.**
