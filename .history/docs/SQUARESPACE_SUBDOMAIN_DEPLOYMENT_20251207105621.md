# ProStar Kurs-Oberfläche - Squarespace Subdomain Deployment Guide

## 📋 Übersicht

Dieser Guide erklärt, wie du die ProStar Kurs-Oberfläche (Landing Page + Kurs-Access) unter einer Squarespace-Subdomain hostest und mit der Haupt-Website verbindest.

### Architektur-Übersicht

```
prostarmarketing.de (Squarespace Hauptseite)
    ↓
    Integration via Squarespace Subdomain
    ↓
kursprostarmarketing.squarespace.com (Squarespace Site)
    ↓
    Embedded/Linked Full-Stack App
    ↓
    Full-Stack React + Express App (Hosting: Azure/Railway/Render)
    ↓
    Azure MySQL Database
```

---

## 🎯 Deployment-Optionen

### Option 1: Azure App Service (Empfohlen für Production)

**Vorteile:**
- ✅ Direkte Integration mit Azure MySQL
- ✅ SSL-Zertifikate automatisch
- ✅ Skalierbar
- ✅ CI/CD mit GitHub Actions

**Kosten:** ~10-50€/Monat je nach Plan

### Option 2: Railway.app (Einfach & Schnell)

**Vorteile:**
- ✅ Sehr einfaches Setup
- ✅ Kostenloses Kontingent verfügbar
- ✅ Automatische Deployments via GitHub
- ✅ SSL automatisch

**Kosten:** 5$ Gratis-Guthaben/Monat, dann ~5-10$/Monat

### Option 3: Render.com (Mittelweg)

**Vorteile:**
- ✅ Einfaches Setup
- ✅ Kostenloser Plan verfügbar
- ✅ SSL automatisch

**Kosten:** Kostenlos (mit Einschränkungen) oder ab 7$/Monat

---

## 🚀 Schritt-für-Schritt: Railway Deployment (Empfohlen für Start)

### Phase 1: Projekt-Vorbereitung

#### 1.1 Production Build testen

```bash
# 1. Environment-Variablen prüfen
cp .env.example .env
nano .env  # Alle Production-Werte eintragen

# 2. TypeScript validieren
pnpm check

# 3. Production Build
pnpm build

# 4. Production Server lokal testen
pnpm start

# Server sollte starten auf http://localhost:3000
```

#### 1.2 Environment-Variablen dokumentieren

Kopiere alle benötigten Variablen aus `.env`:

```env
# DATABASE
DATABASE_URL=mysql://user:pass@server.mysql.database.azure.com:3306/db?ssl-mode=REQUIRED

# SERVER
PORT=3000
NODE_ENV=production
SITE_URL=https://kursprostarmarketing.squarespace.com
OAUTH_SERVER_URL=https://kursprostarmarketing.squarespace.com

# AUTHENTICATION
JWT_SECRET=your-32-character-secret
COOKIE_DOMAIN=prostarmarketing.de
COOKIE_SECURE=true

# EMAIL (Gmail oder AWS SES)
EMAIL_PROVIDER=gmail
EMAIL_USER=noreply@prostarmarketing.de
EMAIL_PASSWORD=app-specific-password
EMAIL_FROM=ProStar <noreply@prostarmarketing.de>

# STRIPE
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OPTIONAL
CAPTCHA_PROVIDER=recaptcha
CAPTCHA_SECRET=your-secret
RECAPTCHA_MIN_SCORE=0.5
```

### Phase 2: Railway Setup

#### 2.1 Account erstellen

