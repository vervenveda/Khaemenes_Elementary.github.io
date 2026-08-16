# Validation Report

## Curriculum inventory

- Units: 36
- Lessons per unit: 5
- Daily lessons: 180
- Weekly assessments: 36
- Printable packets: 36
- Midterm: present
- Final exam: present
- Certificate: present
- Teacher tools: present
- Attribution: Jennifer Kay Pearl only

## Mastery contract

The Grade 01 completion rule remains:

- 80% weekly average
- 80% midterm
- 80% final
- portfolio approval

The course owns Grade 01 course-specific mastery evidence. It does not own Academy placement.

## Canonical learner continuity

Implemented:

- `assets/khaemenes-grade1-continuity.js`
- `assets/khaemenes-grade1-surface-context.js`

Expected canonical placement:

- grade: `01`
- stage: `elementary`

The continuity adapters may read learner identity and placement and may write learner-scoped course state. They may not silently change learner identity, formal placement, grades, or Academy mastery decisions outside the Grade 01 course rules.

Learner-scoped storage convention:

`khaemenes.course:<learnerId>:elementary-grade-01[:<surface>]`

Legacy Grade 01 state is preserved non-destructively for compatibility.

## Second-depth surface status

- Grade root: canonical continuity active
- Teacher Tools: canonical learner context added
- Certificate: canonical learner-scoped state preferred; legacy fallback retained
- Assessment index: structurally present; surface-context wiring is the next direct assessment pass
- 36 unit assessments: printable evidence surfaces; no separate learner identity detected
- Midterm/final: printable evidence surfaces; identity-safe, but repeated-domain prompt structure is flagged for a later content-quality review
- Mathematics subject landing: present and queued for the next direct subject integration pass

See `GRADE01_DEPTH_AUDIT_2026-08-16.md` for the detailed second-depth audit.

## Runtime validation boundary

This report documents source-level contracts and repository structure. Browser, mobile, keyboard, print, and multi-learner runtime behavior must still be exercised in an actual browser session before Grade 01 is marked fully runtime-certified.
