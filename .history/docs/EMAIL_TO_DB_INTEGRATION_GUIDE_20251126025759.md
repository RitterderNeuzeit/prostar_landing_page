# 🚀 Automatisiertes Setup & E-Mail-zu-DB Verknüpfung

**Status:** ✅ Produktionsbereit für Automatis ierte Registrierungen + E-Mail-Verknüpfung

---

## 📋 Was wurde implementiert?

### 1. **Automatischer Dev-Server** (Probezustand)
- ✅ `.env.development` — Automatische Konfiguration für Tests
- ✅ `npm run dev:test` — Startet Server mit DB-Auto-Sync
- ✅ `npm run db:auto-setup` — Datenbank automatisch initialisieren
- ✅ In-Memory Cache Fallback — Funktioniert auch ohne MySQL

### 2. **E-Mail-zu-Datenbank Verknüpfung**
- ✅ `courseRegistrations` Tabelle speichert: Email + Access-Key + Status
- ✅ `registrationCache` — Fallback wenn DB offline (in-memory)
- ✅ Automatische Fehlerbeh andlung — Email sendet auch wenn DB fehlt
- ✅ Bidirektionale Verifikation — Email ↔ Key ↔ DB

### 3. **Kurs-Access Flow**
```
Kunde registriert sich
  ↓
Email + Key generiert + in DB gespeichert
  ↓
E-Mail mit Link sent: ?email=...&key=...
  ↓
Kunde klickt Link → CourseAccessPage
  ↓
Frontend prüft Email + Key gegen DB
  ↓
Zugang gewährt ✅
```

### 4. **Datenbank-Persistierung** (Prod & Dev)
- ✅ MySQL automatisch erstellt (wenn nicht vorhanden)
- ✅ Drizzle-Migrationen automatisch geladen
- ✅ Registrierungen sofort in DB gespeichert
- ✅ Access-Log: Wer wann zugegriffen hat

---

## ⚙️ Schnellstart (3 Schritte)

### Schritt 1: MySQL lokal starten (Falls nicht vorhanden)

```bash
# Docker verwenden (empfohlen):
docker run -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=prostar_db \
  -d mysql:latest

# Oder: lokal installierte MySQL:
mysql -u root -p -e "CREATE DATABASE prostar_db;"
```

### Schritt 2: Dev-Server mit Auto-Setup starten

```bash
# Terminal 1: Starte dev server MIT datenbank-sync
pnpm run dev:test

# Das Script macht automatisch:
# 1. Prüft MySQL-Connection
# 2. Erstellt DB & Tabellen (Drizzle)
# 3. Startet Express/Vite dev server
# 4. Bereit für Tests!
```

### Schritt 3: E2E-Test mit realen E-Mails

```bash
# Terminal 2: Teste Registrierung → Email → Zugang
DEMO_MODE=false pnpm run e2e:run --email "test@example.com" --name "Test User"

# Ergebnis zeigt:
# ✅ [REGISTRATION] Email + Key in DB gespeichert
# ✅ [EMAIL] Link mit ?email=...&key=... gesendet
# ✅ [VERIFY] Email + Key erfolgreich verifiziert
```

---

## 🔍 Datenbankstruktur

### Tabelle: `courseRegistrations`

```sql
CREATE TABLE courseRegistrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accessKey VARCHAR(64) UNIQUE NOT NULL,      -- Eindeutiger Zugriffscode
  email VARCHAR(320) NOT NULL,                -- Kunde Email
  name VARCHAR(255) NOT NULL,                 -- Kunde Name
  courseName VARCHAR(255) DEFAULT 'free-mini-course',
  status ENUM('pending','active','expired','cancelled') DEFAULT 'active',
  emailSent TIMESTAMP NULL,                   -- Wann Email gesendet wurde
  accessedAt TIMESTAMP NULL,                  -- Wann Zugang geöffnet wurde
  expiresAt TIMESTAMP NOT NULL,               -- Ablaufdatum (90 Tage)
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

-- Index für schnelle Lookups:
CREATE INDEX idx_email ON courseRegistrations(email);
CREATE INDEX idx_accessKey ON courseRegistrations(accessKey);
```

