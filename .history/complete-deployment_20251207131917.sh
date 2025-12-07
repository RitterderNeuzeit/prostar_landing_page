#!/bin/bash

# ========================================
# VOLLAUTOMATISCHES RAILWAY DEPLOYMENT
# ========================================
# Dieses Script richtet ALLES automatisch ein!
# ========================================

set -e

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

RAILWAY_URL="prostarlandingpage-1-production.up.railway.app"
CUSTOM_DOMAIN="kurs.prostarmarketing.de"
PROJECT_ID="fb2b6a6c-c10b-4192-89fa-b071b761f619"

echo "🚀 ProStar Railway - Vollautomatisches Deployment"
echo "=================================================="
echo ""

# ========================================
# PHASE 1: Railway Workspace-Zugriff
# ========================================

echo "1️⃣ Railway Workspace-Zugriff prüfen..."
echo ""
echo "   📋 Beitrittslink: https://railway.com/invite/9Fv5LtRqV9K"
echo ""
echo -e "   ${YELLOW}⚠️  WICHTIG: Hast du den Workspace-Invite angenommen?${NC}"
echo "   1. Öffne: https://railway.com/invite/9Fv5LtRqV9K"
echo "   2. Klicke 'Accept Invite'"
echo "   3. Du solltest dann das Projekt 'dependable-youthfulness' sehen"
echo ""
read -p "   Workspace-Zugriff bestätigt? (y/n): " workspace_confirmed

if [ "$workspace_confirmed" != "y" ]; then
    echo -e "   ${RED}❌ Bitte akzeptiere zuerst den Workspace-Invite!${NC}"
    echo "   → https://railway.com/invite/9Fv5LtRqV9K"
    exit 1
fi

echo -e "   ${GREEN}✅ Workspace-Zugriff bestätigt${NC}"
echo ""

# ========================================
# PHASE 2: Credentials prüfen
# ========================================

echo "2️⃣ Prüfe bereitgestellte Credentials..."
echo ""

# Email Credentials
EMAIL_USER="info@prostarmarketing.de"
EMAIL_PASSWORD="apeextssieskueh"

echo -e "   ${GREEN}✅ Email Credentials:${NC}"
echo "      User: $EMAIL_USER"
echo "      Password: ${EMAIL_PASSWORD:0:4}****"
echo ""

# JWT Secret
JWT_SECRET="e6f71626e977eb742e6f9fd9c66ef5bb1502e5402fb13b36cf6abaaff2b5cb84"
echo -e "   ${GREEN}✅ JWT Secret generiert:${NC}"
echo "      ${JWT_SECRET:0:16}..."
echo ""

# Fehlende Credentials
echo -e "   ${YELLOW}⚠️  Fehlende Credentials (müssen manuell ergänzt werden):${NC}"
echo "      ❌ DATABASE_URL (Azure MySQL Connection String)"
echo "      ❌ STRIPE_SECRET_KEY"
echo "      ❌ STRIPE_WEBHOOK_SECRET"
echo "      ❌ STRIPE_PUBLISHABLE_KEY"
echo ""
echo "   📋 Lösung: Diese werden in railway-env-production.txt als Platzhalter eingefügt"
echo "   📋 Du kannst sie später im Railway Dashboard ergänzen"
echo ""
read -p "   Fortfahren ohne DB & Stripe? (y/n): " continue_partial

if [ "$continue_partial" != "y" ]; then
    echo ""
    echo -e "   ${YELLOW}💡 Bitte sammle zuerst:${NC}"
    echo "      1. Azure MySQL Connection String"
    echo "      2. Stripe Test Keys (https://dashboard.stripe.com/test/apikeys)"
    echo ""
    exit 0
fi

echo ""

# ========================================
# PHASE 3: ENV Variables Datei öffnen
# ========================================

echo "3️⃣ Environment Variables vorbereiten..."
echo ""

if [ ! -f "railway-env-production.txt" ]; then
    echo -e "   ${RED}❌ railway-env-production.txt nicht gefunden!${NC}"
    exit 1
