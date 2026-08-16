# Khaemenes Elementary · Archaemenes Mentor Logic

This file preserves the current mentor authority for the Elementary division so future UI, avatar, curriculum, and profile work does not fragment the architecture.

## Canonical Formula

```text
Academy Family Registry
        ↓
active elementary learner
        ↓
NAIB mentor-routing boundary
        ↓
Archaemenes
        ↓
Young Scholar presentation
        ↓
current grade/course context
        ↓
mentor-eligible learning resources
        ↓
bounded learner experience
```

## One Mentor

Archaemenes is the current Academy mentor for Elementary learners.

Grades 01–05 do not create separate mentor identities. Developmental wording, pacing, visual treatment, or grade-specific teaching style may adapt while preserving the same Archaemenes identity.

The default Elementary presentation is `young-scholar`.

## Authority Separation

The following responsibilities remain separate:

- **Academy Family Registry** — learner and family identity.
- **NAIB** — mentor routing and coordination.
- **Archaemenes** — educational mentoring and learner-facing guidance.
- **Grade curriculum** — lessons, mastery rules, assessments, records, and certificates.
- **Elementary mentor manifest/resources** — discoverable learning tools and grade destinations.
- **Parent/guardian/educator** — human oversight and final educational judgment.

Archaemenes may explain progress, recommend practice, give clues, encourage reflection, and help the learner navigate. He does not award mastery, modify grades, bypass assessments, replace guardian authority, or create hidden learner records.

## Legacy Mentor Fields

Older local profile fields such as free-form mentor names, embedded mentor personalities, or custom mentor identity fields are compatibility data only. They are not assignment authority and should not be propagated into new records.

When old records are migrated, learner progress and non-sensitive preferences may be preserved while obsolete mentor identity fields are retired.

## Future Mentor Adoption / Avatar Program

A future responsible Mentor Adoption program may allow a learner or family to design and adopt an AI avatar or mentor under Academy safety, privacy, guardian, identity, and continuity rules.

That program is not active in the current Elementary architecture. The current platform must not simulate it by allowing pages to invent alternate mentor identities locally.

Until the formal adoption program is introduced, Archaemenes remains the Elementary mentor.

## Resource Matching

Resource discovery is distinct from mentor assignment.

The Elementary `mentor-manifest.json` may expose grade portals and mentor-eligible games or simulations. NAIB may use those resources to help Archaemenes recommend suitable practice, but the resource registry never decides who the mentor is.

## Fallback Rule

If the public NAIB mentor router is temporarily unavailable, the Elementary client may present a local, non-privileged fallback representation of Archaemenes so the child-facing page remains coherent.

The fallback must:

- identify as Archaemenes;
- use the `young-scholar` presentation;
- not create a new mentor identity;
- not claim privileged routing occurred;
- not expose private topology or credentials;
- not bypass learner-stage checks.

## Privacy

Use the minimum learner information required for the immediate educational experience. Browser storage is local device data, not a secure vault.

Do not store credentials, private keys, government identifiers, financial data, medical records, privileged account material, or unrestricted child-chat history in Elementary public client code.

## Current Standard

**Archaemenes mentors. NAIB routes. The grade curriculum measures mastery. The resource registry recommends tools. Families and educators remain the human authority.**
