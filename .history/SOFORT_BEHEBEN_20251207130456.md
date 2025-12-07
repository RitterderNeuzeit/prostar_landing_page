# 🚨 SOFORT-ANLEITUNG: Probleme beheben

## ⚡ Status: 2 Kritische Probleme

### ❌ Problem 1: Railway Deployment CRASHED
**Ursache:** Fehlende Environment Variables  
**Lösung:** 5 Minuten  
**Status:** ENV Template bereit, muss in Railway eingefügt werden

### ❌ Problem 2: DNS zeigt auf Squarespace
**Ursache:** CNAME noch nicht aktualisiert  
**Lösung:** 60-90 Minuten (inkl. Propagation)  
**Status:** Manuelle Änderung bei Google Domains erforderlich

---

## 🎯 SCHRITT 1: Railway Environment Variables (5 Min)

### Was du brauchst:
- [ ] Azure MySQL Connection String
- [ ] Gmail-Account + App-Passwort
- [ ] Stripe API Keys (Test oder Live)

### Genaue Schritte:

**1.1 Railway-ENV-Datei öffnen:**
```bash
open railway-env-vars.txt
```

**1.2 Platzhalter ersetzen:**

```env
# DATABASE_URL ersetzen:
# Von: mysql://<USERNAME>:<PASSWORD>@<SERVER>...
# Zu: mysql://admin:DeinPasswort@prostar-db.mysql.database.azure.com:3306/prostar?ssl-mode=REQUIRED

# EMAIL ersetzen:
# Von: <DEINE-EMAIL>@gmail.com
# Zu: kontakt@prostarmarketing.de

# Von: <GMAIL-APP-PASSWORT-16-ZEICHEN>
# Zu: [Dein 16-stelliges App-Passwort ohne Leerzeichen]

# STRIPE ersetzen:
# Von: sk_test_<DEIN-STRIPE-SECRET-KEY>
# Zu: sk_test_51abcdefgh... [Dein echter Key]

# Von: whsec_<DEIN-WEBHOOK-SECRET>
# Zu: whsec_xyz123... [Dein echter Webhook Secret]

# Von: pk_test_<DEIN-PUBLISHABLE-KEY>
# Zu: pk_test_abc123... [Dein echter Publishable Key]
```

**1.3 Gmail App-Passwort erstellen** (falls noch nicht vorhanden):
```
1. Gehe zu: https://myaccount.google.com/apppasswords
2. Name eingeben: "ProStar Railway"
3. "Erstellen" klicken
4. 16-stelliges Passwort kopieren (z.B.: "abcd efgh ijkl mnop")
5. Leerzeichen entfernen → "abcdefghijklmnop"
6. In railway-env-vars.txt einfügen
```

**1.4 Stripe Keys holen:**
```
Test Keys (Sandbox):
https://dashboard.stripe.com/test/apikeys

Live Keys (Produktion):
https://dashboard.stripe.com/apikeys

Du brauchst:
- Secret Key (sk_test_... oder sk_live_...)
- Publishable Key (pk_test_... oder pk_live_...)
```

**1.5 Stripe Webhook Secret erstellen:**
```
1. https://dashboard.stripe.com/test/webhooks
2. "Add endpoint" klicken
3. URL: https://prostarlandingpage-1-production.up.railway.app/api/stripe/webhook
4. Events auswählen:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
5. "Add endpoint" klicken
6. "Signing secret" anzeigen und kopieren (whsec_...)
```

**1.6 In Railway einfügen:**
```
1. Railway öffnen:
   https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619

2. Service "prostar_landing_page--1-" anklicken

3. "Variables" Tab öffnen

4. "Raw Editor" klicken (oben rechts)

5. GESAMTEN Inhalt aus railway-env-vars.txt kopieren

6. In Raw Editor einfügen

7. "Save" klicken

8. Warte 2-3 Minuten → Railway deployt automatisch neu
```

**1.7 Deployment überwachen:**
```
Railway → Deployments Tab

Status sollte wechseln:
❌ CRASHED → 🟡 BUILDING → 🟡 DEPLOYING → ✅ ACTIVE

Wenn CRASHED bleibt:
→ "Deploy Logs" anklicken und Fehler prüfen
```

---

## 🎯 SCHRITT 2: DNS CNAME ändern (2 Min + 60 Min Wartezeit)

### Genaue Schritte:

