# Grade 01 Local Preservation Export — Review Gate

**Mode:** REVIEW BRANCH ONLY / NON-DESTRUCTIVE / NO PRODUCTION OR STOS AUTHORITY.  
**Date:** November 17, 2026.

## What was added

- `assets/grade01-preservation-bundle-v1.js`: pure Grade 01 local-preservation-bundle builder, learner ID-scoped, no I/O or academic authority.
- `grades/grade-01/assets/grade01-preservation-export-ui-v1.js`: additive, user-click-only JSON download from already existing locally selected Grade 01 student records. It has no restore path, server endpoint, import routine, or automatic write.
- `grades/grade-01/index.html`: adds the two deferred scripts to the existing **Family Learning Report** section on the review branch. No source lesson engine replaced.
- `tests/grade01-preservation-bundle.test.cjs`: 11 synthetic checks, executed in an isolated JavaScript harness: **11/11 PASS**.

## Corrected source understanding

The actively published Grade 01 landing page uses `grades/grade-01/assets/grade1-mastery.js`, which already maintains a learner-scoped key when locally linked to the Academy Family Registry. The separate `grades/grade-01/assets/app.js` remains a legacy browser-wide export surface; it is not the script powering that landing page. This change is **additive** to the active Grade 01 lesson engine and does not rewrite the older surface.

## User-click-only export contract

- Requires a locally linked learner, a matching active family and Grade 01 placement, and an existing course record under `khaemenes.course:<learnerId>:elementary-grade-01`.
- Copies available learner-scoped course state, formal assessment attempt history and that learner's formative ledger entries into an **unverified private JSON file**.
- Rejects records that have a foreign learner ID, wrong grade or preview ownership. Does not attribute the browser-wide legacy record to the selected learner.
- Flags the existence of legacy work/favorites as separate sources for future review but **never reads their payload into this bundle or automatically copies them**.
- Does not turn locally selected identity into protected server authentication. Download remains `admission:HOLD`, `restoreAllowed:false`, course mastery authority unchanged and completeness unverified.
- Does not write or clear browser storage and does not call the network. The browser's local download behavior must still be verified manually.

## Known limitations and remaining hold

- The original `app.js` browser-wide dashboard surface still exists and needs a separate route-use audit before retiring or changing it.
- The Grade 01 legacy mastery module already contains an explicit `claimLegacy` option in an older source path. **This new tool does not invoke it.** Adult-supervised legacy identity attribution remains an independent, unresolved gate.
- Exported assessment and ledger arrays can be empty even when the actual source is absent, unreadable, or not fully recorded. Missing evidence must remain unknown, not a zero or a verified complete copy.
- Assessment attempts and formative entries are preserved as historical evidence, not new grade authority.
- No live browser/device, PDF/print, tablet, encrypted private receipt, full lesson coverage, or production family-authorization acceptance tests completed.
- The branch must remain unmerged pending review of local browser data custody, source origin, Grade 01 recovery controls, and real download behavior.

## Acceptance before publication

1. Review the Grade 01 legacy/source overlap to avoid accidentally changing active learning gates.
2. Test the button on a synthetic, separate browser origin and confirm no writes to localStorage.
3. Confirm family/learner switch while export is open fails closed, and verify missing/corrupt data warnings.
4. Verify downloaded bytes and private receipt storage without committing student work to GitHub.
5. Confirm no duplicate buttons, minimum 16 px labels, centered presentation and no toolbar obstruction.

**STOS T03 is not commissioned; this tool does not connect to T03.**
