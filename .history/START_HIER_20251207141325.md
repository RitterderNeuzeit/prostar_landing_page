# 🚀 START HIER - Deployment Guide

## ⚡ Schnellstart (2 Befehle)

```bash
# 1. Status prüfen & Anleitung anzeigen
bash auto-setup.sh

# 2. Anweisungen befolgen (ENV vars + DNS)
# ... dann fertig! 🎉
```

---

## 📊 Aktuelle Situation

### ✅ Was funktioniert
- Code ist fehlerfrei (TypeScript: 0 Errors)
- Build erfolgreich
- JWT_SECRET generiert
- Vollständige Dokumentation erstellt
- Automation Scripts bereit

### ❌ Was noch fehlt
- **Railway Environment Variables** → 5 Minuten Arbeit
- **DNS CNAME Update** → 2 Minuten Arbeit + 60 Min Wartezeit

---

## 🎯 Deine Aufgaben

### 1️⃣ Railway Environment Variables setzen (5 Min)

```bash
# Datei öffnen
open railway-env-vars.txt

# Platzhalter ersetzen mit:
# - DATABASE_URL (Azure MySQL)
# - EMAIL_USER + EMAIL_PASSWORD (Gmail App-Passwort)
# - STRIPE Keys (dashboard.stripe.com)

# In Railway einfügen:
open https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
# → Variables Tab → Raw Editor → Alles einfügen → Save
```

**Wo bekomme ich die Werte?**
- Gmail App-Passwort: https://myaccount.google.com/apppasswords
- Stripe Test Keys: https://dashboard.stripe.com/test/apikeys
- Azure MySQL: Dein Azure Portal

### 2️⃣ DNS CNAME ändern (2 Min + Wartezeit)

```bash
# Google Domains öffnen
open https://domains.google.com

# Domain: prostarmarketing.de → DNS → CNAME 'kurs' ändern:
# Von: ext-sq.squarespace.com
# Zu: prostarlandingpage-1-production.up.railway.app

# DNS Propagation überwachen:
watch -n 30 'dig kurs.prostarmarketing.de CNAME +short'
```

### 3️⃣ Custom Domain hinzufügen (5 Min - NACH DNS-Propagation)

```bash
# Railway Dashboard
open https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619

# Settings → Domains → Custom Domain → Eingeben:
# kurs.prostarmarketing.de

# SSL wird automatisch generiert (5-10 Min)
```

---

## 📖 Dokumentation

| Datei | Beschreibung | Wann nutzen |
|-------|--------------|-------------|
| **ZUSAMMENFASSUNG.md** | Vollständige Übersicht | Erste Orientierung |
| **SOFORT_BEHEBEN.md** | Detaillierte Anleitung | Schritt-für-Schritt |
| **DEPLOYMENT_CHECKLIST.md** | Komplette Checkliste | Systematisch abarbeiten |
| **AKTUELLE_PROBLEME.md** | Problemübersicht | Troubleshooting |

---

## 🤖 Hilfreiche Scripts

```bash
# Status-Check (empfohlen!)
bash auto-setup.sh

# Deployment Health prüfen
bash check-deployment.sh

# ENV Variables generieren
bash generate-env-vars.sh

# DNS Update Guide
bash update-dns.sh
```

---

## 🆘 Bei Problemen

```bash
# 1. Detaillierte Anleitung lesen
cat SOFORT_BEHEBEN.md

# 2. Status prüfen
bash check-deployment.sh

# 3. Railway Logs prüfen
# Railway → Deployments → Deploy Logs

# 4. DNS prüfen
dig kurs.prostarmarketing.de CNAME +short
```

---

## ⏱️ Zeitplan

- **Railway ENV vars:** 5 Min (deine Arbeit)
- **Railway Re-Deploy:** 2-5 Min (automatisch)
- **DNS ändern:** 2 Min (deine Arbeit)
- **DNS Propagation:** 15-60 Min (automatisch)
- **Custom Domain:** 5 Min (deine Arbeit)
- **SSL Provisioning:** 5-10 Min (automatisch)

**Total:** ~60-90 Minuten (inkl. Wartezeiten)

---

## ✅ Erfolg prüfen

```bash
# Sollte alle Tests bestehen:
bash check-deployment.sh

# Browser-Test:
open https://kurs.prostarmarketing.de
```

---

**🎯 Los geht's:** `bash auto-setup.sh`