**2.1 Google Domains öffnen:**
```
https://domains.google.com
```

**2.2 Domain auswählen:**
```
1. In der Liste: "prostarmarketing.de" anklicken
2. Im Menü: "DNS" klicken
```

**2.3 CNAME-Eintrag finden:**
```
Suche in "Custom resource records":

Name: kurs
Type: CNAME
Data: ext-sq.squarespace.com
```

**2.4 Eintrag bearbeiten:**
```
1. Auf "kurs" Zeile klicken (oder Edit/Bearbeiten)

2. "Data" Feld ändern:
   Von: ext-sq.squarespace.com
   Zu: prostarlandingpage-1-production.up.railway.app

3. TTL: 3600 (1 Stunde) - belassen

4. "Save" klicken
```

**2.5 Bestätigung:**
```
Nach dem Speichern sollte stehen:

Name: kurs
Type: CNAME
Data: prostarlandingpage-1-production.up.railway.app
TTL: 3600
```

**2.6 DNS Propagation überwachen:**
```bash
# Alle 5 Minuten ausführen:
dig kurs.prostarmarketing.de CNAME +short

# Warte bis Output zeigt:
# prostarlandingpage-1-production.up.railway.app.

# Global Check:
# https://dnschecker.org/#CNAME/kurs.prostarmarketing.de
```

**Wartezeit:** Normalerweise 15-60 Minuten, manchmal bis 2 Stunden

---

## 🎯 SCHRITT 3: Custom Domain in Railway (5 Min)

⚠️ **WICHTIG:** Erst starten wenn DNS propagiert ist!

### Voraussetzung prüfen:
```bash
dig kurs.prostarmarketing.de CNAME +short

# Muss zurückgeben:
# prostarlandingpage-1-production.up.railway.app.
```

### Genaue Schritte:

**3.1 Railway Dashboard:**
```
https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
```

**3.2 Custom Domain hinzufügen:**
```
1. Service "prostar_landing_page--1-" öffnen

2. "Settings" Tab

3. Runter scrollen zu "Domains"

4. "Custom Domain" klicken

5. Eingeben: kurs.prostarmarketing.de

6. "Add" klicken
```

**3.3 SSL-Zertifikat warten:**
```
Railway generiert automatisch Let's Encrypt SSL.

Status-Anzeige in Railway:
✅ Grünes Häkchen → SSL aktiv (Ready!)
🟡 Orange "Provisioning" → Warten (5-10 Min)
❌ Roter Fehler → DNS falsch oder nicht propagiert

Wenn Fehler:
1. DNS nochmal prüfen mit: dig kurs.prostarmarketing.de CNAME +short
2. Warte weitere 30 Min
3. Custom Domain löschen und neu hinzufügen
```

**3.4 Finale Validierung:**
```bash
# HTTPS Test:
curl -I https://kurs.prostarmarketing.de

# Sollte zurückgeben:
# HTTP/2 200
# server: railway-edge

# Im Browser:
open https://kurs.prostarmarketing.de
```

---

## 🎯 SCHRITT 4: Funktionstest (10 Min)

### Checkliste:

**4.1 Basis-Funktionen:**
```
Browser: https://kurs.prostarmarketing.de

- [ ] Seite lädt ohne 502 Error
- [ ] SSL aktiv (grünes Schloss in Browser)
- [ ] Keine Console-Errors (F12 → Console)
- [ ] Bilder laden
- [ ] CSS funktioniert
```

**4.2 Registrierung:**
```
1. Registrierung-Formular öffnen
2. Email eingeben: test@example.com
3. Passwort: Test1234!
4. Absenden
5. Prüfen:
   - [ ] Erfolgs-Meldung
   - [ ] Bestätigungs-Email erhalten
   - [ ] Email-Link funktioniert
```

**4.3 Login:**
```
1. Login-Seite öffnen
2. Email + Passwort eingeben
3. Einloggen
4. Prüfen:
   - [ ] Erfolgreicher Login
   - [ ] Cookie gesetzt (DevTools → Application → Cookies)
   - [ ] Dashboard erreichbar
   - [ ] Kurs-Inhalte sichtbar
```

**4.4 Stripe-Integration:**
```
1. Checkout starten
2. Test-Kreditkarte: 4242 4242 4242 4242
3. Datum: 12/34, CVC: 123
4. Bezahlung durchführen
5. Prüfen:
   - [ ] Zahlung erfolgreich
   - [ ] Webhook empfangen
   - [ ] Zugriff gewährt
```

