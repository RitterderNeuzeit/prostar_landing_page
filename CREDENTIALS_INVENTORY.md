# Credentials Inventory - ProStar Landing Page

**Version:** 1.0.0  
**Aktualisiert:** 7. Dezember 2025  
**Status:** ✅ Bereinigt & Dokumentiert

---

## 📋 Übersicht

Dieses Dokument listet alle Credentials, API-Keys und Verbindungen auf, die für den Betrieb der ProStar Landing Page benötigt werden.

---

## ✅ Derzeit Konfiguriert & Funktionsfähig

### 1. **Datenbank - MySQL 8.0**

**Entwicklung (Lokal - Docker):**
```
Host: 127.0.0.1:3306
User: root
Password: ProStar2025DB!
Database: prostar_db
```

**Status:** ✅ Läuft lokal  
**Verwendung:** Speicherung von Kurs-Registrierungen, Access Keys, User-Daten

---

### 2. **Email - Gmail SMTP**

```
Server: smtp.gmail.com:587
User: info@prostarmarketing.de
Password: pefn vhlu yeqm ghll (Gmail App-Passwort)
From: ProStar AI <info@prostarmarketing.de>
Reply-To: info@prostarmarketing.de
```

**Status:** ✅ Konfiguriert & funktionsfähig  
**Verwendung:** Versand von Access Keys nach Registrierung

**Wichtig:** 
- Nutzt Gmail App-Passwort (nicht normales Account-Passwort)
- 2FA muss im Gmail-Account aktiviert sein
- App-Passwort bei Google Security Settings erstellt

---

### 3. **ProStar AI Chat Widget - Google Cloud Run**

```
API URL: https://ai-sales-agent-for-prostar-marketing-1013733494627.us-west1.run.app
API Key: AIzaSyDpxE_NS-6pmYrSuUvsv4D_NODVJ8CrjwQ
```

**Status:** ✅ Aktiv (Hardcoded-Key wurde in .env verschoben)  
**Verwendung:** Chat-Widget auf Landing Page für Kundenkontakt

**Sicherheit:**
- ⚠️ Ehemals hardcoded in ChatWidget.tsx (GEFIXT)
- ✅ Jetzt über Environment Variable (VITE_PROSTAR_AI_KEY)
- 🔒 Key sollte mit HTTP Referrer Restrictions geschützt werden

---

### 4. **Stripe Payment (Test Mode)**

```
Secret Key: sk_test_dev_mode
Webhook Secret: whsec_dev_mode
```

**Status:** ⚠️ Test Mode (Placeholder-Werte)  
**Verwendung:** Payment-System für Kurs-Verkauf (derzeit inaktiv)

---

## ⚠️ Benötigt Production-Werte

### 1. **JWT Secret**

**Aktuell (DEV):**
```
JWT_SECRET=dev_secret_key_not_secure
```

**Production:** 
```bash
# Generierter sicherer Key (32+ Zeichen):
JWT_SECRET=b36423c866f8b1634ef8265a92e86bbc3397afcffc442e40956cdf654f609a19
```

**Status:** ⚠️ MUSS für Production ersetzt werden  
**Verwendung:** Session-Management, Access Key Tokens

---

### 2. **Production Database**

**Option A - Railway MySQL:**
```
DATABASE_URL=mysql://root:<password>@<railway-host>:3306/railway
```

**Option B - PlanetScale:**
```
DATABASE_URL=mysql://<user>:<password>@<region>.connect.psdb.cloud/prostar_db?sslaccept=strict
```

**Option C - Azure MySQL Flexible Server:**
```
DATABASE_URL=mysql://prostaradmin:ProStar2025DB!@prostar-mysql-server.mysql.database.azure.com:3306/prostar_db?ssl-mode=REQUIRED
```

**Status:** ⏳ Noch nicht eingerichtet  
**Empfehlung:** Railway MySQL (einfachste Integration)

---

### 3. **Production Site URL**

**Aktuell (DEV):**
```
SITE_URL=http://localhost:3000
```

**Production:**
```
SITE_URL=https://kurs.prostarmarketing.de
```

**Status:** ⏳ DNS muss konfiguriert werden  
**Verwendung:** Email-Links zu Access Keys, OAuth Redirects

---

### 4. **Stripe Live Keys (Optional)**

Falls Payments aktiviert werden sollen:

```
STRIPE_SECRET_KEY=sk_live_... (von Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_... (nach Webhook-Setup)
```

**Status:** ⏳ Optional - nur wenn Payment aktiv  
**Wichtig:** Erst nach kompletten Tests im Test-Mode aktivieren!

---

## 🔒 Optionale Services

### 1. **Google Analytics (Optional)**

```
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Status:** 🔘 Nicht konfiguriert  
**Verwendung:** Tracking von Page Views, User Behavior

---

### 2. **Sentry Error Tracking (Optional)**

```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Status:** 🔘 Nicht konfiguriert  
**Verwendung:** Monitoring von Production-Errors

---

## ❌ Entfernt / Ungenutzt

### 1. **Azure Hosting**

**Status:** ❌ Entfernt (7. Dezember 2025)  
**Grund:** Nie erfolgreich deployed, Railway ist bessere Option

