# Khaemenes Elementary · Hardening Validation

Branch: `hardening/archaemenes-elementary`

## Current Checkpoint

This branch begins the unification of Elementary with the same Academy identity and mentor formula used by Preschool and Kinder Garden.

## Confirmed Repository Structure

- Root is the Grades 1–5 Elementary hub.
- Grade portals exist under `grades/grade-01/` through `grades/grade-05/`.
- Grade 02 currently includes a real `subjects/` directory, so the older validation warning about a possibly missing subject structure is no longer an unresolved folder-level concern.
- The repository contains assessment, records, teacher-tool, and game/resource surfaces.
- `mentor-manifest.json` exposes all five grade portals and verified mentor-eligible resources.

## Mentor Authority

PASS — canonical mentor rule documented.

- Current mentor: **Archaemenes**
- Routing authority: **NAIB**
- Default Elementary presentation: **Young Scholar**
- Local alternate mentor assignment: **retired**
- Future Mentor Adoption / avatar program: **planned, not active**

See `ARCHAEMENES_MENTOR_LOGIC.md`.

## Identity Boundary

IN PROGRESS — root page still contains an older standalone local student/parent profile implementation.

New unification files have been added:

- `assets/khaemenes-elementary-continuity.js`
- `assets/khaemenes-elementary-family-adapter.js`

These establish the target runtime contract:

```text
Academy Family Registry → NAIB → Archaemenes → grade context/resources
```

The adapter strips obsolete mentor identity fields from migrated compatibility records rather than carrying them forward.

## Preserved Systems

The hardening pass is intentionally preserving:

- Grade 01–05 course architectures;
- grade-level progress and mastery records;
- assessments and certificate logic;
- printables and teacher tools;
- Elementary mentor/resource manifest;
- Middle School bridge;
- local-first course state where it is still appropriate.

## Next Required Runtime Work

1. Replace the root page's free-form `mentor` field with a read-only Archaemenes/NAIB presentation.
2. Connect the root page to Academy Family Registry rather than creating a second authoritative learner identity.
3. Preserve legacy local progress/preferences only as migration/compatibility data.
4. Wire the two new Elementary continuity files into the root page.
5. Remove stale root UI wording that instructs families to create a separate Elementary identity.
6. Audit root dynamic rendering, CSP, storage, export behavior, route validation, and accessibility.
7. Inspect each Grade 01–05 portal for duplicated identity/mentor logic and route them through the same shared boundary where needed.

## Security Direction

The public Elementary repository must not contain credentials, tokens, private API secrets, privileged routing, or internal topology. Browser storage remains local device data and is not treated as a secure vault.

## Status

**Architecture unification started; root runtime migration not yet complete.**