---

## 🔧 TROUBLESHOOTING

### Problem: Railway bleibt bei CRASHED

**Fehlersuche:**
```bash
# Railway Logs prüfen:
Railway → Deployments → Letztes Deployment → "Deploy Logs"

Häufige Fehler:

1. "Cannot connect to database"
   → DATABASE_URL falsch
   → Azure MySQL Firewall prüfen (Railway IP erlauben)

2. "Missing JWT_SECRET"
   → Variables Tab prüfen
   → JWT_SECRET muss 64 Zeichen lang sein

3. "Port 3000 already in use"
   → PORT=3000 in Variables setzen

4. "Email authentication failed"
   → EMAIL_PASSWORD prüfen (App-Passwort, keine Leerzeichen)
   → Gmail "Less secure app access" aktiviert?
```

### Problem: DNS ändert sich nicht

**Lösungen:**
```bash
1. DNS-Cache leeren (Mac):
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder

2. Google Domains nochmal prüfen:
   - Änderung wirklich gespeichert?
   - Tippfehler in Railway-URL?
   - Richtiges Domain ausgewählt (prostarmarketing.de)?

3. Alternative DNS-Server testen:
   dig @8.8.8.8 kurs.prostarmarketing.de CNAME +short
   dig @1.1.1.1 kurs.prostarmarketing.de CNAME +short

4. TTL abwarten:
   - Alter Eintrag hatte 3600 Sek (1 Std) TTL
   - Warte mindestens 1 Stunde nach Änderung
```

### Problem: SSL-Zertifikat wird nicht generiert

**Lösungen:**
```bash
1. DNS MUSS auf Railway zeigen:
   dig kurs.prostarmarketing.de CNAME +short
   # Muss Railway-URL zeigen!

2. Warte 30-60 Min nach DNS-Änderung

3. Custom Domain neu hinzufügen:
   Railway → Settings → Domains
   → Custom Domain löschen
   → 5 Min warten
   → Custom Domain neu hinzufügen

4. Railway Support:
   https://railway.app/help
```

---

## ✅ ERFOLGS-KRITERIEN

**Alles funktioniert wenn:**

```bash
✅ Railway Deployment Status: ACTIVE (grün)
✅ Railway App antwortet: HTTP 200
✅ DNS CNAME: zeigt auf Railway
✅ Custom Domain: SSL aktiv (grünes Schloss)
✅ https://kurs.prostarmarketing.de lädt
✅ Registrierung funktioniert
✅ Login funktioniert
✅ Emails werden versendet
✅ Stripe-Checkout funktioniert
```

**Quick Check:**
```bash
bash check-deployment.sh

# Sollte zeigen:
# ✅ Alle Tests bestanden
# 🔧 Gefundene Probleme: 0
```

---

## 📞 BENÖTIGTE CREDENTIALS

### Sammle diese Informationen VOR dem Start:

**1. Azure MySQL:**
```
Server: ___.mysql.database.azure.com
Username: ___
Password: ___
Database: ___
```

**2. Gmail:**
```
Email: ___@gmail.com
App-Passwort: ___ (16 Zeichen, erstellen unter myaccount.google.com/apppasswords)
```

**3. Stripe:**
```
Modus: [ ] Test [ ] Live

Secret Key: sk_test_... oder sk_live_...
Publishable Key: pk_test_... oder pk_live_...
Webhook Secret: whsec_...
```

**4. Google Domains Login:**
```
Account: ___
Passwort: ___
```

---

## ⏱️ ZEITPLAN

**Gesamtdauer:** 90-120 Minuten

- Schritt 1 (ENV vars): 5-10 Min
- Railway Re-Deploy: 2-5 Min (automatisch)
- Schritt 2 (DNS): 2 Min + 60 Min Wartezeit
- Schritt 3 (Custom Domain): 5 Min + 10 Min SSL
- Schritt 4 (Tests): 10-15 Min

**Parallele Ausführung:**
- Schritt 1 → Warte auf Deployment
- Während Deployment: Schritt 2 (DNS ändern)
- Während DNS-Propagation: Kaffee trinken ☕
- Nach DNS: Schritt 3 + 4

---

**Zuletzt aktualisiert:** 7. Dez 2025
**Nächster Check:** `bash check-deployment.sh`