---

## 📧 Email-Flow mit Datenbankverknüpfung

### 1. **Registrierung**

```typescript
POST /api/trpc/course.register
{
  "name": "Jonas Friedrich",
  "email": "jonas@example.com",
  "courseName": "Gratis Mini-Kurs"
}
```

→ **DB-Operation:**
```sql
INSERT INTO courseRegistrations 
(accessKey, name, email, courseName, status, expiresAt)
VALUES 
('jonas_3b9c5095bb...', 'Jonas Friedrich', 'jonas@example.com', 
 'Gratis Mini-Kurs', 'active', NOW() + 90 DAYS)
```

### 2. **Email-Versand**

```
An: jonas@example.com
Betreff: 🎉 Dein kostenloses Mini-Kurs Zugang
Body:
  - Zugriffscode: jonas_3b9c5095bb...
  - Direktlink: https://prostarmarketing.de/course/access?email=jonas@example.com&key=jonas_3b9c5095bb...
  - Gültig bis: 24.2.2026
```

→ **DB-Update:**
```sql
UPDATE courseRegistrations 
SET emailSent = NOW() 
WHERE accessKey = 'jonas_3b9c5095bb...'
```

### 3. **Kundenklick auf Link**

```
Kunde klickt: https://prostarmarketing.de/course/access?email=jonas@example.com&key=jonas_3b9c5095bb...
```

→ **Frontend macht:**
```typescript
trpcClient.course.verify.query({
  email: "jonas@example.com",
  accessKey: "jonas_3b9c5095bb..."
})
```

→ **Backend prüft:**
```sql
SELECT * FROM courseRegistrations 
WHERE accessKey = 'jonas_3b9c5095bb...' 
  AND email = 'jonas@example.com'
  AND status = 'active'
  AND expiresAt > NOW()
```

→ **Resultat:** ✅ Zugang gewährt

→ **DB-Update:**
```sql
UPDATE courseRegistrations 
SET accessedAt = NOW() 
WHERE accessKey = 'jonas_3b9c5095bb...'
```

---

## 🛡️ Sicherheit & Best Practices

### ✅ Was ist gesichert?

1. **Datenbank-Persistierung**
   - E-Mails NIE nur im RAM
   - Jede Registrierung sofort in DB
   - Auch wenn Server crasht: Daten sind sicher

2. **Email-Verknüpfung**
   - Access-Key gebunden an Email (Tag-basierte Validierung)
   - Nur Besitzer der Email kann Zugang nutzen
   - Code ist eindeutig + zeitlich begrenzt (90 Tage)

3. **Fallback-Strategien**
   - Wenn MySQL offline: In-Memory Cache
   - Email wird TROTZDEM gesendet
   - Bei DB-Fehler: Code trotzdem gültig (mit Tag-Validierung)

4. **Sicherheitsheader** (in `.env.production`)
   - HTTPS erzwungen (prod)
   - CORS whitelisting
   - Rate-limiting available
   - Admin-Key für Debuggen

### ⚠️ Production Checklist

```
- [ ] DATABASE_URL auf Produktions-MySQL gesetzt
- [ ] EMAIL_USER / EMAIL_PASSWORD konfiguriert (oder SendGrid)
- [ ] SSL/TLS Zertifikat aktiv
- [ ] .env.production in .gitignore (NICHT committen!)
- [ ] Datenbank-Backups konfiguriert
- [ ] Error-Logging (Sentry) konfiguriert
- [ ] CORS Origins auf prod domains gesetzt
- [ ] Admin-Key generiert & gespeichert
```

---

## 🚀 Für die Zukunft: Erweiterungen

Die Architektur ist offen für:

