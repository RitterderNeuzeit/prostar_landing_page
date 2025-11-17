#!/usr/bin/env bash
set -euo pipefail

# Einfaches Startskript:
# - Wenn pnpm vorhanden ist: install + dev
# - Sonst, wenn Docker Compose vorhanden ist: build + up
# - Ziel: minimaler Manual-Aufwand für Nutzer

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Project root: $ROOT_DIR"

if command -v pnpm >/dev/null 2>&1; then
  echo "pnpm gefunden – verwende pnpm (install + dev)"
  pnpm install
  pnpm run check || true
  pnpm dev
  exit 0
fi

if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
  echo "pnpm nicht gefunden, starte Docker Compose"
  docker compose build --progress=plain
  docker compose up
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  echo "pnpm nicht gefunden. Versuche 'docker compose' (v2) oder 'docker-compose' (v1)."
  if docker compose version >/dev/null 2>&1; then
    docker compose build --progress=plain
    docker compose up
    exit 0
  fi
fi

echo "Weder pnpm noch Docker gefunden. Bitte installiere pnpm (corepack) oder Docker Desktop."
echo "Kurzbefehle (macOS):"
echo "  brew install node"
echo "  corepack enable && corepack prepare pnpm@latest --activate"
echo "  OR: npm install -g pnpm"
exit 2
