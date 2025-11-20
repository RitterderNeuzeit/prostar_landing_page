# 🚀 Azure Deployment für prostarmarketing.de

**Status:** ✅ Konfiguriert für Production | **Domain:** prostarmarketing.de | **Subdomain:** app.prostarmarketing.de

---

## 📋 Übersicht

Du deployest auf **Azure App Service** (sicherer, scalierbar, CDN-ready):

- ✅ `.env` konfiguriert (CORS, Database, Analytics)
- ✅ `server/_core/index.ts` CORS-ready
- ✅ `client/index.html` Google Analytics konfiguriert
- ✅ `vite.config.ts` allowedHosts updatet
- ⏳ **Nächst:** Azure Portal setup + Deployment

---

## 🎯 PHASE 1: Azure Portal Setup (15 Min)

### 1.1 Resource Group erstellen

```bash
# Azure CLI (alternativ: Portal → Resource Groups)
az group create \
  --name prostar-rg \
  --location westeurope

# ✅ Notiert: prostar-rg
```

### 1.2 App Service Plan (Linux)

```bash
# Standard Plan für gute Performance + kosteneffizient (~€10-25/Monat)
az appservice plan create \
  --name prostar-plan \
  --resource-group prostar-rg \
  --is-linux \
  --sku B1
  # B1 = 1 Core, 1.75 GB RAM, 40 GB Storage
  # Später upgradebar zu B2, B3, S1, etc.
```

### 1.3 Web App erstellen

```bash
# Node.js 20 LTS
az webapp create \
  --name prostar-app \
  --resource-group prostar-rg \
  --plan prostar-plan \
  --runtime "NODE:20-lts"

# ✅ App URL: https://prostar-app.azurewebsites.net
# (Später Custom Domain hinzufügen → prostarmarketing.de)
```

### 1.4 Environment Variables setzen

```bash
# Über Azure CLI
az webapp config appsettings set \
  --name prostar-app \
  --resource-group prostar-rg \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL="mysql://root:password@localhost:3306/prostar_db" \
    JWT_SECRET="dein_sicherer_jwt_token_hier" \
    VITE_APP_ID="prostar_landing_page_prod" \
    VITE_ANALYTICS_ID="G-XXXXXXXXXX" \
    ALLOWED_ORIGINS="https://prostarmarketing.de,https://www.prostarmarketing.de,https://app.prostarmarketing.de" \
    STRIPE_SECRET_KEY="sk_live_xxx" \
    STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

**Oder Über Azure Portal:**

- Gehe zu **prostar-app** → **Configuration** → **Application settings**
- Klick **+ New application setting**
- Trage alle `.env` Variablen ein

---

## 🌐 PHASE 2: Custom Domain & SSL (10 Min)

### 2.1 Domain auf DNS registrar konfigurieren

**Bei GoDaddy / Namecheap / Ionos:**

Füge ein **CNAME Record** hinzu:

```dns
Host:  @           (oder: app)
Type:  CNAME
Value: prostar-app.azurewebsites.net
TTL:   3600        (oder: 1 Stunde)
```

**Für Subdomains:**

```dns
Host:  app
Type:  CNAME
Value: prostar-app.azurewebsites.net
TTL:   3600
```

### 2.2 Custom Domain in Azure hinzufügen

```bash
# Via CLI
az webapp config hostname add \
  --name prostar-app \
  --resource-group prostar-rg \
  --hostname prostarmarketing.de

# Oder: portal.azure.com → prostar-app → Custom domains → +Add custom domain
```

### 2.3 SSL/TLS Zertifikat (Free)

Azure managed certificate (kostenlos):

1. Portal → **prostar-app** → **TLS/SSL settings**
2. Klick **+ Add Certificate**
3. Select **Managed Certificate**
4. Wähle deine Domain: `prostarmarketing.de`
5. Klick **Validate** (CNAME muss aktiv sein)
6. Click **Create**

✅ ~10 Min warten → Zertifikat ist active!

---

## 📦 PHASE 3: Deployment Setup (20 Min)

### 3.1 Build vorbereiten

```bash
# Lokal: Test Build
cd /Users/user/Downloads/prostar_landing_page\ \(1\)
pnpm build

# ✅ Checklist:
# - dist/public/   (Frontend HTML/CSS/JS)
# - dist/index.js  (Backend Server)
```

### 3.2 Deployment Method: GitHub Actions (Empfohlen)

**Option A: Automatisch mit GitHub Actions**

1. **Azure Login:**

   ```bash
   az login
   # Browser öffnet sich → Authentifiziere dich
   ```

2. **Deployment Credentials erstellen:**

   ```bash
   az webapp deployment list-publishing-profiles \
     --name prostar-app \
     --resource-group prostar-rg \
     --query "[?publishMethod=='MSDeploy'].{URL:publishUrl, User:userName, Password:userPassword}" \
     --output json
   ```

3. **GitHub Actions Workflow (`.github/workflows/azure-deploy.yml`):**

   ```yaml
   name: Deploy to Azure App Service

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: "20"

         - name: Install pnpm
           run: npm install -g pnpm

         - name: Install dependencies
           run: pnpm install

         - name: Build
           run: pnpm build
           env:
             NODE_ENV: production

         - name: Deploy to Azure
           uses: azure/webapps-deploy@v2
           with:
             app-name: "prostar-app"
             publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
             package: dist/
   ```

4. **GitHub Secret hinzufügen:**
   - GitHub Repo → **Settings** → **Secrets and variables** → **Actions**
   - Klick **+ New repository secret**
   - Name: `AZURE_PUBLISH_PROFILE`
   - Value: (Inhalt aus **Publishing Profile** Azure Portal XML)

**Option B: Manual mit Azure CLI (Quick Test)**

```bash
# Lokal: Login
az login

