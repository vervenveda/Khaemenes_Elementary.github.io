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

## Course-wide lesson and assessment engine

Elementary now uses one shared learning engine across the active Grade 01–05 lesson, quiz, and test surfaces.

The rollout currently covers:

- **1,332 lesson / subject-week / weekly-review surfaces**
- **228 formal assessment surfaces**
- **1,560 upgraded pages total**
- **0 skipped rollout targets**

The shared implementation is deliberately centralized:

```text
assets/khaemenes-elementary-question-factory.js
assets/khaemenes-elementary-learning-ledger.js
assets/khaemenes-elementary-assessment-engine.js
assets/khaemenes-elementary-focus-map.js
```

### Lesson checkpoints

Lesson surfaces can offer short randomized formative checkpoints plus an optional learner reflection.

Saved lesson evidence records:

- active learner ID when available;
- grade and week;
- subject / lesson focus;
- checkpoint score;
- optional reflection;
- completion time.

Lesson checkpoints are **not formal mastery evidence**. They cannot change a grade, unlock curriculum, alter placement, or satisfy an assessment.

The learner-scoped ledger key is:

```text
khaemenes_elementary_learning_ledger_v1
```

### Monte Carlo formal assessments

Weekly quizzes, midterms, and finals now use the shared first-party question factory and draw a fresh randomized attempt.

The factory includes grade-sensitive mathematics and language-arts generators plus reviewed scenario blueprints for science, social studies/civics, arts/music, health/PE/SEL, technology/tools, and integrated projects.

Formal assessment policy:

- weekly quizzes are **open book**;
- midterms are **closed book**;
- finals are **closed book**;
- answer order is randomized;
- a new retake draws a new attempt;
- each completed attempt is preserved as an immutable snapshot;
- the best verified score is retained for mastery;
- the minimum mastery threshold remains **80%**.

Assessment attempt records are learner-scoped under:

```text
khaemenes.elementary.assessment.attempts:<learnerId>:grade-XX
```

### Formal progression and certificate integrity

The grade dashboard no longer serves as the normal score-entry authority.

For Grades 02–05:

- weekly score fields are read-only verified results;
- midterm and final score fields are read-only verified results;
- unowned legacy records are preserved but are not silently attached to a newly active learner.

Formal sequence:

```text
Verified assessment attempt
        ↓
Best verified score
        ↓
80% weekly mastery
        ↓
Next week

36 / 36 mastered weeks
+ Midterm ≥ 80
+ Final ≥ 80
+ Adult-reviewed portfolio
        ↓
Certificate
```

A high average cannot compensate for an unmastered required week.

### Mentor, family, and portfolio evidence bridge

The Family Learning Snapshot can summarize recent lesson checkpoints and the latest verified assessment.

Archaemenes can receive:

- the number and broad focus of recent lesson checkpoints;
- verified assessment score summaries;
- skill names that merit review;
- matched optional practice.

Archaemenes does **not** receive the assessment questions, displayed answer choices, learner selections, or answer keys.

The Elementary Portfolio Builder can automatically discover learner-scoped lesson and assessment evidence on the same origin. New discoveries enter the Evidence Inbox as **pending** so a human reviewer still decides what belongs in the official portfolio.

Formative lesson checks enter with no mastery value. Only verified formal assessment attempts may carry numeric mastery evidence.

### Regression protection

The permanent workflow:

```text
.github/workflows/elementary-learning-engine-regression.yml
```

checks course-wide engine coverage, generated-question validity, large Monte Carlo pool depth, answer randomization, the 80% gate, 36/36 certificate requirements, verified-score dashboards, learner-scoped continuity, non-mastery lesson evidence, and the Portfolio evidence bridge.

---

## Privacy and sovereignty

The current public architecture is local-first and does not introduce advertising, third-party analytics, or a public learner database. Learner context is browser-local unless a commissioned Academy service explicitly provides a protected canonical record.

## Development rule

Preserve established Master Directory names, routes, storage keys, and curriculum authorities. Extend behavior through shared adapters, registries, and metadata rather than renaming established programs.

© 2026 Jennifer Kay Pearl. All Rights Reserved.
