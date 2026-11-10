#!/usr/bin/env bash
# Safe local Git merge preparation for Elementary. DOES NOT push, merge to main, or delete refs.
set -euo pipefail

REPO="vervenveda/Khaemenes_Elementary.github.io"
SOURCE="audit/elementary-family-report-2026-11-09"
RESOLUTION="integration/elementary-family-retention-reconcile-2026-11-10"
LOCAL="integration/elementary-audit-merge-review-2026-11-10"
EXPECTED_MAIN="a314176710fcd0b2dc249a35054753c191d221e1"
EXPECTED_AUDIT="4e9e8fa78849c0f280cc996337d1ad0e05148ae4"
EXPECTED_PROFILE_BLOB="27a6b9abbfab85d94dfc0cea639e146b7ece6078"

[ -d .git ] || { echo "Run inside an existing clone of $REPO" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "Working tree has changes; stash/commit before merging." >&2; exit 1; }
git fetch origin main "$SOURCE" "$RESOLUTION"
[ "$(git rev-parse origin/main)" = "$EXPECTED_MAIN" ] || { echo "main moved; stop and re-audit." >&2; exit 1; }
[ "$(git rev-parse origin/$SOURCE)" = "$EXPECTED_AUDIT" ] || { echo "Audit branch moved; stop and re-audit." >&2; exit 1; }
[ "$(git rev-parse "origin/$RESOLUTION:student-profile/index.html")" = "$EXPECTED_PROFILE_BLOB" ] || { echo "Reviewed profile content changed; stop and re-audit." >&2; exit 1; }

git switch -c "$LOCAL" origin/main
# A merge conflict in student-profile/index.html is expected. Do not swallow unexpected errors.
git merge --no-commit --no-ff "origin/$SOURCE" || {
  conflicts="$(git diff --name-only --diff-filter=U)"
  [ "$conflicts" = "student-profile/index.html" ] || {
    echo "Unexpected conflict(s): $conflicts. STOP; do not commit." >&2
    exit 1
  }
}
# Restore the reviewed blended profile from the reconciliation candidate.
git show "origin/$RESOLUTION:student-profile/index.html" > student-profile/index.html
git add student-profile/index.html
[ -z "$(git diff --name-only --diff-filter=U)" ] || {
  echo "Unresolved merge conflicts; do not commit." >&2
  exit 1
}
git commit -m "Merge audited Elementary family and retention work with latest profile integrations"

# Required synthetic tests: no student data.
node --test tests/elementary-grade1-5-lesson-retention.test.cjs \
  tests/grade-one-family-guardrails.test.cjs \
  tests/grade-two-family-guardrails.test.cjs \
  tests/grade-three-family-guardrails.test.cjs \
  tests/grade-four-family-guardrails.test.cjs \
  tests/grade-five-family-guardrails.test.cjs

echo "Prepared locally: $LOCAL"
echo "No push, production merge, or branch deletion performed."
echo "Review: git log --oneline origin/main..HEAD"
echo "Review: git diff --stat origin/main...HEAD"
echo "After passing full checks, push the branch and create a PR with an authorized GitHub account."
