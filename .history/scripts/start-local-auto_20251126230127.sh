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

# Check if dev server is already running
if pgrep -f "tsx watch server/_core/index.ts" > /dev/null; then
  echo "⚠️  Dev server is already running! Starting only database and tests."
  SKIP_DEV_START=1
else
  SKIP_DEV_START=0
fi

# Start MySQL Docker container if not running
echo "🐳 Checking MySQL Docker container..."
if ! docker ps | grep -q "$DB_CONTAINER_NAME" 2>/dev/null; then
  echo "Attempting to start MySQL container: $DB_CONTAINER_NAME"
  if docker run -d \
    --name "$DB_CONTAINER_NAME" \
    -p "$DB_PORT:3306" \
    -e MYSQL_ROOT_PASSWORD=password \
    -e MYSQL_DATABASE=prostar_db \
    mysql:latest > /dev/null 2>&1; then
    
    echo "⏳ Waiting for MySQL to be ready..."
    retry_count=0
    while ! docker exec "$DB_CONTAINER_NAME" mysqladmin ping -uroot -ppassword --silent 2>/dev/null; do
      if [ $retry_count -ge $MAX_RETRIES ]; then
        echo "⚠️  MySQL failed to start. Using in-memory fallback mode."
        break
      fi
      sleep $RETRY_DELAY
      retry_count=$((retry_count + 1))
    done
    if [ $retry_count -lt $MAX_RETRIES ]; then
      echo "✅ MySQL is ready"
    fi
  else
    echo "⚠️  Docker not available or failed. Continuing in fallback mode (in-memory cache)."
  fi
else
  echo "✅ MySQL container is already running"
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

if [ "$SKIP_DEV_START" -eq 0 ]; then
  echo "Starting dev server (automated local mode)"
  exec pnpm dev
else
  echo "✅ Setup complete. Dev server already running."
  echo "💡 To stop MySQL: docker stop $DB_CONTAINER_NAME && docker rm $DB_CONTAINER_NAME"
  exit 0
fi
