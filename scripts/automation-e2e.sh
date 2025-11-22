#!/bin/bash
# Automatisierter End-to-End-Test für Kursregistrierung und E-Mail-Versand
# Läuft alle 15 Minuten per cron oder manuell

LOGFILE="$(pwd)/automation-e2e.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

run_test() {
  echo "[$TIMESTAMP] Starte E2E-Test..." >> "$LOGFILE"
  OUTPUT=$(npx tsx scripts/e2e-customer-flow.ts 2>&1)
  echo "$OUTPUT" >> "$LOGFILE"
  if echo "$OUTPUT" | grep -q "End-to-End-Test erfolgreich"; then
    echo "[$TIMESTAMP] ✅ Test erfolgreich" >> "$LOGFILE"
  else
    echo "[$TIMESTAMP] ❌ Fehler im Testlauf" >> "$LOGFILE"
    # Optional: Hier könnte ein E-Mail-Alert eingebaut werden
  fi
}

run_test
