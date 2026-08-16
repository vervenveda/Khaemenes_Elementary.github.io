# Khaemenes Elementary Academy

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**

Khaemenes Elementary Academy is the Grades 1–5 learning division of Khaemenes Academy.

It provides five elementary grade pathways, family-linked learner continuity, local course progress, printable learning evidence, assessments, records, certificates, and a bridge into Khaemenes Middle School.

## Canonical Identity and Delegation Architecture

Elementary follows the same Academy identity model as Preschool and Kinder Garden.

```text
Academy Family Registry
        ↓
active Elementary learner
        ↓
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy
        ↓
Archaemenes
        ↓
Young Scholar presentation
        ↓
current Grade 01–05 course context
        ↓
approved learning resources + bounded guidance
```

**Archaemenes is the current Khaemenes Academy mentor for Elementary learners.**

NAIB is the front-desk administrator / AI Resources Director. NAIB receives bounded visitor context and delegates the visitor to the appropriate platform, resource, service, or specialist AI. For an Elementary learner, NAIB delegates into Khaemenes Academy; the Academy provides Archaemenes as its institutional mentor.

The root page and grade portals must not create competing mentor identities. Older free-form mentor fields or custom mentor objects are legacy compatibility data only and are not mentor authority.

A future responsible Mentor Adoption / avatar program may be added under separate Academy safety, guardian, privacy, continuity, and identity rules. It is not active in the current Elementary platform.

See `ARCHAEMENES_MENTOR_LOGIC.md` for the governing mentor rule.

## Authority Boundaries

- **Academy Family Registry** owns learner/family identity and formal grade placement.
- **NAIB** owns intake, resource direction, and delegation across the wider ecosystem.
- **Khaemenes Academy** owns the Archaemenes institutional mentor relationship.
- **Archaemenes** mentors the learner inside Academy education.
- **Grade curriculum** owns lessons, mastery rules, assessments, records, and certificates.
- **mentor-manifest.json** exposes approved grade destinations and mentor-eligible learning resources.
- **Parents, guardians, and educators** remain the human authority.

Archaemenes may explain, encourage, give clues, recommend practice, and help navigate. He does not award mastery, bypass assessments, alter grades, or replace human judgment.

## Grade Pathways

The Elementary grade portals are organized under:

- `grades/grade-01/`
- `grades/grade-02/`
- `grades/grade-03/`
- `grades/grade-04/`
- `grades/grade-05/`

### Grade 01

First Grade remains unit-based. Major parts include lessons, printables, assessments, teacher tools, records, and learner-scoped progress.

### Grade 02

Second Grade includes a `subjects/` directory as well as assessments, assets, data, printables, records, and teacher tools.

### Grades 03–05

Grades 03–05 use the larger subject-hall architecture with subject areas, weekly plans, printables, assessments, teacher tools, and records.

## Mentor-Eligible Resource Registry

`mentor-manifest.json` is the Elementary public resource registry. It includes the Elementary home, all five grade portals, and verified learning games/simulations across literacy, mathematics, science, engineering, civics, arts, social-emotional learning, and inquiry.

The manifest helps NAIB, Khaemenes Academy, and Archaemenes discover useful tools. It does not decide mentor identity and does not award mastery.

## Family and Continuity Files

The hardening architecture includes:

- `assets/khaemenes-elementary-continuity.js`
- `assets/khaemenes-elementary-family-adapter.js`

The continuity bridge reads the active Academy learner and prefers the NAIB delegation contract, with compatibility support for the historical mentor-assignment method while downstream integrations transition. The family adapter strips obsolete local mentor authority from compatibility records rather than carrying old mentor identities forward.

Legacy local Elementary profile records may still exist during migration. Non-sensitive learner preferences and local progress can be preserved, but the Academy Family Registry is the authoritative identity source moving forward.

## Grade Records and Certification

Formal grade records are learner-scoped. Student-facing landing pages do not directly award weekly mastery, midterm/final scores, portfolio approval, or certificates.

Teacher / Family Tools provide the adult verification surface. Current certification standard for Grades 01–05 is:

- active learner in the correct grade;
- 36/36 weekly mastery results at 80% or above;
- midterm at 80% or above;
- final at 80% or above;
- required portfolio/capstone evidence approved.

Grade 05 completion does not automatically promote the learner into Grade 06.

## Privacy

Browser storage is local device data, not a secure vault.

Public Elementary client code must not contain or retain:

- passwords or access tokens;
- private keys;
- government identifiers;
- financial records;
- medical records;
- privileged account material;
- unrestricted private child-chat history.

Collect and retain only the learner context needed for the current educational task.

## Middle School Bridge

Grades 06–08 belong in the separate repository:

`Khaemenes_Middle.github.io`

Elementary bridges to the Middle School home after Grade 05 completion without creating a new learner identity or silently rewriting stage/grade placement.

## Dependency Policy

Core Elementary navigation remains lightweight and portable:

- no required CDN frameworks;
- no external font dependency;
- no secrets in public client files;
- repository-relative or known Academy sibling links where practical;
- progressive enhancement rather than fragile external dependencies.

## Current Unification Rule

**NAIB delegates. Khaemenes Academy provides Archaemenes. Archaemenes mentors. The grade curriculum measures mastery. The resource registry recommends tools. The Academy Family Registry owns learner identity.**
