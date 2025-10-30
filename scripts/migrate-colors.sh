#!/usr/bin/env bash
set -euo pipefail

# 3A.3 Migration Script
# This script creates a safety branch and performs simple find/replace migrations
# from legacy color values to semantic utilities. Review diffs before committing.

# Create backup branch (no-op if branch exists)
BRANCH="feat/token-refresh"
if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git checkout -b "$BRANCH"
fi

git add . || true
if ! git diff --cached --quiet; then
  git commit -m "backup: pre-token-migration state"
fi

# Paths to scan (App Router project layout)
PATHS=(
  "src/app"
  "src/components"
  "src/pages"
  "src/styles"
)

# Function to run sed cross-platform (GNU/BSD)
sedi() {
  # usage: sedi "s/OLD/NEW/g" file
  if sed --version >/dev/null 2>&1; then
    sed -i "$1" "$2"   # GNU sed
  else
    sed -i '' "$1" "$2" # BSD sed (macOS)
  fi
}

# Replace common legacy browns/vars with semantic utilities in TSX/CSS where appropriate
# Note: This is heuristic; always review results.
replace_in_file() {
  local file="$1"
  # Hex browns to semantic classes (examples — customize as needed)
  sedi 's/bg-\[#322923\]/bg-ink/g' "$file"
  sedi 's/#322923/var(--color-text-primary)/g' "$file"
  sedi 's/#3a2f2a/var(--color-text-primary)/g' "$file"

  # Legacy var() utilities to tokens
  sedi 's/text-\[var(--color-charcoal)\]/text-ink-secondary/g' "$file"
  sedi 's/text-\[var(--color-gray-dark)\]/text-ink-muted/g' "$file"
  sedi 's/border-\[var(--color-border)\]/border-border-neutral/g' "$file"
  sedi 's/border-\[var(--color-gray-light)\]/border-border-neutral/g' "$file"
  sedi 's/bg-\[var(--color-gray-light)\]/bg-surface-2/g' "$file"
  sedi 's/hover:bg-\[var(--color-gray-ultra-light)\]/hover:bg-surface-1/g' "$file"
}

# Iterate files
for dir in "${PATHS[@]}"; do
  if [ -d "$dir" ]; then
    while IFS= read -r -d '' f; do
      replace_in_file "$f"
    done < <(find "$dir" -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.ts" -o -name "*.css" \) -print0)
  fi
done

echo "✓ Color migration complete. Review changes with: git diff"
