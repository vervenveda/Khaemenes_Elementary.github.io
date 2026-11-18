# Grade 01 — Collapsible 36-Week Path and Footer Order

**Date:** 2026-11-17

## Implemented on main

- In `grades/grade-01/index.html`, replaced the always-expanded 36-week lesson-card section with a native `<details>` element, **without an `open` attribute** (closed by default). A centered, keyboard-operable `<summary>` is titled “36-Week Learning Path” and includes a downward chevron and a short prompt.
- Kept `id="weeksGrid"` unchanged inside the details region. Existing Grade1Mastery rendering, weekly links, quiz gates, scores, learner-scoped records and local preservation export are unaffected.
- Moved the single actual footer below the Family Learning Report and all other page content, with the copyright year script placed immediately after it.
- Added details and footer presentation rules to `grades/grade-01/assets/grade01-layout-v2.css`, including focus visibility, responsive text/spacing, print rules, and reduced-motion handling.

## Verification and rollback

- Source-only structural assertions: **13/13 PASS**. Checked single closed details, existing week-grid ID inside disclosure, existing mastery script, single footer after Family Reporting, and responsive/focus styles.
- Commits: HTML `a914e1ff8bb1b752dd47e494d4c5a224dceca97c`; CSS `bb131234ce75aa380d145572f8c7b92683054cdf`.
- Pre-change rollback: `rollback/pre-grade01-week-fold-footer-20261117`.
- Live device visual testing not yet performed. Inspect that the card grid renders correctly on first expansion and the footer remains the last page section across screen sizes. No private student data read or modified; no STOS T03 activity.
