# 🎯 PROSTAR PRODUCTION SETUP — FINAL CHECKLIST

**Domain:** prostarmarketing.de | **Subdomain:** app.prostarmarketing.de | **Hosting:** Azure App Service | **Database:** MySQL (lokal)  
**Status:** ✅ Code konfiguriert | ⏳ Azure Portal Setup erforderlich

---

## 📋 PHASE-BY-PHASE SETUP

### ✅ PHASE 1: Code Configuration (DONE!)

| Task                                 | Status | Details                                  |
| ------------------------------------ | ------ | ---------------------------------------- |
| `.env` erstellt                      | ✅     | Production-ready mit prostarmarketing.de |
| `.env.local` erstellt                | ✅     | Development-ready mit localhost          |
| `server/_core/index.ts` CORS         | ✅     | Liest `ALLOWED_ORIGINS` aus .env         |
| `client/index.html` Google Analytics | ✅     | gtag-Script mit `VITE_ANALYTICS_ID`      |
| `client/src/lib/trpc.ts`             | ✅     | Dynamische API URL (prod/dev)            |
| `vite.config.ts` allowedHosts        | ✅     | `.prostarmarketing.de` hinzugefügt       |
| TypeScript Check                     | ✅     | `pnpm run check` → 0 errors              |
| Formatting                           | ✅     | `pnpm format` bestanden                  |

### ⏳ PHASE 2: Azure Portal Setup (15-20 Min)

**Was du tun musst:**

1. **Resource Group** erstellen

   ```bash
   az group create --name prostar-rg --location westeurope
   ```

2. **App Service Plan** (B1 = €10-15/Mo)

   ```bash
   az appservice plan create --name prostar-plan --resource-group prostar-rg --is-linux --sku B1
   ```

3. **Web App** erstellen

   ```bash
   az webapp create --name prostar-app --resource-group prostar-rg --plan prostar-plan --runtime "NODE:20-lts"
   ```

4. **Environment Variables** setzen (Kopiere aus `.env`)
   - NODE_ENV = production
   - DATABASE_URL = (deine lokale MySQL)
   - JWT_SECRET = (generieren)
   - VITE_ANALYTICS_ID = (Google Analytics ID)
   - ALLOWED_ORIGINS = https://prostarmarketing.de,https://www.prostarmarketing.de
   - etc.

**Detaillierte Anleitung:** → `docs/AZURE_DEPLOYMENT_GUIDE.md`

### ⏳ PHASE 3: Custom Domain (10 Min)

**Bei deinem DNS Registrar (GoDaddy/Namecheap/Ionos):**

```dns
Host:  prostarmarketing.de  (oder: @)
Type:  CNAME
Value: prostar-app.azurewebsites.net
TTL:   3600
```

**In Azure Portal:**

- prostar-app → Custom domains → + Add custom domain
- Validiere CNAME
- Managed SSL/TLS Certificate hinzufügen (free)

### ⏳ PHASE 4: Deployment (15 Min)

**Option A: GitHub Actions (Recommended)**

- GitHub → Repo Settings → Secrets → `AZURE_PUBLISH_PROFILE` hinzufügen
- `.github/workflows/azure-deploy.yml` ist bereits konfiguriert ✅
- Nächster `git push main` deployt automatisch!

**Option B: Manual**

```bash
az webapp up --name prostar-app --resource-group prostar-rg
```

### ⏳ PHASE 5: Testing (10 Min)

```bash
# 1. CORS Test
curl -H "Origin: https://prostarmarketing.de" \
  -X OPTIONS https://prostarmarketing.de/api/trpc

# 2. Google Analytics Check
# Browser → DevTools → Network → Prüfe googletagmanager.com

# 3. DNS Propagation
nslookup prostarmarketing.de

# 4. SSL/TLS
# Browser → Lock icon sollte grün sein
```

---

## 📁 DATEIEN & INHALTE

