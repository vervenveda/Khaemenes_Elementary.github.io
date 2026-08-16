# Khaemenes Elementary · Hardening Validation

Branch: `hardening/archaemenes-elementary`

## Current Checkpoint

Elementary now follows one Academy identity, mentor, and mastery model from the root through Grades 01–05.

## Confirmed Repository Structure

- Root is the Grades 01–05 Elementary hub.
- Grade portals exist under `grades/grade-01/` through `grades/grade-05/`.
- Grade 02 includes a real `subjects/` directory.
- Grade 03–05 include subject halls and weekly plans.
- Assessment, records, teacher-tool, printable, and resource surfaces remain preserved.
- `mentor-manifest.json` remains the public Elementary mentor/resource inventory.

## Unified Authority Model

PASS.

```text
Academy Family Registry
        ↓
Elementary continuity
        ↓
NAIB mentor routing
        ↓
Archaemenes · Young Scholar
        ↓
Grade 01–05 course context
        ↓
Assessment evidence + adult verification
        ↓
Learner-scoped course record / certificate
```

Authority boundaries:

- Family Registry owns learner identity and formal grade placement.
- NAIB owns mentor routing.
- Archaemenes is the current Elementary mentor.
- `Young Scholar` is a presentation mode, not a second mentor identity.
- Grade portals own course state.
- Assessments and adult verification own mastery evidence.
- The root homepage does not act as a gradebook.

## Root Identity Boundary

PASS.

The root homepage no longer creates or edits a second authoritative student/parent identity.

Removed from root authority:

- free-form mentor naming;
- standalone learner creation;
- duplicate parent/guardian administration;
- local grade placement authority;
- manually entered root-level progress percentages;
- learner/family identifiers in public readiness-event detail.

The root may store only bounded local preferences:

- favorite subject;
- current learning goal;
- pinned grade doorway.

A pinned grade is explicitly a convenience preference. It cannot become the authoritative Academy grade and cannot unlock grade-level certification.

## Compatibility Migration

PASS.

`assets/khaemenes-elementary-family-adapter.js` now treats the old `khaemenes_elementary_profiles_v1` object as compatibility data only.

Before writing compatibility data it removes legacy authority fields, including:

- mentor / mentorId / mentorIdentity;
- personality;
- local student name and grade;
- parent / guardian / family objects;
- learnerId / familyId;
- prior embedded Academy identity objects.

Only non-authoritative preference-style data may remain, plus a minimal stage/grade compatibility marker.

## Continuity Boundary

PASS.

`assets/khaemenes-elementary-continuity.js` no longer uses the old local Elementary profile as fallback authority for learner name or grade.

- learner name comes from Family Registry;
- grade comes from Family Registry;
- legacy profile data may only supply non-authoritative preference context;
- mentor assignment context excludes learnerId and familyId;
- Archaemenes remains the safe visible fallback if the public router is temporarily unavailable.

## Browser Security Boundary

PASS for the static Elementary root.

The root now uses:

- external first-party CSS/JS rather than a large inline application runtime;
- restrictive Content Security Policy;
- `no-referrer` policy;
- restrictive Permissions Policy;
- no iframe/object/media/worker surface;
- `form-action 'none'` because the root has no form submission workflow;
- bounded local preference storage;
- DOM construction and `textContent` for learner-facing dynamic content;
- no credentials, access tokens, private keys, or privileged server configuration.

The page still consumes the public Academy Family Registry and public NAIB mentor router as first-party Academy dependencies. GitHub Pages remains a public static surface; browser-side logic is not treated as authentication or authorization.

## Grade-Level Status

PASS — Grades 01–05 have been brought onto the same authority model on this branch.

### Grade 01
- learner-scoped records;
- Archaemenes continuity;
- direct student mastery entry removed;
- adult verification surface established;
- certificate requires active Grade 01 learner plus completion gates.

### Grade 02
- learner-scoped records;
- eight subject halls preserved;
- direct student mastery entry removed;
- adult verification surface established;
- certificate requires active Grade 02 learner plus completion gates.

### Grade 03
- learner-scoped records;
- subject-hall / weekly-plan architecture preserved;
- direct student mastery entry removed;
- adult verification surface established;
- certificate requires active Grade 03 learner plus completion gates.

### Grade 04
- learner-scoped records;
- A++ curriculum and capstone expectations preserved;
- direct student mastery entry removed;
- adult verification surface established;
- certificate requires active Grade 04 learner plus completion gates.

### Grade 05
- learner-scoped records;
- middle-school readiness structure preserved;
- direct student mastery entry removed;
- adult verification surface established;
- certificate requires active Grade 05 learner plus completion gates;
- Grade 05 completion does not silently promote the learner to Grade 06.

## Middle School Boundary

PASS.

The Elementary root links onward to Khaemenes Middle School without creating a new learner identity or automatically rewriting grade placement. Promotion remains a deliberate Academy/family action.

## Preserved Systems

The hardening pass intentionally preserves:

- Grade 01–05 curriculum architectures;
- grade-level course records;
- assessments and certificate rules;
- printables and teacher tools;
- mentor/resource manifest;
- Middle School bridge;
- local-first course state where appropriate;
- existing 80% mastery/certification rules.

## Remaining Pre-Merge Checks

Before merging to `main`, run a final browser validation pass for:

1. root → Grade 01–05 navigation;
2. Family Profile selection and grade switching;
3. NAIB router available / unavailable fallback behavior;
4. Grade 01–05 teacher-tool record writes;
5. certificate unlock/lock behavior;
6. legacy-record migration with more than one learner;
7. strict CSP behavior in the deployed GitHub Pages environment;
8. Middle School bridge routing;
9. mobile and print layouts.

## Status

**Elementary root and Grades 01–05 are architecturally unified and hardened on the review branch. `main` remains unchanged pending final validation and merge approval.**
