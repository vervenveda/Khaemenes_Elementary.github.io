# Elementary Mentor Manifest Repair 01

Date: 2026-08-09

## Result

PASS — replacement `mentor-manifest.json` generated.

## Changes

- Manifest version: 1 → 2
- Resource count: 9 → 18
- Added first-class Grade 01–05 curriculum destinations.
- Replaced stale flat `apps/*.html` routes with current `games/<resource>/` routes.
- Added verified STEM, civics, engineering, art, inquiry, literacy, mathematics, science, and SEL resources.
- Preserved source ID: `khaemenes.elementary`
- Preserved repository authority: `vervenveda/Khaemenes_Elementary.github.io`

## Generated resource inventory

- 1 Elementary home
- 5 grade curriculum portals
- 12 verified learning games / simulations
- Total: 18

## Local artifact checks

- JSON parse: PASS
- Unique resource IDs: PASS
- Unique resource URLs: PASS
- Expected repository base on every resource: PASS
- Stale `/apps/` routes remaining: 0

## Repository targets verified during audit

Grade portals:
- `grades/grade-01/`
- `grades/grade-02/`
- `grades/grade-03/`
- `grades/grade-04/`
- `grades/grade-05/`

Games / simulations:
- `games/elementary_geometry/`
- `games/kindness_quest/`
- `games/elementary_vocabulary_garden/`
- `games/elementary_weather_portal/`
- `games/emotional_garden/`
- `games/learn_a_new_word/`
- `games/force-motion-ramp-lab-k-5/`
- `games/fraction-picnic-k-5/`
- `games/jr-city-council/`
- `games/junior-engineer-studio/`
- `games/bazaarart-jr-studio/`
- `games/curiosity-machine/`

## Legacy entries intentionally not carried forward

- Little Kitchen Helper
- Lunar Phase Explorer

No current Elementary successor path was verified for these two during this repair. They can be reintroduced later if their canonical current location is identified.

## Upload

Replace the repository-root:

`mentor-manifest.json`

with the generated file in this package.

No other Elementary files need to be replaced for Repair 01.
