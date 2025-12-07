# 🚨 Railway Deployment - Aktuelle Probleme & Lösungen

## 📊 STATUS ÜBERSICHT

| Komponente | Status | Aktion |
|------------|--------|--------|
| **Railway Deployment** | ❌ CRASHED | ENV Variables setzen |
| **DNS CNAME** | ❌ Falsch | Google Domains ändern |
| **Custom Domain** | ⏸️ Wartet | Nach DNS-Propagation |
| **SSL Zertifikat** | ⏸️ Wartet | Nach Custom Domain |
| **TypeScript Code** | ✅ OK | Keine Fehler |
| **Local Build** | ✅ OK | 0 Errors |

---

## 🎯 QUICK START (3 Schritte)

### Schritt 1: Environment Variables (5 Min)
```bash
# 1. Datei öffnen
open railway-env-vars.txt

# 2. Platzhalter ersetzen:
#    - DATABASE_URL (Azure MySQL)
#    - EMAIL_USER + EMAIL_PASSWORD (Gmail App-Passwort)
#    - STRIPE_* Keys (dashboard.stripe.com)

# 3. In Railway einfügen:
#    https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
#    → Variables Tab → Raw Editor → Einfügen → Save
```

### Schritt 2: DNS ändern (2 Min + 60 Min Wartezeit)
```bash
# 1. Google Domains öffnen
open https://domains.google.com

# 2. Domain: prostarmarketing.de → DNS
# 3. CNAME 'kurs' ändern:
#    Von: ext-sq.squarespace.com
#    Zu: prostarlandingpage-1-production.up.railway.app

# 4. Propagation überwachen:
watch -n 30 'dig kurs.prostarmarketing.de CNAME +short'
```

### Schritt 3: Custom Domain (5 Min)
```bash
# Nach DNS-Propagation:
# 1. Railway Dashboard öffnen
# 2. Settings → Domains → Custom Domain
# 3. Eingeben: kurs.prostarmarketing.de
# 4. SSL wird automatisch generiert (5-10 Min)
```

---

## 🔧 AUTOMATION SCRIPTS

### Status-Check ausführen
```bash
bash check-deployment.sh
```
Prüft:
- ✅ Railway App Health
- ✅ DNS CNAME Konfiguration
- ✅ Custom Domain Erreichbarkeit

### Auto-Setup ausführen
```bash
bash auto-setup.sh
```
Führt aus:
- ✅ TypeScript Check
- ✅ ENV Variables generieren
- ✅ Railway Status prüfen
- ✅ DNS Status prüfen
- ✅ Nächste Schritte anzeigen

### ENV Variables generieren
```bash
bash generate-env-vars.sh
```
Erstellt:
- ✅ Sicherer JWT_SECRET (64 Zeichen)
- ✅ railway-env-vars.txt Template
- ✅ Alle benötigten Variables

### DNS Update Guide
```bash
bash update-dns.sh
```
Zeigt:
- ✅ Aktueller DNS Status
- ✅ Schritt-für-Schritt Anleitung
- ✅ Live DNS Monitoring

---

## 📖 DOKUMENTATION

| Datei | Beschreibung |
|-------|--------------|
| **SOFORT_BEHEBEN.md** | 🔴 Detaillierte Schritt-für-Schritt Anleitung |
| **DEPLOYMENT_CHECKLIST.md** | ✅ Vollständige Checkliste mit Troubleshooting |
| **railway-env-vars.txt** | 🔑 ENV Variables Template (JWT_SECRET bereits generiert) |
| **check-deployment.sh** | 🔍 Status-Checker Script |
| **auto-setup.sh** | 🤖 Automatisches Setup |
| **generate-env-vars.sh** | 🔑 ENV Generator |
| **update-dns.sh** | 🌐 DNS Update Guide |

---

## ⚡ SCHNELLZUGRIFF

### Railway Dashboard
```bash
open https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
```

### Google Domains
```bash
open https://domains.google.com
```

