#!/usr/bin/env bash
# Exact-ref Elementary branch cleanup, dry-run by default.
# Usage (after a tested merge): bash tools/elementary-branch-cleanup.sh
# To actually remove verified redundant refs: bash tools/elementary-branch-cleanup.sh --execute
set -euo pipefail
mode="${1:---dry-run}"
case "$mode" in --dry-run|--execute) ;; *) echo "Use --dry-run or --execute"; exit 2 ;; esac
[ -d .git ] || { echo "Run from repository root"; exit 2; }
[ -z "$(git status --porcelain)" ] || { echo "Uncommitted changes; stop"; exit 2; }
git fetch origin --prune
# Mandatory merge proof: never purge references while the audit work is unmerged.
git merge-base --is-ancestor origin/audit/elementary-family-report-2026-11-09 origin/main || {
  echo "Audit branch not integrated into main. NO BRANCHES REMOVED." >&2
  exit 1
}
branches=(
 backup-elementary-before-landing-header-footer-20261027
 backup-elementary-before-next-five-landings-20261027
 backup-elementary-before-toolbar-overlap-fix-20261027
 backup-elementary-before-uniform-beta-toolbar-20261027
 backup-elementary-grade4-5-remaining-entrances-20261027
 backup-elementary-next-ten-entrances-20261027
 backup-elementary-seven-game-toolbar-regression-20261027
 backup-elementary-teacher-tools-grade2-5-20261027
 backup-elementary-ten-grade-subject-landings-20261027
 backup-elementary-ten-next-subject-headers-20261027
 hardening/archaemenes-elementary-v2
 hardening/archaemenes-elementary-v3
 hardening/archaemenes-elementary-v4
)
for b in "${branches[@]}"; do
  if ! git show-ref --verify --quiet "refs/remotes/origin/$b"; then
    echo "SKIP missing: $b"
    continue
  fi
  if ! git merge-base --is-ancestor "origin/$b" origin/main; then
    echo "KEEP unique work: $b"
    continue
  fi
  if [ "$mode" = "--execute" ]; then
    echo "Deleting confirmed redundant ref: $b"
    git push origin --delete "$b"
  else
    echo "DRY RUN redundant ref: $b"
  fi
done
echo "Unique Archaemenes, profile, audit and integration branches deliberately excluded."
