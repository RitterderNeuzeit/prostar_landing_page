#!/bin/bash

# === SQUARESPACE DOMAIN TROUBLESHOOTING ===
# Diagnostiziert Domain-Kopplungsprobleme

set -e

DOMAIN="prostarmarketing.de"
LOG_FILE="tmp_debug/domain_troubleshooting.log"

mkdir -p tmp_debug

echo "════════════════════════════════════════════════════════════════"
echo "🔍 SQUARESPACE DOMAIN TROUBLESHOOTING"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Domain: $DOMAIN"
echo "Log: $LOG_FILE"
echo ""

# === TEST 1: Aktuelle Nameserver prüfen ===
echo "✓ [TEST 1/5] Prüfe aktuelle Nameserver..."
echo ""
echo "Aktuelle Nameserver für $DOMAIN:" | tee -a "$LOG_FILE"
dig NS $DOMAIN +short | tee -a "$LOG_FILE"
echo ""

# === TEST 2: Squarespace Nameserver erwartet ===
echo "✓ [TEST 2/5] Squarespace Nameserver erwartet:"
echo ""
EXPECTED_NS=(
  "ns1.squarespace.com"
  "ns2.squarespace.com"
  "ns3.squarespace.com"
  "ns4.squarespace.com"
)

for ns in "${EXPECTED_NS[@]}"; do
  echo "  - $ns"
done
echo "" | tee -a "$LOG_FILE"

# === TEST 3: A Records ===
echo "✓ [TEST 3/5] Prüfe A Records (IP Adressen):"
echo ""
dig A $DOMAIN +short | tee -a "$LOG_FILE"
echo ""

# === TEST 4: WHOIS Lookup ===
echo "✓ [TEST 4/5] WHOIS Information:"
echo ""
whois $DOMAIN 2>/dev/null | grep -i "registrar\|nameserver\|status" | head -10 | tee -a "$LOG_FILE" || echo "WHOIS nicht verfügbar"
echo ""

# === TEST 5: SSL Zertifikat ===
echo "✓ [TEST 5/5] SSL Zertifikat Status:"
echo ""
openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | grep -i "subject\|issuer" | tee -a "$LOG_FILE" || echo "SSL nicht erreichbar"
echo ""

# === DIAGNOSE RESULTS ===
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🔧 DIAGNOSE ERGEBNISSE"
echo "════════════════════════════════════════════════════════════════"
echo ""

CURRENT_NS=$(dig NS $DOMAIN +short)

if echo "$CURRENT_NS" | grep -q "squarespace.com"; then
  echo "✅ NAMESERVER: RICHTIG (verweist auf Squarespace)"
  echo "   Status: GRÜN - Nameserver sind korrekt eingestellt"
else
  echo "❌ NAMESERVER: FALSCH (verweist NICHT auf Squarespace)"
  echo "   Status: ROT - Du musst Nameserver bei deinem Registrar ändern"
  echo ""
  echo "   Aktion:"
  echo "   1. Gehe zu deinem Registrar (1&1, Ionos, Strato, etc.)"
  echo "   2. Bearbeite Domain: $DOMAIN"
  echo "   3. Setze diese Nameserver:"
  echo "      - ns1.squarespace.com"
  echo "      - ns2.squarespace.com"
  echo "      - ns3.squarespace.com"
  echo "      - ns4.squarespace.com"
  echo "   4. Speichern"
  echo "   5. Warte 24-48 Stunden auf Propagation"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📋 HÄUFIGE PROBLEME & LÖSUNGEN"
echo "════════════════════════════════════════════════════════════════"
echo ""

cat << 'SOLUTIONS'
PROBLEM 1: "Domain verbunden aber zeigt alte Website"
  URSACHE: Nameserver sind noch nicht aktualisiert
  LÖSUNG:
    1. Warte 24-48 Stunden
    2. Leere Browser Cache (Ctrl+Shift+Del)
    3. Prüfe mit: https://dns.google
    4. Ping: ping prostarmarketing.de

PROBLEM 2: "Squarespace sagt Domain ist nicht verbunden"
  URSACHE: Nameserver bei Registrar nicht geändert
  LÖSUNG:
    1. Gehe zu deinem Registrar (1&1, Ionos, etc.)
    2. Bearbeite Domain-Einstellungen
    3. Ändere Nameserver zu:
       ns1.squarespace.com
       ns2.squarespace.com
       ns3.squarespace.com
       ns4.squarespace.com
    4. Speichern
    5. Warte 24 Stunden

PROBLEM 3: "Registrar erlaubt keine Nameserver-Änderung"
  URSACHE: Domain ist noch bei altem Anbieter gesperrt
  LÖSUNG:
    1. Entsperre Domain bei altem Anbieter
    2. Kopiere Auth-Code
    3. Gehe zu Squarespace
    4. Transferiere Domain
    5. Warte 5-7 Tage auf Tranfer-Bestätigung

PROBLEM 4: "Nur Subdomain verfügbar"
  URSACHE: Root-Domain nicht verfügbar
  LÖSUNG:
    1. Verwende: app.prostarmarketing.de statt prostarmarketing.de
    2. Erstelle CNAME Record:
       Host: app
       Type: CNAME
       Value: prostar-app.squarespace.com
    3. Oder: Kaufe Domain direkt bei Squarespace

PROBLEM 5: "HTTPS funktioniert nicht"
  URSACHE: SSL Zertifikat noch nicht aktiviert
  LÖSUNG:
    1. In Squarespace: Settings → Domains
    2. Wähle: prostarmarketing.de
    3. Klick: "Add SSL Certificate"
    4. Wähle: "Managed Certificate"
    5. Warte 10-30 Minuten
    6. Refresh Browser
SOLUTIONS

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🎯 NÄCHSTE SCHRITTE"
echo "════════════════════════════════════════════════════════════════"
echo ""

cat << 'NEXT'
SOFORT (Jetzt):
  1. Wähle dein Szenario unten
  2. Folge den Schritten
  3. Warte 24-48 Stunden

NACH 24-48 STUNDEN:
  1. Öffne: https://prostarmarketing.de
  2. Sollte auf Squarespace verweisen
  3. Wenn nicht: Wiederhole die Schritte

WENN IMMER NOCH NICHT KLAPPT:
  1. Kontaktiere Squarespace Support (24/7, Deutsch)
  2. Kontaktiere deinen Registrar Support
  3. Siehe: TROUBLESHOOTING weiter oben
NEXT

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "💡 DEIN REGISTRAR?"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Wähle deinen Registrar und folge den Schritten:"
echo ""
echo "1️⃣  1&1 (easyname):"
echo "    → Domain bearbeiten → Nameserver → Benutzerdefiniert"
echo "    → Gib Squarespace Nameserver ein"
echo ""
echo "2️⃣  Ionos:"
echo "    → Domain → Verwaltung → Nameserver"
echo "    → Ändere zu Squarespace Nameserver"
echo ""
echo "3️⃣  Strato:"
echo "    → Domain-Verwaltung → Einstellungen"
echo "    → Nameserver editieren"
echo ""
echo "4️⃣  GoDaddy:"
echo "    → Settings → Nameserver → Ändern"
echo "    → Gib Squarespace Nameserver ein"
echo ""
echo "5️⃣  Dein Registrar nicht aufgelistet?"
echo "    → Googlen: '[Registrar] DNS Nameserver ändern'"
echo "    → Oder Squarespace Support kontaktieren"
echo ""

date >> "$LOG_FILE"
echo "Log gespeichert: $LOG_FILE"
echo "════════════════════════════════════════════════════════════════"
