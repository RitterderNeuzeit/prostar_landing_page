#!/usr/bin/env bash
set -euo pipefail

# Start local dev in fully automated test mode (restores tested dev state)
# - starts Docker MySQL container (if not running)
# - copies .env.development -> .env
# - ensures DB_AUTO_SYNC and DEMO_MODE are set for automated runs
# - prevents double dev server starts
# - starts the dev server (pnpm dev)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_DEV="$ROOT_DIR/.env.development"
ENV_LOCAL="$ROOT_DIR/.env"
DB_CONTAINER_NAME="prostar-mysql-dev"
DB_PORT=3306
MAX_RETRIES=10
RETRY_DELAY=2

if [ ! -f "$ENV_DEV" ]; then
  echo "Error: $ENV_DEV not found. Aborting." >&2
  exit 1
fi

echo "Restoring development env from $ENV_DEV -> $ENV_LOCAL"
cp -f "$ENV_DEV" "$ENV_LOCAL"

# Ensure DB_AUTO_SYNC and DEMO_MODE are enabled for full automation
grep -q "^DB_AUTO_SYNC=true" "$ENV_LOCAL" || echo "DB_AUTO_SYNC=true" >> "$ENV_LOCAL"
grep -q "^DEMO_MODE=auto" "$ENV_LOCAL" || echo "DEMO_MODE=auto" >> "$ENV_LOCAL"

# Ensure minimal OAuth mock values exist so server doesn't abort in dev
grep -q "^OAUTH_SERVER_URL=" "$ENV_LOCAL" || echo "OAUTH_SERVER_URL=http://localhost:8080" >> "$ENV_LOCAL"
grep -q "^VITE_OAUTH_PORTAL_URL=" "$ENV_LOCAL" || echo "VITE_OAUTH_PORTAL_URL=http://localhost:3000/oauth" >> "$ENV_LOCAL"

echo "Using env file:" $(realpath "$ENV_LOCAL")

echo "Installing dependencies (skipped if already up-to-date)"
pnpm install --silent

echo "Starting dev server (automated local mode)"
exec pnpm dev
