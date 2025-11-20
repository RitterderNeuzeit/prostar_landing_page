# 🐳 Docker Deployment für prostarmarketing.de

**Status:** ✅ Docker-ready | **Domain:** prostarmarketing.de | **Container Registry:** Optional (Docker Hub / Azure ACR)

---

## 📋 Übersicht

Docker ermöglicht:
- ✅ **Konsistente Umgebung** (Dev ≈ Prod)
- ✅ **Einfache Skalierung** (mehrere Container)
- ✅ **Schnelle Deployments** (Image wird gepusht)
- ✅ **Lokale MySQL Integration** (optional)
- ✅ **Production-ready** (Logging, Healthchecks, Restart Policies)

---

## 🚀 PHASE 1: Docker Lokal Testen (5 Min)

### 1.1 Development Environment

```bash
# Starte App + MySQL mit einem Befehl
docker-compose up

# ✅ Output:
# app_1    | > pnpm dev
# mysql_1  | ready for connections

# Browser: http://localhost:3000
```

**Was passiert:**
- `app` service: Vite Dev Server + Server Watch (HMR aktiv!)
- `mysql` service: Lokale MySQL DB (Password: `password`)
- Network: Beide Services können sich untereinander erreichen

### 1.2 Production Build lokal testen

```bash
# Build erstellen
docker build -f Dockerfile.prod -t prostar_landing_prod:latest .

# Container starten
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="mysql://root:password@mysql:3306/prostar_db" \
  prostar_landing_prod:latest

# ✅ App lädt auf http://localhost:3000 (prod build)
```

### 1.3 Production Docker Compose

```bash
# Mit .env Variablen
docker-compose -f docker-compose.prod.yml up

# ✅ Both services starten:
# - app (production build)
# - mysql (persistent volume)
```

---

## 🌐 PHASE 2: Docker Registry Setup (Azure oder Docker Hub)

### Option A: Azure Container Registry (Recommended für Azure Deployment)

```bash
# 1. Container Registry erstellen
az acr create \
  --resource-group prostar-rg \
  --name prostarregistry \
  --sku Basic

# 2. Login
az acr login --name prostarregistry

# 3. Image bauen & pushen
az acr build \
  --registry prostarregistry \
  --image prostar_landing:latest \
  --file Dockerfile.prod .

# ✅ Image URL: prostarregistry.azurecr.io/prostar_landing:latest
```

### Option B: Docker Hub (Kostenlos, aber Public)

```bash
# 1. Anmelden bei Docker Hub (kostenlos)
docker login

# 2. Image bauen
docker build -f Dockerfile.prod -t your_username/prostar_landing:latest .

# 3. Pushen
docker push your_username/prostar_landing:latest

# ✅ Image URL: docker.io/your_username/prostar_landing:latest
```

---

## 📦 PHASE 3: Docker Image im Azure App Service nutzen

### 3.1 Container Settings in Azure

```bash
# App Service auf Docker Container umschalten
az webapp config container set \
  --name prostar-app \
  --resource-group prostar-rg \
  --docker-custom-image-name "prostarregistry.azurecr.io/prostar_landing:latest" \
  --docker-registry-server-url "https://prostarregistry.azurecr.io" \
  --docker-registry-server-user <registry-username> \
  --docker-registry-server-password <registry-password>
```

### 3.2 Oder: Über Azure Portal

1. **prostar-app** → **Settings** → **Container settings**
2. Wähle **Image Source**: Azure Container Registry
3. **Registry**: prostarregistry
4. **Image**: prostar_landing
5. **Tag**: latest
6. Speichern → App startet automatisch neu

---

## 🔄 PHASE 4: Automated Docker Builds mit GitHub Actions

### 4.1 GitHub Actions Workflow für Docker

Erstelle `.github/workflows/docker-build.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main
    paths:
      - "Dockerfile.prod"
      - "client/**"
      - "server/**"
      - "package.json"
      - "pnpm-lock.yaml"

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Azure Container Registry
        uses: azure/docker-login@v1
        with:
          login-server: prostarregistry.azurecr.io
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: prostarregistry.azurecr.io/prostar_landing:latest,prostarregistry.azurecr.io/prostar_landing:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Restart Azure App Service
        run: |
          az login --service-principal -u ${{ secrets.AZURE_CLIENT_ID }} \
            -p ${{ secrets.AZURE_CLIENT_SECRET }} \
            --tenant ${{ secrets.AZURE_TENANT_ID }}
          az webapp restart --name prostar-app --resource-group prostar-rg
```

### 4.2 GitHub Secrets hinzufügen

Repo → **Settings** → **Secrets and variables** → **Actions**

```
REGISTRY_USERNAME = <acr-username>
REGISTRY_PASSWORD = <acr-password>
AZURE_CLIENT_ID = <service-principal-id>
AZURE_CLIENT_SECRET = <service-principal-secret>
AZURE_TENANT_ID = <azure-tenant-id>
```

---

## 🗄️ PHASE 5: Docker mit Lokal MySQL Verbinden

### 5.1 Services im gleichen Netzwerk

`docker-compose.yml` & `docker-compose.prod.yml` verwenden bereits `prostar_network`:

```yaml
app:
  networks:
    - prostar_network

mysql:
  networks:
    - prostar_network
```

**Wichtig:** In `.env` nutze:
```env
DATABASE_URL=mysql://root:password@mysql:3306/prostar_db
# 👆 "mysql" = Service-Name (nicht localhost!)
```

### 5.2 Datenbank-Schema initialisieren