### Gmail App-Passwort erstellen
```bash
open https://myaccount.google.com/apppasswords
```

### Stripe API Keys
```bash
# Test Keys:
open https://dashboard.stripe.com/test/apikeys

# Live Keys:
open https://dashboard.stripe.com/apikeys
```

---

## 🔍 AKTUELLER STATUS

### Railway Deployment
```bash
# Status: CRASHED (HTTP 502)
# Ursache: Fehlende Environment Variables
# Lösung: railway-env-vars.txt → Railway Variables Tab

curl -I https://prostarlandingpage-1-production.up.railway.app
# Erwartet: HTTP/2 502
# Nach Fix: HTTP/2 200
```

### DNS Konfiguration
```bash
# Aktuell:
dig kurs.prostarmarketing.de CNAME +short
# Zeigt: ext-sq.squarespace.com.

# Nach Änderung (Ziel):
# Zeigt: prostarlandingpage-1-production.up.railway.app.
```

---

## ❌ PROBLEME & LÖSUNGEN

### Problem 1: Railway CRASHED

**Symptome:**
- HTTP 502 "Application failed to respond"
- Railway Deployment Status: CRASHED
- Logs zeigen fehlende Environment Variables

**Lösung:**
1. `railway-env-vars.txt` öffnen
2. Alle `<PLATZHALTER>` ersetzen:
   - `DATABASE_URL`: Azure MySQL Connection String
   - `EMAIL_USER`: Gmail-Adresse
   - `EMAIL_PASSWORD`: Gmail App-Passwort (16 Zeichen)
   - `STRIPE_SECRET_KEY`: sk_test_... oder sk_live_...
   - `STRIPE_WEBHOOK_SECRET`: whsec_...
   - `STRIPE_PUBLISHABLE_KEY`: pk_test_... oder pk_live_...
3. Railway Dashboard → Variables Tab → Raw Editor
4. Gesamten Inhalt einfügen → Save
5. Warte 2-5 Minuten auf Re-Deployment

**Verifikation:**
```bash
bash check-deployment.sh
# Sollte zeigen: ✅ Railway App läuft (HTTP 200)
```

### Problem 2: DNS zeigt auf Squarespace

**Symptome:**
- `dig kurs.prostarmarketing.de CNAME +short` zeigt `ext-sq.squarespace.com`
- Custom Domain nicht erreichbar
- Railway kann kein SSL-Zertifikat generieren

**Lösung:**
1. https://domains.google.com öffnen
2. Domain `prostarmarketing.de` auswählen
3. DNS → Custom resource records
4. CNAME Eintrag `kurs` bearbeiten:
   - **Von:** `ext-sq.squarespace.com`
   - **Zu:** `prostarlandingpage-1-production.up.railway.app`
5. Save
6. Warte 15-60 Minuten auf DNS-Propagation

**Verifikation:**
```bash
# Alle 5 Minuten prüfen:
dig kurs.prostarmarketing.de CNAME +short

# Sollte zeigen:
# prostarlandingpage-1-production.up.railway.app.
```

**DNS Propagation global prüfen:**
```bash
open https://dnschecker.org/#CNAME/kurs.prostarmarketing.de
```

---

## ✅ ERFOLGS-KRITERIEN

### Deployment ist erfolgreich wenn:

```bash
# 1. Railway App läuft
curl -I https://prostarlandingpage-1-production.up.railway.app
# Zeigt: HTTP/2 200

# 2. DNS zeigt auf Railway
dig kurs.prostarmarketing.de CNAME +short
# Zeigt: prostarlandingpage-1-production.up.railway.app.

# 3. Custom Domain erreichbar
curl -I https://kurs.prostarmarketing.de
# Zeigt: HTTP/2 200

# 4. SSL aktiv
curl -v https://kurs.prostarmarketing.de 2>&1 | grep -i "ssl"
# Zeigt: SSL certificate verify ok

# 5. Alle Checks grün
bash check-deployment.sh
# Zeigt: 🔧 Gefundene Probleme: 0
```