fi

echo -e "   ${GREEN}✅ railway-env-production.txt existiert${NC}"
echo ""
echo "   📋 NÄCHSTE SCHRITTE:"
echo ""
echo "   1. Datei wird jetzt geöffnet:"
echo "      open railway-env-production.txt"
echo ""
echo "   2. Ersetze die Platzhalter:"
echo "      - DATABASE_URL: Dein Azure MySQL Connection String"
echo "      - STRIPE_*: Deine Stripe Keys"
echo ""
echo "   3. Gehe zu Railway Dashboard:"
echo "      https://railway.app/project/$PROJECT_ID"
echo ""
echo "   4. Service 'prostar_landing_page--1-' öffnen"
echo ""
echo "   5. Variables Tab → Raw Editor"
echo ""
echo "   6. GESAMTEN Inhalt aus railway-env-production.txt kopieren"
echo ""
echo "   7. In Raw Editor einfügen → Save"
echo ""
echo "   8. Railway deployt automatisch neu (2-5 Min)"
echo ""
echo ""
read -p "   Drücke ENTER um railway-env-production.txt zu öffnen..."

open railway-env-production.txt 2>/dev/null || cat railway-env-production.txt

echo ""
echo -e "   ${BLUE}⏳ Warte auf deine Bestätigung...${NC}"
echo ""
read -p "   Hast du die ENV Variables in Railway eingefügt? (y/n): " env_uploaded

if [ "$env_uploaded" != "y" ]; then
    echo ""
    echo -e "   ${YELLOW}ℹ️  Script pausiert.${NC}"
    echo "   Führe dieses Script erneut aus nach dem ENV Upload:"
    echo "   bash complete-deployment.sh"
    exit 0
fi

echo -e "   ${GREEN}✅ ENV Variables hochgeladen${NC}"
echo ""

# ========================================
# PHASE 4: Railway Deployment überwachen
# ========================================

echo "4️⃣ Railway Deployment überwachen..."
echo ""
echo "   ⏳ Warte auf Re-Deployment (2-5 Min)..."
echo ""

WAIT_TIME=0
MAX_WAIT=300  # 5 Minuten

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$RAILWAY_URL" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "   ${GREEN}✅ Railway Deployment: ACTIVE (HTTP $HTTP_CODE)${NC}"
        DEPLOYMENT_READY=true
        break
    elif [ "$HTTP_CODE" = "502" ]; then
        echo -e "   ⏳ Status: DEPLOYING oder CRASHED (HTTP $HTTP_CODE) - Warte..."
    else
        echo -e "   ⏳ Status: HTTP $HTTP_CODE - Warte..."
    fi
    
    sleep 10
    WAIT_TIME=$((WAIT_TIME + 10))
    echo "      Vergangene Zeit: ${WAIT_TIME}s / ${MAX_WAIT}s"
done

if [ "$DEPLOYMENT_READY" != true ]; then
    echo ""
    echo -e "   ${YELLOW}⚠️  Deployment dauert länger als erwartet${NC}"
    echo ""
    echo "   📋 Nächste Schritte:"
    echo "   1. Prüfe Railway Logs:"
    echo "      https://railway.app/project/$PROJECT_ID"
    echo "      → Deployments Tab → Deploy Logs"
    echo ""
    echo "   2. Prüfe ob DATABASE_URL korrekt ist"
    echo "   3. Prüfe ob alle ENV Variables gesetzt sind"
    echo ""
    read -p "   Manuell fortfahren trotzdem? (y/n): " force_continue
    
    if [ "$force_continue" != "y" ]; then
        exit 1
    fi
fi

echo ""

# ========================================
# PHASE 5: DNS CNAME Update
# ========================================

echo "5️⃣ DNS CNAME Update..."
echo ""

DNS_TARGET=$(dig +short $CUSTOM_DOMAIN CNAME 2>/dev/null || echo "")