```bash
# MySQL Container mit Bash öffnen
docker-compose exec mysql bash

# In MySQL:
mysql -u root -p
# Password: password

# Schema erstellen:
CREATE DATABASE prostar_db;
USE prostar_db;

# Drizzle Migrations ausführen:
# (von Host-Machine)
docker-compose exec app pnpm run db:push
```

---

## 🔐 PHASE 6: Sicherheit & Best Practices

### 6.1 Secrets Management

**Nicht:**
```dockerfile
ENV DATABASE_URL=mysql://root:password@localhost
```

**Stattdessen:**
```yaml
# docker-compose.yml
environment:
  DATABASE_URL: ${DATABASE_URL}  # Kommt aus .env

# .env (gitignore!)
DATABASE_URL=mysql://root:password@mysql:3306/prostar_db
```

### 6.2 Non-root User

Dockerfile hat bereits:
```dockerfile
RUN useradd -m appuser
USER appuser
```

✅ Sicherer als root!

### 6.3 Health Checks

Beide Compose-Files haben Health Checks:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 10s
  timeout: 5s
  retries: 3
```

✅ Docker checkt: Ist der Container gesund?

### 6.4 Log Rotation

Production hat Log Rotation konfiguriert:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"      # Max 10MB pro Datei
    max-file: "3"        # Max 3 Dateien
```

✅ Verhindert, dass Logs Speicher überlasten!

---

## 📊 Docker Commands Reference

```bash
# === Development ===
docker-compose up              # Starte App + MySQL
docker-compose down            # Stoppe beide Services
docker-compose logs -f app     # Folge App Logs
docker-compose exec app bash   # Shell in App Container

# === MySQL ===
docker-compose exec mysql mysql -u root -p   # MySQL Prompt
docker-compose exec mysql mysqldump -u root -p prostar_db > backup.sql

# === Production ===
docker-compose -f docker-compose.prod.yml up          # Starte Prod
docker-compose -f docker-compose.prod.yml down        # Stoppe Prod
docker-compose -f docker-compose.prod.yml ps          # Status

# === Image Management ===
docker build -f Dockerfile.prod -t prostar_landing:latest .
docker tag prostar_landing:latest prostarregistry.azurecr.io/prostar_landing:latest
docker push prostarregistry.azurecr.io/prostar_landing:latest

# === Cleanup ===
docker system prune              # Entferne ungenutzte Images/Volumes
docker image rm prostar_landing  # Lösche spezifisches Image
```

---

## ✅ Testing in Docker

### Test 1: Container startet

```bash
docker-compose up
# Warte auf: "ready for connections" ✅
```

### Test 2: App antwortet

```bash
curl http://localhost:3000
# Sollte HTML zurückgeben ✅
```

### Test 3: Database Verbindung

```bash
docker-compose exec app pnpm run check
# TypeScript Check sollte bestanden ✅
```

### Test 4: Production Image

```bash
docker-compose -f docker-compose.prod.yml up
# App sollte im Production Mode starten ✅
```

---

## 🚀 Deployment Flow mit Docker

```
┌─────────────────┐
│  Local Git Push │
└────────┬────────┘
         │
    GitHub.com
         │
    ┌────▼──────────┐
    │ GitHub Actions│  (docker-build.yml)
    │ - Build Image │
    │ - Push to ACR │
    └────┬──────────┘
         │
    Azure Container Registry
         │
    ┌────▼──────────────┐
    │ Azure App Service │
    │ - Pull Image      │
    │ - Start Container │
    │ - Health Check    │
    └───────┬───────────┘
            │
    ✅ Live on prostarmarketing.de
```

---

## 📋 Docker Checklist

- ✅ `Dockerfile` — Multi-stage build optimiert
- ✅ `Dockerfile.prod` — Production-optimiert
- ✅ `docker-compose.yml` — Dev + MySQL
- ✅ `docker-compose.prod.yml` — Prod + MySQL + Logging
- ✅ `.env.local` — Dev Secrets (gitignore)
- ✅ `.env` — Prod Secrets (gitignore)
- ⏳ **TODO:** `.github/workflows/docker-build.yml` (erstelle diesen)
- ⏳ **TODO:** Azure Container Registry erstellen
- ⏳ **TODO:** App Service auf Docker umschalten

---

## 🎯 Kosten mit Docker

| Szenario | Kosten | Details |
|----------|--------|---------|
| **Dev lokal** | €0 | Kostenlos |
| **Prod on Azure** | €10-15/Mo | App Service B1 |
| **Azure Container Registry** | €5-25/Mo | Abhängig von Speicher |
| **Alternative: Docker Hub** | €0-5/Mo | Free oder Pro |
| **TOTAL mit Docker** | ~€15-25/Mo | Noch kostengünstiger! |

---

## 🔗 Nächste Schritte

1. ✅ `docker-compose up` lokal testen
2. ✅ Production Build mit `docker-compose.prod.yml` testen
3. ⏳ Azure Container Registry erstellen
4. ⏳ GitHub Actions Workflow für Docker Build
5. ⏳ Azure App Service auf Docker umschalten
6. ⏳ Deployment testen & Live gehen!

---

**Dokumentation:** `/docs/DOCKER_DEPLOYMENT.md`  
**Compose Files:** `docker-compose.yml` (dev) + `docker-compose.prod.yml` (prod)  
**Dockerfiles:** `Dockerfile` (dev) + `Dockerfile.prod` (prod)

🚀 Docker ist die Zukunft! Super Setup!