1. Gehe zu [railway.app](https://railway.app)
2. Melde dich mit GitHub an
3. Verbinde dein Repository `AIHubcom/prostar_landing_page--1-`

#### 2.2 Neues Projekt erstellen

```bash
# Im Terminal (optional, oder via Web-UI):
npm install -g @railway/cli
railway login
railway init
```

**Oder via Web-UI:**

1. Klicke auf "New Project"
2. Wähle "Deploy from GitHub repo"
3. Wähle `AIHubcom/prostar_landing_page--1-`
4. Branch: `main` (oder `restore-complete-visuals-ui`)

#### 2.3 Environment-Variablen setzen

Im Railway Dashboard:

1. Klicke auf dein Projekt
2. Gehe zu "Variables"
3. Füge **ALLE** Variablen aus Schritt 1.2 hinzu

**Wichtig:**
- `NODE_ENV=production`
- `SITE_URL=https://kursprostarmarketing.squarespace.com`
- `COOKIE_SECURE=true`

#### 2.4 Build-Konfiguration

Railway erkennt automatisch `package.json`, aber überprüfe:

**Settings → Build & Deploy:**

```json
{
  "buildCommand": "pnpm install && pnpm build",
  "startCommand": "pnpm start",
  "watchPatterns": ["**"]
}
```

#### 2.5 Deployment triggern

1. Pushe deinen Code zu GitHub (bereits erledigt ✅)
2. Railway deployed automatisch
3. Warte auf Build (ca. 2-5 Minuten)
4. Überprüfe Logs in Railway Dashboard

**Build sollte ausgeben:**

```
✓ 6252 modules transformed
✓ built in 9.69s
dist/index.js  57.8kb
⚡ Done
```

### Phase 3: Custom Domain Setup

#### 3.1 Railway Domain generieren

1. Im Railway Dashboard → "Settings" → "Domains"
2. Klicke "Generate Domain"
3. Du erhältst: `your-app-xyz.up.railway.app`
4. Teste die URL → Sollte deine App anzeigen

#### 3.2 Squarespace Subdomain Setup

Da du bereits eine Squarespace-Subdomain hast (`kursprostarmarketing.squarespace.com`), gibt es **zwei Optionen**:

**Option A: Direktes Embedding in Squarespace-Site**

Die App wird direkt in die Squarespace-Site eingebettet via Iframe oder Code-Injection.

**Option B: Custom Domain Mapping**

Mappe eine eigene Domain zur gehosteten App und verlinke von Squarespace.

---

### Option A: Embedding in Squarespace (Empfohlen für deine Setup)

#### 3.3 Railway App deployen

1. Deploy deine App auf Railway (siehe oben)
2. Notiere die Railway-URL: `your-app-xyz.up.railway.app`
3. Teste die URL → App sollte funktionieren

#### 3.4 In Squarespace einbetten

**Methode 1: Vollbild-Iframe auf Squarespace-Seite**

1. Gehe zu `kursprostarmarketing.squarespace.com` → Edit
2. Füge eine neue **Blank Page** hinzu (Name: "Kurs-Zugang")
3. Füge einen **Code Block** ein
4. Kopiere diesen Code:
**Methode 2: Code Injection (ganze Site)**

Für alle Seiten auf `kursprostarmarketing.squarespace.com`:

1. Gehe zu **Settings** → **Advanced** → **Code Injection**
2. **Header** Tab:

```html
<style>
  /* Hide Squarespace Header/Footer for clean app experience */
#### 4.1 Navigation-Link hinzufügen

**Auf der Hauptseite (prostarmarketing.de):**

1. Gehe zu **Pages** → Edit Navigation
2. Füge neuen Link hinzu:
   - **Name:** "Kurs-Zugang" oder "Online-Kurse"
   - **URL:** `https://kursprostarmarketing.squarespace.com`
   - **Open in:** New Tab (empfohlen) oder Same Windowr"></div>
<script>
  // Load ProStar Kurs-App
  (function() {
    const container = document.getElementById('prostar-app-container');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://your-app-xyz.up.railway.app';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:999999';
    iframe.allow = 'camera; microphone; payment';
    container.appendChild(iframe);
  })();
</script>
```

4. Speichern und Veröffentlichen

#### 3.5 SSL-Zertifikat

- Railway hat automatisch SSL (https://your-app-xyz.up.railway.app)
- Squarespace hat automatisch SSL (https://kursprostarmarketing.squarespace.com)
- ✅ Beide sind bereits gesichert!
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border: none;
    z-index: 9999;
  }
  /* Optional: Squarespace Header ausblenden */
  header, footer { display: none !important; }
</style>
#### 4.2 Call-to-Action Button erstellen

Auf der Haupt-Landingpage (prostarmarketing.de):

```html
<!-- In einem Code Block oder Custom CSS/HTML Sektion -->
<div style="text-align: center; margin: 40px 0;">
  <a href="https://kursprostarmarketing.squarespace.com" 
     target="_blank"
     style="
       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
       color: white;
       padding: 16px 32px;
       border-radius: 8px;
       text-decoration: none;
       font-weight: 600;
       font-size: 18px;
       display: inline-block;
       box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
       transition: transform 0.2s;
     "
     onmouseover="this.style.transform='translateY(-2px)'"
     onmouseout="this.style.transform='translateY(0)'">
    🚀 Jetzt Kurs-Zugang sichern
  </a>
</div>
```
1. Gehe zu **Pages** → Edit Navigation
2. Füge neuen Link hinzu:
   - **Name:** "Online-Kurse" oder "Kurs-Zugang"
   - **URL:** `https://kurse.prostarmarketing.de`
   - **Open in:** Same Window

#### 4.2 Call-to-Action Button erstellen

Auf der Haupt-Landingpage (prostarmarketing.de):

```html
<!-- In einem Code Block oder Custom CSS/HTML Sektion -->
<div style="text-align: center; margin: 40px 0;">
  <a href="https://kurse.prostarmarketing.de" 
     style="
       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
       color: white;
       padding: 16px 32px;
       border-radius: 8px;
       text-decoration: none;
       font-weight: 600;
       font-size: 18px;
       display: inline-block;
       box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
       transition: transform 0.2s;
     "
     onmouseover="this.style.transform='translateY(-2px)'"
     onmouseout="this.style.transform='translateY(0)'">
    🚀 Jetzt Kurs-Zugang sichern
  </a>
</div>
```
#### 4.3 Embedded Kurs-Vorschau (Optional)

Falls du einen Teaser auf der Hauptseite (prostarmarketing.de) zeigen willst:

```html
<!-- Squarespace Code Block auf prostarmarketing.de -->
<div style="margin: 60px auto; max-width: 1200px;">
  <h2 style="text-align: center; font-size: 32px; margin-bottom: 30px;">
    Unsere Online-Kurse
  </h2>
  
  <iframe 
    src="https://your-app-xyz.up.railway.app" 
    style="
      width: 100%; 
      height: 600px; 
      border: none; 
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    "
    loading="lazy"
    allow="payment">
  </iframe>
  
  <div style="text-align: center; margin-top: 20px;">
    <a href="https://kursprostarmarketing.squarespace.com" 
       target="_blank"
       style="color: #667eea; font-weight: 600; font-size: 16px;">
      Zum vollständigen Kurs-Portal →
    </a>
  </div>
</div>
```
**Hinweis:** Du musst dann eine `/preview` Route in deiner App erstellen, die eine vereinfachte Ansicht zeigt.

### Phase 5: Testing & Validierung

#### 5.1 Funktionale Tests

```bash
# Checklist:
✅ https://kurse.prostarmarketing.de lädt
✅ SSL-Zertifikat ist aktiv (grünes Schloss)
✅ Landing Page wird korrekt angezeigt
✅ Registrierung funktioniert
✅ Email-Versand funktioniert
✅ Kurs-Zugang nach Registrierung funktioniert
✅ Stripe-Zahlung funktioniert (Testmodus)
✅ Login/Logout funktioniert
✅ Session-Cookies werden gesetzt
✅ Passwort-Reset funktioniert
✅ Mobile Responsive funktioniert
```

#### 5.2 Performance-Tests

```bash
# Google PageSpeed Insights
https://pagespeed.web.dev/analysis?url=https://kurse.prostarmarketing.de

# Ziel:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90
```

#### 5.3 Security-Tests

```bash
# SSL Labs SSL Test
https://www.ssllabs.com/ssltest/analyze.html?d=kurse.prostarmarketing.de

# Ziel: A+ Rating
```

#### 5.4 Database Connection Test

```bash
# Im Railway Dashboard → Logs
# Suche nach:
✓ Database connection established
✓ Server running on port 3000
✓ Auto-migration completed

# Keine Fehler wie:
✗ ECONNREFUSED
✗ ER_ACCESS_DENIED_ERROR
✗ Certificate verification failed
```

---

## 🔄 Continuous Deployment

### Automatische Deployments via GitHub

Railway deployed automatisch bei jedem Push zu `main`:

```bash
# Workflow:
1. Code-Änderungen lokal machen
2. git add . && git commit -m "feat: neue Funktion"
3. git push origin main
4. Railway erkennt Push automatisch
5. Build startet automatisch
6. Deployment nach ~2-5 Minuten live
```

### Deployment-Benachrichtigungen

**Railway Dashboard → Settings → Notifications:**

- ✅ Enable Slack/Discord Webhooks
- ✅ Email-Benachrichtigungen aktivieren
- ✅ Build Success/Failure Alerts

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to database"

**Lösung:**

1. Überprüfe `DATABASE_URL` in Railway Variables
2. Stelle sicher, dass SSL aktiviert ist: `?ssl-mode=REQUIRED`
3. Teste Connection:

```bash
# Lokal via Railway CLI:
railway run pnpm tsx -e "import{db}from'./server/db';console.log(await db.select().from(users).limit(1))"
```

### Problem: "CORS Error" von Squarespace

**Lösung:**

Füge in `server/_core/index.ts` hinzu:

```typescript
app.use(
  cors({
    origin: [
      'https://prostarmarketing.de',
      'https://www.prostarmarketing.de',
      'https://kurse.prostarmarketing.de'
    ],
    credentials: true
  })
);
```

### Problem: "Session cookies not set"

**Lösung:**

Überprüfe Environment-Variablen:

```env
COOKIE_DOMAIN=prostarmarketing.de  # OHNE Subdomain!
COOKIE_SECURE=true
NODE_ENV=production
```

### Problem: "Email not sending"

**Lösung:**

**Für Gmail:**

1. Gehe zu Google Account → Security
2. Enable "2-Step Verification"
3. Gehe zu "App Passwords"
4. Erstelle neues App-Passwort für "Mail"
5. Kopiere Passwort (16 Zeichen ohne Leerzeichen)
6. Setze in Railway: `EMAIL_PASSWORD=abcd efgh ijkl mnop`

**Für AWS SES:**

```env
EMAIL_PROVIDER=ses
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
EMAIL_FROM=ProStar <noreply@prostarmarketing.de>
```

### Problem: "Stripe Webhook failed"

**Lösung:**

1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Klicke "Add endpoint"
3. URL: `https://kurse.prostarmarketing.de/api/stripe/webhook`
4. Events: `checkout.session.completed`
5. Kopiere Signing Secret
6. Setze in Railway: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 📊 Monitoring & Analytics

### Railway Metrics

**Dashboard → Metrics:**

- CPU Usage
- Memory Usage
- Network Traffic
- Request Count
- Response Times

### Custom Analytics

**Google Analytics Integration:**

```html
<!-- In Squarespace Code Injection Footer -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'linker': {
      'domains': ['prostarmarketing.de', 'kurse.prostarmarketing.de']
    }
  });
</script>
```

### Error Tracking

**Sentry Integration (Optional):**

```bash
# Installation
pnpm add @sentry/node @sentry/react

# In server/_core/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});
```

---

## 🔐 Security Best Practices

### 1. Environment-Variablen sichern

✅ **NIE** `.env` Datei committen
✅ Verwende starke JWT Secrets (min. 32 Zeichen)
✅ Rotate Secrets regelmäßig
✅ Verwende separate Keys für Dev/Production

### 2. HTTPS erzwingen

Bereits aktiviert via Railway SSL.

### 3. Rate Limiting aktivieren

Bereits implementiert in `server/middleware/rateLimit.ts`:

```typescript
// 10 Requests pro Minute pro IP
export const loginRateLimit = rateLimit({
  windowMs: 60000,
  max: 10
});
```

### 4. SQL Injection Protection

Bereits geschützt via Drizzle ORM (Prepared Statements).

### 5. XSS Protection

Bereits aktiviert via Security Headers in `server/_core/index.ts`.

---

## 📝 Checkliste: Go-Live

### Pre-Launch

- [ ] Production Build erfolgreich getestet
- [ ] Alle Environment-Variablen gesetzt
- [ ] Database Connection funktioniert
- [ ] Email-Versand funktioniert (Testmail gesendet)
- [ ] Stripe Testmodus funktioniert
- [ ] SSL-Zertifikat aktiv (A+ Rating)
- [ ] DNS-Propagierung abgeschlossen (kurse.prostarmarketing.de)
- [ ] Mobile/Tablet/Desktop getestet
- [ ] Alle Links funktionieren
- [ ] Analytics installiert

### Launch

- [ ] Stripe auf Live-Modus umstellen
- [ ] `NODE_ENV=production` setzen
- [ ] Final Deployment zu Railway
- [ ] DNS-Flush durchführen
- [ ] 5 Test-Registrierungen durchführen
- [ ] Email-Flow komplett testen
- [ ] Zahlungsflow testen

### Post-Launch

- [ ] Monitoring aktivieren (Railway + Analytics)
- [ ] Error Tracking aktivieren (Sentry)
- [ ] Backup-Strategie implementieren
- [ ] Dokumentation aktualisieren
- [ ] Team schulen

---

## 📞 Support & Ressourcen

### Railway Dokumentation
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

### Squarespace Dokumentation
- [Custom Domains](https://support.squarespace.com/hc/en-us/articles/205812378)
- [DNS Settings](https://support.squarespace.com/hc/en-us/articles/360002101888)

### ProStar Dokumentation
- [Lokale Dokumentation](./README.md)
- [Optimizations Guide](../OPTIMIZATIONS.md)
- [Email Integration](./EMAIL_TO_DB_INTEGRATION_GUIDE.md)

---

## 🎉 Fertig!

Deine Kurs-Oberfläche ist jetzt live unter:

**https://kurse.prostarmarketing.de**

Nächste Schritte:
1. Marketing-Kampagne starten
2. Email-Listen aufbauen
3. Conversion-Tracking optimieren
4. Feedback sammeln und iterieren

Viel Erfolg! 🚀
