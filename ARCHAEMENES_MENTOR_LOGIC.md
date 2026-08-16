# Khaemenes Elementary · Archaemenes Mentor Logic

This file preserves the current mentor authority for the Elementary division so future UI, avatar, curriculum, and profile work does not fragment the architecture.

## Canonical Formula

```text
Academy Family Registry
        ↓
active Elementary learner
        ↓
NAIB intake / delegation
        ↓
Khaemenes Academy
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

## One Academy Mentor

Archaemenes is the current Khaemenes Academy mentor for Elementary learners.

Grades 01–05 do not create separate mentor identities. Developmental wording, pacing, visual treatment, or grade-specific teaching style may adapt while preserving the same Archaemenes identity.

The default Elementary presentation is `young-scholar`.

## Authority Separation

The following responsibilities remain separate:

- **Academy Family Registry** — learner and family identity.
- **NAIB** — front-desk intake, administration, resource direction, and delegation.
- **Khaemenes Academy** — institutional educational relationship and Academy specialist context.
- **Archaemenes** — educational mentoring and learner-facing guidance inside Khaemenes Academy.
- **Grade curriculum** — lessons, mastery rules, assessments, records, and certificates.
- **Elementary mentor manifest/resources** — discoverable learning tools and grade destinations.
- **Parent/guardian/educator** — human oversight and final educational judgment.

Archaemenes may explain progress, recommend practice, give clues, encourage reflection, and help the learner navigate. He does not award mastery, modify grades, bypass assessments, replace guardian authority, or create hidden learner records.

## NAIB Delegation Rule

NAIB determines **where the visitor should go**, not who every platform must use as its specialist.

For an Elementary learner entering Khaemenes Academy, NAIB delegates to the Elementary campus and returns Archaemenes as the Academy specialist. Other destinations may expose their own specialist AIs, games, knowledge systems, communications tools, civic resources, emergency resources, or non-AI services.

Current school clients may still call `assignMentor()` / `requestMentor()` as compatibility methods. NAIB v2 keeps those methods while clients migrate toward `delegate()` / `requestDelegation()`. The compatibility seam must resolve through the same delegation policy and must not make NAIB the mentor.

## Specialist Platform Boundary

A Khaemenes learner may also enter specialized Verve N Veda platforms. Those platforms may present their own specialist AIs inside their domains. NAIB may delegate the learner there without permanently replacing Archaemenes as the Khaemenes Academy mentor.

## Legacy Mentor Fields

Older local profile fields such as free-form mentor names, embedded mentor personalities, or custom mentor identity fields are compatibility data only. They are not specialist authority and should not be propagated into new records.

When old records are migrated, learner progress and non-sensitive preferences may be preserved while obsolete mentor identity fields are retired.

## Future Mentor Adoption / Avatar Program

A future responsible Mentor Adoption program may allow a learner or family to design and adopt an AI avatar or mentor under Academy safety, privacy, guardian, identity, and continuity rules.

That program is not active in the current Elementary architecture. The current platform must not simulate it by allowing pages to invent alternate mentor identities locally.

Until the formal adoption program is introduced, Archaemenes remains the Khaemenes Academy mentor.

## Resource Matching

Resource discovery is distinct from NAIB delegation and distinct from the Academy specialist relationship.

The Elementary `mentor-manifest.json` may expose grade portals and mentor-eligible games or simulations. NAIB may direct the learner to a resource or return the Elementary campus as the destination; Archaemenes may then recommend suitable practice within the Academy context. The resource registry never becomes identity or grading authority.

## Fallback Rule

If the public NAIB delegation router is temporarily unavailable, the Elementary client may present a local, non-privileged fallback representation of Archaemenes so the child-facing page remains coherent.

The fallback must:

- identify as Archaemenes;
- identify him as the Khaemenes Academy mentor;
- use the `young-scholar` presentation;
- not claim that a fresh NAIB delegation occurred;
- not expose private topology or credentials;
- not bypass learner-stage or grade checks.

## Privacy

Use the minimum learner information required for the immediate educational experience. Browser storage is local device data, not a secure vault.

Do not store credentials, private keys, government identifiers, financial data, medical records, privileged account material, or unrestricted child-chat history in Elementary public client code.

## Current Standard

**NAIB delegates. Khaemenes Academy provides Archaemenes. Archaemenes mentors. The grade curriculum measures mastery. Resource systems recommend tools. Families and educators remain the human authority.**
