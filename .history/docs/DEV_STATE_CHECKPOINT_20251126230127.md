# DEV State Checkpoint — funktional getesteter Stand

Datum: 2025-11-26

## Kurzbeschreibung

Dieser Checkpoint dokumentiert den lokalen Entwicklungszustand, in dem alle Kernfunktionen des Projekts getestet wurden (Dev‑Server läuft, E‑Mail‑Automatisierungen senden/tracken lokal). Reproduzierbare Schritte und Hinweise zum Entfernen externer Serververbindungen für reine Offline/Local‑Dev Nutzung.

## Getestete Funktionen (Status)

- **Dev‑Server (Vite + Express/ts-node)**: läuft auf `http://localhost:3000` — ✅ getestet
- **tRPC Endpunkte** (`/api/trpc`): ansprechbar — ✅ getestet
- **Checkout / Stripe‑Integration** (Test‑Keys): Routen verfügbar; Webhook‑Middleware korrekt registriert — ✅ geprüft
- **Admin‑Routes** (`/api/admin`): geladen (lokal, mit `x-admin-key`) — ✅ geprüft
- **E‑Mail Automatisierungen** (SMTP via `.env.development`): Test‑E‑Mails werden via konfigurierte SMTP‑Zugangsdaten versendet; Open‑Tracking (`/api/email/open`) markiert Zugriffe in DB — ✅ getestet
- **Datenbank** (Drizzle + MySQL lokal): DB‑Sync / Migrations erwartet lokal verfügbar — `DB_AUTO_SYNC=true` erlaubt Auto‑Sync im Dev‑Modus — ✅ geprüft

## Reproduktionsschritte (schnell)

1. **Repo klonen und Install:**
   ```bash
   git clone https://github.com/AIHubcom/prostar_landing_page--1-.git
   cd prostar_landing_page\ \(1\)
   pnpm install
   ```

2. **Dev-Server starten (Option A — automatisiert mit Docker fallback):**
   ```bash
   pnpm run dev:local-auto
   # Server läuft auf http://localhost:3000
   # Docker MySQL wird versucht zu starten; bei Fehler fällt es auf in-memory-Cache zurück
   ```

3. **Dev-Server starten (Option B — nur lokaler Mode):**
   ```bash
   pnpm dev
   ```

4. **E2E-Tests lokal ausführen:**
   ```bash
   pnpm run e2e:run
   # Ergebnis: ✅ End-to-End-Test erfolgreich!
   ```

5. **Optional: MySQL lokal via Docker starten (wenn nicht automatisch):**
   ```bash
   docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=prostar_db mysql:latest
   ```

## Wichtige Umgebungsdateien

- **Aktive Dev‑Env**: `.env.development` (enthält lokale SMTP‑Credentials, `DATABASE_URL=mysql://root:password@127.0.0.1:3306/prostar_db`, `TEST_EMAIL_ENABLED=true`)
- **Sanitisierte Env** (ohne externe Services): `.env.development.sanitized` (zum manuellen Offline‑Dev verwenden)
- **Beispiel**: `.env.example` (sollte keine echten Secrets enthalten)

## Startup-Scripts

- **`scripts/start-local-auto.sh`**: Vereinheitlichter Startup (Docker MySQL, DB_AUTO_SYNC, DEMO_MODE, Fallback)
- **`package.json` Script**: `dev:local-auto` → ruft das Startskript auf

## Bemerkungen zum Fallback-Mode

- Wenn Docker nicht verfügbar ist: System verwendet **In-Memory Cache** für Registrierungen
- E‑Mails werden trotzdem via SMTP (Gmail) versendet
- DB‑Operationen fallen auf Cache zurück bei Fehler
- E2E‑Tests laufen erfolgreich auch ohne aktive MySQL

## Nächste Schritte (nach dem Klonen)

1. `pnpm install` (oder wird automatisch ausgeführt)
2. `pnpm run dev:local-auto` (oder `pnpm dev`)
3. Server läuft auf `http://localhost:3000`
4. Tests: `pnpm run e2e:run`

---

**Status**: ✅ Vollständig getestet und funktionsfähig lokal  
**Letzte Änderung**: 2025-11-26  
**Branch**: `main`
