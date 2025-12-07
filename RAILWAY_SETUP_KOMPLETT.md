# 🚀 Railway Deployment - Komplette Anleitung

## 📊 AKTUELLER STATUS (7. Dez 2025)

```
✅ Railway Projekt erstellt: "zoological-integrity"
✅ Service erstellt: "prostar_landing_page--1-"
✅ Project ID: 42c11096-6fbe-409c-87a5-fa507ccb586a
✅ Service ID: bae02d32-b261-42cb-b189-623e02ae3e2e
✅ Environment: production (7869586c-5a0f-45a1-b09a-253dd1621f16)

❌ KEIN aktives Deployment gefunden
❌ Keine Railway-Domain verfügbar
```

**Problem**: Service ist erstellt, aber nicht deployed!

---

## 🎯 SCHRITT-FÜR-SCHRITT: Was du JETZT tun musst

### **1. Railway Dashboard öffnen**

Gehe zu: https://railway.app/project/42c11096-6fbe-409c-87a5-fa507ccb586a

---

### **2. GitHub-Repository verbinden**

#### Prüfe zuerst: Ist GitHub schon verbunden?

Klicke auf deinen Service **"prostar_landing_page--1-"**

**Siehst du:**
- ✅ "Connected to GitHub" → Gut, weiter zu Schritt 3
- ❌ "Connect GitHub Repository" → Mache folgendes:

#### GitHub verbinden:

```
1. Klicke "Settings" (oben rechts im Service)
2. Tab "Service" → Section "Source"
3. Klicke "Connect Repo"
4. Wähle: "AIHubcom/prostar_landing_page--1-"
5. Branch: "restore-complete-visuals-ui"
6. Klicke "Connect"
```

**Railway wird SOFORT ein Deployment starten!**

---

### **3. Environment Variables setzen**

**WICHTIG**: Deployment wird fehlschlagen ohne diese!

```
1. Im Service-View: Klicke "Variables" Tab
2. Klicke "Raw Editor" (oben rechts)
3. Kopiere ALLE diese Variablen:
```

```env
# Database
DATABASE_URL=mysql://dein-user:dein-passwort@server.mysql.database.azure.com:3306/dbname?ssl-mode=REQUIRED

# Authentication
JWT_SECRET=generiere_mit_openssl_rand_hex_32
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

**4. Klicke "Save"**

**Railway wird automatisch neu deployen!**

---

### **4. Deployment beobachten**

```
1. Klicke "Deployments" Tab
2. Siehst du ein aktives Deployment?
3. Status sollte ändern: "Building" → "Deploying" → "Active"
```

**Build-Zeit**: 2-5 Minuten

**Wenn Fehler auftreten**:
- Klicke auf das Deployment
- Scrolle zu "Build Logs" und "Deploy Logs"
- Kopiere Fehler hierher, ich helfe dir!

---

### **5. Railway Domain generieren**

**NACHDEM Deployment erfolgreich ist (Status: Active)**:

```
1. Klicke "Settings" Tab
2. Links: "Domains"
3. Klicke "Generate Domain"
4. Railway erstellt automatisch:
   zoological-integrity-production-abc123.up.railway.app
5. NOTIERE DIESE URL!
```

**ODER**: Railway generiert die Domain automatisch beim ersten erfolgreichen Deployment.

---

### **6. Teste die Railway-URL**

Öffne im Browser:
```
https://zoological-integrity-production-xyz.up.railway.app
```

**Erwartetes Ergebnis**:
- ✅ Landing Page lädt
- ✅ Keine Fehler
- ✅ SSL aktiv (grünes Schloss)

---

## 🔧 NACH ERFOLGREICHEM DEPLOYMENT

### **7. DNS CNAME einrichten**

**Sobald du die Railway-URL hast** (z.B. `zoological-integrity-production-abc123.up.railway.app`):

#### Bei Google Domains:

```
1. https://domains.google.com
2. prostarmarketing.de → DNS
3. Custom resource records
4. BEARBEITE den Eintrag:
   
   VORHER:
   Name: kurs
   Type: CNAME
   Data: ext-sq.squarespace.com  ← LÖSCHEN!
   
   NACHHER:
   Name: kurs
   Type: CNAME
   TTL:  1H
   Data: zoological-integrity-production-abc123.up.railway.app
   
