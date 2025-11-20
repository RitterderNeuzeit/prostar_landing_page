# 📋 URL-Integrations-Checkliste — ProStar Landing Page

**Projekt:** ProStar Landing Page  
**Datum:** 19.11.2025  
**Status:** 📋 **Planung & Vorbereitung**  
**Ziel:** Vollständige URL-Integration vorbereiten

---

## 🎯 Aufgabenliste

### Phase 1: Vorbereitungen (Setup & Konfiguration)

#### 1.1 Umgebungsvariablen (.env) konfigurieren

- [ ] `.env` Datei erstellen (aus `.env.example`)
- [ ] **DATABASE_URL** → MySQL/MariaDB Connection String
  - Format: `mysql://user:password@host:3306/dbname`
  - Lokal: `mysql://root:password@localhost:3306/prostar_db`
- [ ] **JWT_SECRET** → Sichere Random-String generieren
  - `openssl rand -base64 32`
- [ ] **VITE_APP_ID** → App-Identifier definieren
- [ ] **OAUTH_SERVER_URL** → OAuth Provider URL (falls benutzt)
- [ ] **STRIPE_SECRET_KEY** → Stripe API Key (falls Zahlungen benutzt)
- [ ] **STRIPE_WEBHOOK_SECRET** → Stripe Webhook Secret
- [ ] **NODE_ENV** → `development` (lokal) oder `production` (live)
- [ ] **PORT** → `3000` (Standard, oder freier Port)

**Datei:** `.env` (gitignore: JA!)

---

#### 1.2 Domain/Hosting vorbereiten

- [ ] **Domain registrieren/reservieren** (z.B. prostar.de, prostar.ai)
- [ ] **Hosting wählen** (Vercel, Netlify, AWS, Azure, eigenerer Server)
- [ ] **DNS-Einträge planen** (A-Record, CNAME, MX für Email)
- [ ] **SSL/TLS Zertifikat** sicherstellen (Let's Encrypt oder Paid)
- [ ] **Subdomain-Strategie** (www, api, admin, staging, etc.)

**Beispiel DNS-Setup:**

```
Domain: example.com
├── A Record: 203.0.113.1 (production server)
├── CNAME: www.example.com → example.com
├── CNAME: api.example.com → api-server.example.com
├── CNAME: staging.example.com → staging.example.com
└── MX Record: mail.example.com (für Email)
```

---

#### 1.3 Server-URLs in Code identifizieren

- [ ] **API Base URL** definieren
  - Lokal: `http://localhost:3000/api`
  - Production: `https://api.example.com/api`
- [ ] **Client Base URL** definieren
  - Lokal: `http://localhost:3000`
  - Production: `https://example.com`
- [ ] **OAuth Callback URLs** registrieren
- [ ] **Webhook URLs** registrieren (Stripe, etc.)
- [ ] **CORS-Origins** definieren (für API-Zugriff)

---

### Phase 2: Code-Vorbereitung (URL-Handling)

#### 2.1 Environment-basierte URLs in `server/_core/index.ts`

- [ ] **Dynamische Base URL** je nach NODE_ENV
  ```typescript
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.API_DOMAIN_PROD
      : `http://localhost:${process.env.PORT}`;
  ```
- [ ] **CORS Konfiguration** mit erlaubten Origins
  ```typescript
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
  });
  ```
- [ ] **Cookie Samesite/Secure** für Production
  ```typescript
  sameSite: NODE_ENV === "production" ? "strict" : "lax";
  ```

**Datei:** `server/_core/index.ts`

---

#### 2.2 Client-seitige URLs in `client/src/`

- [ ] **Vite API Proxy** konfigurieren (dev mode)
  ```typescript
  // vite.config.ts
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || 3000}`,
        changeOrigin: true
      }
    }
  }
  ```
- [ ] **tRPC Client URL** dynamisch setzen
  ```typescript
  // client/src/lib/trpc.ts
  const apiUrl = import.meta.env.PROD
    ? "https://api.example.com/api/trpc"
    : "http://localhost:3000/api/trpc";
  ```
- [ ] **API Endpoints** auf Env-Variablen prüfen
  ```typescript
  const VITE_API_BASE = import.meta.env.VITE_API_BASE || "/api";
  ```

**Dateien:**

- `vite.config.ts`
- `client/src/lib/trpc.ts`
- `client/src/const.ts` (falls API-Konstanten dort)

