#!/bin/bash

# PROBLEM 1: DNS bei Google Domains ändern
# =========================================

echo "🌐 DNS-ÄNDERUNG BEI GOOGLE DOMAINS"
echo "===================================="
echo ""
echo "Du musst JETZT bei Google Domains den DNS ändern:"
echo ""
echo "AKTUELL:"
echo "  kurs.prostarmarketing.de → ext-sq.squarespace.com"
echo ""
echo "ÄNDERN ZU:"
echo "  kurs.prostarmarketing.de → prostarlandingpage-1-production.up.railway.app"
echo ""
echo "ANLEITUNG:"
echo "1. Öffne: https://domains.google.com"
echo "2. Klicke auf: prostarmarketing.de"
echo "3. Linke Seite: 'DNS' klicken"
echo "4. Scrolle zu 'Custom resource records' (Benutzerdefinierte Ressourceneinträge)"
echo "5. Suche den Eintrag:"
echo "   Name: kurs"
echo "   Type: CNAME"
echo "   Data: ext-sq.squarespace.com"
echo ""
echo "6. Klicke auf den Stift (Edit/Bearbeiten)"
echo "7. Ändere 'Data' zu: prostarlandingpage-1-production.up.railway.app"
echo "8. TTL: 1H (3600 Sekunden) belassen"
echo "9. Klicke 'Save' (Speichern)"
echo ""
echo "⏱️  WARTEZEIT: 15-60 Minuten (DNS Propagation)"
echo ""
echo "PRÜFEN MIT:"
echo "  dig kurs.prostarmarketing.de CNAME +short"
echo ""
echo "SOLLTE ZEIGEN:"
echo "  prostarlandingpage-1-production.up.railway.app."
echo ""
echo "===================================="
echo ""
read -p "Hast du die DNS-Änderung gemacht? (j/n): " DNS_DONE

if [[ "$DNS_DONE" == "j" ]] || [[ "$DNS_DONE" == "J" ]]; then
    echo ""
    echo "✅ Gut! Warte jetzt 30 Minuten..."
    echo ""
    echo "Du kannst alle 5 Minuten prüfen mit:"
    echo "  dig kurs.prostarmarketing.de CNAME +short"
    echo ""
else
    echo ""
    echo "⚠️  Bitte ändere den DNS zuerst!"
    echo "Ohne DNS-Änderung kann die Custom Domain nicht funktionieren."
    exit 1
fi

echo "===================================="
echo ""

# PROBLEM 2: Railway Variables setzen
# ====================================

echo "🔧 RAILWAY VARIABLES SETZEN"
echo "===================================="
echo ""
echo "Der Railway Deployment ist CRASHED (502 Error)"
echo ""
echo "Das bedeutet: Environment Variables fehlen!"
echo ""
echo "ANLEITUNG:"
echo "1. Öffne: https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
echo "2. Klicke auf Service: 'prostar_landing_page--1-'"
echo "3. Klicke Tab: 'Variables'"
echo "4. Klicke 'Raw Editor' (oben rechts)"
echo "5. Kopiere ALLE diese Variablen hinein:"
echo ""
echo "--- VARIABLES START ---"
echo ""
cat << 'EOF'
# Database (WICHTIG!)
DATABASE_URL=mysql://username:password@server.mysql.database.azure.com:3306/database?ssl-mode=REQUIRED

# Security (WICHTIG!)
JWT_SECRET=GENERIERE_MIT_openssl_rand_hex_32
NODE_ENV=production

# Server
PORT=3000

# URLs (WICHTIG!)
SITE_URL=https://kurs.prostarmarketing.de
OAUTH_SERVER_URL=https://kurs.prostarmarketing.de

# Email
EMAIL_USER=deine-email@gmail.com
EMAIL_PASSWORD=dein-gmail-app-passwort
EMAIL_FROM=ProStar Marketing <deine-email@gmail.com>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
EOF
echo ""
echo "--- VARIABLES END ---"
echo ""
echo "WICHTIG:"
echo "  • DATABASE_URL: Dein Azure MySQL Connection String"
echo "  • JWT_SECRET: Generiere mit: openssl rand -hex 32"
echo "  • EMAIL_PASSWORD: Gmail App-Passwort (nicht dein normales Passwort!)"
echo "  • STRIPE_*: Aus Stripe Dashboard → Developers → API Keys"
echo ""
echo "6. Klicke 'Save'"
echo "7. Railway startet automatisch einen Redeploy"
echo "8. Warte 2-3 Minuten bis Status 'Active' wird"
echo ""
echo "===================================="
echo ""
read -p "Hast du die Variables gesetzt? (j/n): " VARS_DONE

