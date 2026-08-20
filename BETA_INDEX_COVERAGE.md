# Beta Index Coverage

Khaemenes Elementary uses a hardened, centralized Beta Program rollout for visible interactive index surfaces.

## Current source-level coverage

- Visible index surfaces already covered: **154**
- Explicitly skipped at the last recorded coverage pass: **0**
- Canonical Beta destination: `https://vervenveda.com/beta/`
- Canonical widget: `https://vervenveda.com/assets/vnv-beta-link.js`

## Coverage rule

The canonical injector scans public HTML surfaces named:

- `index.html`
- `inndex.html`
- `*_index.html`
- `*-index.html`

This includes subject portals, homework/lesson indexes, teacher tools, grade portals, and other visible interactive index surfaces. Archived, backup, deprecated, private, vendor, and repository-control directories are excluded.

## Security and privacy boundary

The Beta doorway may carry only public routing metadata needed to identify the surface being tested. It must not collect or transmit learner IDs, Student/Scholar IDs, family IDs, grades, answers, form values, query strings, URL fragments, localStorage contents, credentials, passcodes, verification codes, or other protected account data.

Pages that explicitly prohibit script execution through Content Security Policy receive a plain semantic Beta Program fallback link rather than weakening the page CSP.

## Automation hardening

`scripts/inject-beta-links.mjs` is the single canonical writer. It is deterministic and idempotent, removes duplicate legacy Beta injections, uses the absolute canonical widget URL, rebuilds safe source metadata, and supports `--check` verification mode.

`.github/workflows/beta-link-coverage.yml` is the only automatic writer. The older Beta workflows are retained only as read-only/manual verification surfaces so multiple GitHub Actions jobs cannot race to rewrite the same HTML files.

Pull requests can run read-only Beta coverage verification. A coverage failure means a visible index page is missing the canonical doorway, has no closing `</body>`, or otherwise cannot be safely normalized.

## Runtime validation boundary

This document records repository/source coverage. It does not claim browser, mobile, CSP, iframe, or navigation runtime validation until those surfaces are actually tested in a browser.