# Deploy
az webapp up \
  --name prostar-app \
  --resource-group prostar-rg \
  --plan prostar-plan

# ✅ App läuft auf: https://prostar-app.azurewebsites.net
```

---

## 🗄️ PHASE 4: Datenbank mit SSH-Tunnel (Optional aber Empfohlen)

Deine lokal MySQL-Datenbank ist **nicht direkt** vom Internet erreichbar (Sicherheit!).

### 4.1 SSH Jump Host Setup (Azure VM optional)

**Option A: Bastion Host (€5-10/Monat)**

- Azure Portal → **Bastions** → **Create**
- Verbindet deine VM sicher

**Option B: VPN (Free Azure)**

- Günstiger: VPN Gateway erstellen
- Oder: SSH-Tunnel über existing server

### 4.2 SSH-Tunnel lokal testen

```bash
# Terminal 1: SSH-Tunnel aufbauen
ssh -i ~/.ssh/id_rsa user@dein-server.de \
  -L 3306:localhost:3306 \
  -N

# Terminal 2: Mit Tunnel verbinden
mysql -h localhost -u root -p -D prostar_db

# ✅ Du bist verbunden!
```

### 4.3 Production: App Service verbindet über VPN

Azure App Service:

- Konfiguriere VPN Route → `.env` verwendet `localhost:3306` über Tunnel
- Oder: MySQL → Azure Database for MySQL (managed, recommended)

---

## ✅ PHASE 5: Testing & Go Live (15 Min)

### 5.1 Health Check

```bash
# 1. Test CORS
curl -H "Origin: https://prostarmarketing.de" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://prostarmarketing.de/api/trpc

# ✅ Header sollten enthalten:
# Access-Control-Allow-Origin: https://prostarmarketing.de

# 2. Test tRPC
curl https://prostarmarketing.de/api/trpc

# ✅ Response: tRPC OK
```

### 5.2 Google Analytics prüfen

1. Öffne https://prostarmarketing.de
2. Öffne Browser DevTools → **Network** Tab
3. Schau nach Request zu `www.googletagmanager.com`
4. Sollte **200 OK** sein
5. Google Analytics Dashboard → **Realtime** → Du solltest sichtbar sein!

### 5.3 SSL/TLS Check

```bash
# Browser: padlock Icon sollte grün sein ✅
# Oder:
curl -I https://prostarmarketing.de
# HTTP/2 200 OK → ✅
```

### 5.4 DNS Propagation

```bash
# Check: Hat deine Domain richtig registriert?
nslookup prostarmarketing.de

# ✅ Sollte: prostar-app.azurewebsites.net zeigen
```

---

## 📊 Kosten Übersicht

| Service                             | Preis                | Details                              |
| ----------------------------------- | -------------------- | ------------------------------------ |
| **App Service Plan B1**             | €10-15/Monat         | Ausreichend für Landing Page         |
| **App Service Plan B2**             | €25-30/Monat         | Upgrade wenn Traffic ↑               |
| **Azure Database MySQL** (optional) | €15-50/Monat         | Falls du lokal nicht nutzen möchtest |
| **Custom Domain**                   | €0 (du hast bereits) | Deine Domain                         |
| **SSL/TLS**                         | €0                   | Azure managed cert (free)            |
| **Bandwidth**                       | €0.12/GB             | Limited im B1 Plan included          |
| **Total: Basic Setup**              | ~€15-20/Monat        | Scalierbar                           |

---

## 🔐 Sicherheit Checklist

- ✅ CORS konfiguriert (nur `prostarmarketing.de`)
- ✅ `.env` secrets nicht committet
- ✅ Database hinter Firewall (lokal/VPN)
- ✅ SSL/TLS enforced
- ✅ JWT Secret generiert
- ⏳ **TODO:** Rate Limiting hinzufügen
- ⏳ **TODO:** DDoS Protection (Azure WAF)

---

## 🚨 Troubleshooting

### App lädt nicht

```bash
# Azure Logs prüfen:
az webapp log tail --name prostar-app --resource-group prostar-rg

# Oder: Azure Portal → Log Stream
```

### CORS Fehler

```bash
# Checke .env ALLOWED_ORIGINS:
echo $ALLOWED_ORIGINS

# Muss EXACTLY deine Domain sein:
# https://prostarmarketing.de,https://www.prostarmarketing.de
# (Keine http:// in Prod!)
```

### Database Connection Error

```bash
# 1. Test MySQL lokal:
mysql -u root -p -D prostar_db

# 2. Prüfe .env DATABASE_URL:
# mysql://root:password@localhost:3306/prostar_db

# 3. SSH-Tunnel aktiv?
ssh user@server -L 3306:localhost:3306 -N
```

---

## 🎯 Nächste Schritte

1. ✅ `.env` für Production gefüllt
2. ✅ Code für Google Analytics ready
3. ⏳ **JETZT:** Azure Portal → Resource Group erstellen
4. ⏳ Custom Domain registrieren (CNAME)
5. ⏳ GitHub Actions oder Manual Deploy
6. ⏳ Testing + Go Live!

---

**Geschätzte Zeit bis Live:** 1-2 Stunden (inkl. DNS Propagation)

📧 **Support:** GitHub Issues oder Sentry Logs
