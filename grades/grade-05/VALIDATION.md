# Grade 05 Hardening Validation

## Curriculum inventory

- Weeks: 36
- Subject halls: 8
- Lesson blocks: 1,440
- Weekly plans: 36
- Printable packets: 36
- Weekly assessments: 36
- Midterm: present
- Final: present
- Teacher / Family Tools: present
- Certificate: present
- Middle-school readiness portfolio / capstone: present
- Advanced Grade 06 preview bridge: present
- Attribution: Jennifer Kay Pearl only

## Architecture

PASS — Grade 05 follows the unified Elementary authority model on `hardening/archaemenes-elementary`.

```text
Academy Family Registry
  → NAIB delegation
  → Khaemenes Academy
  → Archaemenes · Young Scholar
  → Grade 05
  → assessment evidence
  → adult verification
  → certificate / Middle School readiness
```

- Family Registry owns learner identity and formal placement.
- Formal Grade 05 records require the active learner to resolve to `grade-05`.
- NAIB delegates; it does not become the learner's academic mentor.
- Khaemenes Academy provides Archaemenes.
- Young Scholar is the Elementary presentation.
- Grade 05 defines no alternate mentor authority.

## Record isolation

PASS — `assets/khaemenes-grade5-continuity.js` stores formal records by learner ID.

- legacy shared browser data remains migration-only;
- migration uses a one-time learner claim;
- the old shared record is not rewritten by the hardened runtime;
- one historical snapshot cannot silently migrate into multiple learners;
- learner nickname is supplied by Academy identity;
- Grade 05 course state remains local-first and course-owned.

## Mastery authority

PASS — learner-facing score entry has been removed from the Grade 05 landing page.

Teacher / Family Tools records verified:

- weekly mastery score;
- midterm score;
- final score;
- portfolio / capstone approval.

Controls remain locked without an eligible Grade 05 learner.

## Certificate

PASS — certificate uses the active learner-scoped Grade 05 record.

Requirements:

- active eligible Grade 05 learner;
- 36/36 weeks at 80%+;
- midterm 80%+;
- final 80%+;
- portfolio / capstone approved.

## Grade 05 → Grade 06 academic bridge

PASS — the Grade 05 and Grade 06 programs form a coherent progression.

Key progression checks:

- Grade 05 quotation/comparison/research → Grade 06 citation/argument/disciplinary literacy;
- Grade 05 decimals/fractions/coordinate planes/volume → Grade 06 ratios/rates/percent/rational numbers/expressions/equations/statistics;
- Grade 05 matter/Earth systems/ecosystems/models → Grade 06 systems science/data/CER/engineering;
- Grade 05 civics/historical foundations → Grade 06 world geography/ancient civilizations/primary sources/economics/trade/migration;
- Grade 05 technology/source notes/capstone → Grade 06 independent research/design systems;
- Grade 06 introduces a dedicated World Languages & Global Culture hall, identified as a useful advanced-preview strand.

## Advanced learner pathway

PASS — the Grade 05 landing page now exposes an **Advanced Grade 06 Preview** without changing formal grade placement.

Preview mode is explicitly non-authoritative. It does not:

- rewrite the Academy learner's stage;
- rewrite `grade-05` to `grade-06`;
- create or unlock a formal Grade 06 record;
- award Grade 06 mastery;
- bypass the adult/Academy placement decision.

The bridge carries context to the Middle School landing page using a public entry-mode query only. No learner or family identifier is placed in the URL.

## Middle School boundary

PASS — Grade 05 completion does not auto-promote, create, or silently change a learner into Grade 06. Middle School transition remains explicit and separate.

The transition center can be visited before formal promotion for planning and preview, while formal Grade 06 record eligibility remains dependent on the Academy Family Registry reporting:

- `stage: middle`
- `grade: grade-06`

## Preserved systems

- all eight subject halls;
- 36-week structure;
- 1,440 lesson blocks;
- weekly plans;
- printables;
- assessments;
- research/capstone expectations;
- middle-school readiness work;
- local-first records;
- 80% mastery rule.

## Remaining deployment checks

Before merge, browser-test:

1. Grade 05 learner with incomplete certification;
2. Grade 05 learner with complete certification;
3. Advanced Preview link into Middle School;
4. transition-center link into Middle School;
5. confirmation that Grade 06 formal records remain locked for an unpromoted Grade 05 learner;
6. formal Grade 06 learner after explicit placement change;
7. mobile and print layouts.

## Status

**Grade 05 identity, mentor, records, mastery, certification, standard transition, and advanced Middle School preview boundary are unified on the hardening branch.**