**Aufgeräumt:**
- Git Remote entfernt: `azure: https://prostar-kurs.scm.azurewebsites.net`
- Azure Workflow gelöscht: `.github/workflows/azure-deploy.yml`
- Kommentierte Azure MySQL Connection aus .env entfernt

---

### 2. **OAuth / Forge API**

**Status:** ❌ Entfernt  
**Grund:** War Teil eines alten Templates, nicht im Projekt verwendet

**Entfernte Variablen:**
- `OAUTH_SERVER_URL`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `VITE_OAUTH_PORTAL_URL`

---

### 3. **Azure Storage**

**Status:** ❌ Entfernt  
**Grund:** Nicht verwendet

**Entfernte Variablen:**
- `AZURE_STORAGE_ACCOUNT`
- `AZURE_STORAGE_KEY`

---

### 4. **Diverse Dev-Flags**

**Status:** ❌ Bereinigt  
**Entfernte Variablen:**
- `MANUS_RUNTIME=off`
- `DEMO_MODE=auto`
- `DB_AUTO_SYNC=true`
- `TEST_EMAIL_ENABLED=false`
- `VITE_DEV_PORT=3004`
- `VITE_APP_ID=prostar_landing_page_dev`
- `VITE_APP_TITLE=ProStar - Landing Page`
- `VITE_APP_LOGO=/logo.png`
- `VITE_ANALYTICS_ENDPOINT=`

---

## 🚀 Deployment Checklist

### Pre-Deployment:

- [x] .env.example bereinigt (Duplikate entfernt)
- [x] Hardcoded API Key aus ChatWidget.tsx entfernt
- [x] .env aufgeräumt (ungenutzte Variablen entfernt)
- [x] Production JWT Secret generiert
- [ ] Production Database eingerichtet
- [ ] Environment Variables in Hosting-Platform konfiguriert
- [ ] DNS CNAME für kurs.prostarmarketing.de gesetzt

### Production Environment Variables:

```bash
# PFLICHT
NODE_ENV=production
PORT=3000
DATABASE_URL=<railway-mysql-url>
JWT_SECRET=b36423c866f8b1634ef8265a92e86bbc3397afcffc442e40956cdf654f609a19
EMAIL_USER=info@prostarmarketing.de
EMAIL_PASSWORD=pefn vhlu yeqm ghll
EMAIL_FROM=ProStar AI <info@prostarmarketing.de>
REPLY_TO_EMAIL=info@prostarmarketing.de
SITE_URL=https://kurs.prostarmarketing.de

# OPTIONAL
VITE_PROSTAR_AI_URL=https://ai-sales-agent-for-prostar-marketing-1013733494627.us-west1.run.app
VITE_PROSTAR_AI_KEY=AIzaSyDpxE_NS-6pmYrSuUvsv4D_NODVJ8CrjwQ
STRIPE_SECRET_KEY=sk_live_... (falls aktiviert)
STRIPE_WEBHOOK_SECRET=whsec_... (falls aktiviert)
VITE_ANALYTICS_ID=G-XXXXXXXXXX (falls aktiviert)
```

### Post-Deployment Tests:

- [ ] Health Check: `curl https://kurs.prostarmarketing.de/api/health`
- [ ] Registrierung mit echter Email testen
- [ ] Access Key Email erhalten
- [ ] Login mit Access Key erfolgreich
- [ ] Datenbank-Einträge verifizieren
- [ ] Chat-Widget funktioniert
- [ ] SSL-Zertifikat aktiv (HTTPS)

---

## 🔐 Sicherheits-Hinweise

1. **NIEMALS** echte Credentials in Git committen!
2. Für Production immer `.env` in `.gitignore` (✅ bereits konfiguriert)
3. Gmail App-Passwort regelmäßig rotieren
4. ProStar AI Key mit HTTP Referrer Restrictions schützen
5. Stripe Live-Keys erst nach vollständigen Tests aktivieren
6. Production JWT Secret sicher speichern (z.B. in Railway Variables)

---

## 📞 Zuständigkeiten

**Datenbank:** Jonas  
**Email (Gmail):** Jonas (info@prostarmarketing.de)  
**ProStar AI API:** Jonas (Google Cloud Project)  
**Domain (prostarmarketing.de):** Jonas (Google Domains / Squarespace)  
**Hosting:** TBD (Railway empfohlen)

---

## 🔄 Nächste Schritte

1. **Railway Account erstellen** (falls noch nicht vorhanden)
2. **MySQL Database provisionieren** (Railway MySQL Add-on)
3. **Environment Variables konfigurieren** (siehe Checklist oben)
4. **Git Deployment aktivieren** (Branch: master-checkpoint-v1.0.0)
5. **DNS CNAME setzen:** kurs → <railway-app-domain>
6. **SSL verifizieren** (automatisch durch Railway)
7. **Smoke Tests durchführen** (siehe Post-Deployment Tests)

---

**Status:** ✅ Alle Credentials dokumentiert & bereinigt  
**Bereit für Production Deployment:** ⏳ Nach Railway-Setup