---

#### 2.3 OAuth/Auth-URLs

- [ ] **OAuth Server URL** in `server/_core/oauth.ts` konfigurieren
- [ ] **Callback URLs** für OAuth Provider eintragen
- [ ] **Redirect URLs** nach Login definieren
  - Lokal: `http://localhost:3000/oauth/callback`
  - Production: `https://example.com/oauth/callback`
- [ ] **Session/JWT Tokens** auf neue Domain vorbereiten

**Datei:** `server/_core/oauth.ts`

---

#### 2.4 Stripe Webhook URLs

- [ ] **Webhook Endpoint URL** registrieren
  - Production: `https://api.example.com/api/stripe/webhook`
  - Staging: `https://staging-api.example.com/api/stripe/webhook`
- [ ] **Webhook Signing Secret** aktualisieren
- [ ] **Event Handler** für neue URL testen

**Datei:** `server/routes/stripe.ts`, `server/stripe/webhooks.ts`

---

#### 2.5 Datenbank-Migrations prüfen

- [ ] **DATABASE_URL** in `.env` gesetzt
- [ ] **Migrations ausführen:** `pnpm run db:push`
- [ ] **Seed-Daten** (falls vorhanden) für neue Domain anpassen

**Befehle:**

```bash
pnpm run db:push  # Migrations
```

---

### Phase 3: Build & Deployment-Vorbereitung

#### 3.1 Production Build testen

- [ ] **Build durchführen:** `pnpm build`
- [ ] **Build-Output prüfen:** `dist/public/` (Client) + `dist/index.js` (Server)
- [ ] **Größe überprüfen** (sollte nicht >5MB sein)
- [ ] **Alle Assets vorhanden?** (CSS, JS, Fonts)

**Befehle:**

```bash
pnpm run check    # TypeScript
pnpm lint         # Format & Duplikate
pnpm build        # Production Build
```

---

#### 3.2 Production Server vorbereiten

- [ ] **Node.js Version** auf Server installiert
  - Required: Node.js 20+
  - Check: `node --version`
- [ ] **PM2 oder ähnlich** für Process Management
  ```bash
  npm install -g pm2
  pm2 start dist/index.js --name prostar
  ```
- [ ] **Env-File auf Server** deployed
- [ ] **Database Connection** vom Server erreichbar
- [ ] **Reverse Proxy** (Nginx/Apache) konfigurieren

**Nginx Beispiel:**

```nginx
server {
  listen 443 ssl;
  server_name api.example.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

#### 3.3 Domain Konfiguration

- [ ] **DNS A-Record** → Server IP
- [ ] **SSL/TLS Zertifikat** aktiv
- [ ] **HSTS Headers** (Sicherheit)
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```
- [ ] **CSP Headers** (Content Security Policy)
- [ ] **CORS Headers** korrekt

---

### Phase 4: Testing & Validierung

#### 4.1 Lokal testen (Dev Mode)

- [ ] **Dev Server starten:** `pnpm dev`
- [ ] **Localhost:3000 laden** → OK?
- [ ] **API Calls testen** (Inspector Network Tab)
- [ ] **OAuth Flow testen** (falls implementiert)
- [ ] **Cookies/Sessions testen** (auch Cross-Domain?)

**Befehle:**

```bash
pnpm dev  # Dev-Server mit HMR
```

---

#### 4.2 Production Simulation (lokal)

- [ ] **Build durchführen:** `pnpm build`
- [ ] **Production Server starten:** `NODE_ENV=production node dist/index.js`
- [ ] **Localhost:3000 laden** → OK?
- [ ] **Assets korrekt geladen?** (CSS, JS, Fonts)
- [ ] **API funktioniert?**

**Befehle:**

```bash
pnpm build
NODE_ENV=production node dist/index.js
```

---

#### 4.3 Staging-Umgebung testen

- [ ] **Staging-Domain einrichten** (staging.example.com)
- [ ] **Code auf Staging deployen**
- [ ] **Alle Features testen** gegen neue Domain
- [ ] **Performance überprüfen** (Lighthouse)
- [ ] **Security Check** (SSL, Headers, etc.)

---

#### 4.4 Production Checklist

