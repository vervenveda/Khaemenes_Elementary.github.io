# Khaemenes Elementary · Hardening Validation

Branch: `hardening/archaemenes-elementary`

## Current Checkpoint

Elementary now follows one Academy identity, delegation, mentor, and mastery model from the root through Grades 01–05.

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
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy
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
- NAIB is the front-desk administrator / AI Resources Director and owns bounded delegation across the ecosystem.
- Khaemenes Academy provides Archaemenes as its institutional mentor.
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

`assets/khaemenes-elementary-family-adapter.js` treats the old `khaemenes_elementary_profiles_v1` object as compatibility data only.

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
- NAIB delegation context excludes learnerId and familyId;
- the continuity layer prefers NAIB `delegate()` and retains `assignMentor()` only as a transition compatibility seam;
- Archaemenes remains the safe visible Academy fallback if the public router is temporarily unavailable.

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

The page still consumes the public Academy Family Registry and public NAIB delegation router as first-party Academy dependencies. GitHub Pages remains a public static surface; browser-side logic is not treated as authentication or authorization.

## Grade-Level Status

PASS — Grades 01–05 are on the same authority model on this branch.

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
- adult record controller externalized in `assets/grade4-records.js`;
- certificate print control is unique and externalized;
- certificate requires active Grade 04 learner plus completion gates.

### Grade 05
- learner-scoped records;
- middle-school readiness structure preserved;
- direct student mastery entry removed;
- adult verification surface established;
- certificate requires active Grade 05 learner plus completion gates;
- Grade 05 completion does not silently promote the learner to Grade 06.

## Certification Standard

PASS.

Grades 01–05 use the strengthened common completion rule:

- active eligible learner in the correct grade;
- 36/36 weekly mastery results at 80% or above;
- midterm at 80% or above;
- final at 80% or above;
- required portfolio/capstone evidence approved.

This intentionally replaces older average-only weekly certification behavior.

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
- the 80% mastery threshold.

## Remaining Deployment Checks

Architecture hardening is complete on this review branch. Before merging to `main`, the remaining work is browser/deployment validation rather than another structural rewrite:

1. root → Grade 01–05 navigation;
2. Family Profile selection and grade switching;
3. NAIB v2 delegation available / unavailable fallback behavior;
4. Grade 01–05 teacher-tool record writes;
5. certificate unlock/lock and print behavior;
6. legacy-record migration with more than one learner;
7. strict CSP behavior in the deployed GitHub Pages environment;
8. Middle School bridge routing;
9. mobile and print layouts.

## Status

**Elementary root and Grades 01–05 are architecturally unified and hardened on the review branch. `main` remains unchanged pending deployment validation and merge approval.**
