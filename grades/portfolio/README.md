# Elementary Portfolio Builder v3 — NAIB + Learning Adventures Library

This version extends Portfolio Builder with a scalable in-page **Learning Adventures Library**.

## Repositories inspected

The library was assembled from the current app/game directories in:
- `vervenveda/Khaemenes_Elementary.github.io/games`
- `vervenveda/Khaemenes_KinderGarden.github.io/apps`
- `vervenveda/Khaemenes_Preschool.github.io/apps`
- `vervenveda/bazaarart.github.io/apps`

The library intentionally prioritizes Elementary apps, then selected Kinder Garden / Preschool resources that remain useful as review, accessibility, enrichment, or foundational support.

## Popup launcher

Apps open inside a large responsive modal containing:
- app title and metadata
- close `✕` in the upper-right
- Print
- Favorite
- Open in New Tab
- scalable iframe workspace
- Escape-key close
- click-outside close

### Cross-origin limitation
Remote repositories can be embedded only if the destination site allows framing. If a remote page blocks iframe embedding, the built-in **Open in New Tab** control remains available.

In-frame printing may also be blocked by browser cross-origin rules. In that case the user should open the app in a new tab and print there.

## Student profile
The app library is tied to the current Portfolio Builder student profile:
- student name
- grade
- school year
- favorites
- portfolio evidence count

Favorites are stored in the same Portfolio Builder state.

## Parent profile
A simple local parent/guardian profile stores:
- display name
- parent notes

No remote account is required.

## Filters
- search
- repository
- subject
- student favorites

## Included app families
- Elementary math, science, language arts, civics, wellbeing, engineering, art
- selected Kinder Garden literacy, math, PE, breathing/self-regulation
- selected Preschool bilingual, time, art/color resources
- selected Bazaar Art elementary-friendly art, kindness, affirmation, and music resources

## Existing v2 features preserved
- Evidence Inbox
- parent/teacher human approval
- NAIB mentor review
- IndexedDB Sovereign Grade Vault
- cross-app JSON imports
- curated portfolio
- printable year report
- certification review

## Validation
Generated JavaScript is checked with Node `--check`.

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