- [ ] **Backup erstellt** (DB + Code)
- [ ] **Monitoring eingerichtet** (Sentry, DataDog, etc.)
- [ ] **Logging aktiviert** (Error Tracking)
- [ ] **Analytics aktiviert** (Google Analytics, Hotjar, etc.)
- [ ] **Email Notifications konfiguriert** (Alerts)
- [ ] **Notfall-Runbook** verfasst (Rollback-Plan)

---

### Phase 5: Post-Deployment

#### 5.1 Domain/URL Finalisierung

- [ ] **DNS Propagation überprüft** (`nslookup`, `dig`)
- [ ] **SSL Zertifikat aktiv** und gültig
- [ ] **Robots.txt** konfiguriert (SEO)
- [ ] **Sitemap.xml** vorhanden
- [ ] **Canonical URLs** in HTML gesetzt

**Beispiel Robots.txt:**

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

#### 5.2 Monitor & Maintain

- [ ] **Daily Health Checks** (Server Status)
- [ ] **Weekly Backups** überprüft
- [ ] **Monthly Security Audits**
- [ ] **Analytics Dashboard** eingerichtet
- [ ] **Error Logs** regelmäßig überprüft

---

## 📊 Datei-Übersicht (zu bearbeiten)

| Datei                     | Bereich  | Aufgaben                  | Priorität   |
| ------------------------- | -------- | ------------------------- | ----------- |
| `.env`                    | Config   | Env-Variablen setzen      | 🔴 KRITISCH |
| `server/_core/index.ts`   | Backend  | CORS, URL-Config, Cookies | 🔴 KRITISCH |
| `server/_core/oauth.ts`   | Auth     | OAuth URLs, Callbacks     | 🟠 HOCH     |
| `server/routes/stripe.ts` | Payments | Stripe Webhook URLs       | 🟠 HOCH     |
| `vite.config.ts`          | Frontend | API Proxy, Host-Config    | 🟠 HOCH     |
| `client/src/lib/trpc.ts`  | Frontend | tRPC API URL              | 🟠 HOCH     |
| `client/src/const.ts`     | Frontend | API Endpoints             | 🟠 HOCH     |
| `drizzle/schema.ts`       | DB       | (keine Änderungen nötig)  | 🟢 OK       |
| `package.json`            | Build    | (keine Änderungen nötig)  | 🟢 OK       |

---

## 🔗 URL-Muster (Beispiel)

### Lokale Entwicklung

```
Frontend:    http://localhost:3000
API:         http://localhost:3000/api
tRPC:        http://localhost:3000/api/trpc
OAuth:       http://localhost:3000/oauth/callback
Stripe WH:   http://localhost:3000/api/stripe/webhook
Database:    mysql://root:pw@localhost:3306/prostar_db
```

### Production (Beispiel: example.com)

```
Frontend:    https://example.com
API:         https://api.example.com/api
tRPC:        https://api.example.com/api/trpc
OAuth:       https://example.com/oauth/callback
Stripe WH:   https://api.example.com/api/stripe/webhook
Database:    mysql://dbuser:secure_pw@db.example.com/prostar_db
Staging:     https://staging.example.com
```

---

## 🛠️ Schnell-Start Anweisungen

### Schritt 1: `.env` erstellen

```bash
cp .env.example .env
# Dann alle Variablen in .env ausfüllen
```

### Schritt 2: Lokal testen

```bash
pnpm install
pnpm dev  # Test auf http://localhost:3000
```

### Schritt 3: Build & Production Test

```bash
pnpm run check    # TypeScript
pnpm build        # Production Build
NODE_ENV=production node dist/index.js
```

### Schritt 4: Auf Server deployen

```bash
# Code hochladen + .env auf Server
# Dependencies installieren
npm install --production
# PM2 oder Service starten
pm2 start dist/index.js --name prostar
```

---

## 📋 Checklisten-Status

| Phase | Name                  | Status     | Notes                    |
| ----- | --------------------- | ---------- | ------------------------ |
| **1** | Vorbereitungen        | ⏳ Pending | Env & Domain-Setup       |
| **2** | Code-Vorbereitung     | ⏳ Pending | URLs in Code integrieren |
| **3** | Build & Deployment    | ⏳ Pending | Production-Ready machen  |
| **4** | Testing & Validierung | ⏳ Pending | Alle Features testen     |
| **5** | Post-Deployment       | ⏳ Pending | Monitoring & Maintenance |

---

## 🎯 DEINE KONFIGURATION (Spezifisch)

**Angaben:**

