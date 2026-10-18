# Khaemenes Elementary Academy

**Grades 01–05 · Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**

Khaemenes Elementary is the Grades 1–5 learning campus of Khaemenes Academy. It uses the Academy Family Registry for learner identity and formal placement while keeping grade curriculum records learner-scoped and local-first.

## Authority model

Elementary follows one continuous Academy architecture:

```text
Academy Family Registry
        ↓
Active Elementary learner · Grade 01–05
        ├── Course engine → scores, mastery, assessments, progression, certificate
        ├── NAIB → routing, matching, academic navigation
        ├── Archaemenes → educational mentorship
        └── Family / educator → observation, judgment, support
```

Archaemenes is the single educational Mentor. Elementary does not create a second Mentor identity.

## Archaemenes across Grades 01–05

Archaemenes remains the **Academy Mentor** while his presentation grows with the learner:

- Grade 01 — gentle learning guide
- Grade 02 — curious learning coach
- Grade 03 — independent-learning coach
- Grade 04 — study-strategy coach
- Grade 05 — scholarship and readiness coach

These are developmental presentation modes, not separate Mentor identities.

## Today with Archaemenes

The shared Elementary experience layer keeps the formal grade pathway first:

1. **Learn** — current formal week, correction, assessment, portfolio, or completion step.
2. **Practice** — optional support matched from the shared Elementary resource registry.
3. **Explore / Create** — a second way to apply or extend the idea.
4. **Reset** — an optional Aurora learning break before returning to formal work.

Practice tools do not award mastery and cannot unlock formal curriculum.

## Shared Elementary resource registry

The first-party registry is:

```text
assets/khaemenes-elementary-resources.js
```

It currently registers the 28 verified Elementary game and learning-tool cabinets in `/games/` and provides one matching source for Mentor and family support recommendations.

The shared experience layer is:

```text
assets/khaemenes-elementary-experience.js
```

## Family Learning Snapshot

The Elementary home and grade portals can show a learner-scoped family snapshot containing:

- current grade and formal academic position;
- weeks recorded at the 80% mastery threshold;
- average across attempted weeks;
- recent optional support-path activity;
- learner goal and favorite subject when saved;
- lesson or week focus when available;
- matched optional support;
- latest optional family observation.

### Optional family observations

A grown-up may record:

- **Learning with support**
- **Working independently**
- **Explaining & applying**

These notes never change a score, mastery gate, assessment, placement, prerequisite, portfolio requirement, or certificate. They are not diagnoses or ability labels.

## Academy Mentor context bridge

Elementary publishes a sanitized browser-local record:

```text
khaemenes_elementary_mentor_context_v1
```

It may include the active learner ID, grade, current formal position, mastery summary, learning goal, current instructional focus, matched support, and recent optional family observations.

The Academy Mentor accepts this context only when its learner ID matches the active learner in the Academy Family Registry.

Family support notes are **not** copied into the Mentor context.

## Grade continuity

Grade 01 retains its active Grade 1 mastery engine as the state authority. Grades 02–05 use their grade continuity adapters and learner-scoped course records.

Grade 03 now publishes cross-campus learning continuation consistently with Grades 02, 04, and 05.

## Mastery boundary

The minimum formal mastery threshold remains **80%**. Mentor suggestions and family observations are support context only.

## Privacy and sovereignty

The current public architecture is local-first and does not introduce advertising, third-party analytics, or a public learner database. Learner context is browser-local unless a commissioned Academy service explicitly provides a protected canonical record.

## Development rule

Preserve established Master Directory names, routes, storage keys, and curriculum authorities. Extend behavior through shared adapters, registries, and metadata rather than renaming established programs.

© 2026 Jennifer Kay Pearl. All Rights Reserved.