---

## ⏱️ ZEITPLAN

| Phase | Dauer | Aktion |
|-------|-------|--------|
| **Vorbereitung** | 5 Min | Credentials sammeln (DB, Email, Stripe) |
| **ENV Variables** | 5 Min | railway-env-vars.txt → Railway |
| **Railway Re-Deploy** | 2-5 Min | Automatisch nach Variables-Save |
| **DNS Änderung** | 2 Min | Google Domains CNAME ändern |
| **DNS Propagation** | 15-60 Min | ⏳ Wartezeit (nicht beeinflussbar) |
| **Custom Domain** | 5 Min | Railway → Custom Domain hinzufügen |
| **SSL Provisioning** | 5-10 Min | Let's Encrypt automatisch |
| **Funktionstest** | 10 Min | Registrierung, Login, Checkout testen |
| **GESAMT** | ~60-90 Min | Inkl. Wartezeiten |

---

## 🎯 NÄCHSTER SCHRITT

### Du bist hier: 🟢 START

```
🟢 START
   ↓
🔴 Schritt 1: Railway ENV Variables setzen (5 Min)
   → open railway-env-vars.txt
   → Platzhalter ersetzen
   → Railway Dashboard → Variables → Save
   ↓
🟡 Schritt 2: DNS CNAME ändern (2 Min + Wartezeit)
   → Google Domains öffnen
   → CNAME 'kurs' ändern
   → 15-60 Min Propagation warten
   ↓
🟢 Schritt 3: Custom Domain in Railway (5 Min)
   → Settings → Domains → Custom Domain
   → kurs.prostarmarketing.de hinzufügen
   → SSL warten (5-10 Min)
   ↓
✅ FERTIG: https://kurs.prostarmarketing.de läuft!
```

---

## 📞 BENÖTIGTE CREDENTIALS

### Bevor du startest, sammle:

- [ ] **Azure MySQL:**
  - Server: `___.mysql.database.azure.com`
  - Username: `___`
  - Password: `___`
  - Database: `___`

- [ ] **Gmail:**
  - Email: `___@gmail.com`
  - App-Passwort: `___` (erstellen: https://myaccount.google.com/apppasswords)

- [ ] **Stripe:**
  - Modus: Test ☐ oder Live ☐
  - Secret Key: `sk_test_...` oder `sk_live_...`
  - Publishable Key: `pk_test_...` oder `pk_live_...`
  - Webhook Secret: `whsec_...`

- [ ] **Google Domains:**
  - Login: `___`
  - Passwort: `___`

---

## 🆘 SUPPORT

### Bei Problemen:

1. **Status prüfen:**
   ```bash
   bash check-deployment.sh
   ```

2. **Railway Logs prüfen:**
   ```
   Railway → Deployments → Letztes Deployment → Deploy Logs
   ```

3. **DNS Status prüfen:**
   ```bash
   dig kurs.prostarmarketing.de CNAME +short
   ```

4. **Detaillierte Anleitung:**
   ```bash
   cat SOFORT_BEHEBEN.md
   ```

5. **GitHub Issues:**
   ```
   https://github.com/AIHubcom/prostar_landing_page--1-/issues
   ```

---

## 📝 CHANGELOG

**7. Dez 2025 - 13:00 UTC**
- ✅ Architektur korrigiert (Iframe → DNS CNAME)
- ✅ CORS, Cookies, Security Headers angepasst
- ✅ Railway Projekt identifiziert: `dependable-youthfulness`
- ✅ Automation Scripts erstellt (4 Scripts)
- ✅ Dokumentation erstellt (3 Guides)
- ✅ JWT_SECRET generiert
- ❌ Railway Deployment: CRASHED (ENV vars fehlen)
- ❌ DNS: zeigt noch auf Squarespace

---

**Zuletzt aktualisiert:** 7. Dez 2025, 13:00 UTC  
**Nächster Check:** `bash auto-setup.sh`