- ✅ **Subdomain:** Ja (z.B. `app.example.com` oder `api.example.com`)
- ✅ **Hosting:** Azure App Service ODER eigenerer Server
- ✅ **Datenbank:** Lokal (MySQL/MariaDB) — aber SSH-Tunnel zum Server
- ✅ **Analytics:** Google Analytics integriert
- ❓ **Domain:** (noch zu definieren — z.B. prostar.de)

---

## 🚀 ANGEPASSTER SETUP-PLAN (Für deine Konfiguration)

### Schritt 1: Domain & DNS (Was du selbst tun musst)

```
Domain: example.com (bei Registrar wie GoDaddy, Namecheap, etc.)

DNS-Records zu setzen:
├── Subdomain 1: app.example.com → Azure/Server IP oder Azure DNS
├── Subdomain 2: api.example.com → Azure/Server IP oder Azure DNS
└── MX Record: mail.example.com → (falls Email nötig)
```

**Wo man DNS-Records setzt:**

- GoDaddy: https://www.godaddy.com/
- Namecheap: https://www.namecheap.com/
- Ionos: https://www.ionos.com/
- etc.

---

### Schritt 2: Azure App Service Setup (Wenn du Azure nimmst)

#### 2.1 Azure Ressourcen erstellen

```bash
# Oder über Azure Portal (einfacher):
# 1. Resource Group erstellen (z.B. "prostar-rg")
# 2. App Service Plan erstellen (z.B. B1 - $10-15/Monat)
# 3. App Service erstellen (Node.js 20 LTS)
# 4. Custom Domain hinzufügen (app.example.com)
# 5. SSL/TLS Zertifikat (kostenlos via Azure)
```

**Links:**

- Azure Portal: https://portal.azure.com
- App Service Pricing: https://azure.microsoft.com/pricing/details/app-service/windows/

#### 2.2 Environment Variables in Azure setzen

```
Azure Portal → App Service → Configuration → Application Settings

Füge hinzu:
- DATABASE_URL = mysql://user:password@localhost:3306/prostar_db
- JWT_SECRET = (generieren: openssl rand -base64 32)
- VITE_APP_ID = prostar-app
- VITE_ANALYTICS_ID = G-XXXXXXXXXX (Google Analytics)
- NODE_ENV = production
- PORT = 8080 (Azure Standard)
```

#### 2.3 Deployment zu Azure

```bash
# Option A: Git Integration (einfachste Methode)
# 1. GitHub mit Azure verbinden
# 2. Branch "main" Auto-Deploy konfigurieren
# 3. Jeder Commit = Auto-Build & Deploy

# Option B: Azure CLI
az webapp up --name prostar-app --resource-group prostar-rg

# Option C: GitHub Actions (CI/CD)
# .github/workflows/azure-deploy.yml
```

---

### Schritt 3: Eigenerer Server Setup (Alternative zu Azure)

Wenn du selbst einen Server hosten möchtest:

#### 3.1 Server-Anforderungen

```
Betriebssystem: Ubuntu 22.04 LTS (oder deine Wahl)
RAM: mind. 2 GB
Storage: mind. 20 GB SSD
Node.js: 20 LTS
Nginx: Reverse Proxy
PM2: Process Manager
```

#### 3.2 Server-Setup (SSH Terminal)

```bash
# SSH zum Server
ssh user@your-server-ip

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# pnpm installieren
npm install -g pnpm

# App-Code klonen
git clone https://github.com/your-repo.git /home/user/prostar
cd /home/user/prostar

# Dependencies
pnpm install --production

# Build
pnpm build

# PM2 installieren & starten
npm install -g pm2
pm2 start dist/index.js --name prostar
pm2 startup
pm2 save

# Nginx konfigurieren (siehe unten)
```

#### 3.3 Nginx Reverse Proxy (Server)

```nginx
# /etc/nginx/sites-available/prostar

upstream prostar_app {
    server localhost:3000;
}

server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://prostar_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name app.example.com;
    return 301 https://$server_name$request_uri;
}
```

#### 3.4 SSL/TLS Zertifikat (Let's Encrypt)

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# Zertifikat generieren
sudo certbot certonly --standalone -d app.example.com

# Auto-Renewal einrichten
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

### Schritt 4: Lokale Datenbank mit SSH-Tunnel

Da du die Datenbank lokal haben möchtest:

#### 4.1 MySQL lokal installieren (Entwicklung)

