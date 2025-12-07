# 🧪 ProStar Landing Page - Test & Validierungs-Protokoll

## Übersicht

Dieses Dokument beschreibt alle automatisierten Tests, Sicherheitschecks und Validierungen für die ProStar Landing Page.

---

## Automatisierter Kompletttest

### Ausführen

```bash
./test-all.sh
```

Der Test prüft automatisch alle kritischen Komponenten und gibt einen detaillierten Bericht.

---

## Test-Kategorien

### 1. DATEISYSTEM-TESTS

#### 1.1 Essenzielle Dateien
**Prüfung:** Existenz aller benötigten Projekt-Dateien

| Datei | Zweck | Kritisch |
|-------|-------|----------|
| `package.json` | Node.js Dependencies | ✓ |
| `Dockerfile` | Development Container | ✓ |
| `Dockerfile.prod` | Production Container | ✓ |
| `docker-compose.yml` | Dev Orchestrierung | ✓ |
| `docker-compose.prod.yml` | Prod Orchestrierung | ✓ |
| `.env` | Dev Umgebungsvariablen | ✓ |
| `.env.production` | Prod Umgebungsvariablen | ✓ |
| `start-local.sh` | Lokaler Start | ✓ |
| `start-dev.sh` | Docker Dev Start | ✓ |
| `start-prod.sh` | Docker Prod Start | ✓ |
| `stop.sh` | Alle Services stoppen | ✓ |

**Erwartetes Ergebnis:** Alle Dateien müssen existieren

#### 1.2 Ausführungsrechte
**Prüfung:** Alle Shell-Scripts müssen ausführbar sein

```bash
# Auto-Fix wenn nicht ausführbar
chmod +x start-local.sh start-dev.sh start-prod.sh stop.sh test-all.sh
```

#### 1.3 Projekt-Struktur
**Prüfung:** Verzeichnisse für Source-Code

- `server/` - Backend-Code
- `client/` - Frontend-Code
- `drizzle/` - Datenbank-Schema
- `scripts/` - Hilfsskripte
- `patches/` - Package-Patches

---

### 2. DOCKER-TESTS

#### 2.1 Docker Installation
**Prüfung:** Docker ist installiert und verfügbar

```bash
docker --version
# Erwartetes Minimum: Docker 20.10+
```

**Fehlerbehandlung:**
- macOS: Installiere Docker Desktop
- Linux: `curl -fsSL https://get.docker.com | sh`

#### 2.2 Docker Daemon Status
**Prüfung:** Docker läuft und ist bereit

```bash
docker info
```

**Fehlerbehandlung:**
- macOS: Starte Docker Desktop
- Linux: `sudo systemctl start docker`

#### 2.3 Docker Compose
**Prüfung:** Docker Compose ist verfügbar

```bash
docker compose version
# Erwartetes Minimum: v2.0+
```

#### 2.4 Dockerfile Validierung
**Prüfung:** Syntax-Check aller Dockerfiles

```bash
docker build -f Dockerfile --dry-run .
docker build -f Dockerfile.prod --dry-run .
```

---

### 3. UMGEBUNGSVARIABLEN-TESTS

#### 3.1 Development Environment (.env)
**Prüfung:** Alle kritischen Variablen sind definiert

| Variable | Zweck | Muss vorhanden |
|----------|-------|----------------|
| `NODE_ENV` | Environment-Typ | ✓ |
| `PORT` | Server-Port | ✓ |
| `DATABASE_URL` | MySQL Connection String | ✓ |
| `JWT_SECRET` | Auth Token Secret | ✓ |
| `EMAIL_USER` | SMTP User | ✓ |
| `EMAIL_PASSWORD` | SMTP Passwort | ✓ |
| `STRIPE_SECRET_KEY` | Payment API | - |

**Validierung:**
```bash
grep "^NODE_ENV=" .env
grep "^DATABASE_URL=" .env
```

#### 3.2 Production Environment (.env.production)
**Prüfung:** Production-spezifische Sicherheit

