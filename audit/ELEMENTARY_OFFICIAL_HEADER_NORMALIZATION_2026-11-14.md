# Elementary Official Header & Hamburger Menu Normalization
**Date:** 2026-11-14  
**Repository:** `vervenveda/Khaemenes_Elementary.github.io`

## Canonical authority
All Elementary landing pages now use the same shared header engine and menu contract as the Elementary home landing page.

Canonical engine:
- `https://vervenveda.com/assets/vnv-header-autopopulate.js`
- Header engine version verified: **v2.1.0**
- Shared header title: **Khaemenes Elementary Academy**
- Shared subtitle: **Grades 01–05**
- Shared badge/icon: **K**
- Shared hamburger: canonical enriched Verve N Veda branched ecosystem menu

Shared header shortcuts:
1. Academy Home
2. Student Profile
3. Family
4. Teacher
5. Middle School

Nested pages use absolute shortcut URLs so the same menu destinations resolve correctly from every folder depth.

## Landing-page scope
Exactly **49** real landing surfaces were normalized:

- Elementary home: 1
- Student Profile: 1
- Games Hall: 1
- Portfolio Builder: 1
- Grade 01–05 home portals: 5
- Grade 01–05 Teacher Tools landings: 5
- Grade subject-hall landings: 35

Total: **49**

Interactive game/app screens and the 36 Grade 1 unit lesson indexes were intentionally excluded from this landing-page replacement because their local top bars contain application or lesson controls. They are not portal/hall landing pages.

## Replacement model
Old landing-page headers are marked `data-vnv-header-legacy`.

This is deliberate:
- the auto-populating ticker can still discover useful page-specific navigation links from the legacy markup;
- the official header engine then removes the marked legacy chrome at runtime;
- only one official Elementary header is presented to the learner.

The official mount contract uses `replaceLegacy:true` and removes:
- explicit `data-vnv-header-legacy` headers;
- old `site-header` chrome;
- old `data-khae-header` chrome;
- remaining direct body-level legacy headers.

## Portfolio preservation
The Portfolio Builder had operational controls embedded in a second legacy header:
- **Scan Local Apps**
- **Print Report**

Those controls were preserved and moved into a non-header secondary page-control strip:
`[data-vnv-page-controls]`

The Portfolio now has:
- the same official Elementary header/hamburger as every other landing;
- its original Scan and Print controls;
- a fallback auto-ticker population set because removing the old global header left the page with no ordinary anchor links.

## Final verification
Final official-header audit:
- Real landings: **49**
- Compliant: **49**
- Noncompliant: **0**
- Unmarked legacy headers: **0**
- Unbalanced header-tag pages: **0**
- Portfolio controls preserved: **true**

Final auto-ticker audit:
- Total HTML: **2,390**
- Real content pages: **1,833**
- Ticker-compliant: **1,833**
- Missing/incomplete: **0**
- Duplicate: **0**
- Approved fallback pages: **21**
- Unrenderable: **0**

## Acceptance runs
- One-Time Elementary Official Header Normalization: run **43638750881** — PASS
- Elementary Student Profile Browser Regression: run **43638939466** — PASS
- Final Elementary Official Header Landing Audit: run **43639005602** — PASS
- Final Elementary Auto Ticker Coverage Audit: run **43639005600** — PASS
- Final Elementary Learning Engine Regression: run **43639005576** — PASS
- Pages build and deployment: run **43639005759** — PASS

Runtime normalization commit:
`f236b2c990d259ba988d910c56e3d1710fbfc3e8`

Portfolio structural repair:
`5fc8ef35e1d389be9aadcc0d685b7108cdda5906`

Portfolio ticker renderability repair:
`6ad9b119ad68d7e0b2d091f597876156715f572d`

## Permanent protection
The read-only workflow:
`.github/workflows/elementary-official-header-audit.yml`

now verifies both:
- exact official header contract on all 49 landing pages;
- repository-wide auto-ticker renderability.

The Student Profile browser regression is also tied to the official-header audit source so shared-header contract changes receive browser-level acceptance.

The one-time write-capable normalization workflow is retired after this record is sealed.
