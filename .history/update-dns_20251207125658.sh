#!/bin/bash

# DNS CNAME Update Anleitung für Google Domains
# ==============================================

echo "🌐 DNS CNAME Update Anleitung"
echo "======================================"
echo ""

DOMAIN="prostarmarketing.de"
SUBDOMAIN="kurs"
OLD_CNAME="ext-sq.squarespace.com"
NEW_CNAME="prostarlandingpage-1-production.up.railway.app"

echo "📋 Aktueller DNS Status:"
echo "   Domain: $SUBDOMAIN.$DOMAIN"
echo "   Zeigt auf: $(dig +short $SUBDOMAIN.$DOMAIN CNAME)"
echo ""
echo "🎯 Ziel:"
echo "   Domain: $SUBDOMAIN.$DOMAIN"
echo "   Soll zeigen auf: $NEW_CNAME"
echo ""
echo "======================================"
echo ""
echo "📝 SCHRITT-FÜR-SCHRITT ANLEITUNG:"
echo ""
echo "1️⃣ Öffne Google Domains:"
echo "   → https://domains.google.com"
echo ""
echo "2️⃣ Domain auswählen:"
echo "   → Klicke auf '$DOMAIN'"
echo ""
echo "3️⃣ DNS-Einstellungen:"
echo "   → Linke Seite: Klicke 'DNS'"
echo ""
echo "4️⃣ Custom Resource Records:"
echo "   → Scrolle zu 'Custom resource records'"
echo "   → SUCHE den Eintrag:"
echo ""
echo "      Name:  $SUBDOMAIN"
echo "      Type:  CNAME"
echo "      Data:  $OLD_CNAME"
echo ""
echo "5️⃣ Eintrag bearbeiten:"
echo "   → Klicke auf das Stift-Symbol (Edit)"
echo "   → ÄNDERE 'Data' von:"
echo "      $OLD_CNAME"
echo "   → zu:"
echo "      $NEW_CNAME"
echo ""
echo "   ⚠️  WICHTIG: Railway URL OHNE 'https://'!"
echo ""
echo "6️⃣ Speichern:"
echo "   → Klicke 'Save'"
echo ""
echo "7️⃣ Warten auf DNS Propagation:"
echo "   → Dauer: 15-60 Minuten"
echo "   → Prüfen mit:"
echo "     dig $SUBDOMAIN.$DOMAIN CNAME +short"
echo ""
echo "======================================"
echo ""
echo "🔍 DNS Propagation Live-Check:"
echo "   → https://dnschecker.org/#CNAME/$SUBDOMAIN.$DOMAIN"
echo ""
echo "✅ DNS ist propagiert wenn mindestens 50% der Standorte grün sind"
echo ""
echo "======================================"
echo ""
echo "🔄 NACH DNS-ÄNDERUNG:"
echo ""
echo "1. Warte 30 Minuten"
echo ""
echo "2. Prüfe DNS lokal:"
echo "   dig $SUBDOMAIN.$DOMAIN CNAME +short"
echo ""
echo "3. Sollte zurückgeben:"
echo "   $NEW_CNAME."
echo ""
echo "4. Wenn erfolgreich, Custom Domain in Railway hinzufügen:"
echo "   → Railway Dashboard → Settings → Domains"
echo "   → 'Custom Domain' klicken"
echo "   → Eingeben: $SUBDOMAIN.$DOMAIN"
echo "   → 'Add' klicken"
echo "   → Railway generiert automatisch SSL (Let's Encrypt)"
echo ""
echo "5. Status-Check ausführen:"
echo "   bash check-deployment.sh"
echo ""
echo "======================================"
echo ""

# DNS Status Live-Monitor
echo "🔄 Möchtest du DNS-Änderungen live monitoren? (y/n)"
read -t 5 -n 1 MONITOR

if [[ $MONITOR == "y" ]]; then
    echo ""
    echo "📡 DNS Live-Monitor gestartet..."
    echo "   Drücke Ctrl+C zum Beenden"
    echo ""
    
    while true; do
        CURRENT_CNAME=$(dig +short $SUBDOMAIN.$DOMAIN CNAME)
        TIMESTAMP=$(date '+%H:%M:%S')
        
        if [[ "$CURRENT_CNAME" == *"railway.app"* ]]; then
            echo "[$TIMESTAMP] ✅ DNS updated: $CURRENT_CNAME"
            echo ""
            echo "🎉 SUCCESS! DNS zeigt jetzt auf Railway!"
            echo ""
            echo "📝 NÄCHSTER SCHRITT:"
            echo "   → Custom Domain in Railway hinzufügen"
            echo "   → https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
            echo "   → Settings → Domains → Custom Domain"
            echo "   → Eingeben: $SUBDOMAIN.$DOMAIN"
            break
        elif [[ "$CURRENT_CNAME" == *"squarespace"* ]]; then
            echo "[$TIMESTAMP] ⏳ Warte auf DNS Propagation... (noch: $CURRENT_CNAME)"
        else
            echo "[$TIMESTAMP] 🔄 DNS: $CURRENT_CNAME"
        fi
        
        sleep 30
    done
else
    echo ""
    echo "💡 DNS Status manuell prüfen mit:"
    echo "   dig $SUBDOMAIN.$DOMAIN CNAME +short"
    echo ""
fi

echo ""
