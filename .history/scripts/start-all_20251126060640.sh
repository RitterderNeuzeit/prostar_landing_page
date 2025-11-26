#!/bin/zsh
# Startet Dev-Server, DB (Docker), E2E-Test und Maildev (optional)
# Logs landen in tmp/dev-start.log

set -e
mkdir -p tmp
LOGFILE="tmp/dev-start.log"
echo "[START] $(date)" > "$LOGFILE"

# 1. Datenbank (MySQL via Docker, falls nicht läuft)
if ! docker ps | grep -q prostar-mysql; then
  echo "[DB] Starte MySQL-Container..." | tee -a "$LOGFILE"
  docker run --name prostar-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=prostar -p 3307:3306 -d mysql:8.0 >> "$LOGFILE" 2>&1 || true
else
  echo "[DB] MySQL läuft bereits." | tee -a "$LOGFILE"
fi

# 2. Maildev (für lokale E-Mail-Tests, optional)
if ! docker ps | grep -q prostar-maildev; then
  echo "[Maildev] Starte Maildev-Container..." | tee -a "$LOGFILE"
  docker run --name prostar-maildev -p 1080:1080 -p 1025:1025 -d maildev/maildev >> "$LOGFILE" 2>&1 || true
else
  echo "[Maildev] Läuft bereits." | tee -a "$LOGFILE"
fi

# 3. Dev-Server (pnpm dev)
echo "[DEV] Starte pnpm dev..." | tee -a "$LOGFILE"
(pnpm dev >> "$LOGFILE" 2>&1 &)

sleep 5

# 4. Playwright E2E-Test (Watch-Modus)
echo "[E2E] Starte Playwright Test (watch)..." | tee -a "$LOGFILE"
(npx playwright test e2e/course-access.spec.ts --watch >> "$LOGFILE" 2>&1 &)

echo "[READY] Alles läuft! Logs: $LOGFILE"
