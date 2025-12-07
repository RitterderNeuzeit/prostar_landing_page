#!/bin/bash

# Railway Deployment Checker & Auto-Fixer
# ===========================================

echo "🔍 Railway Deployment Status Check"
echo "======================================"
echo ""

RAILWAY_URL="https://prostarlandingpage-1-production.up.railway.app"
DNS_DOMAIN="kurs.prostarmarketing.de"

# 1. Railway App Status prüfen
echo "1️⃣ Prüfe Railway App..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL" --max-time 10)

if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ Railway App läuft (HTTP 200)"
elif [ "$RESPONSE" = "502" ]; then
    echo "   ❌ Railway App crashed (HTTP 502 - Application failed to respond)"
    echo "   📋 LÖSUNG:"
    echo "      → Railway Dashboard öffnen"
    echo "      → Deployment Logs prüfen"
    echo "      → Variables prüfen (DATABASE_URL, JWT_SECRET, etc.)"
    echo "      → Redeploy triggern"
else
    echo "   ⚠️  Railway App Status: HTTP $RESPONSE"
fi

echo ""

# 2. DNS Status prüfen
echo "2️⃣ Prüfe DNS CNAME..."
DNS_CNAME=$(dig +short "$DNS_DOMAIN" CNAME | head -1)

if [[ "$DNS_CNAME" == *"railway.app"* ]]; then
    echo "   ✅ DNS zeigt auf Railway: $DNS_CNAME"
elif [[ "$DNS_CNAME" == *"squarespace"* ]]; then
    echo "   ❌ DNS zeigt noch auf Squarespace: $DNS_CNAME"
    echo "   📋 LÖSUNG:"
    echo "      → Google Domains öffnen: https://domains.google.com"
    echo "      → prostarmarketing.de → DNS"
    echo "      → CNAME 'kurs' ändern von:"
    echo "         $DNS_CNAME"
    echo "      → zu:"
    echo "         prostarlandingpage-1-production.up.railway.app"
else
    echo "   ⚠️  DNS CNAME: $DNS_CNAME"
fi

echo ""

# 3. Custom Domain Status
echo "3️⃣ Prüfe Custom Domain..."
CUSTOM_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DNS_DOMAIN" --max-time 10)

if [ "$CUSTOM_RESPONSE" = "200" ]; then
    echo "   ✅ Custom Domain läuft (HTTP 200)"
elif [ "$CUSTOM_RESPONSE" = "301" ]; then
    LOCATION=$(curl -sI "https://$DNS_DOMAIN" | grep -i "location:" | cut -d' ' -f2-)
    echo "   ⚠️  Redirect zu: $LOCATION"
elif [ "$CUSTOM_RESPONSE" = "502" ]; then
    echo "   ❌ Custom Domain: HTTP 502 (App crashed oder DNS nicht propagiert)"
else
    echo "   ⚠️  Custom Domain Status: HTTP $CUSTOM_RESPONSE"
fi

echo ""
echo "======================================"
echo "📊 ZUSAMMENFASSUNG"
echo "======================================"
echo ""

# Probleme zählen
ISSUES=0

if [ "$RESPONSE" != "200" ]; then
    echo "❌ Problem 1: Railway App antwortet nicht"
    ISSUES=$((ISSUES + 1))
fi

if [[ "$DNS_CNAME" == *"squarespace"* ]]; then
    echo "❌ Problem 2: DNS zeigt noch auf Squarespace"
    ISSUES=$((ISSUES + 1))
fi

if [ "$ISSUES" -eq 0 ]; then
    echo "✅ Keine Probleme gefunden! System läuft."
else
    echo ""
    echo "🔧 Gefundene Probleme: $ISSUES"
    echo ""
    echo "📝 NÄCHSTE SCHRITTE:"
    echo ""
    
    if [ "$RESPONSE" != "200" ]; then
        echo "1. Railway Deployment fixen:"
        echo "   → https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
        echo "   → Service 'prostar_landing_page--1-' öffnen"
        echo "   → Deployments Tab → Deploy Logs prüfen"
        echo "   → Variables Tab → Alle ENV vars setzen"
        echo "   → Redeploy starten"
        echo ""
    fi
    
    if [[ "$DNS_CNAME" == *"squarespace"* ]]; then
        echo "2. DNS CNAME ändern:"
        echo "   → https://domains.google.com"
        echo "   → prostarmarketing.de → DNS → Custom resource records"
        echo "   → Eintrag 'kurs' bearbeiten:"
        echo "      CNAME: prostarlandingpage-1-production.up.railway.app"
        echo ""
    fi
fi

echo ""
echo "🔄 Dieses Script erneut ausführen mit:"
echo "   bash check-deployment.sh"
echo ""
