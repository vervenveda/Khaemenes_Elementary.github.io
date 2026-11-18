# Grade 01 — Opt-In Title/Chrome Flash Diagnostic

**Status:** Committed to Elementary `main` on 2026-11-17. Read-only and disabled unless URL contains `?chrome_audit=1` or `?title_audit=1`.

**User reference:** The Khaemenes High Grade 09 Chrome Forensic Probe described in the user-supplied *DIAGNOSTISC OPT IN* PDF. Adapted to monitor heading-size transitions on the First Grade landing page; the original Grade 09 runtime probe was not changed.

## Activate

Open `https://vervenveda.com/Khaemenes_Elementary.github.io/grades/grade-01/?chrome_audit=1` and refresh. A charcoal diagnostic panel will appear in the lower-left with a **Copy Report** button. For console access:
```js
KhaemenesGrade01ChromeAudit.snapshot()
KhaemenesGrade01ChromeAudit.events()
KhaemenesGrade01ChromeAudit.report()
```
Without an opt-in parameter, the script returns immediately, with no panel, observers or learner-data access.

## What is actually measured

- First six seconds: computed font sizes, font families, line heights, physical heading dimensions and the `data-khaemenes-primary-title` marker.
- Title targets: Grade 1 hero `h1`, Start Here `h2`, Progress `h2`, 36-week path `h2`, Family Learning Report `h2`.
- Canonical 333 ticker, Auto ticker, VNV header and both tool docks: ID instance counts, visibility, rectangular dimensions and parent element.
- Loaded and pending stylesheets; DOM/title mutations, document load/page show; browser JavaScript errors and unhandled Promise rejections.
- In-page report and optional user-initiated copy action; no network reporting.

## Source-level hypothesis, not yet confirmed by browser timings

The First Grade page uses independent heading styles from `grades/grade-01/assets/styles.css` (`h1: clamp(2.1rem,6vw,4rem)`), while `assets/elementary-global-standard-v1.js` injects a general 33px heading rule and then selects one primary `h1` for 66px. The latter is loaded as a deferred script, so visible title-size changes during refresh are plausible. An additional inline Family Learning Report `h2` font declaration and external header CSS add further typography sources. The report will tell us if and when those transitions occur.

## Cutover and safeguards

- New: `grades/grade-01/assets/grade01-chrome-title-forensic-v1.js`
- Wired early in `grades/grade-01/index.html`, before first page stylesheet.
- Rollback: `rollback/pre-grade01-title-diagnostic-20261117`
- **12/12 static checks pass**, including JS syntax, early mounting, opt-in guard, tracking, and no localStorage/fetch/beacon.
- Browser timing output has **not yet been provided or verified**. Do not claim that the exact cause or number of flashes is conclusively established until the user provides the report.
- No modifications to curriculum, quiz/mastery, family registry, private exports, STOS T03, or Account Cloud.

## Next action

Use **Copy Report** from the panel and provide the text. Locate the observed font transitions and their timings, then consolidate/precede typography styles only after isolating the competing selectors. Preserve the canonical template hierarchy: eyebrow category; one largest primary title; all other headings in their established hierarchy; minimum 16px body/control text. Stop any repeated layout repaint rather than masking visible flashes with animation.

## 2026-11-17 live diagnostic feedback and first-paint correction

User-provided report on a 2086 × 1083 viewport:

| Transition | Primary title | Other three main headings |
| --- | --- | --- |
| 342ms | 30px | 22.5px |
| 8,176ms | 76px | 43.7px |
| 23,344ms / DOMContentLoaded | 66px | 33px |

At 23,353ms the report found 0 instances of both ticker IDs and the left class-tools dock, one visible 2064×67 VNV header and one 240×108 right dock. This report alone does **not** prove a permanent ticker/left-tools absence: the snapshot was taken roughly **10ms after a delayed DOMContentLoaded** and the original probe stopped frequent sampling after six seconds. All seven linked CSS stylesheets and four runtime style elements were reported ready at that time.

### Source repair applied

- `grades/grade-01/index.html`: inserted a *scoped critical first-paint heading style* before any page stylesheet. Sets the main Grade 01 title to 66px and other targeted section headings to 33px with appropriate specificity. This aims to prevent the 30→76→66px / 22.5→43.7→33px three-stage render. The title is explicitly premarked `data-khaemenes-primary-title="true"` in HTML so the deferred global script does not need to promote it after first paint. Existing shared typography and grade engine retained.
- `grades/grade-01/assets/grade01-chrome-title-forensic-v1.js`: extended observation up to five seconds beyond page load (maximum 45 seconds) to determine whether ticker and left-tools mounts are merely late.
- Code commits: `70693e930bcc679ad205ac146188ea7308a83c93` and `44697c30d01a86667a3b980e71ffecda3098f89c`.
- Prior release preserved at `rollback/pre-grade01-typography-stabilization-20261117`.
- **10/10 source contract checks plus syntax validation PASS**. Not a browser-based visual acceptance test.

### Next verification

Reopen the First Grade page with `?chrome_audit=1` and refresh. Wait until at least five seconds after the page's load event, then click **Copy Report**. Confirm that each title reports one stable size throughout the captured render. Verify whether the canonical 333 and AutoPopulate tickers and left class-tools dock eventually appear; investigate their load URLs or mount operations only if still missing once the page is settled. No learner or STOS data was read or changed during this repair.