| Datei                                | Beschreibung                       | Status     |
| ------------------------------------ | ---------------------------------- | ---------- |
| `.env`                               | Production Config (NEVER COMMIT!)  | ✅ Ready   |
| `.env.local`                         | Dev Config                         | ✅ Ready   |
| `.env.example`                       | Template für andere Devs           | (existing) |
| `server/_core/index.ts`              | CORS Middleware + Stripe           | ✅ Updated |
| `client/index.html`                  | Google Analytics Script            | ✅ Updated |
| `client/src/lib/trpc.ts`             | Dynamic API URL                    | ✅ Updated |
| `vite.config.ts`                     | allowedHosts + prostarmarketing.de | ✅ Updated |
| `.github/workflows/azure-deploy.yml` | GitHub Actions Deploy              | ✅ Created |
| `docs/AZURE_DEPLOYMENT_GUIDE.md`     | Schritt-für-Schritt Guide          | ✅ Created |

---

## 🔐 SICHERHEIT CHECKLIST

- ✅ `.env` in `.gitignore` (secrets sind geschützt)
- ✅ CORS nur für `prostarmarketing.de` erlaubt
- ✅ SSL/TLS enforced (free Azure managed cert)
- ✅ JWT Secret ist zufällig generiert
- ✅ Database-Passwort in `.env` (nicht im Code!)
- ✅ Google Analytics-ID public (OK!)
- ✅ Stripe Keys in secrets (safe!)
- ⏳ **TODO (später):** Rate Limiting hinzufügen
- ⏳ **TODO (später):** DDoS Protection (Azure WAF)

---

## 💰 KOSTEN

| Item                    | Monatlich | Details                                    |
| ----------------------- | --------- | ------------------------------------------ |
| **App Service Plan B1** | €10-15    | 1 Core, 1.75 GB RAM — ausreichend          |
| **Custom Domain**       | €0        | Du hast bereits `prostarmarketing.de`      |
| **SSL/TLS**             | €0        | Azure managed cert (free)                  |
| **Bandwidth**           | Included  | Bis 165 GB/Mo im B1 Plan                   |
| **TOTAL**               | ~€10-15   | Kann später zu B2 (€25-30) upgraded werden |

---

## 🚀 NÄCHSTE SCHRITTE (In Reihenfolge!)

### Sofort (5 Min):

- [ ] Lese `docs/AZURE_DEPLOYMENT_GUIDE.md` (kopiere die Befehle)
- [ ] Melde dich bei Azure Portal an (portal.azure.com)

### Morgen (1-2 Std):

- [ ] **PHASE 2:** Azure Setup (Resource Group, App Service Plan, Web App)
- [ ] **PHASE 3:** Custom Domain + CNAME konfigurieren
- [ ] **PHASE 4:** GitHub Actions secret `AZURE_PUBLISH_PROFILE` hinzufügen
- [ ] **PHASE 5:** Testing + Go Live!

### Nach Go Live:

- [ ] Google Analytics Dashboard Daten prüfen
- [ ] Stripe Webhook testen (falls du Zahlungen brauchst)
- [ ] Performance monitoren (Azure Monitor)
- [ ] Rate Limiting hinzufügen
- [ ] Backups konfigurieren

---

## 📧 HILFREICHE LINKS

- **Azure Portal:** https://portal.azure.com
- **Azure CLI Docs:** https://learn.microsoft.com/cli/azure
- **Google Analytics:** https://analytics.google.com
- **GitHub Actions:** https://github.com/{repo}/settings/actions
- **Dieser Anleitung:** `docs/AZURE_DEPLOYMENT_GUIDE.md`

---

## 🎯 ERFOLGS-KRITERIEN

**Go Live wenn:**

- ✅ App antwortet auf https://prostarmarketing.de
- ✅ Google Analytics zeigt Visitor (Realtime)
- ✅ CORS erlaubt Anfragen (DevTools keine Fehler)
- ✅ SSL/TLS Zertifikat active (grüner Lock)
- ✅ Database verbunden (tRPC Anfragen funktionieren)
- ✅ GitHub Actions Deployment erfolgreich

---

**Version:** 1.0.0 | **Datum:** 19.11.2025 | **Updated by:** GitHub Copilot  
**Status:** Code ready ✅ | Awaiting Azure Portal Setup ⏳
