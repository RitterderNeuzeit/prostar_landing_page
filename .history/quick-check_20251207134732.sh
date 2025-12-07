#!/bin/bash

# Schneller Railway Status Check
echo "🔍 Railway Deployment Status"
echo "=============================="
echo ""

RAILWAY_URL="prostarlandingpage-1-production.up.railway.app"

echo "Testing: https://$RAILWAY_URL"
echo ""

# Timeout nach 5 Sekunden
HTTP_CODE=$(timeout 5 curl -s -o /dev/null -w "%{http_code}" "https://$RAILWAY_URL" 2>/dev/null || echo "timeout")

echo "Result: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ DEPLOYMENT ERFOLGREICH!"
    echo "✅ Railway App läuft (HTTP 200)"
    echo ""
    echo "🎉 NÄCHSTER SCHRITT: DNS konfigurieren"
    echo ""
    echo "1. Google Domains öffnen: https://domains.google.com"
    echo "2. Domain 'prostarmarketing.de' → DNS"
    echo "3. CNAME 'kurs' ändern zu: $RAILWAY_URL"
    echo ""
    exit 0
elif [ "$HTTP_CODE" = "502" ]; then
    echo "⏳ Railway deployt noch..."
    echo "⏳ Status: HTTP 502 (Deployment in Arbeit)"
    echo ""
    echo "Warte 2-5 Minuten und prüfe erneut:"
    echo "bash quick-check.sh"
    echo ""
    echo "Oder prüfe Railway Logs:"
    echo "https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
    exit 1
elif [ "$HTTP_CODE" = "timeout" ]; then
    echo "⏳ Timeout - Railway deployt wahrscheinlich noch"
    echo ""
    echo "Warte 2-5 Minuten und prüfe erneut:"
    echo "bash quick-check.sh"
    exit 1
else
    echo "⚠️ Unerwarteter Status: $HTTP_CODE"
    echo ""
    echo "Prüfe Railway Dashboard:"
    echo "https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
    exit 1
fi