5. Speichern
```

**WICHTIG**: Railway-URL **OHNE** `https://`!

---

### **8. DNS Propagation abwarten**

```bash
# Prüfen (15-60 Min warten):
dig kurs.prostarmarketing.de CNAME +short

# Sollte zeigen:
zoological-integrity-production-abc123.up.railway.app.
```

**Online prüfen**: https://dnschecker.org/#CNAME/kurs.prostarmarketing.de

---

### **9. Custom Domain in Railway hinzufügen**

**ERST NACHDEM DNS propagiert ist!**

```
1. Railway → Settings → Domains
2. Klicke "Custom Domain"
3. Eingeben: kurs.prostarmarketing.de
4. Klicke "Add"
```

Railway prüft DNS und generiert SSL-Zertifikat automatisch!

**Status prüfen**:
- ✅ Grünes Häkchen → SSL aktiv, alles gut!
- ⏳ Orange Warnung → DNS noch nicht propagiert, warte
- ❌ Roter Fehler → DNS falsch konfiguriert, prüfe CNAME

---

### **10. FERTIG! Testen**

Öffne: **https://kurs.prostarmarketing.de**

**Finale Tests**:
- [ ] Seite lädt ohne Fehler
- [ ] SSL aktiv (grünes Schloss)
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] E-Mail wird empfangen
- [ ] Cookie gesetzt (DevTools → Application → Cookies)
- [ ] Kurs-Zugriff nach Login
- [ ] Mobile responsive (Chrome DevTools)

---

## 🐛 HÄUFIGE PROBLEME

### Problem 1: "Deployment failed - Build error"

**Symptom**: Build bricht ab mit Fehler

**Häufigste Ursachen**:

1. **Environment Variables fehlen**
   ```
   Lösung: Setze alle Variables (siehe Schritt 3)
   ```

2. **DATABASE_URL falsch**
   ```
   Lösung: Prüfe Azure MySQL Connection String
   Format: mysql://user:pass@host:3306/db?ssl-mode=REQUIRED
   ```

3. **Dependencies fehlen**
   ```
   Lösung: Railway sollte automatisch pnpm install ausführen
   Prüfe Build Logs für Fehler
   ```

**Debug**:
```
1. Deployment → Build Logs
2. Suche nach "error" oder "failed"
3. Kopiere relevante Zeilen
```

### Problem 2: "Deployment succeeded but app crashes"

**Symptom**: Build OK, aber Deploy Status: "Crashed"

**Lösung**:
```
1. Deployment → Deploy Logs
2. Suche nach:
   - "Error: Cannot connect to database"
     → DATABASE_URL prüfen
   - "Port already in use"
     → PORT Variable setzen (PORT=3000)
   - "Missing environment variable"
     → Alle Variables setzen
```

### Problem 3: "No domain generated"

**Symptom**: Unter "Domains" ist nichts

**Lösung**:
```
1. Settings → Domains
2. Klicke "Generate Domain"
3. Falls Button nicht da: Deployment muss erst "Active" sein
```

### Problem 4: "Custom domain SSL error"

**Symptom**: kurs.prostarmarketing.de zeigt SSL-Warnung

**Lösung**:
```
1. Prüfe DNS:
   dig kurs.prostarmarketing.de CNAME +short
   
2. Sollte Railway-Domain zeigen!
   
3. Warte 30-60 Min (SSL-Generation braucht Zeit)
   
4. Falls nach 1h immer noch Fehler:
   - Railway → Settings → Domains
   - Custom Domain löschen
   - 5 Min warten
   - Custom Domain neu hinzufügen
```

