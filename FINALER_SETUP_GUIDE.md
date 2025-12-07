# 🎯 FINALER SETUP-STATUS & NÄCHSTE SCHRITTE

**Datum**: 7. Dezember 2025, 12:45 UTC  
**Railway Domain**: prostarlandingpage-1-production.up.railway.app

---

## 📊 AKTUELLER STATUS

### ✅ Was FUNKTIONIERT:
- ✅ Railway Projekt erstellt: `dependable-youthfulness`
- ✅ Service deployed: `prostar_landing_page--1-`
- ✅ Railway Domain generiert: `prostarlandingpage-1-production.up.railway.app`
- ✅ SSL-Zertifikat für kurs.prostarmarketing.de vorhanden (Let's Encrypt)

### ❌ Was NOCH NICHT funktioniert:
- ❌ **Railway App crashed** (502 Bad Gateway) → Environment Variables fehlen
- ❌ **DNS zeigt auf Squarespace** → Muss auf Railway geändert werden

---

## 🚀 TO-DO: 2 EINFACHE SCHRITTE

### **SCHRITT 1: Railway App fixen (5 Min)**

Das Deployment ist crashed weil Environment Variables fehlen!

```
1. Öffne: https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619

2. Klicke auf Service "prostar_landing_page--1-"

3. Tab "Variables" → Raw Editor

4. Kopiere ALLE diese Variablen und füge sie ein:
```

```env
# Database (Azure MySQL)
DATABASE_URL=mysql://username:password@server.mysql.database.azure.com:3306/dbname?ssl-mode=REQUIRED

# Authentication
JWT_SECRET=<generiere mit: openssl rand -hex 32>
NODE_ENV=production
PORT=3000

# URLs
SITE_URL=https://kurs.prostarmarketing.de
OAUTH_SERVER_URL=https://kurs.prostarmarketing.de

# Email (Gmail App Password)
EMAIL_USER=deine-email@gmail.com
EMAIL_PASSWORD=dein-gmail-app-passwort
EMAIL_FROM=ProStar Marketing <deine-email@gmail.com>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```
5. Klicke "Save"

6. Railway deployt automatisch neu (2-3 Min)

7. Warte bis Status "Active" wird

8. Teste: https://prostarlandingpage-1-production.up.railway.app
   (sollte Landing Page zeigen)
```

---

### **SCHRITT 2: DNS auf Railway umleiten (10 Min)**

**Nachdem Railway App läuft (Status: Active):**

```
1. Öffne: https://domains.google.com

2. Wähle Domain: prostarmarketing.de

3. Klicke: DNS (linke Seite)

4. Scrolle zu: "Custom resource records"

5. FINDE Eintrag:
   Name:  kurs
   Type:  CNAME
   Data:  ext-sq.squarespace.com  ← MUSS WEG!

6. Klicke: Edit (Stift-Symbol)

7. ÄNDERE "Data" zu:
   prostarlandingpage-1-production.up.railway.app

8. TTL: 1H (oder Auto)

9. Klicke: SPEICHERN

10. Warte 15-30 Minuten (DNS Propagation)
```

---

### **SCHRITT 3: Custom Domain in Railway (5 Min)**

**Nachdem DNS propagiert ist (30 Min gewartet):**

```
1. Railway Dashboard → Service → Settings → Domains

2. Klicke "Custom Domain"

3. Eingeben: kurs.prostarmarketing.de

4. Klicke "Add"

5. Railway generiert automatisch SSL-Zertifikat (2-5 Min)

6. Status wird grün ✅ → FERTIG!
```

---

## 🔍 MONITORING & TESTS

### Automatisches Monitoring:

```bash
# Im Terminal ausführen:
bash monitor-deployment.sh

# Das Script prüft automatisch:
# - DNS CNAME Status
# - Railway App Status
# - Custom Domain Status
# - SSL-Zertifikat Status
```

### Manuelle Tests:

```bash
# 1. DNS CNAME prüfen
dig kurs.prostarmarketing.de CNAME +short
# Sollte zeigen: prostarlandingpage-1-production.up.railway.app.

# 2. Railway App testen
curl -I https://prostarlandingpage-1-production.up.railway.app
# Sollte zeigen: HTTP/2 200

# 3. Custom Domain testen (nach DNS + Custom Domain Setup)
curl -I https://kurs.prostarmarketing.de
# Sollte zeigen: HTTP/2 200
```

---

## 📋 CREDENTIALS ERSTELLEN

### JWT_SECRET generieren:

```bash
openssl rand -hex 32
# Ausgabe kopieren und als JWT_SECRET in Railway eintragen
```

### Gmail App-Passwort:

```
1. https://myaccount.google.com/apppasswords
2. App: Mail
3. Gerät: Other → "ProStar Railway"
4. Generieren
5. 16-stelliges Passwort kopieren (ohne Leerzeichen)
6. Als EMAIL_PASSWORD in Railway eintragen
```

### Stripe Keys:

```
1. https://dashboard.stripe.com/test/apikeys
2. Secret Key: sk_test_...
3. Publishable Key: pk_test_...
4. Webhook Secret:
   - Stripe → Developers → Webhooks
   - Add endpoint: https://prostarlandingpage-1-production.up.railway.app/api/stripe/webhook
   - Events: checkout.session.completed, payment_intent.succeeded
   - Signing secret: whsec_...
```

---

## 🐛 TROUBLESHOOTING

### Problem: Railway App bleibt crashed

**Symptom**: Nach Variables setzen immer noch 502 Error

**Lösung**:
```
1. Railway → Deployments → Neuestes Deployment
2. Klicke auf Deployment → "Deploy Logs"
3. Suche nach Fehler-Zeilen:
   - "Cannot connect to database" → DATABASE_URL prüfen
   - "Missing environment variable" → Alle Variables gesetzt?
   - "Port already in use" → PORT=3000 setzen
4. Kopiere Fehler und frage mich!
```

### Problem: DNS ändert sich nicht

**Symptom**: Auch nach 1 Stunde zeigt `dig` noch auf Squarespace

**Lösung**:
```bash
# DNS Cache leeren
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Erneut testen
dig kurs.prostarmarketing.de CNAME +short

# Online prüfen (mehrere Standorte):
# https://dnschecker.org/#CNAME/kurs.prostarmarketing.de
```

### Problem: Custom Domain SSL-Fehler

**Symptom**: Railway zeigt roten Fehler bei Custom Domain

**Lösung**:
```
1. DNS muss ZUERST propagiert sein!
2. Prüfe: dig kurs.prostarmarketing.de CNAME +short
3. Falls falsch: Warte länger (bis 60 Min)
4. Falls richtig aber Fehler:
   - Custom Domain in Railway löschen
   - 5 Min warten
   - Custom Domain neu hinzufügen
```

---

## ✅ SUCCESS CHECKLIST

Nach Abschluss aller Schritte:

- [ ] Railway App Status: **Active** (nicht Crashed)
- [ ] https://prostarlandingpage-1-production.up.railway.app lädt Landing Page
- [ ] DNS CNAME zeigt auf Railway: `dig kurs.prostarmarketing.de CNAME +short`
- [ ] Custom Domain in Railway hinzugefügt
- [ ] SSL-Status in Railway: ✅ Grün
- [ ] https://kurs.prostarmarketing.de lädt Landing Page
- [ ] Grünes Schloss im Browser (SSL aktiv)
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] E-Mail-Versand funktioniert
- [ ] Kurs-Zugriff nach Login
- [ ] Mobile responsive

---

## 🆘 HILFE BENÖTIGT?

**Wenn etwas nicht klappt:**

1. **Führe Monitoring-Script aus**:
   ```bash
   bash monitor-deployment.sh
   ```

2. **Kopiere die Ausgabe** und sage mir was nicht funktioniert

3. **Railway Deploy Logs** (bei 502 Error):
   ```
   Railway → Deployments → Neuestes → Deploy Logs
   → Kopiere letzte 20 Zeilen
   ```

---

## 📊 ZEITPLAN

```
⏱️  SCHRITT 1: Railway Variables setzen → 5 Min
    ↓
    Warte auf Deployment → 2-3 Min
    ↓
⏱️  SCHRITT 2: DNS CNAME ändern → 5 Min
    ↓
    Warte auf DNS Propagation → 15-30 Min
    ↓
⏱️  SCHRITT 3: Custom Domain in Railway → 5 Min
    ↓
    SSL-Generierung → 2-5 Min
    ↓
✅  FERTIG! App ist LIVE!
```

**Gesamt**: ~45-60 Minuten (inkl. Wartezeiten)

---

## 🎯 ZUSAMMENFASSUNG

**Was du JETZT tun musst (in dieser Reihenfolge):**

1. ✅ Railway Variables setzen (5 Min)
2. ⏳ Warten bis Deployment "Active" (2-3 Min)
3. ✅ DNS CNAME ändern bei Google Domains (5 Min)
4. ⏳ Warten auf DNS Propagation (30 Min)
5. ✅ Custom Domain in Railway hinzufügen (5 Min)
6. 🎉 FERTIG!

**Monitoring**: `bash monitor-deployment.sh`

---

**Los geht's! 🚀**

Fang mit Schritt 1 an: Railway Variables setzen!
