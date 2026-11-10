# Elementary Branch Reconciliation and Safe-Purge Inventory
**Date:** 2026-11-10
**Repository:** `vervenveda/Khaemenes_Elementary.github.io`
**Integration candidate:** `integration/elementary-family-retention-reconcile-2026-11-10`
**Status:** reconciled contents staged, but **not merged to main**; branch refs **not deleted**.

## Source branch and main comparison
At inventory:
- `main` HEAD: `a314176710fcd0b2dc249a35054753c191d221e1`
- `audit/elementary-family-report-2026-11-09` HEAD: `4e9e8fa78849c0f280cc996337d1ad0e05148ae4`
- Audit branch: **114 commits ahead, 3 behind**, 71 files different from main.
- The only main-only file is `student-profile/index.html`. Its three newer commits incorporate a shared Yearbook chooser, a refreshed horizontal profile look editor and the Elementary look adapter. Other upstream audited changes must remain intact.

## Reconciliation performed
- Created a review candidate from the full audit branch, preserving all 114 commits and its Grade 1–5 retention/family patches.
- Updated the candidate's `student-profile/index.html` script references to match the latest `main` exactly:
  - `khaemenes-yearbook-profile-images.js?v=20261109-modal-v4`
  - `khaemenes-universal-profile-look-editor.js?v=20261109-all-horizontal-v5`
  - `khaemenes-elementary-look-adapter.js?v=20261109-hero-yearbook-v3`
- Verified that the three integration script references match main and three embedded page scripts parse. All other family/profile features from the audit branch remain in place.
- Candidate remains ancestry-diverged from main until a conventional merge commit is created; content reconciliation is not the same as a completed merge.

## Branch classification
### Already contained in main (0 ahead)
Ten named October 27 `backup-elementary-*` branches, including older header, toolbar, entrance and teacher-tool backups:
- backup-elementary-before-landing-header-footer-20261027
- backup-elementary-before-next-five-landings-20261027
- backup-elementary-before-toolbar-overlap-fix-20261027
- backup-elementary-before-uniform-beta-toolbar-20261027
- backup-elementary-grade4-5-remaining-entrances-20261027
- backup-elementary-next-ten-entrances-20261027
- backup-elementary-seven-game-toolbar-regression-20261027
- backup-elementary-teacher-tools-grade2-5-20261027
- backup-elementary-ten-grade-subject-landings-20261027
- backup-elementary-ten-next-subject-headers-20261027

Also `hardening/archaemenes-elementary-v2`, `-v3`, and `-v4` have 0 commits ahead of main. These 13 names are *eligible for historical-ref cleanup* only after verifying main still contains their commits and a separate backup exists.

### Preserve: unique work not proven integrated
- `hardening/archaemenes-elementary`: 84 commits ahead / 1067 behind main, 55 files different. Do not discard.
- `fix/elementary-yearbook-photo-modal-2026-11-09`: 1 ahead / 3 behind; unique.
- `hardening/student-profile-sibling-selection-2026-11-09`: 2 ahead / 0 behind; unique.
- `upgrade/profile-creative-rail-2026-11-09`: 1 ahead / 2 behind; unique.
- `upgrade/profile-photo-editor-parity-2026-11-09`: 8 ahead / 3 behind; unique.
- `audit/elementary-family-report-2026-11-09`: 114 ahead / 3 behind; source of all staged family/retention work, keep until integrated and protected.
- `integration/elementary-family-retention-reconcile-2026-11-10`: reviewed candidate; preserve until merge outcome known.

## Why main was not automatically merged
A GitHub connector attempt to create a draft pull request returned HTTP 403 `Resource not accessible by integration`; the available GitHub connector also does not offer branch-ref deletion. Forcing `main` or moving refs to bypass review could discard its newer commits and deploy 114 commits without executed regression tests. Therefore neither action was taken.

## Safe local merge preparation
`tools/elementary-merge-review.sh` checks expected main/audit refs, checks the immutable reviewed profile blob, merges the audit branch into a fresh locally-created branch from main, resolves *only* `student-profile/index.html` with the reconciled candidate, rejects other conflicts, and runs the Grade 1–5 synthetic Node family/retention tests.

It **never pushes, merges into main or deletes a branch**. After tests and browser review, push the resulting branch and open a PR using a GitHub account with repository PR permission.

## Remaining acceptance gates
- Execute Grade 1–5 Node tests and review all 11 newly added GitHub workflow definitions in the audit branch.
- Confirm synthetic sibling switching, lesson assessment scores and grade-specific course gates still work across Grades 01–05.
- Inspect latest student-profile UI, Yearbook, photo editor, family buttons with browser before production.
- Create a conventional merge commit preserving both main and audit history; verify compare main against merged branch reports 0 behind.
- After verified merge, classify each stale branch again against the new main and delete **only exact names with zero unique commits**, retaining a recovery ref or archive.
- No real student records, protected Academy authority, STOS terminals or backend storage were accessed or modified.
