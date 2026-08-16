# Khaemenes Elementary · Hardening Validation

Branch: `hardening/archaemenes-elementary`

## Current Checkpoint

Elementary now follows the same Academy identity and mentor formula used by Preschool and Kinder Garden.

## Confirmed Repository Structure

- Root is the Grades 1–5 Elementary hub.
- Grade portals exist under `grades/grade-01/` through `grades/grade-05/`.
- Grade 02 currently includes a real `subjects/` directory, so the older validation warning about a possibly missing subject structure is no longer an unresolved folder-level concern.
- The repository contains assessment, records, teacher-tool, and game/resource surfaces.
- `mentor-manifest.json` exposes all five grade portals and verified mentor-eligible resources.

## Mentor Authority

PASS.

- Current mentor: **Archaemenes**
- Routing authority: **NAIB**
- Default Elementary presentation: **Young Scholar**
- Local alternate mentor assignment: **retired**
- Future Mentor Adoption / avatar program: **planned, not active**

See `ARCHAEMENES_MENTOR_LOGIC.md`.

## Identity Boundary

PASS at the Elementary root.

The root homepage no longer creates or edits a second authoritative student/parent identity. It now reads the active learner from the Academy Family Registry and routes mentor continuity through the Elementary continuity layer.

Runtime chain:

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
```

New shared files:

- `assets/khaemenes-elementary-continuity.js`
- `assets/khaemenes-elementary-family-adapter.js`
- `assets/elementary-home.js`
- `assets/elementary-home.css`

The family adapter strips obsolete mentor identity fields from migrated compatibility records rather than carrying them forward.

## Root Homepage Changes

PASS.

Removed from root authority:

- free-form mentor naming;
- standalone student identity creation;
- duplicate parent/guardian identity administration;
- manually entered root-level progress percentages that could disagree with course records.

Preserved as learner-scoped local preferences only:

- favorite subject;
- current learning goal;
- pinned grade doorway;
- preference export and print overview.

These preferences do not assign identity, mentor authority, or mastery.

## Security Boundary

PASS for the current root hardening target.

The root now uses:

- external local CSS/JS instead of a large inline application script;
- Content Security Policy;
- no-referrer policy;
- restrictive Permissions Policy;
- no iframe surface;
- DOM construction/text assignment for grade cards rather than user-controlled HTML injection;
- bounded local preference storage;
- no credentials, access tokens, private keys, or privileged server configuration.

GitHub Pages remains a public static surface; browser-side controls are not treated as authentication or authorization.

## Preserved Systems

The hardening pass intentionally preserves:

- Grade 01–05 course architectures;
- grade-level progress and mastery records;
- assessments and certificate logic;
- printables and teacher tools;
- Elementary mentor/resource manifest;
- Middle School bridge;
- local-first course state where appropriate.

## Remaining Work

The Elementary **root** is unified. The next audit should inspect Grade 01–05 portals individually for:

1. duplicate learner/profile systems;
2. local mentor fields or alternate mentor authority;
3. mastery/progress consistency;
4. unsafe dynamic rendering;
5. CSP and network boundaries;
6. broken internal routes;
7. compatibility records that should migrate rather than remain authoritative.

## Status

**Elementary root identity and mentor unification complete on the hardening branch. Grade-level deep inspection remains.**