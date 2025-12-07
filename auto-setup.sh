#!/bin/bash

# ========================================
# Automatisches Railway + DNS Setup
# ========================================
# Dieses Script führt alle automatisierbaren Schritte aus
# und gibt klare Anweisungen für manuelle Schritte.
# ========================================

set -e  # Bei Fehler stoppen

RAILWAY_URL="prostarlandingpage-1-production.up.railway.app"
CUSTOM_DOMAIN="kurs.prostarmarketing.de"
PROJECT_ID="fb2b6a6c-c10b-4192-89fa-b071b761f619"

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🚀 ProStar Railway Deployment - Auto Setup"
echo "=========================================="
echo ""

# ========================================
# SCHRITT 1: Lokaler Build-Check
# ========================================

echo "1️⃣ Prüfe lokalen TypeScript-Code..."

if pnpm run check > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ TypeScript Check erfolgreich${NC}"
else
    echo -e "   ${RED}❌ TypeScript Fehler gefunden!${NC}"
    echo "   → Führe aus: pnpm run check"
    exit 1
fi

echo ""

# ========================================
# SCHRITT 2: Environment Variables generieren
# ========================================

echo "2️⃣ Generiere Environment Variables..."

if [ ! -f "railway-env-vars.txt" ]; then
    echo "   🔑 Generiere JWT_SECRET..."
    JWT_SECRET=$(openssl rand -hex 32)
    
    cat > railway-env-vars.txt << EOF
# ========================================
# Railway Environment Variables
# ========================================
# Kopiere diese Variablen in Railway:
# 1. https://railway.app/project/$PROJECT_ID
# 2. Service öffnen → Variables Tab → Raw Editor
# 3. Alles unten kopieren und einfügen
# 4. <PLATZHALTER> mit echten Werten ersetzen
# 5. Save klicken
# ========================================

# Database (Azure MySQL)
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@<SERVER>.mysql.database.azure.com:3306/<DBNAME>?ssl-mode=REQUIRED

# Authentication
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
PORT=3000

# URLs
SITE_URL=https://$CUSTOM_DOMAIN
OAUTH_SERVER_URL=https://$CUSTOM_DOMAIN

# Email (Gmail mit App-Passwort)
# App-Passwort: https://myaccount.google.com/apppasswords
EMAIL_USER=<DEINE-EMAIL>@gmail.com
EMAIL_PASSWORD=<GMAIL-APP-PASSWORT-16-ZEICHEN>
EMAIL_FROM=ProStar Marketing <<DEINE-EMAIL>@gmail.com>

# Stripe (Test oder Live)
# Test: https://dashboard.stripe.com/test/apikeys
# Live: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_<DEIN-STRIPE-SECRET-KEY>
STRIPE_WEBHOOK_SECRET=whsec_<DEIN-WEBHOOK-SECRET>
STRIPE_PUBLISHABLE_KEY=pk_test_<DEIN-PUBLISHABLE-KEY>

# Optional: Google OAuth
# GOOGLE_CLIENT_ID=<optional>
# GOOGLE_CLIENT_SECRET=<optional>
EOF
    
    echo -e "   ${GREEN}✅ Environment Variables erstellt: railway-env-vars.txt${NC}"
    echo "   🔑 JWT_SECRET: ${JWT_SECRET:0:16}..."
else
    echo -e "   ${GREEN}✅ railway-env-vars.txt existiert bereits${NC}"
fi

echo ""

# ========================================
# SCHRITT 3: Railway Status prüfen
# ========================================

echo "3️⃣ Prüfe Railway Deployment..."

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$RAILWAY_URL" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Railway App läuft (HTTP $HTTP_CODE)${NC}"
    RAILWAY_HEALTHY=true
elif [ "$HTTP_CODE" = "502" ]; then
    echo -e "   ${RED}❌ Railway App crashed (HTTP $HTTP_CODE)${NC}"
    echo -e "   ${YELLOW}→ Environment Variables fehlen!${NC}"
    RAILWAY_HEALTHY=false
else
    echo -e "   ${YELLOW}⚠️  Railway App Status: HTTP $HTTP_CODE${NC}"
    RAILWAY_HEALTHY=false
fi

echo ""

# ========================================
# SCHRITT 4: DNS Status prüfen
# ========================================

echo "4️⃣ Prüfe DNS CNAME..."

DNS_TARGET=$(dig +short $CUSTOM_DOMAIN CNAME)

if [ -z "$DNS_TARGET" ]; then
    echo -e "   ${YELLOW}⚠️  Kein CNAME gefunden für $CUSTOM_DOMAIN${NC}"
    DNS_CORRECT=false
elif echo "$DNS_TARGET" | grep -q "railway"; then
    echo -e "   ${GREEN}✅ DNS zeigt auf Railway: $DNS_TARGET${NC}"
    DNS_CORRECT=true
