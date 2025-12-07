#!/bin/bash
# DNS & Railway Deployment Monitor

echo "🔍 DNS & Railway Status Monitor"
echo "================================"
echo ""

echo "1️⃣ DNS CNAME Status:"
echo "-------------------"
CURRENT_CNAME=$(dig kurs.prostarmarketing.de CNAME +short)
echo "Aktuell: $CURRENT_CNAME"
echo ""

if [[ "$CURRENT_CNAME" == *"railway.app"* ]]; then
    echo "✅ DNS zeigt auf Railway!"
else
    echo "❌ DNS zeigt NOCH NICHT auf Railway!"
    echo "   Erwartet: prostarlandingpage-1-production.up.railway.app."
    echo "   Aktuell:  $CURRENT_CNAME"
    echo ""
    echo "👉 AKTION NÖTIG: Ändere DNS bei Google Domains!"
    echo "   Siehe: dns-update-anleitung.sh"
fi

echo ""
echo "2️⃣ Railway App Status:"
echo "---------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://prostarlandingpage-1-production.up.railway.app)
echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Railway App läuft perfekt!"
elif [ "$HTTP_CODE" == "502" ]; then
    echo "❌ Railway App antwortet nicht (502 Bad Gateway)"
    echo "   Mögliche Ursachen:"
    echo "   - Deployment crashed"
    echo "   - Environment Variables fehlen"
    echo "   - Database Connection fehlgeschlagen"
    echo ""
    echo "👉 AKTION NÖTIG:"
    echo "   1. Railway Dashboard öffnen"
    echo "   2. Deployments → Deploy Logs prüfen"
    echo "   3. Variables setzen (siehe RAILWAY_SETUP_KOMPLETT.md)"
else
    echo "⚠️  Unerwarteter Status: $HTTP_CODE"
fi

echo ""
echo "3️⃣ HTTPS Custom Domain Status:"
echo "-----------------------------"
CUSTOM_HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://kurs.prostarmarketing.de)
echo "HTTP Status: $CUSTOM_HTTP_CODE"
echo ""

if [ "$CUSTOM_HTTP_CODE" == "200" ]; then
    echo "✅ Custom Domain funktioniert perfekt!"
    echo "   https://kurs.prostarmarketing.de ist LIVE!"
elif [ "$CUSTOM_HTTP_CODE" == "301" ] || [ "$CUSTOM_HTTP_CODE" == "302" ]; then
    echo "⚠️  Redirect aktiv"
    LOCATION=$(curl -sI https://kurs.prostarmarketing.de | grep -i "location:" | cut -d' ' -f2)
    echo "   Leitet weiter zu: $LOCATION"
    echo ""
    if [[ "$LOCATION" == *"squarespace"* ]]; then
        echo "❌ Leitet noch zu Squarespace!"
        echo "   DNS ist NOCH NICHT propagiert."
        echo "   Warte 15-30 Minuten und teste erneut."
    fi
else
    echo "⚠️  Status: $CUSTOM_HTTP_CODE"
fi

echo ""
echo "4️⃣ SSL Zertifikat:"
echo "-----------------"
SSL_INFO=$(openssl s_client -connect kurs.prostarmarketing.de:443 -servername kurs.prostarmarketing.de </dev/null 2>&1 | grep -A2 "subject=")
if [[ "$SSL_INFO" == *"kurs.prostarmarketing.de"* ]]; then
    echo "✅ SSL-Zertifikat für kurs.prostarmarketing.de vorhanden"
    echo "$SSL_INFO" | head -3
else
    echo "⚠️  SSL-Zertifikat Info:"
    echo "$SSL_INFO" | head -3
fi

echo ""
echo "================================"
echo "📊 ZUSAMMENFASSUNG:"
echo ""

# Finale Status-Bewertung
if [[ "$CURRENT_CNAME" == *"railway.app"* ]] && [ "$HTTP_CODE" == "200" ] && [ "$CUSTOM_HTTP_CODE" == "200" ]; then
    echo "🎉 ALLES FUNKTIONIERT!"
    echo "   ✅ DNS korrekt konfiguriert"
    echo "   ✅ Railway App läuft"
    echo "   ✅ Custom Domain aktiv"
    echo "   ✅ SSL-Zertifikat vorhanden"
    echo ""
    echo "🚀 Deine App ist LIVE unter:"
    echo "   https://kurs.prostarmarketing.de"
elif [[ "$CURRENT_CNAME" != *"railway.app"* ]]; then
    echo "⏳ DNS-Änderung nötig!"
    echo "   1. Ändere DNS CNAME bei Google Domains"
    echo "   2. Führe dieses Script in 30 Min erneut aus"
elif [ "$HTTP_CODE" != "200" ]; then
    echo "🔧 Railway Deployment Problem!"
    echo "   1. Prüfe Railway Deploy Logs"
    echo "   2. Setze Environment Variables"
    echo "   3. Triggere Re-Deploy"
else
    echo "⏳ Custom Domain Setup läuft..."
    echo "   Warte auf DNS Propagation & SSL-Generierung"
fi

echo ""
