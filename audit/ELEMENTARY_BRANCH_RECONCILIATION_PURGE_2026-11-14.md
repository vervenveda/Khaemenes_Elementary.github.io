# Elementary Branch Reconciliation & Surgical Purge Record
**Date:** 2026-11-14  
**Repository:** `vervenveda/Khaemenes_Elementary.github.io`  
**Policy:** production work on `main`; exact-name purge only after content reconciliation and green tests.

## Acceptance evidence before purge
- Canonical curriculum authority and 557 historical compatibility redirects already hardened.
- Elementary Learning Engine Regression: PASS on run 43620770188.
- Elementary Student Profile Browser Regression: PASS on run 43620799184.
- Reconciled family/forensic guardrails are permanent steps in the main regression workflow.
- Shared profile now revalidates active learner ID, family ownership and membership, verifies local write readback, rejects wrong-learner continuation rows, and preserves read-only Grade 1–5 Family Learning Reports.

## Branches approved for exact-name deletion
- `backup-elementary-before-landing-header-footer-20261027` — source head `dafb15a891ce07a61ad75f1bcc867c52f1b5c14f` — ancestor
- `backup-elementary-before-next-five-landings-20261027` — source head `be9f76b175726bed8d71b6d38ba4dcfda37293f1` — ancestor
- `backup-elementary-before-toolbar-overlap-fix-20261027` — source head `cfe907deb473b535fb299ddb806091e62b913a31` — ancestor
- `backup-elementary-before-uniform-beta-toolbar-20261027` — source head `c349af9d916cd7163d9f3721e889a27d9e86a1f5` — ancestor
- `backup-elementary-grade4-5-remaining-entrances-20261027` — source head `d41670fdf83dc3bf97e0691ee42cdba5588d15eb` — ancestor
- `backup-elementary-next-ten-entrances-20261027` — source head `84cdd832b9d045ef2433f7e4c50146ffd4327a36` — ancestor
- `backup-elementary-seven-game-toolbar-regression-20261027` — source head `5606eeb1bb4c920947d0ac07d24228647aacf793` — ancestor
- `backup-elementary-teacher-tools-grade2-5-20261027` — source head `6430a4169a4ffeb3b59b9dec8324624baa86a7eb` — ancestor
- `backup-elementary-ten-grade-subject-landings-20261027` — source head `4f2c84d0890e0f2c1398d394b93792a5fa246d4a` — ancestor
- `backup-elementary-ten-next-subject-headers-20261027` — source head `7f90a4415f955327de2a167f79f0b07810df199f` — ancestor
- `hardening/archaemenes-elementary-v2` — source head `f0c724ca83f6f6353dbb2f8638955e2180e3bd3b` — ancestor
- `hardening/archaemenes-elementary-v3` — source head `f0c724ca83f6f6353dbb2f8638955e2180e3bd3b` — ancestor
- `hardening/archaemenes-elementary-v4` — source head `f0c724ca83f6f6353dbb2f8638955e2180e3bd3b` — ancestor
- `fix/elementary-yearbook-photo-modal-2026-11-09` — source head `86af808d3c3c09e435884eaf35a5263f78a6ddc1` — superseded
- `hardening/student-profile-sibling-selection-2026-11-09` — source head `7eb3d0caab9751a31edbb08e8bd1c9163890b5fc` — absorbed
- `upgrade/profile-creative-rail-2026-11-09` — source head `f02012e8f58d6a07c37604d9ba07eb090f6d286b` — superseded
- `upgrade/profile-photo-editor-parity-2026-11-09` — source head `3497e71781a311ffaa05c65a13b01a08bc800d45` — absorbed
- `audit/elementary-family-report-2026-11-09` — source head `4e9e8fa78849c0f280cc996337d1ad0e05148ae4` — absorbed
- `integration/elementary-family-retention-reconcile-2026-11-10` — source head `beb07101a30b59fe4cf90a5c7e26a38f41bb471e` — absorbed

### Why these are safe
- The ten October backup refs and `hardening/archaemenes-elementary-v2/v3/v4` have zero unique commits relative to current main.
- Yearbook-modal and creative-rail branches are superseded by newer shared profile/Yearbook tooling already exercised by the green browser suite.
- Sibling-selection and photo-editor-parity security improvements were selectively reconciled into current main and regression-protected.
- The family-report audit branch was three-way reconciled: 59 zero-conflict blobs were transplanted, newer main conflict files were preserved, learner-scoped family panels were restored, and inherited guardrail tests were made permanent.
- The integration retention branch's substantive runtime/test content is present on main; its remaining branch-management workflow/scripts are obsolete local merge scaffolding tied to the old November 10 main SHA.

## Deliberately preserved branch
- `hardening/archaemenes-elementary` — source head `6a0d126274579fa073e5c9b14564aac2ee411c47`.

It remains because it contains 84 unique historical commits and old root/continuity implementations. Its mentor authority concepts are superseded by current `mentor-contract.json` v3 and `mentor-manifest.json` v4, but its unique historical runtime has not been exhaustively file-by-file retired. Surgical cleanup therefore preserves it rather than guessing.

## Safety contract for cleanup workflow
The one-time workflow:
1. fetches every branch;
2. requires every target branch to still match the exact SHA recorded above;
3. proves ancestor-class refs are ancestors of main;
4. checks current main contains the reconciled profile/family/guardrail markers;
5. reruns the synthetic curriculum, identity, retention and reconciled family/forensic test suites;
6. deletes only the exact approved names;
7. never targets `main` or `hardening/archaemenes-elementary`.

No real learner data is read or modified by this cleanup.


## Executed result
- One-time cleanup run: `43620926448` — **PASS**.
- All exact source-head checks passed before deletion.
- Full synthetic curriculum, learner isolation, formal boundary, retention, family and forensic suites passed inside the cleanup job.
- **19 approved branch refs were deleted successfully.**
- Remote branch re-list immediately after cleanup contained only:
  - `main`
  - `hardening/archaemenes-elementary`
- The one-time workflow `.github/workflows/elementary-branch-retirement-20261114.yml` was then removed from `main`, so no branch-deletion workflow remains armed.

The preserved historical branch remains intentionally outside the purge because its 84 unique commits have not been exhaustively mapped file-by-file to current equivalents. Its mentor-authority concepts are superseded by current contract/manifest metadata, but historical runtime preservation is the safer forensic choice until that final archive audit is completed.