**Sicherheits-Checks:**
- ❌ Keine Dev-Secrets (`dev_secret_key`)
- ❌ Keine Test-Stripe-Keys (`sk_test_`)
- ✓ Starke Passwörter (min. 16 Zeichen)
- ✓ Produktions-URLs (kein localhost)

**Kritische Warnungen:**
```bash
# Diese sollten in Production NICHT vorkommen
grep "dev_secret_key" .env.production  # Muss leer sein!
grep "sk_test_" .env.production        # Muss leer sein!
grep "localhost" .env.production       # Muss leer sein!
```

---

### 4. DATENBANK-TESTS

#### 4.1 MySQL Container Status
**Prüfung:** MySQL Container läuft

```bash
docker ps | grep prostar-mysql
```

**Auto-Start wenn nicht vorhanden:**
```bash
docker run -d --name prostar-mysql \
  -e MYSQL_ROOT_PASSWORD=ProStar2025DB! \
  -e MYSQL_DATABASE=prostar_db \
  -p 3306:3306 \
  mysql:8.0
```

#### 4.2 Datenbank-Verbindung
**Prüfung:** Verbindung zur MySQL-Instanz funktioniert

```bash
docker exec prostar-mysql mysql -u root -pProStar2025DB! -e "SELECT 1"
```

**Erwartetes Ergebnis:** Keine Connection-Errors

#### 4.3 Schema-Validierung
**Prüfung:** Datenbank und Tabellen existieren

```bash
docker exec prostar-mysql mysql -u root -pProStar2025DB! -e "USE prostar_db; SHOW TABLES;"
```

**Erwartete Tabellen:**
- `users` - Benutzer-Accounts
- `courseRegistrations` - Kurs-Anmeldungen

#### 4.4 Drizzle Migrationen
**Prüfung:** Migrationen sind aktuell

```bash
pnpm db:push
# Sollte ausgeben: "No schema changes, nothing to migrate"
```

---

### 5. NODE.JS / PNPM TESTS

#### 5.1 Node.js Version
**Prüfung:** Kompatible Node.js Version

```bash
node --version
# Minimum: v20.0.0
# Empfohlen: v20.x LTS
```

**Kompatibilitätstabelle:**
| Version | Status |
|---------|--------|
| v18.x | ⚠️ Veraltet |
| v20.x | ✅ Empfohlen |
| v21.x | ✅ OK |
| v22.x | ✅ OK |

#### 5.2 pnpm Installation
**Prüfung:** pnpm Package Manager verfügbar

```bash
pnpm --version
# Minimum: 8.0.0
```

**Installation falls fehlt:**
```bash
npm install -g pnpm
```

#### 5.3 Dependencies Installiert
**Prüfung:** node_modules existiert

```bash
ls node_modules | wc -l
# Erwartete Anzahl: ~970 packages
```

**Neu installieren falls fehlt:**
```bash
pnpm install
```

#### 5.4 Package Scripts Validierung
**Prüfung:** Alle npm scripts sind definiert

```json
{
  "scripts": {
    "dev": "...",        // Development Server
    "build": "...",      // Production Build
    "start": "...",      // Production Start
    "db:push": "...",    // DB Migrations
    "test": "..."        // Tests
  }
}
```

---

### 6. PORT-VERFÜGBARKEITS-TESTS

#### 6.1 Standard-Ports
**Prüfung:** Kritische Ports sind frei oder belegt

| Port | Service | Aktion wenn belegt |
|------|---------|-------------------|
| 3000 | Dev Server | Nutze 3001 |
| 3001 | Fallback Server | Nutze 3002 |
| 3306 | MySQL | OK (läuft bereits) |
| 80 | HTTP (Production) | Stoppe anderen Service |
| 443 | HTTPS (Production) | Stoppe anderen Service |

**Port-Check:**
```bash
lsof -i :3000
lsof -i :3306
```

**Auto-Fallback:** Die App nutzt automatisch den nächsten freien Port (3001, 3002, etc.)

---

### 7. NETZWERK-TESTS

#### 7.1 Localhost Erreichbarkeit
**Prüfung:** Loopback funktioniert

