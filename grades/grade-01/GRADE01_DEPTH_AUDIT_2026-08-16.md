# Grade 01 Second-Depth Integration Audit — 2026-08-16

## Scope

This audit covers the Grade 01 learner journey beneath the grade root:

- grade landing page
- subject landing pages
- lessons
- assessments
- records / certificate
- teacher tools
- learner continuity
- placement authority

## Current structure

The Grade 01 directory contains:

- `index.html`
- `subjects/`
- `lessons/`
- `assessments/`
- `records/`
- `teacher-tools/`
- `printables/`
- `assets/`
- `data/`

The assessment layer includes 36 unit mastery checks, a weekly assessment index, a midterm, and a final. The records layer currently exposes the completion certificate. The teacher layer exposes a printable First Grade Mentor Toolkit.

## Canonical identity status

### PASS

The Grade 01 root already has the Academy Family Registry continuity adapter and can recognize the active canonical Grade 01 learner.

`assets/khaemenes-grade1-continuity.js`:

- expects grade `01` and stage `elementary`;
- preserves preview access for other learners;
- does not change identity, placement, mastery, or grades;
- mirrors the legacy Grade 01 state into learner-scoped storage;
- preserves legacy state non-destructively.

### NEW SHARED SURFACE CONTRACT

`assets/khaemenes-grade1-surface-context.js` is the reusable second-depth adapter for Grade 01 surfaces.

It provides:

- canonical learner status;
- placement-match / preview-mode information;
- a visible optional learner-context banner;
- learner-scoped surface storage keys;
- no formal academic mutation authority.

Storage convention:

`khaemenes.course:<learnerId>:elementary-grade-01:<surface>`

## Assessment findings

### Weekly assessments

The assessment index contains 36 unit mastery checks at a stated 80% threshold. Each unit assessment is printable and observational/performance based.

### Midterm and final

The current midterm and final are printable demonstration rubrics rather than browser-scored tests. They do not create a second learner identity and do not directly mutate placement.

However, the current midterm/final prompts repeat broad domain demonstrations many times. That is a curriculum-quality issue to revisit separately from identity continuity. This audit does not silently replace the assessment design.

## Certificate finding

The current certificate runtime reads the legacy browser-wide state key:

`khaemenes_grade1_36_aplus_v1`

This is the most important Grade 01 records gap because two Grade 01 learners sharing a browser could otherwise compete for one certificate state.

Required repair:

1. prefer the canonical learner-scoped Grade 01 state when a valid Grade 01 learner is active;
2. fall back to the legacy key for backward compatibility;
3. use the canonical learner nickname when available;
4. preserve the 80% completion rule;
5. never issue a certificate merely because a different learner's legacy state exists.

## Teacher-tools finding

The Teacher Toolkit is pedagogically separate from learner identity, which is appropriate. It should still display active learner context when a teacher opens it from a Grade 01 learner pathway, but it must remain printable and usable in preview mode.

Teacher tools do not own formal placement or mastery.

## Subject finding

Grade 01 currently contains a Mathematics subject landing surface under:

`subjects/math/math-01_index.html`

This subject landing page is part of the next Grade 01 subpass and should inherit the same surface context contract rather than create its own profile/state authority.

## Authority contract

Grade 01 surfaces may:

- read canonical learner identity;
- read formal placement;
- write learner-scoped course state;
- present assessment evidence;
- print teacher/family materials;
- recommend review or next steps.

Grade 01 surfaces may not:

- change formal placement silently;
- create a second learner identity;
- award Academy placement;
- mutate another learner's record;
- treat preview access as enrollment.

## Certification state

### Root Grade 01
PASS — canonical continuity established.

### Teacher Tools
PASS WITH CONTEXT UPGRADE — printable/advisory, no independent academic authority.

### Assessment Index
PASS WITH CONTEXT UPGRADE — 36 mastery checks, 80% stated threshold.

### Unit Assessments
PASS FOR IDENTITY — printable evidence sheets, no competing learner identity. Individual content-quality audit remains separate.

### Midterm / Final
PASS FOR IDENTITY / REVIEW RECOMMENDED FOR CONTENT DEPTH — printable, no silent placement mutation; repeated-domain structure should later receive a content-quality pass.

### Certificate
REPAIR REQUIRED — legacy browser-wide state must be subordinated to learner-scoped canonical state.

### Subject Halls
IN PROGRESS — Mathematics is the current Grade 01 subject landing surface and is next for direct integration.

## Next action

Wire the shared Grade 01 surface context into:

1. weekly assessment index;
2. teacher tools;
3. certificate;
4. Mathematics subject landing page;
5. then inspect lesson-entry surfaces before marking Grade 01 fully second-depth certified.
