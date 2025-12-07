# 🔑 Benötigte Credentials für vollständige Automatisierung

## 📋 WAS ICH BRAUCHE

Um **ALLES automatisch** zu erledigen, benötige ich folgende Zugangsdaten:

---

## 1️⃣ RAILWAY API TOKEN (mit Schreibrechten)

**Zweck:** Environment Variables setzen + Custom Domain hinzufügen

**Aktueller Status:** 
- ❌ Bestehende Tokens haben nur Leserechte
- ❌ Mutation-Operationen werden mit "Not Authorized" abgelehnt

**Was ich brauche:**
```
Railway API Token mit folgenden Rechten:
- ✅ Read Projects
- ✅ Read Deployments
- ✅ Write Variables (WICHTIG!)
- ✅ Write Domains (WICHTIG!)
- ✅ Trigger Deployments (WICHTIG!)
```

**Wo erstellen:**
1. Railway Dashboard: https://railway.app/account/tokens
2. "Create Token" klicken
3. Name: "Copilot Full Access"
4. Permissions auswählen: **ALL** oder minimal:
   - Project Read
   - Project Write
   - Environment Variables Write
   - Service Domains Write
5. Token kopieren und mir geben

**Damit kann ich:**
- ✅ Environment Variables automatisch hochladen
- ✅ Custom Domain automatisch hinzufügen
- ✅ Deployment automatisch triggern

---

## 2️⃣ GOOGLE DOMAINS API CREDENTIALS (Optional aber empfohlen)

**Zweck:** DNS CNAME automatisch ändern

**Aktueller Status:**
- ❌ Manuelle Änderung über Google Domains UI erforderlich
- ⚠️ Google Domains API ist limitiert/deprecated

**Alternative Lösung:**
Da Google Domains zu Squarespace migriert, gibt es 2 Optionen:

### Option A: Cloudflare nutzen (EMPFOHLEN)
```
1. Domain zu Cloudflare transferieren (kostenlos)
2. Cloudflare API Token erstellen
3. DNS via API automatisch ändern
```

**Vorteile:**
- ✅ Volle API-Kontrolle
- ✅ Schnellere DNS-Propagation
- ✅ Kostenlos
- ✅ Besseres DDoS-Protection

**Cloudflare API Token erstellen:**
1. https://dash.cloudflare.com/profile/api-tokens
2. "Create Token" → "Edit zone DNS" Template
3. Permissions:
   - Zone - DNS - Edit
   - Zone - Zone - Read
4. Zone Resources: Include - Specific zone - prostarmarketing.de
5. Token kopieren

### Option B: Manuelle DNS-Änderung (wie bisher)
```
Du änderst DNS manuell in Google Domains (2 Minuten)
Ich überwache die Propagation automatisch
```

---

## 3️⃣ AZURE MYSQL CONNECTION STRING

**Zweck:** Datenbank-Verbindung für Railway

**Format:**
```
mysql://USERNAME:PASSWORD@SERVER.mysql.database.azure.com:3306/DATABASE?ssl-mode=REQUIRED
```

**Beispiel:**
```
mysql://adminuser:MyP@ssw0rd!@prostar-mysql.mysql.database.azure.com:3306/prostar_db?ssl-mode=REQUIRED
```

**Wo finden:**
1. Azure Portal: https://portal.azure.com
2. Deine MySQL-Datenbank öffnen
3. "Connection strings" → "ADO.NET" oder "JDBC"
4. Umwandeln in MySQL-Format (siehe oben)

---

## 4️⃣ GMAIL APP-PASSWORT

**Zweck:** Email-Versand (Registrierung, Passwort-Reset)

**Format:**
```
Email: deine-email@gmail.com
App-Passwort: abcdefghijklmnop (16 Zeichen, keine Leerzeichen)
```

**Wie erstellen:**
1. https://myaccount.google.com/apppasswords
2. "Select app" → "Mail"
3. "Select device" → "Other" → "ProStar Railway"
4. "Generate" klicken
5. 16-stelliges Passwort kopieren (z.B.: "abcd efgh ijkl mnop")
6. **WICHTIG:** Leerzeichen entfernen → "abcdefghijklmnop"

---

## 5️⃣ STRIPE API KEYS

**Zweck:** Zahlungsabwicklung

**Test Keys (Sandbox - EMPFOHLEN für Start):**
```
Secret Key: sk_test_...
Publishable Key: pk_test_...
Webhook Secret: whsec_... (nach Webhook-Erstellung)
```

**Wo finden:**
- Test Keys: https://dashboard.stripe.com/test/apikeys
- Live Keys: https://dashboard.stripe.com/apikeys

**Webhook Secret erstellen:**
1. https://dashboard.stripe.com/test/webhooks
2. "Add endpoint"
3. URL: `https://prostarlandingpage-1-production.up.railway.app/api/stripe/webhook`
4. Events auswählen:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
5. "Add endpoint"
6. "Signing secret" anzeigen → kopieren (whsec_...)

---

## 📊 PRIORISIERUNG

### 🔴 KRITISCH (ohne geht's nicht):
1. **Railway API Token** (mit Schreibrechten)
2. **Azure MySQL Connection String**
3. **Gmail App-Passwort**
4. **Stripe Keys**

### 🟡 OPTIONAL (kann manuell gemacht werden):
5. **Google Domains API / Cloudflare Token**

---

## ✅ WAS ICH DAMIT AUTOMATISCH MACHE

