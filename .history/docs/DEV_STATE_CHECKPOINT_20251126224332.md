# DEV State Checkpoint — funktional getesteter Stand

Datum: 2025-11-26

Kurzbeschreibung:
- Dieser Checkpoint beschreibt den lokalen Entwicklungszustand, in dem alle Kernfunktionen des Projekts getestet wurden (Dev‑Server läuft, E‑Mail‑Automatisierungen senden/tracken lokal), sowie reproduzierbare Schritte und Hinweise zum Entfernen externer Serververbindungen für reine Offline/Local‑Dev Nutzung.

Getestete Funktionen (Status)
- Dev‑Server (Vite + Express/ts-node): läuft auf `http://localhost:3000` — getestet
- tRPC Endpunkte (`/api/trpc`): ansprechbar — getestet
- Checkout / Stripe‑Integration (Test‑Keys): Routen verfügbar; Webhook‑Middleware korrekt registriert — geprüft
- Admin‑Routes (`/api/admin`): geladen (lokal, mit `x-admin-key`) — geprüft
- E‑Mail Automatisierungen (SMTP via `.env.development`): Test‑E‑Mails werden via konfigurierte SMTP‑Zugangsdaten versendet; Open‑Tracking (`/api/email/open`) markiert Zugriffe in DB — getestet
- Datenbank (Drizzle + MySQL lokal): DB‑Sync / Migrations erwartet lokal verfügbar — `DB_AUTO_SYNC=true` erlaubt Auto‑Sync im Dev‑Modus — geprüft

Belege / Logs
- Dev‑Server Log (Beispiel): `tmp/dev_server.log` — enthält Einträge wie `[EmailService] ENV.emailUser: info@prostarmarketing.de` und Server-Start auf `http://localhost:3000`.
- Serverprozess: `NODE_ENV=development tsx watch server/_core/index.ts` (siehe `package.json` script `dev`).

Wichtige Umgebungsdateien
- Aktive Dev‑Env: `.env.development` (enthält lokale SMTP‑Credentials, `DATABASE_URL=mysql://root:password@127.0.0.1:3306/prostar_db`, `TEST_EMAIL_ENABLED=true`).
- Beispiel: `.env.example` (sollte keine echten Secrets enthalten)

Reproduktionsschritte (kurz)
1. Kopiere die dev‑env (falls nötig):

```bash
cp .env.development .env
```

2. Abhängigkeiten installieren:

```bash
pnpm install
```

3. Dev‑Server starten:

```bash
pnpm dev
# öffne http://localhost:3000
```

4. Optional: MySQL lokal starten (Docker):

```bash
docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=prostar_db mysql:latest
```

5. Test‑E‑Mails: Die Dev‑Umgebung sendet Test‑E‑Mails automatisch wenn `TEST_EMAIL_ENABLED=true`. Open‑Tracking verwendet `/api/email/open?key=<accessKey>&email=<email>` und markiert Zugriffe in DB.

Empfehlungen zum Entfernen externer Serververbindungen ("der Serververbindung kann weg")
- Ziel: Lokaler Dev‑Checkpoint ohne Abhängigkeit zu externen OAuth/Authentifizierungsservern oder Cloud‑Diensten.
- Vorgehen (nicht destruktiv):
  - Erstelle eine sanitisierte Dev‑Env (ist bereits angelegt: `.env.development.sanitized`) und nutze diese beim lokalen Start.
  - Setze in der sanitierten Env alle externen URLs leer oder auf lokale Mocks:
    - `OAUTH_SERVER_URL=` (leer)
    - `BUILT_IN_FORGE_API_URL=` (leer)
    - `AZURE_*` Variablen leer lassen
  - Stelle sicher, dass `DATABASE_URL` auf eine lokale DB (127.0.0.1) zeigt oder auf sqlite (wenn Projekt das unterstützt).
  - Deaktiviere/Mocke Webhooks und Background‑Jobs falls sie externe Verbindungen aufbauen.

Konkrete Dateien / Einstellungen zu prüfen
- `server/_core/index.ts`: OAuth‑Routes werden in `registerOAuthRoutes(app)` geladen — wenn kein `OAUTH_SERVER_URL` gesetzt ist, läuft der Dev‑Flow meist lokal; für vollständige Offline‑Nutzung kann man diese Registrierung temporär auskommentieren.
- `.env.development`: enthält produktionsähnliche Werte — nutze die sanitisierte Variante für Offline.
- `server/routes/*`: prüfen, ob externe HTTP‑Clients verwendet werden (z. B. fetch/axios) und diese ggf. mit lokalen Stubs ersetzen.

Was ich erstellt habe
- `docs/DEV_STATE_CHECKPOINT.md` (dieses File) — dokumentiert den Zustand und Reproduktionsschritte.
- `.env.development.sanitized` — Beispiel‑Dev‑Env mit externen Verbindungen deaktiviert (siehe nebenstehend).

Nächste Schritte (optional, kurz)
- Willst du, dass ich die App so anpasse, dass sie standardmäßig die sanitisierte Dev‑Env nutzt (z. B. `NODE_ENV=development` lädt `.env.development.sanitized`)?
- Soll ich OAuth/OAuth‑Route in `server/_core/index.ts` temporär auskommentieren und lokale Mock‑Provider aktivieren?

Kontakt
- Wenn du möchtest, übernehme ich die Änderungen automatisiert (Code‑Änderungen) — sag mir kurz welche Option du bevorzugst.
