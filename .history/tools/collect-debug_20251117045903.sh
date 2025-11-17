#!/usr/bin/env bash
set -euo pipefail

# collect-debug.sh
# Sammlung prüfbarer Logs für dieses Repo. Ausführen in Projekt-Root.
# Verwendung:
#   chmod +x tools/collect-debug.sh
#   tools/collect-debug.sh [--no-install]

OUT_DIR="debug_logs"
BUNDLE="debug_bundle.tar.gz"
NO_INSTALL=false

if [[ "${1-}" == "--no-install" ]]; then
  NO_INSTALL=true
fi

mkdir -p "$OUT_DIR"

echo "Collecting environment info..."
{
  echo "pwd: $(pwd)"
  uname -a
  date
} > "$OUT_DIR/system_info.txt"

echo "Checking versions..."
if command -v node >/dev/null 2>&1; then
  node -v > "$OUT_DIR/node_version.txt" 2>&1 || true
else
  echo "node: MISSING" > "$OUT_DIR/node_version.txt"
fi

if command -v pnpm >/dev/null 2>&1; then
  pnpm -v > "$OUT_DIR/pnpm_version.txt" 2>&1 || true
else
  echo "pnpm: MISSING" > "$OUT_DIR/pnpm_version.txt"
fi

npm -v > "$OUT_DIR/npm_version.txt" 2>&1 || true

echo "Recording minimal env (keys only, values REDACTED if present)..."
if [[ -f ".env" ]]; then
  # redact values
  grep -v '^\s*#' .env | sed -E 's/(^[^=]+=).*/\1REDACTED/' > "$OUT_DIR/env_redacted.txt" || true
else
  echo ".env not found; copy .env.example to .env and fill values" > "$OUT_DIR/env_redacted.txt"
fi

echo "Recording selected ENV variables from process (if present)..."
env | grep -E 'DATABASE_URL|JWT_SECRET|STRIPE|OAUTH|PORT|VITE_APP_ID|OWNER_OPEN_ID' || true > "$OUT_DIR/process_env.txt" 2>&1 || true

if [[ "$NO_INSTALL" = false ]]; then
  if command -v pnpm >/dev/null 2>&1; then
    echo "Running pnpm install (this may take a while)..."
    pnpm install --reporter=silent > "$OUT_DIR/install.txt" 2>&1 || true
  else
    echo "Skipping install: pnpm not found" > "$OUT_DIR/install.txt"
  fi
else
  echo "Skipping install (user requested)" > "$OUT_DIR/install.txt"
fi

echo "Running type-check (tsc --noEmit)..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm run check > "$OUT_DIR/tsc.txt" 2>&1 || true
else
  echo "pnpm not found; cannot run type-check" > "$OUT_DIR/tsc.txt"
fi

echo "Running tests (vitest) -- may be skipped if heavy..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm test > "$OUT_DIR/tests.txt" 2>&1 || true
else
  echo "pnpm not found; cannot run tests" > "$OUT_DIR/tests.txt"
fi

echo "Collecting git status and recent commits..."
git status --porcelain > "$OUT_DIR/git_status.txt" 2>&1 || true
git rev-parse --abbrev-ref HEAD > "$OUT_DIR/git_branch.txt" 2>&1 || true
git log --oneline -n 20 > "$OUT_DIR/git_log_20.txt" 2>&1 || true

echo "Attempting short dev server start to capture startup logs (12s)..."
if command -v pnpm >/dev/null 2>&1; then
  # Start pnpm dev in background; capture output to file. Stop after 12s.
  pnpm dev > "$OUT_DIR/dev_server.txt" 2>&1 &
  DEV_PID=$!
  echo "Started dev (pid=$DEV_PID), waiting 12s to capture logs..."
  sleep 12
  echo "Killing dev process..."
  kill "$DEV_PID" 2>/dev/null || true
  # Give it a moment to flush
  sleep 1
else
  echo "pnpm not found; skipping dev server run" > "$OUT_DIR/dev_server.txt"
fi

echo "Collecting node process list (short)..."
ps aux | grep -E 'node|vite|tsx' | grep -v grep > "$OUT_DIR/process_list.txt" 2>&1 || true

echo "Packaging logs into $BUNDLE"
tar -czf "$BUNDLE" "$OUT_DIR"

echo "Done. Upload or attach $BUNDLE. Size: $(du -h "$BUNDLE" | cut -f1)"
echo "Contents saved in $OUT_DIR/"

exit 0