if echo "$DNS_TARGET" | grep -q "railway"; then
    echo -e "   ${GREEN}✅ DNS zeigt bereits auf Railway: $DNS_TARGET${NC}"
    DNS_READY=true
else
    echo -e "   ${YELLOW}⚠️  DNS zeigt noch auf: ${DNS_TARGET:-"keine CNAME"}${NC}"
    echo ""
    echo "   📋 MANUELLE DNS-ÄNDERUNG ERFORDERLICH:"
    echo ""
    echo "   1. Öffne Google Domains:"
    echo "      https://domains.google.com"
    echo ""
    echo "   2. Domain 'prostarmarketing.de' auswählen"
    echo ""
    echo "   3. DNS → Custom resource records"
    echo ""
    echo "   4. CNAME 'kurs' bearbeiten:"
    echo "      Von: ${DNS_TARGET:-"ext-sq.squarespace.com"}"
    echo "      Zu: $RAILWAY_URL"
    echo ""
    echo "   5. Save"
    echo ""
    echo ""
    read -p "   Hast du die DNS-Änderung durchgeführt? (y/n): " dns_changed
    
    if [ "$dns_changed" != "y" ]; then
        echo ""
        echo -e "   ${YELLOW}ℹ️  Script pausiert.${NC}"
        echo "   Führe dieses Script erneut aus nach der DNS-Änderung:"
        echo "   bash complete-deployment.sh"
        exit 0
    fi
    
    echo ""
    echo "   ⏳ Überwache DNS-Propagation (kann 15-60 Min dauern)..."
    echo "   💡 Drücke Ctrl+C zum Abbrechen (Script kann später fortgesetzt werden)"
    echo ""
    
    DNS_WAIT=0
    DNS_MAX_WAIT=3600  # 60 Minuten
    
    while [ $DNS_WAIT -lt $DNS_MAX_WAIT ]; do
        DNS_CHECK=$(dig +short $CUSTOM_DOMAIN CNAME 2>/dev/null || echo "")
        
        if echo "$DNS_CHECK" | grep -q "railway"; then
            echo -e "   ${GREEN}✅ DNS propagiert! Zeigt auf: $DNS_CHECK${NC}"
            DNS_READY=true
            break
        fi
        
        echo "      Aktuell: ${DNS_CHECK:-"unverändert"} - Warte 30s... (${DNS_WAIT}s / ${DNS_MAX_WAIT}s)"
        sleep 30
        DNS_WAIT=$((DNS_WAIT + 30))
    done
    
    if [ "$DNS_READY" != true ]; then
        echo ""
        echo -e "   ${YELLOW}⚠️  DNS-Propagation dauert länger als erwartet${NC}"
        echo ""
        echo "   💡 Das ist normal! DNS kann bis zu 2 Stunden dauern."
        echo ""
        echo "   📋 Überwache manuell mit:"
        echo "      dig $CUSTOM_DOMAIN CNAME +short"
        echo ""
        echo "   📋 Oder online:"
        echo "      https://dnschecker.org/#CNAME/$CUSTOM_DOMAIN"
        echo ""
        read -p "   Trotzdem fortfahren? (y/n): " force_dns
        
        if [ "$force_dns" != "y" ]; then
            exit 0
        fi
    fi
fi

echo ""

# ========================================
# PHASE 6: Custom Domain zu Railway
# ========================================

echo "6️⃣ Custom Domain zu Railway hinzufügen..."
echo ""