### Mit Railway API Token:
```bash
# 1. Environment Variables automatisch hochladen
curl -X POST https://backboard.railway.app/graphql \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -d '{"query":"mutation { variableUpsert(...) }"}'

# 2. Custom Domain automatisch hinzufügen
curl -X POST https://backboard.railway.app/graphql \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -d '{"query":"mutation { serviceDomainCreate(...) }"}'

# 3. Deployment automatisch triggern
curl -X POST https://backboard.railway.app/graphql \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -d '{"query":"mutation { deploymentRestart(...) }"}'
```

### Mit Cloudflare Token (optional):
```bash
# DNS CNAME automatisch ändern
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d '{"type":"CNAME","name":"kurs","content":"prostarlandingpage-1-production.up.railway.app"}'
```

---

## 🚀 ABLAUF MIT VOLLSTÄNDIGER AUTOMATISIERUNG

### Phase 1: Credentials sammeln (5 Min - DU)
```
1. Railway API Token erstellen (mit Schreibrechten)
2. Azure MySQL Connection String kopieren
3. Gmail App-Passwort erstellen
4. Stripe Keys kopieren
5. [Optional] Cloudflare Token erstellen
```

### Phase 2: Automatische Ausführung (2-5 Min - ICH)
```bash
# Ich führe automatisch aus:
./auto-deploy-complete.sh \
  --railway-token "DEIN_TOKEN" \
  --database-url "DEIN_MYSQL_STRING" \
  --email-user "DEINE_EMAIL" \
  --email-password "APP_PASSWORT" \
  --stripe-secret "STRIPE_SECRET" \
  --stripe-webhook "STRIPE_WEBHOOK" \
  --stripe-public "STRIPE_PUBLIC" \
  --cloudflare-token "CF_TOKEN" # optional
```

**Das Script macht dann:**
1. ✅ JWT_SECRET generieren
2. ✅ Alle ENV vars zu Railway hochladen (via API)
3. ✅ Deployment triggern (via API)
4. ✅ Deployment-Status überwachen
5. ✅ [Optional] DNS CNAME ändern (via Cloudflare API)
6. ✅ DNS-Propagation überwachen
7. ✅ Custom Domain zu Railway hinzufügen (via API)
8. ✅ SSL-Zertifikat-Generierung überwachen
9. ✅ Finale Tests durchführen
10. ✅ Erfolgs-Report ausgeben

### Phase 3: DNS Propagation (15-60 Min - AUTOMATISCH)
```
Script überwacht automatisch und benachrichtigt bei Fertigstellung
```

### Phase 4: Fertig! (0 Min - AUTOMATISCH)
```
✅ https://kurs.prostarmarketing.de läuft
✅ SSL aktiv
✅ Alle Funktionen getestet
```

---

## 📝 TEMPLATE ZUM AUSFÜLLEN

Kopiere dieses Template und fülle es aus:

```bash
# ========================================
# CREDENTIALS FÜR AUTOMATISIERUNG
# ========================================

# 1. Railway API Token (mit Schreibrechten)
RAILWAY_TOKEN="dein_railway_token_hier"

# 2. Azure MySQL Connection String
DATABASE_URL="mysql://USERNAME:PASSWORD@SERVER.mysql.database.azure.com:3306/DATABASE?ssl-mode=REQUIRED"

# 3. Gmail Credentials
EMAIL_USER="deine-email@gmail.com"
EMAIL_PASSWORD="app-passwort-16-zeichen"

# 4. Stripe Keys (Test oder Live)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# 5. [OPTIONAL] Cloudflare Token für DNS-Automatisierung
CLOUDFLARE_TOKEN="dein_cloudflare_token" # oder leer lassen für manuelle DNS-Änderung
CLOUDFLARE_ZONE_ID="deine_zone_id" # nur wenn Cloudflare genutzt wird
```

**Wenn du das ausgefüllt hast, kann ich alles automatisch erledigen!** 🚀

---

## ⚠️ SICHERHEIT

**Wichtig:**
- ✅ Teile Credentials nur direkt (nicht öffentlich)
- ✅ Nutze Test-Keys für Stripe (nicht Live-Keys)
- ✅ Railway Token kann nach Deployment wieder gelöscht werden
- ✅ Credentials werden nicht im Code gespeichert
- ✅ Alle Credentials nur in Railway Environment Variables (verschlüsselt)

---

## 🤔 EMPFEHLUNG

### Minimale Variante (ohne DNS-Automatisierung):
```
Benötigt:
1. Railway API Token
2. Azure MySQL String
3. Gmail App-Passwort
4. Stripe Keys

Du änderst: DNS manuell (2 Min)
Ich mache: Alles andere automatisch (5 Min)
```

### Vollautomatische Variante (mit Cloudflare):
```
Benötigt:
1. Railway API Token
2. Azure MySQL String
3. Gmail App-Passwort
4. Stripe Keys
5. Cloudflare Token

Ich mache: ALLES automatisch (0 Min für dich)
Domain-Transfer zu Cloudflare: 10-20 Min Einrichtung (einmalig)
```

---

## 📞 NÄCHSTER SCHRITT

**Sage mir einfach:**

1. Welche Variante du willst:
   - [ ] Minimal (DNS manuell)
   - [ ] Vollautomatisch (mit Cloudflare)

2. Gib mir die Credentials (via sichere Methode)

3. Ich erstelle dann das vollautomatische Deployment-Script und führe es aus!

---

**Benötigte Zeit:**
- **Deine Zeit:** 5-10 Min (Credentials sammeln)
- **Meine Zeit:** 2-5 Min (automatisches Deployment)
- **Wartezeit:** 15-60 Min (DNS-Propagation, automatisch überwacht)
- **GESAMT:** ~20-75 Min bis zur fertigen Website!

🚀 **Bereit? Gib mir die Credentials und ich starte!**