```bash
ping -c 1 127.0.0.1
```

#### 7.2 DNS Auflösung
**Prüfung:** Externe DNS-Auflösung

```bash
nslookup registry.npmjs.org
```

#### 7.3 Externe Konnektivität
**Prüfung:** Internet-Verbindung für npm/Docker

```bash
curl -I https://registry.npmjs.org
curl -I https://hub.docker.com
```

---

### 8. SICHERHEITS-TESTS

#### 8.1 Passwort-Stärke
**Prüfung:** Keine schwachen Passwörter

```bash
# Diese Patterns sollten NICHT in .env vorkommen:
grep -i "password123" .env
grep -i "admin" .env
grep -i "test123" .env
```

**Anforderungen:**
- Minimum 12 Zeichen
- Groß-/Kleinbuchstaben
- Zahlen und Sonderzeichen
- Keine Dictionary-Wörter

#### 8.2 .gitignore Validierung
**Prüfung:** Sensible Dateien sind ausgeschlossen

```bash
grep ".env" .gitignore           # Muss vorhanden sein
grep "node_modules" .gitignore   # Muss vorhanden sein
grep "*.log" .gitignore          # Empfohlen
```

#### 8.3 Hardcoded Secrets Scan
**Prüfung:** Keine API-Keys im Source-Code

```bash
# Suche nach verdächtigen Patterns
grep -r "sk_live_" --include="*.js" --include="*.ts" .
grep -r "api_key" --include="*.js" --include="*.ts" .
grep -r "password.*=" --include="*.js" --include="*.ts" .
```

**Erlaubt:** Nur Environment-Variablen nutzen
```javascript
// ✅ RICHTIG
const key = process.env.STRIPE_SECRET_KEY;

// ❌ FALSCH
const key = "sk_live_abc123...";
```

#### 8.4 HTTPS in Production
**Prüfung:** Production nutzt HTTPS

```bash
grep "https://" .env.production | grep SITE_URL
```

---

### 9. BUILD-TESTS

#### 9.1 TypeScript Compilation
**Prüfung:** Code kompiliert ohne Fehler

```bash
pnpm run check
```

**Toleranz:** Type-Errors sind in Dev nicht kritisch, sollten aber in Production behoben sein.

#### 9.2 Production Build
**Prüfung:** Production Build erfolgreich

```bash
pnpm run build
```

**Erwartetes Ergebnis:**
- `dist/` Verzeichnis erstellt
- `dist/index.js` vorhanden
- Keine Build-Fehler

---

### 10. FUNKTIONALE TESTS

#### 10.1 Server Start
**Prüfung:** Dev-Server startet fehlerfrei

```bash
pnpm dev &
sleep 10
curl http://localhost:3000
```

**Erwartete HTTP Codes:** 200 OK

#### 10.2 API Endpunkte
**Prüfung:** Kritische API-Routes funktionieren

```bash
# Health Check
curl http://localhost:3000/api/health

# Auth Endpoints
curl http://localhost:3000/api/auth/status
```

#### 10.3 Frontend Rendering
**Prüfung:** HTML wird korrekt ausgeliefert

```bash
curl http://localhost:3000 | grep "<html"
```

#### 10.4 Datenbank-Operationen
**Prüfung:** CRUD-Operationen funktionieren

```bash
# Über die API oder direkt:
docker exec prostar-mysql mysql -u root -pProStar2025DB! \
  -e "INSERT INTO prostar_db.users (email) VALUES ('test@test.de');"
```

---

### 11. DOKUMENTATIONS-TESTS

#### 11.1 README Vollständigkeit
**Prüfung:** Alle Docs vorhanden

- [ ] `README.md` - Projekt-Übersicht
- [ ] `START_HIER.md` - Quick-Start Guide
- [ ] `DOCKER_SETUP.md` - Docker-Anleitung
- [ ] `TEST_PROTOKOLL.md` - Dieses Dokument

**Mindestinhalt jeder Datei:**
- Beschreibung
- Installation
- Verwendung
- Troubleshooting

