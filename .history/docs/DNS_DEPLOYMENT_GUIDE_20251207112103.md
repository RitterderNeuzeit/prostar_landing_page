# DNS-basiertes Deployment: kurs.prostarmarketing.de → Railway

**Status**: ✅ Aktuelle Konfiguration (Custom Subdomain mit CNAME)

## Überblick

Diese Anleitung beschreibt das Deployment der ProStar Kurs-Plattform mit einer **Custom Subdomain** (`kurs.prostarmarketing.de`), die per **DNS CNAME** direkt auf Railway verweist.

### Architektur

```
Benutzer                DNS CNAME                Railway Server
   ↓                       ↓                          ↓
kurs.prostarmarketing.de → your-app.up.railway.app → Express/React App
                                                           ↓
                                                    Azure MySQL DB
```

**Vorteile gegenüber Iframe-Embedding**:
- ✅ Keine Cookie-Probleme (sameSite='strict' funktioniert)
- ✅ Keine CORS-Komplexität
- ✅ Bessere SEO
- ✅ Schnellere Performance (kein Iframe-Overhead)
- ✅ Einfachere Benutzer-Experience

---

## 1. Railway Deployment

### 1.1 Railway-Projekt erstellen

1. Gehe zu [railway.app](https://railway.app) und erstelle einen Account
2. Klicke auf **"New Project"**
3. Wähle **"Deploy from GitHub repo"**
4. Verbinde dein GitHub-Repository: `AIHubcom/prostar_landing_page--1-`
5. Wähle Branch: `restore-complete-visuals-ui` (oder `main` nach Merge)

### 1.2 Environment Variables konfigurieren

Gehe zu **Settings** → **Variables** und setze:

```env
# Database
DATABASE_URL=mysql://user:password@server.mysql.database.azure.com:3306/db?ssl-mode=REQUIRED

# Authentication
JWT_SECRET=<generiere mit: openssl rand -hex 32>

# Server
NODE_ENV=production
SITE_URL=https://kurs.prostarmarketing.de
OAUTH_SERVER_URL=https://kurs.prostarmarketing.de

# Email (Gmail App Password ODER AWS SES)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_live_... (oder sk_test_... für Testing)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_... (oder pk_test_...)

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Wichtig**: `SITE_URL` MUSS `https://kurs.prostarmarketing.de` sein!

### 1.3 Deployment starten

Railway deployt automatisch nach dem Commit. Warte auf:
- ✅ **Build erfolgreich** (ca. 2-5 Minuten)
- ✅ **Deployment aktiv** (grüner Status)

Notiere die **Railway URL**: `your-app-xyz.up.railway.app`

---

## 2. DNS-Konfiguration

### 2.1 CNAME-Record anlegen

Bei deinem DNS-Provider (z.B. Squarespace DNS, Cloudflare, Namecheap):

1. Gehe zu **DNS-Einstellungen** für `prostarmarketing.de`
2. Füge einen **CNAME-Record** hinzu:

```
Type:   CNAME
Name:   kurs (oder kurs.prostarmarketing.de)
Value:  your-app-xyz.up.railway.app
TTL:    3600 (oder Auto)
```

**Beispiel für verschiedene DNS-Provider**:

#### Squarespace DNS:
```
Host:   kurs
Type:   CNAME
Data:   your-app-xyz.up.railway.app
```

#### Cloudflare:
```
Type:   CNAME
Name:   kurs
Target: your-app-xyz.up.railway.app
Proxy:  OFF (wichtig: Orange Cloud deaktivieren für Railway)
```

#### Namecheap:
```
Type:   CNAME Record
Host:   kurs
Value:  your-app-xyz.up.railway.app
TTL:    Automatic
```

### 2.2 DNS-Propagation prüfen

DNS-Änderungen brauchen **15 Minuten bis 48 Stunden** (meist < 1 Stunde).

**Prüfe den Status**:

```bash
# macOS/Linux:
dig kurs.prostarmarketing.de

# Oder online:
# https://dnschecker.org
# https://www.whatsmydns.net
```

**Erwartete Ausgabe nach erfolgreicher Propagation**:

```
kurs.prostarmarketing.de. 3600 IN CNAME your-app-xyz.up.railway.app.
your-app-xyz.up.railway.app. 300 IN A 104.21.x.x
```

---

## 3. Custom Domain in Railway konfigurieren

### 3.1 Domain hinzufügen

1. Gehe zu deinem Railway-Projekt
2. Klicke auf **Settings** → **Domains**
3. Klicke **"Add Custom Domain"**
4. Gib ein: `kurs.prostarmarketing.de`
5. Klicke **"Add Domain"**

### 3.2 SSL-Zertifikat

Railway generiert automatisch ein **Let's Encrypt SSL-Zertifikat**.

**Status prüfen**:
- ✅ Grünes Schloss-Symbol in Railway → SSL aktiv
- ⏳ Orange Warn-Symbol → DNS noch nicht propagiert (warte 15-30 Min.)
- ❌ Rotes X → DNS-Konfiguration prüfen

**SSL wird automatisch erneuert** (alle 60 Tage).

---

## 4. Testing

### 4.1 Basis-Tests

Nach DNS-Propagation und SSL-Aktivierung:

```bash
# 1. HTTPS-Zugriff prüfen
curl -I https://kurs.prostarmarketing.de

# Erwartete Ausgabe:
# HTTP/2 200
# content-type: text/html

# 2. SSL-Zertifikat prüfen
openssl s_client -connect kurs.prostarmarketing.de:443 -servername kurs.prostarmarketing.de

# Erwartete Ausgabe:
# subject=CN=kurs.prostarmarketing.de
# issuer=C=US, O=Let's Encrypt, CN=R3
```

### 4.2 Funktionstest im Browser

Öffne https://kurs.prostarmarketing.de und prüfe:

- ✅ Seite lädt ohne Fehler
- ✅ Grünes Schloss-Symbol (SSL aktiv)
- ✅ **Registrierung** funktioniert
- ✅ **Login** funktioniert (Cookies werden gesetzt)
- ✅ **E-Mail-Versand** funktioniert (Bestätigungsmail erhalten)
- ✅ **Kurs-Zugriff** nach Login möglich
- ✅ **Stripe-Zahlung** funktioniert (Test-Modus)
- ✅ **Passwort-Reset** funktioniert
- ✅ **Mobile Ansicht** korrekt (Responsive Design)

### 4.3 Cookie-Test (wichtig!)

Öffne Browser-DevTools → **Application** → **Cookies** → `https://kurs.prostarmarketing.de`

**Erwartete Cookies nach Login**:

```
Name:     session_token (oder ähnlich)
Value:    jwt-token-hier...
Domain:   .prostarmarketing.de (oder kurs.prostarmarketing.de)
Path:     /
Secure:   ✅ Yes
HttpOnly: ✅ Yes
SameSite: Strict
```

**Falls Cookies fehlen**:
- Prüfe ob HTTPS aktiv ist (HTTP speichert keine Secure-Cookies)
- Prüfe `SITE_URL` in Railway (muss `https://kurs.prostarmarketing.de` sein)
- Browser-Cache leeren und neu einloggen

---

## 5. Integration mit Hauptseite (prostarmarketing.de)

### 5.1 Direkte Links von Hauptseite

In Squarespace (oder deiner Hauptseite) kannst du jetzt **direkt verlinken**:

```html
<!-- Call-to-Action Button -->
<a href="https://kurs.prostarmarketing.de" class="cta-button">
  Jetzt Kurs starten
</a>

<!-- Navigation Link -->
<nav>
  <a href="https://prostarmarketing.de">Home</a>
  <a href="https://kurs.prostarmarketing.de">Kurs-Portal</a>
  <a href="https://prostarmarketing.de/kontakt">Kontakt</a>
</nav>
```

### 5.2 Zurück-Navigation

In deiner React-App (`client/src/components/`) kannst du Links zur Hauptseite setzen:

```tsx
// Header.tsx (Beispiel)
<a href="https://prostarmarketing.de" className="back-link">
  ← Zurück zur Hauptseite
</a>
```

---

## 6. Monitoring & Wartung

### 6.1 Railway Logs

Überwache deine App in Railway:

1. Gehe zu deinem Projekt
2. Klicke auf **Deployments**
3. Wähle aktuelles Deployment
4. Tab **Logs** → Siehe Server-Logs in Echtzeit

**Wichtige Log-Meldungen**:

```
✅ "Server running on port 3000" → App läuft
✅ "Database connection successful" → DB verbunden
❌ "ECONNREFUSED mysql" → DB-Verbindung fehlgeschlagen
❌ "CORS error" → Falsche Origin (sollte nicht passieren)
```

### 6.2 Uptime-Monitoring (optional)

Empfohlene Tools:

- **UptimeRobot** (gratis): https://uptimerobot.com
  - Prüft `https://kurs.prostarmarketing.de` alle 5 Minuten
  - E-Mail-Benachrichtigung bei Downtime

- **Better Uptime** (gratis Plan): https://betteruptime.com
  - Erweiterte Monitoring-Optionen
  - Status-Page für Kunden

### 6.3 SSL-Überwachung

Railway erneuert SSL automatisch. Trotzdem empfohlen:

- **SSL Labs Test**: https://www.ssllabs.com/ssltest/
  - Analysiere `kurs.prostarmarketing.de`
  - Erwartetes Rating: **A** oder **A+**

---

## 7. Troubleshooting

### Problem 1: DNS funktioniert nicht

**Symptom**: `kurs.prostarmarketing.de` nicht erreichbar nach 24h

**Lösung**:

```bash
# DNS prüfen
dig kurs.prostarmarketing.de

# Falls kein CNAME zurückkommt:
# 1. DNS-Provider-Einstellungen prüfen (Tippfehler?)
# 2. TTL abwarten (kann bis 48h dauern)
# 3. DNS-Cache leeren:
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder  # macOS
ipconfig /flushdns  # Windows
```

### Problem 2: SSL-Zertifikat nicht generiert

**Symptom**: Railway zeigt "SSL Certificate Error" nach 1h

**Lösung**:

1. **DNS propagiert?** → Prüfe mit `dig` (siehe oben)
2. **CNAME korrekt?** → Muss auf Railway-Domain zeigen (nicht IP-Adresse!)
3. **Cloudflare?** → Orange Cloud (Proxy) MUSS deaktiviert sein
4. Railway-Domain **entfernen und neu hinzufügen**:
   - Settings → Domains → Custom Domain löschen
   - 5 Minuten warten
   - Domain neu hinzufügen

### Problem 3: Cookies funktionieren nicht

**Symptom**: Login funktioniert nicht, ständig ausgeloggt

**Lösung**:

1. **SITE_URL prüfen**:
   ```bash
   # In Railway Settings → Variables:
   SITE_URL=https://kurs.prostarmarketing.de  # ✅ Korrekt
   SITE_URL=http://kurs.prostarmarketing.de   # ❌ Falsch (kein HTTPS)
   SITE_URL=https://your-app.up.railway.app   # ❌ Falsch (Railway-Domain statt Custom)
   ```

2. **Browser-Cache leeren** und neu einloggen

3. **Cookie-Domain prüfen** (Browser DevTools):
   - Domain sollte `.prostarmarketing.de` oder `kurs.prostarmarketing.de` sein
   - Secure: ✅ Yes
   - SameSite: Strict

### Problem 4: CORS-Fehler

**Symptom**: Browser-Console zeigt "CORS policy: No 'Access-Control-Allow-Origin' header"

**Lösung**:

Sollte **nicht passieren** bei direktem DNS-Zugriff. Falls doch:

1. **Prüfe `server/_core/index.ts`**:
   ```typescript
   const allowedOrigins = [
     'https://kurs.prostarmarketing.de',  // ← Muss enthalten sein
     // ...
   ];
   ```

2. **Rebuild und Redeploy**:
   ```bash
   git commit -am "fix: CORS origin"
   git push origin restore-complete-visuals-ui
   # Railway deployt automatisch neu
   ```

### Problem 5: Stripe Webhook funktioniert nicht

**Symptom**: Zahlungen erfolgreich, aber Kurs-Zugriff nicht freigeschaltet

**Lösung**:

1. **Webhook-URL in Stripe aktualisieren**:
   - Gehe zu [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
   - Bestehenden Webhook bearbeiten oder neu erstellen
   - **Endpoint URL**: `https://kurs.prostarmarketing.de/api/stripe/webhook`
   - **Events**: `checkout.session.completed`, `payment_intent.succeeded`

2. **Webhook Secret in Railway aktualisieren**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...  # Neuer Secret von Stripe
   ```

3. **Test mit Stripe CLI**:
   ```bash
   stripe listen --forward-to https://kurs.prostarmarketing.de/api/stripe/webhook
   stripe trigger payment_intent.succeeded
   ```

---

## 8. Continuous Deployment

### 8.1 Automatisches Deployment

Railway deployt automatisch bei jedem Git-Push:

```bash
# Änderungen committen
git add .
git commit -m "feat: neue Feature"
git push origin restore-complete-visuals-ui

# Railway startet automatisch:
# 1. Build (pnpm install && pnpm build)
# 2. Deployment (pnpm start)
# 3. Live in ~2-5 Minuten
```

### 8.2 Rollback bei Problemen

Falls ein Deployment fehlschlägt:

1. Gehe zu Railway → **Deployments**
2. Wähle vorheriges funktionierendes Deployment
3. Klicke **"Redeploy"** (3-Punkte-Menü)

Oder per Git:

```bash
# Letzten Commit rückgängig machen
git revert HEAD
git push origin restore-complete-visuals-ui
```

---

## 9. Production Checklist

Vor dem Live-Gang:

### Deployment
- [ ] Railway-Projekt erstellt
- [ ] Environment Variables gesetzt (insbesondere `SITE_URL`)
- [ ] Deployment erfolgreich (grüner Status in Railway)
- [ ] Railway-URL notiert: `____________________.up.railway.app`

### DNS
- [ ] CNAME-Record erstellt: `kurs → Railway-Domain`
- [ ] DNS propagiert (geprüft mit `dig` oder dnschecker.org)
- [ ] Custom Domain in Railway hinzugefügt: `kurs.prostarmarketing.de`
- [ ] SSL-Zertifikat aktiv (grünes Schloss in Railway)

### Funktionstest
- [ ] https://kurs.prostarmarketing.de lädt ohne Fehler
- [ ] SSL-Zertifikat gültig (Browser zeigt grünes Schloss)
- [ ] Registrierung funktioniert
- [ ] Login funktioniert (Cookies werden gesetzt)
- [ ] E-Mail-Versand funktioniert
- [ ] Kurs-Zugriff nach Login möglich
- [ ] Passwort-Reset funktioniert
- [ ] Mobile Ansicht korrekt

### Stripe (wenn produktiv)
- [ ] Stripe auf Live-Modus umgestellt
- [ ] Live API Keys in Railway gesetzt
- [ ] Webhook-URL aktualisiert: `https://kurs.prostarmarketing.de/api/stripe/webhook`
- [ ] Test-Zahlung erfolgreich
- [ ] Kurs-Freischaltung nach Zahlung funktioniert

### Integration
- [ ] Links von prostarmarketing.de auf kurs.prostarmarketing.de gesetzt
- [ ] Zurück-Navigation zur Hauptseite funktioniert
- [ ] Footer-Links aktualisiert

### Monitoring (optional, aber empfohlen)
- [ ] Uptime-Monitoring eingerichtet (UptimeRobot)
- [ ] Error-Tracking konfiguriert (Sentry o.ä.)
- [ ] Google Analytics eingebunden (falls gewünscht)

---

## 10. Kontakt & Support

**Railway Support**:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**DNS-Hilfe**:
- Squarespace: https://support.squarespace.com
- Cloudflare: https://community.cloudflare.com

**Bei Problemen mit der App**:
- Prüfe Railway Logs: Projekt → Deployments → Logs
- Prüfe Browser Console (F12)
- GitHub Issues: https://github.com/AIHubcom/prostar_landing_page--1-/issues

---

**Zusammenfassung**:

✅ **Custom Subdomain** (`kurs.prostarmarketing.de`) ist die beste Lösung  
✅ **DNS CNAME** zeigt direkt auf Railway (keine Iframe-Komplexität)  
✅ **SSL automatisch** von Railway (Let's Encrypt)  
✅ **Cookies funktionieren** einwandfrei (sameSite='strict')  
✅ **Performance optimal** (kein Iframe-Overhead)  
✅ **SEO-freundlich** (eigene Domain)

**Geschätzter Zeitaufwand**: 30-60 Minuten (inkl. DNS-Propagation-Wartezeit)