```bash
# macOS
brew install mysql

# Ubuntu/Linux
sudo apt install mysql-server

# Start
mysql.server start

# Superuser erstellen
mysql -u root
  CREATE USER 'prostar'@'localhost' IDENTIFIED BY 'secure_password';
  CREATE DATABASE prostar_db;
  GRANT ALL PRIVILEGES ON prostar_db.* TO 'prostar'@'localhost';
  FLUSH PRIVILEGES;
```

#### 4.2 Lokale DB vom Server erreichen (SSH Tunnel)

Wenn Server auf Azure/extern ist, aber DB lokal bleibt:

```bash
# SSH Tunnel zur DB (vom Server aus)
ssh -L 3306:localhost:3306 your-local-machine-ip

# Dann in .env auf Server:
DATABASE_URL=mysql://prostar:password@localhost:3306/prostar_db
```

**ODER:** DB lokal halten, Server greift via SSH darauf zu:

```bash
# .env auf Server:
DATABASE_URL=mysql://prostar:password@your-local-ip:3306/prostar_db

# Firewall: MySQL Port 3306 öffnen (nur für Server-IP!)
```

---

### Schritt 5: Google Analytics Integration

#### 5.1 Google Analytics Konto erstellen

1. https://analytics.google.com → Sign in mit Google Account
2. "Create Account" → Property erstellen
3. **Tracking ID** kopieren (Format: `G-XXXXXXXXXX`)

#### 5.2 In Code integrieren

```typescript
// client/src/main.tsx
import { initializeAnalytics } from "@firebase/analytics";

// Oder: Google Analytics via gtag

declare global {
  interface Window {
    dataLayer: any[];
    gtag: Function;
  }
}

// Script in client/index.html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

#### 5.3 Analytics Tracking Events

```typescript
// Beispiel: Track Button Click
function trackEvent(eventName: string, eventData?: any) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventData);
  }
}

// Nutzen:
<button onClick={() => trackEvent("purchase_complete", { value: 99.99 })}>
  Kaufen
</button>
```

---

## 📋 ANGEPASSTE CHECKLISTE (Für DEINE Konfiguration)

### Phase 1: Setup

- [ ] **Domain registrieren** (z.B. prostar.de)
- [ ] **DNS Records hinzufügen** für Subdomain (z.B. app.example.com)
- [ ] **Azure Resource Group** erstellen (oder Server mieten)
- [ ] **MySQL lokal installieren** + Datenbank erstellen
- [ ] **Google Analytics Account** erstellen → Tracking ID notieren
- [ ] `.env` Datei erstellen mit:
  ```
  DATABASE_URL=mysql://prostar:password@localhost:3306/prostar_db
  JWT_SECRET=(openssl rand -base64 32)
  VITE_APP_ID=prostar
  VITE_ANALYTICS_ID=G-XXXXXXXXXX
  NODE_ENV=production
  ALLOWED_ORIGINS=https://app.example.com
  ```

### Phase 2: Code anpassen

- [ ] `server/_core/index.ts` → CORS für neue Domain anpassen
- [ ] `client/index.html` → Google Analytics Script einfügen
- [ ] `vite.config.ts` → Env-Variablen laden
- [ ] `client/src/lib/trpc.ts` → API URL dynamisch setzen

### Phase 3: Build & Deploy

- [ ] `pnpm build` → Production Build
- [ ] zu Azure deployen (oder zu eigenem Server via Git/FTP)
- [ ] Environment Variables in Azure/Server setzen
- [ ] Database Migrations: `pnpm run db:push`

### Phase 4: Testing

- [ ] Website öffnen: https://app.example.com
- [ ] Google Analytics prüfen (Events kommen an?)
- [ ] API Calls testen
- [ ] SSL/TLS aktiv?

---

## 🎯 NÄCHSTE SCHRITTE (FÜR DICH)

1. **Domain-Name entscheiden** (z.B. `prostar.de`)
2. **Subdomain-Namen entscheiden** (z.B. `app.prostar.de` oder `api.prostar.de`)
3. **Azure vs. eigenerer Server entscheiden**
4. **Dann:** Ich passe `.env` und Code an ✅

**Sobald du diese 4 Infos hast, beginne ich mit der konkreten Umsetzung!**

---

**Stand:** 19.11.2025 | **Spezifisch für:** Subdomain, Azure/Server, Lokale DB, Google Analytics