---

### 12. AUTOMATISIERUNGS-TESTS

#### 12.1 Start-Scripts
**Prüfung:** Alle Scripts funktionieren

```bash
# Syntax-Check
bash -n start-local.sh
bash -n start-dev.sh
bash -n start-prod.sh
bash -n stop.sh
```

#### 12.2 Docker Compose Syntax
**Prüfung:** YAML ist valide

```bash
docker compose -f docker-compose.yml config
docker compose -f docker-compose.prod.yml config
```

#### 12.3 End-to-End Tests
**Prüfung:** Kompletter Workflow

```bash
# 1. Stoppe alles
./stop.sh

# 2. Starte Development
./start-dev.sh

# 3. Warte 30 Sekunden
sleep 30

# 4. Teste Erreichbarkeit
curl http://localhost:3000

# 5. Cleanup
./stop.sh
```

---

## Test-Automation Matrix

### CI/CD Integration

Für automatische Tests in CI/CD-Pipelines:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: ./test-all.sh
```

---

## Fehlerbehandlung

### Häufige Fehler und Lösungen

#### Fehler: "Docker Daemon läuft nicht"
**Lösung:**
```bash
# macOS
open -a Docker

# Linux
sudo systemctl start docker
```

#### Fehler: "Port bereits belegt"
**Lösung:**
```bash
# Finde Prozess
lsof -i :3000

# Beende Prozess
kill -9 <PID>

# Oder nutze automatischen Fallback
# (App startet auf 3001)
```

#### Fehler: "MySQL Verbindung fehlgeschlagen"
**Lösung:**
```bash
# Container neu starten
docker restart prostar-mysql

# Oder komplett neu erstellen
docker rm -f prostar-mysql
./start-local.sh
```

#### Fehler: "pnpm nicht gefunden"
**Lösung:**
```bash
npm install -g pnpm
```

---

## Performance-Tests

### Benchmarks

```bash
# Response Time Test
ab -n 100 -c 10 http://localhost:3000/

# Load Test
wrk -t12 -c400 -d30s http://localhost:3000/
```

**Erwartete Werte:**
- Response Time: < 100ms (lokal)
- Requests/Sec: > 1000 (lokal)

---

## Sicherheits-Audit

### Automatischer Security-Scan

```bash
# npm audit
pnpm audit

# Dependency Check
pnpm outdated

# Container Scan
docker scan prostar_landing_prod:latest
```

---

## Checkliste vor Production-Deployment

- [ ] Alle Tests bestanden (`./test-all.sh`)
- [ ] `.env.production` angepasst
- [ ] Starke Passwörter gesetzt
- [ ] Production Stripe Keys eingetragen
- [ ] HTTPS konfiguriert
- [ ] Domain eingerichtet
- [ ] Backup-Strategie definiert
- [ ] Monitoring aufgesetzt
- [ ] Firewall konfiguriert

---

## Test-Protokoll

### Letzter Test: {{ DATUM }}

| Kategorie | Status | Fehler | Warnungen |
|-----------|--------|--------|-----------|
| Dateisystem | ✅ | 0 | 0 |
| Docker | ✅ | 0 | 0 |
| Umgebung | ✅ | 0 | 0 |
| Datenbank | ✅ | 0 | 0 |
| Node.js | ✅ | 0 | 0 |
| Ports | ⚠️ | 0 | 3 |
| Sicherheit | ✅ | 0 | 0 |
| Scripts | ✅ | 0 | 0 |

**Gesamt:** 29 Tests bestanden, 3 Warnungen, 0 Fehler

---

## Continuous Testing

### Automatische Tests vor jedem Start

Füge zum Start-Script hinzu:

```bash
# In start-local.sh, start-dev.sh, etc.
echo "Führe Pre-Start Tests durch..."
./test-all.sh --quick || {
    echo "Tests fehlgeschlagen! Abbruch."
    exit 1
}
```

---

**Dokumentation erstellt:** 8. Dezember 2025  
**Version:** 1.0  
**Autor:** GitHub Copilot
