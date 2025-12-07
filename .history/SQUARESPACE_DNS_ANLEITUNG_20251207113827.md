# 🚨 Squarespace DNS-Konfiguration für kurs.prostarmarketing.de

## ⚠️ WICHTIG: Du hast 2 Optionen!

Deine Domain `prostarmarketing.de` wird über **Google Domains Nameserver** verwaltet.
Du hast aktuell bei Squarespace eine Weiterleitung eingerichtet, aber wir brauchen **direktes DNS**.

---

## 🎯 OPTION 1: Google Domains DNS nutzen (EMPFOHLEN ✅)

**Vorteile**:
- ✅ Volle Kontrolle über DNS
- ✅ Schnellere Änderungen
- ✅ Funktioniert garantiert mit Railway

### Schritt-für-Schritt bei Google Domains:

1. **Gehe zu Google Domains**: https://domains.google.com
2. **Einloggen** mit deinem Google-Account
3. **Domain auswählen**: `prostarmarketing.de`
4. **Navigation**: Klicke auf **"DNS"** im linken Menü
5. **Custom Resource Records**:

   ```
   Füge NEUEN CNAME-Record hinzu:
   
   Name/Host:  kurs
   Type:       CNAME
   TTL:        1H (oder 3600)
   Data:       <DEINE-RAILWAY-URL>.up.railway.app
   
   Beispiel:
   kurs    CNAME    1H    prostar-production-abc123.up.railway.app
   ```

6. **Speichern** → Fertig!

### Railway URL herausfinden:

Du brauchst deine Railway-Deployment-URL. Die findest du hier:

```bash
# NACHDEM du Railway deployed hast:
1. Gehe zu railway.app
2. Öffne dein Projekt
3. Klicke auf dein Deployment
4. In "Settings" → "Domains" siehst du:
   "prostar-production-xyz123.up.railway.app"
   
Diese URL OHNE "https://" als CNAME eintragen!
```

---

## 🎯 OPTION 2: Squarespace DNS nutzen

**Nur wenn du Google Domains NICHT verwenden kannst!**

### Schritt-für-Schritt bei Squarespace:

1. **Gehe zu Squarespace**: https://account.squarespace.com
2. **Einloggen**
3. **Website auswählen**: `prostarmarketing.de`
4. **Navigation**: Settings → Domains → `prostarmarketing.de` → DNS Settings
5. **WICHTIG**: Du musst die **Custom DNS Records** konfigurieren

   ```
   CNAME-Record hinzufügen:
   
   Host:       kurs
   Type:       CNAME
   Priority:   - (leer lassen)
   Data:       <DEINE-RAILWAY-URL>.up.railway.app
   ```

6. **Speichern**

---

## ⚠️ WICHTIGER HINWEIS: Railway muss ZUERST deployed sein!

**DU KANNST DNS ERST KONFIGURIEREN, WENN RAILWAY LÄUFT!**

### Reihenfolge:

```
1. Railway Deployment ✅ (zuerst!)
   ↓
2. Railway URL notieren (z.B. prostar-xyz.up.railway.app)
   ↓
3. DNS CNAME einrichten (bei Google Domains oder Squarespace)
   ↓
4. 15-30 Min warten (DNS Propagation)
   ↓
5. Custom Domain in Railway hinzufügen (kurs.prostarmarketing.de)
   ↓
6. SSL wird automatisch generiert
   ↓
7. ✅ FERTIG!
```

---

## 🚀 SCHRITT 1: Railway Deployment (JETZT MACHEN!)

Bevor du DNS konfigurierst, musst du **Railway deployen**:

### A) Railway Account erstellen

1. Gehe zu: https://railway.app
2. **Sign up with GitHub** (empfohlen)
3. Authentifiziere dich

### B) Projekt erstellen

1. Klicke **"New Project"**
2. Wähle **"Deploy from GitHub repo"**
3. **Authorize GitHub** (wenn gefragt)
4. Wähle Repository: `AIHubcom/prostar_landing_page--1-`
5. Wähle Branch: `restore-complete-visuals-ui`

### C) Environment Variables setzen

**WICHTIG**: Ohne diese Variables startet die App nicht!

Klicke auf dein Projekt → **Variables** → **Raw Editor** und füge ein:

```env
# Database (Azure MySQL)
DATABASE_URL=mysql://username:password@server.mysql.database.azure.com:3306/database?ssl-mode=REQUIRED

# Authentication (generiere mit: openssl rand -hex 32)
JWT_SECRET=<generiere-einen-32-zeichen-secret>

# Server
NODE_ENV=production
PORT=3000

# URLs (Railway setzt RAILWAY_STATIC_URL automatisch)
SITE_URL=https://kurs.prostarmarketing.de
OAUTH_SERVER_URL=https://kurs.prostarmarketing.de

# Email (Gmail mit App-Passwort)
EMAIL_USER=deine-email@gmail.com
EMAIL_PASSWORD=<gmail-app-password>
EMAIL_FROM=ProStar Marketing <deine-email@gmail.com>

# Stripe (Test-Modus für jetzt)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Google OAuth
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
```

