# Khaemenes Elementary · Hardening Validation

Branch: `hardening/archaemenes-elementary`

## Current Checkpoint

Elementary follows one Academy identity, delegation, mentor, and mastery model from the root through Grades 01–05.

## Confirmed Repository Structure

- Root is the Grades 01–05 Elementary hub.
- Grade portals exist under `grades/grade-01/` through `grades/grade-05/`.
- Grade 01 preserves lessons, subjects, assessments, printables, records, and teacher tools.
- Grade 02 includes a real `subjects/` directory.
- Grades 03–05 include subject halls and weekly plans.
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
- NAIB is the front-desk administrator / AI Resources Director and performs bounded delegation across the ecosystem.
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

PASS after final validation repair.

`assets/khaemenes-elementary-family-adapter.js` treats the old `khaemenes_elementary_profiles_v1` object as compatibility data only.

Before writing compatibility data it removes legacy authority fields, including:

- mentor / mentorId / mentorIdentity;
- personality;
- local student name and grade;
- parent / guardian / family objects;
- learnerId / familyId;
- prior embedded Academy identity objects.

Only non-authoritative preference-style data may remain, plus a minimal stage/grade compatibility marker.

### Grade legacy migration isolation

During the final static validation pass, a multi-learner edge case was found in the grade continuity bridges: the old shared legacy key was still being rewritten after learner-scoped records became active. A second learner could therefore have inherited the first learner's latest compatibility snapshot.

This has been repaired in Grades 01–05.

Each grade now:

- treats the old shared key as migration input only;
- never rewrites that legacy key after learner-scoped state is active;
- records a one-time migration claim for the learner receiving an unscoped legacy record;
- refuses to migrate a legacy record already tied or claimed to another learner;
- saves all new formal state only under the grade's learner-scoped records map;
- clears only the active learner's learner-scoped state, leaving historical legacy input untouched.

This prevents sibling / multi-learner record bleed while retaining non-destructive legacy recovery.

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

PASS for static architecture inspection of the Elementary root.

The root uses:

- external first-party CSS/JS rather than a large inline application runtime;
- restrictive Content Security Policy;
- `no-referrer` policy;
- restrictive Permissions Policy;
- no iframe/object/media/worker surface;
- `form-action 'none'` because the root has no form submission workflow;
- bounded local preference storage;
- DOM construction and `textContent` for learner-facing dynamic content;
- no credentials, access tokens, private keys, or privileged server configuration.

The page consumes the public Academy Family Registry and public NAIB delegation router as first-party Academy dependencies. GitHub Pages remains a public static surface; browser-side logic is not treated as authentication or authorization.

## Grade-Level Status

PASS — Grades 01–05 are on the same authority model on this branch.

### Grade 01
- learner-scoped records;
- Archaemenes continuity;
- direct student mastery entry removed;
- adult verification surface established;
- one-time legacy migration isolation added;
- certificate requires active Grade 01 learner plus completion gates.

### Grade 02
- learner-scoped records;
- eight subject halls preserved;
- direct student mastery entry removed;
- adult verification surface established;
- one-time legacy migration isolation added;
- certificate requires active Grade 02 learner plus completion gates.

### Grade 03
- learner-scoped records;
- subject-hall / weekly-plan architecture preserved;
- direct student mastery entry removed;
- adult verification surface established;
- one-time legacy migration isolation added;
- certificate requires active Grade 03 learner plus completion gates.

### Grade 04
- learner-scoped records;
- A++ curriculum and capstone expectations preserved;
- direct student mastery entry removed;
- adult verification surface established;
- adult record controller externalized in `assets/grade4-records.js`;
- certificate print control is unique and externalized;
- one-time legacy migration isolation added;
- certificate requires active Grade 04 learner plus completion gates.

### Grade 05
- learner-scoped records;
- middle-school readiness structure preserved;
- direct student mastery entry removed;
- adult verification surface established;
- one-time legacy migration isolation added;
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

## Static Pre-Merge Validation · 2026-08-16

PASS with one issue found and repaired during validation.

Confirmed by repository inspection:

1. Root grade map points to `grades/grade-01/index.html` through `grades/grade-05/index.html`.
2. Grade directories and their assessment / record / teacher-tool structures are present.
3. Family adapter does not expose learnerId or familyId in its public ready-event detail.
4. Family adapter never creates a family and never auto-promotes a learner.
5. Elementary continuity requires the authoritative Family Registry grade for formal grade context.
6. Grade continuity modules require the matching active grade before exposing formal records.
7. Grade record keys are unique by grade and records are additionally keyed by learner ID.
8. All five certification summaries require 36 mastered weeks, midterm 80%+, final 80%+, and portfolio evidence.
9. Grade 04 teacher-record logic and certificate print behavior are externalized rather than inline application logic.
10. Grade 05 completion does not rewrite the learner into Middle School.
11. Root Middle School bridge points to the separate Khaemenes Middle School repository.
12. Multi-learner legacy migration was examined, an inheritance risk was identified, and Grades 01–05 were repaired with single-claim migration and read-only legacy snapshots.

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

## Remaining Browser / Deployment Checks

Static architecture validation is complete. These items require an actual deployed/browser execution pass and are not honestly provable from repository source alone:

1. click-through root → Grade 01–05 navigation in the deployed origin;
2. Family Profile learner selection and live grade switching across pages;
3. NAIB v2 available / unavailable runtime fallback behavior;
4. adult teacher-tool writes and reload persistence for two separate learners;
5. certificate lock → unlock → print flow in each grade;
6. strict CSP behavior under the deployed GitHub Pages/custom-domain environment;
7. mobile layout at narrow viewports;
8. print layout for lessons, records, and certificates;
9. Middle School bridge click-through.

## Status

**Elementary root and Grades 01–05 are statically validated, architecturally unified, and hardened on the review branch. One multi-learner migration defect was found during validation and repaired across all five grades. `main` remains unchanged pending browser/deployment validation and merge approval.**
