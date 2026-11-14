# Elementary Global Header, Menu & Lower-Right Toolbar Normalization
**Date:** 2026-11-14  
**Repository:** `vervenveda/Khaemenes_Elementary.github.io`

## Canonical Elementary chrome
The Elementary home page remains the visual and navigation authority.

### Official header / menu
Every real Elementary page now loads:
- `https://vervenveda.com/assets/vnv-header-autopopulate.js`
- shared contract: `data-vnv-elementary-header-contract="v2"`

The shared header presents:
- **Khaemenes Elementary Academy**
- **Grades 01–05**
- **K** badge
- Academy Home
- Student Profile
- Family
- Teacher
- Middle School
- canonical hamburger button that opens the branched Verve N Veda ecosystem menu

The current Elementary home does not have a separate standalone Ecosystem header button. The hamburger is the ecosystem-menu trigger.

### Canonical lower-right utility dock
Every real page now has exactly one direct loader for:
`https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`

The canonical dock is the six-control 3-column × 2-row lower-right toolbar:
1. Profile
2. Search
3. Updates
4. Mentor
5. Support
6. Beta

The former `khaemenes-landing-toolbar.js` compatibility loader was removed from normalized pages so there is one toolbar authority.

## Assessment protection
There are **195 protected assessment/exam/closed-book pages**.

They carry the same canonical toolbar loader for structural consistency, but the shared toolbar's own canonical runtime rule refuses to mount the Search/Mentor utility dock on protected assessment routes. This preserves the Academy's closed-book boundary.

The official header and hamburger menu still mount on those pages.

## Page-control preservation
The audit found **49 pages** where a legacy header contained real interactive controls.

Those controls were not deleted. They were converted from competing `<header>` elements into secondary page-control sections marked:
`data-vnv-page-controls`

Examples include:
- game/app Voice, Print and Reset controls;
- Grade 1 Science course navigation and Print controls.

Thus each page gets one official global header while page-specific operational controls remain available below it.

## Lower-right exclusivity
Repository-wide audit result:
- pages with competing fixed lower-right controls: **0**
- interactive controls left inside legacy headers: **0**

The lower-right corner is therefore reserved for the canonical six-button ecosystem dock on eligible non-assessment pages.

## Final regression
Global chrome guard:
- renderable/non-redirect pages checked: **1,689**
- official header compliant: **1,689**
- header noncompliant: **0**
- canonical toolbar loader compliant: **1,689**
- toolbar loader noncompliant: **0**
- protected assessment pages: **195**
- competing lower-right pages: **0**
- interactive controls left in legacy headers: **0**

Repository-wide ticker audit remains:
- total HTML: **2,390**
- ticker content surfaces: **1,833**
- missing/incomplete ticker: **0**
- duplicate ticker: **0**
- unrenderable ticker: **0**

The count difference comes from immediate redirect shims: the global chrome guard excludes every page that immediately redirects because it never presents visible UI.

## Existing student export features — recorded for next pass
Two student/record export surfaces were found:

1. `grades/grade-01/subjects/math/math-01_index.html`
   - button: **Export Progress**
   - JSON download: `mathPortal_progress.json`

2. `grades/grade-02/record-recovery.html`
   - button: **Export Grade 2 Backup**

These were intentionally **not relocated or expanded in this pass**. The requested next design decision is to standardize student export on the lower-left side without competing with the lower-right ecosystem dock.

## Acceptance evidence
- One-Time Elementary Global Chrome Normalization — run **43641728288** — PASS
- Elementary Global Chrome Regression — run **43641832812** — PASS
- Elementary Official Header Landing Audit — run **43641832936** — PASS
- Elementary Student Profile Browser Regression — run **43641832842** — PASS
- Pages build and deployment — run **43641832382** — PASS

Runtime normalization commit:
`40ca5f5b2950c1aadb15b13890da7e4a8b1da0f6`

Guard alignment commit:
`6c81eb82b4f88ea3394f6ea880dfb62d8285d35a`