**Wo bekomme ich die Werte?**

1. **DATABASE_URL**: Hast du bereits (Azure MySQL Connection String)
2. **JWT_SECRET**: 
   ```bash
   # Im Terminal ausführen:
   openssl rand -hex 32
   # Ausgabe kopieren
   ```
3. **EMAIL_PASSWORD**: Gmail App-Passwort (siehe unten ⬇️)
4. **STRIPE Keys**: Stripe Dashboard → Developers → API Keys

### D) Gmail App-Passwort erstellen (für Email-Versand)

1. Gehe zu: https://myaccount.google.com/apppasswords
2. **App auswählen**: "Mail"
3. **Gerät auswählen**: "Other" → "ProStar Railway"
4. Klicke **"Generate"**
5. **Kopiere das 16-stellige Passwort** (z.B. `abcd efgh ijkl mnop`)
6. Verwende es als `EMAIL_PASSWORD` (OHNE Leerzeichen: `abcdefghijklmnop`)

### E) Deployment starten

1. Railway startet automatisch das Deployment
2. Warte 2-5 Minuten
3. **Status prüfen**: Deployment sollte **grün** werden

### F) Railway URL notieren

1. Klicke auf dein Deployment
2. In **Settings** → **Domains** siehst du:
   ```
   https://prostar-production-abc123.up.railway.app
   ```
3. **NOTIERE DIESE URL!** (brauchst du für DNS)

---

## 🔍 SCHRITT 2: DNS konfigurieren (NACHDEM Railway läuft!)

### Teste zuerst ob Railway funktioniert:

```bash
# Öffne im Browser:
https://prostar-production-abc123.up.railway.app

# Sollte deine Landing Page zeigen!
```

### Jetzt DNS einrichten:

**Bei Google Domains** (empfohlen):

1. https://domains.google.com
2. `prostarmarketing.de` → DNS
3. **Custom Resource Records**:
   ```
   Name: kurs
   Type: CNAME
   TTL:  1H
   Data: prostar-production-abc123.up.railway.app
   ```
4. **Wichtig**: Nur die Railway-Domain OHNE `https://` eintragen!

**ODER bei Squarespace**:

1. https://account.squarespace.com
2. `prostarmarketing.de` → Settings → Domains → DNS Settings
3. **Custom DNS Records**:
   ```
   Host: kurs
   Type: CNAME
   Data: prostar-production-abc123.up.railway.app
   ```

---

## 🕐 SCHRITT 3: DNS Propagation abwarten (15-60 Min.)

DNS-Änderungen brauchen Zeit!

### Prüfen mit:

```bash
# Im Terminal:
dig kurs.prostarmarketing.de CNAME +short

# Sollte zurückgeben:
# prostar-production-abc123.up.railway.app.
```

**Oder online**: https://dnschecker.org/#CNAME/kurs.prostarmarketing.de

Warte bis **mindestens 50% der Standorte** grün sind!

---

## 🔒 SCHRITT 4: Custom Domain in Railway hinzufügen

**ERST NACHDEM DNS propagiert ist!**

1. Gehe zu Railway → Dein Projekt
2. Klicke auf dein Deployment
3. **Settings** → **Domains**
4. Klicke **"Custom Domain"**
5. Gib ein: `kurs.prostarmarketing.de`
6. Klicke **"Add"**