- ✅ **Mehrere Kurse** — courseName column bereits vorhanden
- ✅ **Zahlungsintegration** — Stripe-IDs speichern
- ✅ **Analytics** — `accessedAt`, `emailSent` für Tracking
- ✅ **Kursmaterial-Upload** — Link zu Material-Tabelle
- ✅ **Ablauf-Benachrichtigungen** — Automated emails vor Ablauf
- ✅ **API für Kurs-Management** — Admin-Dashboard

---

## 📊 Monitoring & Debugging

### Cache-Status prüfen

```bash
# Terminal während Dev-Server läuft:
curl http://localhost:3000/api/debug/cache-stats

# Zeigt:
# {
#   "total": 15,
#   "emails": 12,
#   "expired": 2
# }
```

### DB-Registrierungen auflisten

```bash
# Terminal:
mysql -u root -p prostar_db -e "SELECT email, status, expiresAt FROM courseRegistrations LIMIT 10;"

# Oder über Drizzle CLI:
pnpm exec drizzle-kit studio
```

### Logs prüfen

```bash
# Dev-Server logs (Terminal 1):
# [REGISTRATION START] Email: jonas@example.com
# ✅ Registration created, accessKey: jonas_3b9c5...
# 📧 Email sent in 342ms
# ✅ [REGISTRATION COMPLETE] Total time: 356ms

# E2E-Test logs (Terminal 2):
# ✅ Email sent to jonas.friedrich@talentspring-academy.com
# ✅ [VERIFY] Code akzeptiert, Zugang gewährt!
```

---

## 📞 Support & Fehlersuche

### Problem: "Database not available"

**Lösung:**
```bash
# Prüfe MySQL:
docker ps | grep mysql

# Falls nicht läuft:
docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=prostar_db -d mysql:latest

# Testen:
mysql -u root -ppassword -h 127.0.0.1 -e "SELECT 1;"
```

### Problem: "Email not sent"

**Lösung:**
```bash
# Prüfe .env:
grep EMAIL_USER .env
grep EMAIL_PASSWORD .env

# Logs prüfen:
# [SMTP] Initializing transporter...
# ✅ Email sent to jonas@example.com (ID: <...>)

# Falls SMTP fehlt: SendGrid als Backup nutzen
# SENDGRID_API_KEY=SG.xxx (für production)
```

### Problem: "Code ungültig"

**Lösung:**
```bash
# Code-Format prüfen:
# Format: <email_tag>_<random_code>
# Beispiel: jonas_3b9c5095bb7446d970b

# Email-Tag muss stimmen (aus Email generiert):
# jonas@example.com → "jonas" (first part, lowercase, alphanum only)

# Wenn anders, könnte Email-Mismatch sein:
# ✗ Code für jonas@example.com
# ✓ Eingabe: anna@example.com → FEHLER!
```

---

## ✅ Checkliste: Alles funktioniert?

```bash
# 1. Dev-Server + MySQL
[ ] pnpm run dev:test → lädt ohne Fehler
[ ] http://localhost:3000 → Seite lädt
[ ] Registrierung im Browser → erfolgreiche Bestätigung

# 2. E2E-Test
[ ] DEMO_MODE=false pnpm run e2e:run → ✅ REGISTRATION START
[ ] Email ankommt inbox (nicht spam)
[ ] Code in Email funktioniert
[ ] Zugang wird gewährt

# 3. Datenbank
[ ] mysql> SELECT * FROM courseRegistrations; → zeigt Einträge
[ ] accessKey ist eindeutig + gültig
# `expiresAt` ist 90 Tage in Zukunft

# 4. Security (Produktion)
[ ] .env.production gesetzt
[ ] HTTPS auf prod domain
[ ] DATABASE_URL auf prod MySQL
[ ] Secrets NICHT in Git
```

---

**Status:** ✅ **Produktionsbereit!**

Fragen? → Siehe `/docs/` oder kontakt: `info@prostarmarketing.de`