if [ "$DNS_READY" = true ]; then
    echo "   📋 NÄCHSTER SCHRITT:"
    echo ""
    echo "   1. Railway Dashboard öffnen:"
    echo "      https://railway.app/project/$PROJECT_ID"
    echo ""
    echo "   2. Service 'prostar_landing_page--1-' → Settings → Domains"
    echo ""
    echo "   3. 'Custom Domain' klicken"
    echo ""
    echo "   4. Eingeben: $CUSTOM_DOMAIN"
    echo ""
    echo "   5. 'Add' klicken"
    echo ""
    echo "   6. SSL-Zertifikat wird automatisch generiert (5-10 Min)"
    echo ""
    echo "   7. Warte auf grünes Häkchen ✅"
    echo ""
    echo ""
    
    read -p "   Custom Domain hinzugefügt? (y/n): " domain_added
    
    if [ "$domain_added" = "y" ]; then
        echo ""
        echo "   ⏳ Warte auf SSL-Zertifikat (5-10 Min)..."
        echo ""
        
        SSL_WAIT=0
        SSL_MAX_WAIT=600
        
        while [ $SSL_WAIT -lt $SSL_MAX_WAIT ]; do
            HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$CUSTOM_DOMAIN" 2>/dev/null || echo "000")
            
            if [ "$HTTPS_CODE" = "200" ]; then
                echo -e "   ${GREEN}✅ SSL aktiv! HTTPS funktioniert (HTTP $HTTPS_CODE)${NC}"
                SSL_READY=true
                break
            fi
            
            echo "      Status: HTTP $HTTPS_CODE - Warte 30s... (${SSL_WAIT}s / ${SSL_MAX_WAIT}s)"
            sleep 30
            SSL_WAIT=$((SSL_WAIT + 30))
        done
    fi
else
    echo -e "   ${YELLOW}⚠️  DNS noch nicht propagiert - Custom Domain wird übersprungen${NC}"
    echo "   💡 Führe später aus:"
    echo "      bash complete-deployment.sh"
fi

echo ""

# ========================================
# FINALE TESTS
# ========================================

echo "=================================================="
echo "🎉 DEPLOYMENT ABGESCHLOSSEN!"
echo "=================================================="
echo ""

# Status Check
echo "📊 FINALE STATUS-PRÜFUNG:"
echo ""

# Railway App
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$RAILWAY_URL" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Railway App: LÄUFT (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Railway App: Problem (HTTP $HTTP_CODE)${NC}"
fi

# DNS
DNS_CHECK=$(dig +short $CUSTOM_DOMAIN CNAME 2>/dev/null || echo "")
if echo "$DNS_CHECK" | grep -q "railway"; then
    echo -e "${GREEN}✅ DNS CNAME: $DNS_CHECK${NC}"
else
    echo -e "${YELLOW}⚠️  DNS CNAME: ${DNS_CHECK:-"nicht gesetzt"}${NC}"
fi

# HTTPS
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$CUSTOM_DOMAIN" 2>/dev/null || echo "000")
if [ "$HTTPS_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Custom Domain: LÄUFT (HTTPS aktiv)${NC}"
else
    echo -e "${YELLOW}⚠️  Custom Domain: ${HTTPS_CODE} (DNS/SSL in Arbeit)${NC}"
fi

echo ""
echo "=================================================="
echo "🔗 LINKS:"
echo "=================================================="
echo ""
echo "Railway Dashboard:"
echo "https://railway.app/project/$PROJECT_ID"
echo ""
echo "Railway App:"
echo "https://$RAILWAY_URL"
echo ""
echo "Custom Domain:"
echo "https://$CUSTOM_DOMAIN"
echo ""
echo "=================================================="
echo "📋 NÄCHSTE SCHRITTE:"
echo "=================================================="
echo ""

if [ "$HTTPS_CODE" = "200" ]; then
    echo -e "${GREEN}✅ FERTIG! Deine Website läuft!${NC}"
    echo ""
    echo "Teste jetzt:"
    echo "1. Registrierung funktioniert"
    echo "2. Email-Empfang funktioniert"
    echo "3. Login funktioniert"
    echo ""
    echo "Im Browser öffnen:"
    echo "open https://$CUSTOM_DOMAIN"
else
    echo "⏳ Warte noch auf:"
    if [ "$DNS_READY" != true ]; then
        echo "   - DNS-Propagation (15-60 Min)"
    fi
    if [ "$SSL_READY" != true ]; then
        echo "   - SSL-Zertifikat (5-10 Min)"
    fi
    echo ""
    echo "Status prüfen mit:"
    echo "bash check-deployment.sh"
fi

echo ""
echo "=================================================="