if [[ "$VARS_DONE" == "j" ]] || [[ "$VARS_DONE" == "J" ]]; then
    echo ""
    echo "✅ Gut! Warte 2-3 Minuten auf Deployment..."
    echo ""
    echo "DEPLOYMENT-STATUS PRÜFEN:"
    echo "1. Railway → Deployments Tab"
    echo "2. Status sollte ändern: Building → Deploying → Active"
    echo ""
    echo "WENN FEHLER AUFTRETEN:"
    echo "  • Klicke auf das Deployment"
    echo "  • Scrolle zu 'Deploy Logs'"
    echo "  • Kopiere die letzten 20 Zeilen hierher"
    echo ""
else
    echo ""
    echo "⚠️  Bitte setze die Variables zuerst!"
    echo "Ohne Variables wird das Deployment immer crashen."
    exit 1
fi

echo "===================================="
echo ""

# JWT_SECRET Generator
echo "🔑 JWT_SECRET GENERIEREN"
echo "===================================="
echo ""
echo "Falls du noch kein JWT_SECRET hast:"
echo ""
JWT_SECRET=$(openssl rand -hex 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "Kopiere diese Zeile und füge sie in Railway Variables ein!"
echo ""
echo "===================================="
echo ""

# Warte auf Deployment
echo "⏱️  WARTE AUF DEPLOYMENT"
echo "===================================="
echo ""
echo "Prüfe alle 30 Sekunden ob Railway App läuft..."
echo ""

for i in {1..10}; do
    echo "Versuch $i/10..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://prostarlandingpage-1-production.up.railway.app 2>/dev/null)
    
    if [[ "$HTTP_STATUS" == "200" ]]; then
        echo ""
        echo "✅ SUCCESS! Railway App läuft!"
        echo ""
        echo "🎉 DEPLOYMENT ERFOLGREICH!"
        break
    elif [[ "$HTTP_STATUS" == "502" ]]; then
        echo "   Status: 502 (noch crashed, warte...)"
    else
        echo "   Status: $HTTP_STATUS"
    fi
    
    if [ $i -lt 10 ]; then
        sleep 30
    fi
done

if [[ "$HTTP_STATUS" != "200" ]]; then
    echo ""
    echo "⚠️  Deployment läuft noch nicht nach 5 Minuten"
    echo ""
    echo "PRÜFE DEPLOY LOGS:"
    echo "1. Railway → Deployments → Letztes Deployment"
    echo "2. Scrolle zu 'Deploy Logs'"
    echo "3. Suche nach 'Error' oder 'failed'"
    echo "4. Kopiere relevante Zeilen hierher"
    echo ""
    exit 1
fi

echo "===================================="
echo ""

# Custom Domain hinzufügen
echo "🔒 CUSTOM DOMAIN HINZUFÜGEN"
echo "===================================="
echo ""
echo "Jetzt Custom Domain in Railway einrichten:"
echo ""
echo "ERST WENN:"
echo "  ✅ DNS geändert (Google Domains)"
echo "  ✅ DNS propagiert (30+ Min gewartet)"
echo "  ✅ Railway App läuft (Status 200)"
echo ""
echo "ANLEITUNG:"
echo "1. Railway → Settings → Domains"
echo "2. Klicke 'Custom Domain'"
echo "3. Eingeben: kurs.prostarmarketing.de"
echo "4. Klicke 'Add'"
echo ""
echo "Railway prüft jetzt:"
echo "  • DNS zeigt auf Railway? → SSL-Zertifikat generieren"
echo "  • DNS zeigt woanders? → Fehler anzeigen"
echo ""
echo "SSL-GENERATION: 2-5 Minuten"
echo ""
echo "STATUS PRÜFEN:"
echo "  ✅ Grünes Häkchen → SSL aktiv, fertig!"
echo "  ⏳ Orange Warnung → DNS noch nicht propagiert"
echo "  ❌ Roter Fehler → DNS falsch konfiguriert"
echo ""
echo "===================================="
echo ""

# DNS Propagation Check
echo "🌐 DNS PROPAGATION CHECK"
echo "===================================="
echo ""
echo "Prüfe ob DNS schon propagiert ist..."
echo ""

DNS_CURRENT=$(dig kurs.prostarmarketing.de CNAME +short)
echo "Aktueller DNS: $DNS_CURRENT"
echo ""

if [[ "$DNS_CURRENT" == *"railway"* ]]; then
    echo "✅ DNS ist propagiert!"
    echo ""
    echo "Du kannst JETZT Custom Domain in Railway hinzufügen!"
else
    echo "⏳ DNS noch nicht propagiert (zeigt noch: $DNS_CURRENT)"
    echo ""
    echo "WARTE NOCH:"
    echo "  • DNS-Änderungen brauchen 15-60 Minuten"
    echo "  • Prüfe alle 10 Minuten mit: dig kurs.prostarmarketing.de CNAME +short"
    echo "  • Online prüfen: https://dnschecker.org/#CNAME/kurs.prostarmarketing.de"
fi

echo ""
echo "===================================="
echo ""

# Finale Zusammenfassung
echo "📋 ZUSAMMENFASSUNG"
echo "===================================="
echo ""
echo "STATUS:"
echo ""
echo "1. DNS-Änderung: $(if [[ "$DNS_DONE" == "j" ]]; then echo "✅ Erledigt"; else echo "❌ Ausstehend"; fi)"
echo "2. Railway Variables: $(if [[ "$VARS_DONE" == "j" ]]; then echo "✅ Erledigt"; else echo "❌ Ausstehend"; fi)"
echo "3. Deployment Status: $(if [[ "$HTTP_STATUS" == "200" ]]; then echo "✅ Läuft"; else echo "⚠️ Status $HTTP_STATUS"; fi)"
echo "4. DNS Propagation: $(if [[ "$DNS_CURRENT" == *"railway"* ]]; then echo "✅ Propagiert"; else echo "⏳ Noch nicht"; fi)"
echo ""
echo "NÄCHSTE SCHRITTE:"
echo ""

if [[ "$DNS_CURRENT" == *"railway"* ]] && [[ "$HTTP_STATUS" == "200" ]]; then
    echo "✅ ALLES BEREIT!"
    echo ""
    echo "Füge jetzt Custom Domain in Railway hinzu:"
    echo "  → Railway → Settings → Domains → Custom Domain"
    echo "  → kurs.prostarmarketing.de"
    echo ""
    echo "Nach 5 Min sollte SSL aktiv sein!"
    echo ""
    echo "DANN TESTEN:"
    echo "  → https://kurs.prostarmarketing.de"
    echo "  → Sollte Landing Page zeigen"
    echo "  → Grünes Schloss (SSL)"
    echo ""
elif [[ "$HTTP_STATUS" != "200" ]]; then
    echo "1. ⏱️  Warte auf Railway Deployment (Status: $HTTP_STATUS)"
    echo "2. Prüfe Deploy Logs bei Fehlern"
    echo "3. Dann Custom Domain hinzufügen"
elif [[ "$DNS_CURRENT" != *"railway"* ]]; then
    echo "1. ⏱️  Warte auf DNS Propagation (aktuell: $DNS_CURRENT)"
    echo "2. Prüfe alle 10 Min: dig kurs.prostarmarketing.de CNAME +short"
    echo "3. Dann Custom Domain hinzufügen"
fi

echo ""
echo "===================================="
echo ""
echo "🆘 SUPPORT:"
echo ""
echo "Bei Problemen kopiere hierher:"
echo "  • Railway Deploy Logs (letzte 20 Zeilen)"
echo "  • DNS Status: $(dig kurs.prostarmarketing.de CNAME +short)"
echo "  • HTTP Status: $(curl -s -o /dev/null -w "%{http_code}" https://prostarlandingpage-1-production.up.railway.app 2>/dev/null)"
echo ""
echo "===================================="
echo ""