else
    echo -e "   ${RED}❌ DNS zeigt noch auf: $DNS_TARGET${NC}"
    echo -e "   ${YELLOW}→ Sollte zeigen auf: $RAILWAY_URL${NC}"
    DNS_CORRECT=false
fi

echo ""

# ========================================
# ZUSAMMENFASSUNG & NÄCHSTE SCHRITTE
# ========================================

echo "=========================================="
echo "📊 STATUS ZUSAMMENFASSUNG"
echo "=========================================="
echo ""

PROBLEMS=0

# Railway Status
if [ "$RAILWAY_HEALTHY" = true ]; then
    echo -e "${GREEN}✅ Railway Deployment: GESUND${NC}"
else
    echo -e "${RED}❌ Problem 1: Railway Deployment CRASHED${NC}"
    ((PROBLEMS++))
    echo ""
    echo "   📋 LÖSUNG:"
    echo "   1. Öffne: railway-env-vars.txt"
    echo "   2. Ersetze alle <PLATZHALTER> mit echten Werten"
    echo "   3. Railway öffnen: https://railway.app/project/$PROJECT_ID"
    echo "   4. Service → Variables Tab → Raw Editor"
    echo "   5. Alles kopieren und einfügen → Save"
    echo "   6. Warte 2-5 Min auf Re-Deployment"
    echo ""
fi

# DNS Status
if [ "$DNS_CORRECT" = true ]; then
    echo -e "${GREEN}✅ DNS CNAME: KORREKT${NC}"
else
    echo -e "${RED}❌ Problem 2: DNS CNAME falsch oder fehlt${NC}"
    ((PROBLEMS++))
    echo ""
    echo "   📋 LÖSUNG:"
    echo "   1. Google Domains öffnen: https://domains.google.com"
    echo "   2. Domain 'prostarmarketing.de' auswählen"
    echo "   3. DNS → Custom resource records"
    echo "   4. CNAME 'kurs' bearbeiten:"
    echo "      Von: $DNS_TARGET"
    echo "      Zu: $RAILWAY_URL"
    echo "   5. Save → Warte 15-60 Min auf Propagation"
    echo ""
    echo "   🔄 DNS-Änderungen live überwachen:"
    echo "   watch -n 30 'dig $CUSTOM_DOMAIN CNAME +short'"
    echo ""
fi

echo "=========================================="
echo "🔧 Gefundene Probleme: $PROBLEMS"
echo "=========================================="
echo ""

# ========================================
# NÄCHSTE SCHRITTE
# ========================================

if [ $PROBLEMS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALLES BEREIT!${NC}"
    echo ""
    echo "Nächster Schritt: Custom Domain in Railway hinzufügen"
    echo ""
    echo "1. Railway öffnen: https://railway.app/project/$PROJECT_ID"
    echo "2. Service → Settings → Domains"
    echo "3. 'Custom Domain' klicken"
    echo "4. Eingeben: $CUSTOM_DOMAIN"
    echo "5. 'Add' klicken"
    echo "6. Warte 5-10 Min auf SSL-Zertifikat"
    echo ""
    echo "Danach testen:"
    echo "   curl -I https://$CUSTOM_DOMAIN"
    echo "   open https://$CUSTOM_DOMAIN"
else
    echo "📝 NÄCHSTE SCHRITTE:"
    echo ""
    
    if [ "$RAILWAY_HEALTHY" != true ]; then
        echo "1. 🔴 PRIORITÄT: Railway Environment Variables setzen"
        echo "   → Siehe Anleitung oben"
        echo "   → Datei: railway-env-vars.txt"
        echo "   → Detaillierte Schritte: SOFORT_BEHEBEN.md"
        echo ""
    fi
    
    if [ "$DNS_CORRECT" != true ]; then
        echo "2. 🟡 DNS CNAME aktualisieren"
        echo "   → Siehe Anleitung oben"
        echo "   → Detaillierte Schritte: SOFORT_BEHEBEN.md"
        echo ""
    fi
    
    echo "📖 Vollständige Anleitung:"
    echo "   cat SOFORT_BEHEBEN.md"
    echo ""
    echo "🔄 Dieses Script erneut ausführen:"
    echo "   bash auto-setup.sh"
fi

echo ""
echo "=========================================="

# ========================================
# HILFREICHE COMMANDS
# ========================================

echo ""
echo "💡 HILFREICHE COMMANDS:"
echo ""
echo "# Status prüfen:"
echo "bash check-deployment.sh"
echo ""
echo "# DNS live monitoren:"
echo "watch -n 30 'dig $CUSTOM_DOMAIN CNAME +short'"
echo ""
echo "# Railway App testen:"
echo "curl -I https://$RAILWAY_URL"
echo ""
echo "# Custom Domain testen:"
echo "curl -I https://$CUSTOM_DOMAIN"
echo ""
echo "# Railway Dashboard öffnen:"
echo "open https://railway.app/project/$PROJECT_ID"
echo ""
echo "=========================================="