---

## 🔑 WICHTIGE CREDENTIALS

### JWT_SECRET generieren:

```bash
openssl rand -hex 32
# Ausgabe: z.B. a1b2c3d4e5f6...
# In Variables eintragen: JWT_SECRET=a1b2c3d4e5f6...
```

### Gmail App-Passwort erstellen:

```
1. https://myaccount.google.com/apppasswords
2. App: "Mail"
3. Gerät: "Other" → "ProStar Railway"
4. Generieren
5. Kopiere 16-stelliges Passwort (ohne Leerzeichen)
6. In Variables: EMAIL_PASSWORD=abcdefghijklmnop
```

### Stripe Test Keys:

```
1. https://dashboard.stripe.com/test/apikeys
2. Secret Key: sk_test_...
3. Publishable Key: pk_test_...
4. Webhook Secret: 
   - Stripe → Developers → Webhooks
   - Add endpoint: https://deine-railway-url.up.railway.app/api/stripe/webhook
   - Events: checkout.session.completed, payment_intent.succeeded
   - Webhook signing secret: whsec_...
```

---

## 📋 VOLLSTÄNDIGE CHECKLISTE

### Phase 1: Railway Setup
- [ ] Railway Dashboard geöffnet
- [ ] GitHub Repository verbunden
- [ ] Branch "restore-complete-visuals-ui" ausgewählt
- [ ] Environment Variables gesetzt (alle!)
- [ ] Deployment gestartet
- [ ] Build erfolgreich (Status: Active)
- [ ] Railway Domain generiert (xyz.up.railway.app)
- [ ] Railway-URL im Browser getestet

### Phase 2: DNS Konfiguration
- [ ] Railway-URL notiert
- [ ] Google Domains DNS geöffnet
- [ ] CNAME-Record bearbeitet (kurs → Railway-URL)
- [ ] 30 Min gewartet
- [ ] DNS propagiert (dig-Test erfolgreich)

### Phase 3: Custom Domain
- [ ] Custom Domain in Railway hinzugefügt
- [ ] SSL-Zertifikat generiert
- [ ] https://kurs.prostarmarketing.de lädt
- [ ] Alle Funktionen getestet

### Phase 4: Production
- [ ] Stripe auf Live-Modus umgestellt (optional)
- [ ] Test-Zahlung durchgeführt
- [ ] Monitoring eingerichtet (optional)

---

## 🆘 SCHNELLHILFE

**Wenn du nicht weiterkommst:**

1. **Screenshot machen** von:
   - Railway Dashboard (Service-Übersicht)
   - Deployment Logs (bei Fehler)
   - DNS Settings (Google Domains)

2. **Fehler kopieren**:
   ```bash
   # Build Logs oder Deploy Logs
   # Relevante Error-Zeilen
   ```

3. **Status mitteilen**:
   - Deployment Status? (Building/Failed/Active)
   - DNS konfiguriert? (Ja/Nein)
   - Railway-URL verfügbar? (Ja/Nein)

---

## 🎯 ZUSAMMENFASSUNG

```
SCHRITT 1: GitHub verbinden → Auto-Deploy startet
SCHRITT 2: Variables setzen → Deployment läuft durch
SCHRITT 3: Railway-URL notieren → z.B. xyz.up.railway.app
SCHRITT 4: DNS CNAME ändern → kurs → Railway-URL
SCHRITT 5: 30 Min warten → DNS propagiert
SCHRITT 6: Custom Domain → kurs.prostarmarketing.de
SCHRITT 7: SSL automatisch → Fertig!
```

**Geschätzte Zeit**: 45-90 Minuten (inkl. Wartezeiten)

---

**Los geht's mit Schritt 1! 🚀**

Gehe zu: https://railway.app/project/42c11096-6fbe-409c-87a5-fa507ccb586a