Railway generiert jetzt automatisch ein **SSL-Zertifikat** (Let's Encrypt).

**Status prüfen**:
- ✅ Grünes Schloss → SSL aktiv, alles gut!
- ⏳ Orange Warnung → DNS noch nicht propagiert, warte noch
- ❌ Roter Fehler → DNS falsch konfiguriert, prüfe CNAME

---

## ✅ SCHRITT 5: Finale Tests

### A) HTTPS-Zugriff testen

Öffne im Browser: **https://kurs.prostarmarketing.de**

**Erwartetes Ergebnis**:
- ✅ Grünes Schloss (SSL aktiv)
- ✅ Landing Page lädt
- ✅ Keine Fehler in Browser-Console (F12)

### B) Funktionstest

- [ ] **Registrierung** funktioniert
- [ ] **Login** funktioniert
- [ ] **E-Mail** erhalten (Bestätigung)
- [ ] **Cookie** gesetzt (DevTools → Application → Cookies)
- [ ] **Kurs-Zugriff** nach Login
- [ ] **Mobile** responsive (Chrome DevTools → Toggle Device Toolbar)

### C) DNS-Test

```bash
# Im Terminal:
dig kurs.prostarmarketing.de

# Sollte zeigen:
# kurs.prostarmarketing.de. 3600 IN CNAME prostar-production-abc123.up.railway.app.
# prostar-production-abc123.up.railway.app. 300 IN A 104.x.x.x
```

---

## 🐛 Troubleshooting

### Problem 1: "Railway URL nicht gefunden"

**Lösung**: Du musst ZUERST Railway deployen!

```
1. Railway Account erstellen
2. Projekt erstellen (GitHub Repo verbinden)
3. Environment Variables setzen
4. Deployment abwarten (2-5 Min.)
5. DANN siehst du die Railway URL in Settings → Domains
```

### Problem 2: "DNS funktioniert nicht"

**Prüfe**:

```bash
# Ist CNAME gesetzt?
dig kurs.prostarmarketing.de CNAME +short

# Sollte Railway-Domain zurückgeben!
# Falls nicht: DNS-Einstellungen prüfen (Google Domains oder Squarespace)
```

**Häufiger Fehler**: CNAME zeigt noch auf `ext-sq.squarespace.com`

**Lösung**:
1. Bei Google Domains oder Squarespace: **Alten CNAME löschen**
2. **Neuen CNAME** auf Railway-Domain setzen
3. 30 Min warten

### Problem 3: "SSL-Zertifikat fehlt"

**Symptom**: Railway zeigt roten Fehler bei Custom Domain

**Lösung**:

1. **Warte 30-60 Min** nach DNS-Änderung
2. **DNS propagiert?** → Prüfe mit `dig` (siehe oben)
3. **CNAME korrekt?** → Muss auf Railway-Domain zeigen, NICHT auf IP!
4. Railway Domain **entfernen und neu hinzufügen**:
   - Settings → Domains → Custom Domain löschen
   - 5 Min warten
   - Domain neu hinzufügen

### Problem 4: "Squarespace zeigt immer noch eigene Seite"

**Symptom**: `kurs.prostarmarketing.de` lädt Squarespace-Content

**Lösung**: Du hast vermutlich eine **Squarespace Page** mit dieser URL!

1. **Bei Squarespace**: Settings → Domains
2. **Prüfe**: Gibt es eine Page mit URL `/kurs`?
3. **Lösche** diese Page ODER benenne sie um
4. **Wichtig**: Die Subdomain `kurs.prostarmarketing.de` darf NICHT in Squarespace als Page existieren!

---

## 📋 Quick Checklist

Bevor du startest, prüfe:

- [ ] Ich habe Zugriff auf **Google Domains** (Nameserver-Verwaltung)
  - ODER: Ich habe Zugriff auf **Squarespace DNS Settings**
- [ ] Ich habe **Azure MySQL Connection String** (DATABASE_URL)
- [ ] Ich habe **Gmail Account** für E-Mail-Versand
- [ ] Ich habe **Stripe Account** (Test-Modus reicht)
- [ ] Ich habe **GitHub Account** (für Railway)

---

## 🎯 Zusammenfassung: Was du JETZT tun musst

### 1️⃣ Railway Deployment (30 Min.)

```
→ railway.app → Sign up with GitHub
→ New Project → Deploy from GitHub
→ Repository: AIHubcom/prostar_landing_page--1-
→ Branch: restore-complete-visuals-ui
→ Variables setzen (siehe oben)
→ Deployment abwarten
→ Railway URL notieren: prostar-xyz.up.railway.app
```

### 2️⃣ DNS CNAME einrichten (5 Min.)

**Option A - Google Domains** (empfohlen):
```
→ domains.google.com
→ prostarmarketing.de → DNS
→ CNAME: kurs → prostar-xyz.up.railway.app
```

**Option B - Squarespace**:
```
→ account.squarespace.com
→ prostarmarketing.de → DNS Settings
→ CNAME: kurs → prostar-xyz.up.railway.app
```

### 3️⃣ Warten + Custom Domain (30 Min.)

```
→ 15-30 Min warten (DNS Propagation)
→ Railway → Settings → Domains → Custom Domain
→ kurs.prostarmarketing.de hinzufügen
→ SSL automatisch generiert
```

### 4️⃣ Testen (10 Min.)

```
→ https://kurs.prostarmarketing.de öffnen
→ Registrierung testen
→ Login testen
→ E-Mail erhalten prüfen
```

---

## 🆘 Hilfe benötigt?

**Wenn etwas nicht funktioniert:**

1. **Prüfe Railway Logs**:
   ```
   Railway → Dein Projekt → Deployments → Logs
   ```

2. **Prüfe DNS**:
   ```bash
   dig kurs.prostarmarketing.de CNAME +short
   ```

3. **Prüfe Browser Console**:
   ```
   F12 → Console → Siehe Fehler
   ```

4. **GitHub Issues**:
   ```
   https://github.com/AIHubcom/prostar_landing_page--1-/issues
   ```

---

**Los geht's! 🚀**

Fang mit **SCHRITT 1: Railway Deployment** an!
