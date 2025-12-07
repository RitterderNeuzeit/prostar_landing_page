#!/bin/bash

# Railway Deployment Fix Script
# Automatische Problemlösung für prostarlandingpage-1-production

echo "🔍 RAILWAY DEPLOYMENT DIAGNOSE"
echo "================================"
echo ""

# Problem 1: DNS Check
echo "📡 DNS-Status prüfen..."
DNS_RESULT=$(dig kurs.prostarmarketing.de CNAME +short)
echo "Aktueller CNAME: $DNS_RESULT"

if [[ "$DNS_RESULT" == *"squarespace"* ]]; then
    echo "❌ PROBLEM: DNS zeigt noch auf Squarespace!"
    echo ""
    echo "🔧 LÖSUNG:"
    echo "1. Öffne: https://domains.google.com"
    echo "2. Wähle: prostarmarketing.de → DNS"
    echo "3. Finde CNAME-Eintrag: kurs → ext-sq.squarespace.com"
    echo "4. ÄNDERE zu: prostarlandingpage-1-production.up.railway.app"
    echo "5. Speichern"
    echo ""
elif [[ "$DNS_RESULT" == *"railway"* ]]; then
    echo "✅ DNS korrekt konfiguriert: $DNS_RESULT"
else
    echo "⚠️  DNS-Status unklar: $DNS_RESULT"
fi

echo ""
echo "================================"
echo ""

# Problem 2: Railway App Check
echo "🚀 Railway App testen..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://prostarlandingpage-1-production.up.railway.app 2>/dev/null)
echo "HTTP Status: $HTTP_STATUS"

if [[ "$HTTP_STATUS" == "502" ]]; then
    echo "❌ PROBLEM: Railway App crashed (502 Bad Gateway)"
    echo ""
    echo "🔧 LÖSUNG:"
    echo "1. Öffne: https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
    echo "2. Klicke Service: prostar_landing_page--1-"
    echo "3. Tab: Deployments"
    echo "4. Letztes Deployment → Deploy Logs anzeigen"
    echo ""
    echo "HÄUFIGSTE FEHLER:"
    echo "  • DATABASE_URL fehlt oder falsch"
    echo "  • JWT_SECRET nicht gesetzt"
    echo "  • PORT Variable fehlt"
    echo "  • Email-Konfiguration fehlt"
    echo ""
    echo "QUICK FIX:"
    echo "  • Tab 'Variables' öffnen"
    echo "  • Alle nötigen Variables setzen (siehe RAILWAY_SETUP_KOMPLETT.md)"
    echo "  • Save → Auto-Redeploy startet"
    echo ""
elif [[ "$HTTP_STATUS" == "200" ]]; then
    echo "✅ Railway App läuft korrekt!"
elif [[ "$HTTP_STATUS" == "000" ]]; then
    echo "⚠️  Keine Verbindung zu Railway möglich"
else
    echo "⚠️  Unerwarteter Status: $HTTP_STATUS"
fi

echo ""
echo "================================"
echo ""

# Problem 3: Custom Domain Check
echo "🔒 Custom Domain & SSL testen..."
CUSTOM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://kurs.prostarmarketing.de 2>/dev/null)
echo "kurs.prostarmarketing.de Status: $CUSTOM_STATUS"

if [[ "$CUSTOM_STATUS" == "301" ]]; then
    echo "⚠️  Redirect (wahrscheinlich noch Squarespace)"
    LOCATION=$(curl -sI https://kurs.prostarmarketing.de | grep -i "^location:" | cut -d' ' -f2)
    echo "   Leitet um zu: $LOCATION"
    echo ""
    echo "→ DNS muss geändert werden (siehe oben)"
elif [[ "$CUSTOM_STATUS" == "200" ]]; then
    echo "✅ Custom Domain funktioniert!"
    echo ""
    echo "🎉 ALLES FERTIG!"
else
    echo "⚠️  Status: $CUSTOM_STATUS"
fi

echo ""
echo "================================"
echo ""
echo "📋 NÄCHSTE SCHRITTE:"
echo ""

# Entscheidungsbaum
if [[ "$DNS_RESULT" == *"squarespace"* ]]; then
    echo "SCHRITT 1: DNS ÄNDERN (Google Domains)"
    echo "SCHRITT 2: 30 Min warten (DNS Propagation)"
    echo "SCHRITT 3: Custom Domain in Railway hinzufügen"
elif [[ "$HTTP_STATUS" == "502" ]]; then
    echo "SCHRITT 1: Railway Variables setzen"
    echo "SCHRITT 2: Deploy Logs prüfen"
    echo "SCHRITT 3: Fehler beheben & Redeploy"
else
    echo "SCHRITT 1: Custom Domain in Railway hinzufügen"
    echo "   → Railway → Settings → Domains → Custom Domain"
    echo "   → kurs.prostarmarketing.de eingeben"
    echo "   → SSL wird automatisch generiert"
fi

echo ""
echo "================================"
echo ""
echo "🆘 SUPPORT:"
echo "Bei Problemen kopiere die Deploy Logs aus Railway hierher!"
echo ""
