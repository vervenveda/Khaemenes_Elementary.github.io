# Khaemenes Academy Landing Page Integration Roadmap

Status vocabulary:
- **Integrated** — canonical Academy learner identity is authoritative and page-specific state is learner-scoped where applicable.
- **Compatibility** — legacy local data is preserved and may be mirrored into learner-scoped storage.
- **Pending** — page exists but has not yet been wired to the canonical learner-context contract.
- **Preview-safe** — a learner may view a different grade/school surface without that page changing formal placement.

## Elementary root
- `index.html` — **Integrated / Compatibility / Preview-safe**
- Canonical source: Academy Family Registry
- Local Elementary preferences are learner-scoped.
- Legacy `khaemenes_elementary_profiles_v1` remains preserved as compatibility data.

## Grade 01
- `grades/grade-01/index.html` — **Integrated / Compatibility**
- `grades/grade-01/assets/khaemenes-grade1-continuity.js` — active
- Legacy Grade 01 state and favorites are mirrored to learner-scoped storage.
- Remaining nested lesson/assessment/record surfaces: **Pending page-level audit**

## Grade 02
- `grades/grade-02/index.html` — **Integrated / Compatibility / Preview-safe**
- `grades/grade-02/assets/khaemenes-grade2-continuity.js` — active
- `grades/grade-02/assets/app.js` — learner-scoped record support active
- Legacy `khaemenes_grade2_subject_36_aplus_v1` is preserved and migrated non-destructively.
- Shared subject context: `grades/grade-02/assets/khaemenes-grade2-subject-context.js`

### Grade 02 subject landing pages
- Language Arts — **Pending page wiring**
- Mathematics — **Pending page wiring**
- Science — **Pending page wiring**
- Social Studies — **Pending page wiring**
- Arts & Music — **Pending page wiring**
- Health, PE & SEL — **Pending page wiring**
- Technology & Tools — **Pending page wiring**
- Integrated Projects — **Pending page wiring**

### Grade 02 other landing surfaces
- Teacher Tools — **Pending page audit**
- Weekly Assessments — **Pending page audit**
- Certificate / Records — **Pending page audit**

## Grade 03
- Root grade landing — **Pending**
- Subject halls — **Pending**
- Assessments / records / teacher tools — **Pending**

## Grade 04
- Root grade landing — **Pending**
- Subject halls — **Pending**
- Assessments / records / teacher tools — **Pending**

## Grade 05
- Root grade landing — **Pending**
- Subject halls — **Pending**
- Assessments / records / teacher tools — **Pending**

## System rule
Every landing surface should eventually verify:
1. active Academy learner identity,
2. exact grade and stage context,
3. learner-scoped local records where applicable,
4. non-destructive legacy migration,
5. preview-safe mismatch handling,
6. no authority to silently change placement, identity, grade, or mastery,
7. correct family / teacher / Academy return paths,
8. correct mentor and specialist boundaries,
9. asset and link integrity,
10. accessible keyboard/mobile behavior after browser validation.

This roadmap is a source-level integration tracker. It does not claim browser, mobile, keyboard, or runtime validation until those checks are actually performed.
