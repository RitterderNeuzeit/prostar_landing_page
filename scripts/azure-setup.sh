#!/bin/bash

# === PROSTAR AZURE AUTOMATION SCRIPT ===
# Automatisiert alle Azure Setup-Schritte für prostarmarketing.de
# Ausführung: bash scripts/azure-setup.sh

set -e  # Stop bei Fehler

RESOURCE_GROUP="prostar-rg"
APP_SERVICE_PLAN="prostar-plan"
WEB_APP="prostar-app"
LOCATION="westeurope"
DOMAIN="prostarmarketing.de"
LOG_FILE="tmp_debug/azure_setup.log"

# Erstelle Log Verzeichnis
mkdir -p tmp_debug

echo "════════════════════════════════════════════════════════════════"
echo "🚀 PROSTAR AZURE AUTOMATION STARTER"
echo "════════════════════════════════════════════════════════════════"
echo "Domain: $DOMAIN"
echo "Region: $LOCATION"
echo "Log: $LOG_FILE"
echo ""
date >> "$LOG_FILE"

# === SCHRITT 1: Resource Group ===
echo "📍 [1/6] Erstelle Resource Group: $RESOURCE_GROUP..."
if az group exists --name "$RESOURCE_GROUP" | grep -q true; then
  echo "   ✅ Existiert bereits"
  echo "   ✅ Resource Group existiert bereits" >> "$LOG_FILE"
else
  echo "   ⏳ Erstelle neu..."
  az group create --name "$RESOURCE_GROUP" --location "$LOCATION" >> "$LOG_FILE" 2>&1
  echo "   ✅ Erstellt!"
fi

# === SCHRITT 2: App Service Plan ===
echo "📍 [2/6] Erstelle App Service Plan: $APP_SERVICE_PLAN..."
if az appservice plan show --name "$APP_SERVICE_PLAN" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
  echo "   ✅ Existiert bereits"
  echo "   ✅ App Service Plan existiert bereits" >> "$LOG_FILE"
else
  echo "   ⏳ Erstelle neu (B1 Plan = €10-15/Mo)..."
  az appservice plan create \
    --name "$APP_SERVICE_PLAN" \
    --resource-group "$RESOURCE_GROUP" \
    --is-linux \
    --sku B1 >> "$LOG_FILE" 2>&1
  echo "   ✅ Erstellt!"
fi

# === SCHRITT 3: Web App ===
echo "📍 [3/6] Erstelle Web App: $WEB_APP..."
if az webapp show --name "$WEB_APP" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
  echo "   ✅ Existiert bereits"
  echo "   ✅ Web App existiert bereits" >> "$LOG_FILE"
else
  echo "   ⏳ Erstelle neu (Node.js 20 LTS)..."
  az webapp create \
    --name "$WEB_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --plan "$APP_SERVICE_PLAN" \
    --runtime "NODE:20-lts" >> "$LOG_FILE" 2>&1
  echo "   ✅ Erstellt!"
  
  # Get default hostname
  DEFAULT_HOST=$(az webapp show --name "$WEB_APP" --resource-group "$RESOURCE_GROUP" --query defaultHostName -o tsv)
  echo "   📍 Default URL: https://$DEFAULT_HOST"
  echo "   📍 Default URL: https://$DEFAULT_HOST" >> "$LOG_FILE"
fi

# === SCHRITT 4: Environment Variables ===
echo "📍 [4/6] Setze Environment Variables..."
az webapp config appsettings set \
  --name "$WEB_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL="mysql://root:password@localhost:3306/prostar_db" \
    JWT_SECRET="dein_super_geheimes_token_hier_min_32_zeichen_lang" \
    VITE_APP_ID="prostar_landing_page_prod" \
    VITE_ANALYTICS_ID="G-XXXXXXXXXX" \
    ALLOWED_ORIGINS="https://$DOMAIN,https://www.$DOMAIN" \
    WEBSITE_NODE_DEFAULT_VERSION="20.9.0" >> "$LOG_FILE" 2>&1
echo "   ✅ Alle Variablen gesetzt!"

# === SCHRITT 5: Custom Domain (wenn DNS schon konfiguriert) ===
echo "📍 [5/6] Füge Custom Domain hinzu: $DOMAIN..."
if az webapp config hostname show --webapp-name "$WEB_APP" --resource-group "$RESOURCE_GROUP" --hostname "$DOMAIN" &>/dev/null; then
  echo "   ✅ Domain ist bereits konfiguriert"
  echo "   ✅ Domain ist bereits konfiguriert" >> "$LOG_FILE"
else
  echo "   ⏳ Registriere Domain..."
  az webapp config hostname add \
    --webapp-name "$WEB_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --hostname "$DOMAIN" >> "$LOG_FILE" 2>&1 || \
  echo "   ⚠️  Domain-Registrierung pending (DNS Propagation nötig)"
  echo "   ✅ Domain-Befehl ausgeführt!"
fi

# === SCHRITT 6: Info & Next Steps ===
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ AZURE SETUP AUTOMATISIERT!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🎯 NÄCHSTE MANUELLE SCHRITTE:"
echo ""
echo "1️⃣  DNS CNAME bei deinem Registrar hinzufügen:"
echo "    Host: @ (oder blank)"
echo "    Type: CNAME"
echo "    Value: $(az webapp show --name "$WEB_APP" --resource-group "$RESOURCE_GROUP" --query defaultHostName -o tsv)"
echo "    TTL: 3600"
echo ""
echo "2️⃣  SSL/TLS Zertifikat in Azure Portal:"
echo "    • Gehe zu: https://portal.azure.com"
echo "    • Suche: $WEB_APP"
echo "    • Settings → TLS/SSL settings"
echo "    • + Add certificate → Managed Certificate"
echo "    • Domain: $DOMAIN"
echo "    • Warte 10-30 Min"
echo ""
echo "3️⃣  GitHub Secret für Auto-Deploy:"
echo "    • Azure Portal → $WEB_APP"
echo "    • Get publish profile (oben rechts)"
echo "    • GitHub → Repo Settings → Secrets → New"
echo "    • Name: AZURE_PUBLISH_PROFILE"
echo "    • Value: (paste XML)"
echo ""
echo "4️⃣  Git Push zum Deployen:"
echo "    git add ."
echo "    git commit -m 'Azure Setup automatisiert'"
echo "    git push origin main"
echo ""
echo "📊 Status: $(az webapp show --name "$WEB_APP" --resource-group "$RESOURCE_GROUP" --query state -o tsv)"
echo "🔗 Default URL: https://$(az webapp show --name "$WEB_APP" --resource-group "$RESOURCE_GROUP" --query defaultHostName -o tsv)"
echo ""
echo "Log gespeichert: $LOG_FILE"
echo "════════════════════════════════════════════════════════════════"
date >> "$LOG_FILE"
