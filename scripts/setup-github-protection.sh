#!/usr/bin/env bash
set -euo pipefail

REPO="RitterderNeuzeit/prostar_landing_page"
PROTECTION_FILE="/tmp/protection.json"

cat > "$PROTECTION_FILE" <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["CI Guard (PR checks)"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null
}
JSON

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI 'gh' is required. Install and run 'gh auth login' first." >&2
  exit 2
fi

echo "Setting repository secret ALLOW_REAL_EMAILS=false (encrypted by gh)..."
gh secret set ALLOW_REAL_EMAILS -b"false" -R "$REPO"

echo "Applying branch protection to 'main'..."
# Apply branch protection via GitHub API (gh will use your auth)
gh api --method PUT -H "Accept: application/vnd.github+json" \
  /repos/$REPO/branches/main/protection --input "$PROTECTION_FILE"

echo "Done. Branch protection applied and secret ALLOW_REAL_EMAILS=false set."

echo "Please verify in: https://github.com/$REPO/settings/branches"
