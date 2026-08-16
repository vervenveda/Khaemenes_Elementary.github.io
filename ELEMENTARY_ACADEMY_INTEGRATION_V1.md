# Khaemenes Elementary Academy Integration v1

Status: staged on the Elementary repository main branch.

## Purpose

Elementary must participate in the Academy-wide family and learner protocol without creating a second learner identity.

## Authority

Canonical learner identity and formal placement come from the Khaemenes Academy Family Registry.

Elementary may store learner-specific preferences, school progress summaries, favorites, and course-local evidence, but these records are subordinate to the Academy learner identity.

## Current contract

The Elementary root loads:

- Khaemenes Family Registry
- NAIB mentor/router layer
- Khaemenes Learner Context
- Khaemenes Family School Bridge
- Elementary Academy Adapter

The Elementary adapter:

1. reads the active Academy learner;
2. accepts Grades 01–05 as canonical Elementary placements;
3. highlights the registered grade without blocking preview of other grades;
4. stores Elementary preferences by learner ID;
5. preserves `khaemenes_elementary_profiles_v1` as legacy compatibility data;
6. can copy legacy preferences/progress into learner-scoped storage without deleting or promoting the old record;
7. does not change formal placement, learner identity, grades, or mastery.

## Learner-scoped storage

Elementary learner-specific state uses a deterministic Academy learner key where available:

`khaemenes.course:<learnerId>:elementary-hub:<kind>`

Legacy local storage remains readable for compatibility but is not identity authority.

## Preview rule

A learner whose formal placement is outside Grades 01–05 may still view Elementary for family or educator preview. The school bridge should recommend the registered path rather than force a redirect.

## Remaining Elementary rollout

The repository root is now Academy-aware. The next phase is to add the same learner-context contract to each Grade 01–05 portal so course progress, assessment evidence, and favorites can be keyed to the canonical learner ID without rewriting the courses themselves.

## Security and privacy

This is a public-browser integration layer. It does not create authenticated server accounts, expose protected infrastructure, or claim protected Noema/HTURT execution. Formal cross-device identity and protected administrative actions require authorized backend services.
