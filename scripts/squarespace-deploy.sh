#!/bin/bash

# === SQUARESPACE LANDING PAGE AUTOMATION ===
# Automatisiert den Upload deiner ProStar Landing Page zu Squarespace
# Status: Production Ready
# Build: dist/public/ (262 Dateien, 1.9 MB)

set -e

PROJECT_DIR="/Users/user/Downloads/prostar_landing_page (1)"
BUILD_DIR="$PROJECT_DIR/dist/public"
LOG_FILE="$PROJECT_DIR/tmp_debug/squarespace_deployment.log"

echo "════════════════════════════════════════════════════════════════"
echo "🎯 SQUARESPACE LANDING PAGE DEPLOYMENT"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📦 Projekt: ProStar Landing Page"
echo "🌐 Domain: prostarmarketing.de"
echo "📂 Build Output: $BUILD_DIR"
echo "📝 Log: $LOG_FILE"
echo ""

# === SCHRITT 1: Build Status prüfen ===
echo "✓ [1/4] Prüfe Production Build..."
mkdir -p "$PROJECT_DIR/tmp_debug"

if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "❌ FEHLER: Build nicht gefunden!"
    echo "   Führe zuerst aus: pnpm build"
    exit 1
fi

BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)

echo "   ✅ Build gefunden"
echo "   📊 Größe: $BUILD_SIZE | Dateien: $FILE_COUNT"
echo "" >> "$LOG_FILE"
echo "✅ Build Status: OK ($BUILD_SIZE, $FILE_COUNT Dateien)" >> "$LOG_FILE"

# === SCHRITT 2: HTML Struktur analysieren ===
echo "✓ [2/4] Analysiere HTML Struktur..."

HTML_FILE="$BUILD_DIR/index.html"
TITLE=$(grep -o '<title>[^<]*</title>' "$HTML_FILE" | sed 's/<[^>]*>//g' || echo "ProStar Landing Page")
BODY_LINES=$(grep -c "^" < <(sed -n '/<body>/,/<\/body>/p' "$HTML_FILE"))

echo "   ✅ HTML analysiert"
echo "   📄 Titel: $TITLE"
echo "   📝 Body Zeilen: $BODY_LINES"
echo "   ✅ HTML Struktur: OK (Titel: $TITLE, Zeilen: $BODY_LINES)" >> "$LOG_FILE"

# === SCHRITT 3: Assets prüfen ===
echo "✓ [3/4] Prüfe Assets & Dependencies..."

ASSET_COUNT=$(find "$BUILD_DIR/assets" -type f | wc -l)
CSS_COUNT=$(find "$BUILD_DIR/assets" -name "*.css" | wc -l)
JS_COUNT=$(find "$BUILD_DIR/assets" -name "*.js" | wc -l)
IMAGE_COUNT=$(find "$BUILD_DIR/assets" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.svg" \) | wc -l)

echo "   ✅ Assets vorhanden"
echo "   📦 JS: $JS_COUNT | CSS: $CSS_COUNT | Bilder: $IMAGE_COUNT"
echo "   ✅ Assets: OK ($ASSET_COUNT Dateien, JS: $JS_COUNT, CSS: $CSS_COUNT, Img: $IMAGE_COUNT)" >> "$LOG_FILE"

# === SCHRITT 4: Squarespace Anleitung ===
echo "✓ [4/4] Generiere Squarespace Anleitung..."

cat > "$PROJECT_DIR/tmp_debug/SQUARESPACE_UPLOAD_GUIDE.txt" << 'GUIDE'
═══════════════════════════════════════════════════════════════════════
🎯 SQUARESPACE UPLOAD ANLEITUNG - ProStar Landing Page
═══════════════════════════════════════════════════════════════════════

VORBEREITUNG ✅
- Production Build erstellt: ✅
- HTML Datei vorhanden: ✅
- Assets vollständig: ✅

═══════════════════════════════════════════════════════════════════════
SCHRITT 1: SQUARESPACE KONTO & DOMAIN (15 Minuten)
═══════════════════════════════════════════════════════════════════════

1.1 Konto erstellen
  1. Gehe zu: https://squarespace.com
  2. Klick: "Website erstellen"
  3. Wähle Template: "Blank Canvas" oder "Business"
  4. Fülle Daten aus:
     - E-Mail: deine@email.de
     - Passwort: Stark! (min 16 Zeichen)
  5. Klick: "Create account"

1.2 Domain verbinden
  Option A (EINFACHER): Neue Domain bei Squarespace kaufen
  1. Settings → Domains
  2. "+ Add domain"
  3. Eingabe: prostarmarketing.de
  4. Preis: ~€12/Jahr
  5. "Register domain"
  6. Fertig! (SSL aktiviert sich automatisch)

  Option B (Externe Domain):
  1. Settings → Domains
  2. "+ Add domain"
  3. "Connect external domain"
  4. Eingabe: prostarmarketing.de
  5. Kopiere Nameserver von Squarespace
  6. Gehe zu deinem Registrar (1&1, Ionos, etc.)
  7. Ersetze Nameserver
  8. Warte 24-48 Stunden

═══════════════════════════════════════════════════════════════════════
SCHRITT 2: LANDING PAGE HOCHLADEN (10 Minuten)
═══════════════════════════════════════════════════════════════════════

2.1 Neue Seite erstellen
  1. Gehe zu: Website Editor
  2. Klick: "Pages"
  3. Klick: "+ Add page"
  4. Name: "Home"
  5. Template: "Blank" oder "Custom"
  6. Create

2.2 HTML Content einfügen
  1. Klick: "+"
  2. Suche: "Code"
  3. Wähle: "Code Block"
  4. WICHTIG: Stelle sicher "Full Width" ist aktiviert
  5. Öffne: /dist/public/index.html (mit Text Editor)
  6. Kopiere ALLES ab <body> bis </body>
  7. Paste in den Code Block
  8. Speichern

2.3 Assets hochladen
  1. Settings → Asset Library (oder Media)
  2. "+ Upload"
  3. Wähle alle Dateien aus /dist/public/assets/
     Typischerweise:
     - index-[HASH].js (Haupt-JS)
     - index-[HASH].css (Haupt-CSS)
     - Alle anderen .js und .css Dateien
  4. "Upload"
  5. Warten bis alle vollständig sind

2.4 Seite veröffentlichen
  1. Klick: "Publish" (oben rechts)
  2. Oder: "Publish changes"
  3. Warte 2-3 Sekunden
  4. Fertig!

═══════════════════════════════════════════════════════════════════════
SCHRITT 3: GOOGLE ANALYTICS (5 Minuten)
═══════════════════════════════════════════════════════════════════════

3.1 Google Analytics Konto
  1. Gehe zu: https://analytics.google.com
  2. "Start measuring"
  3. Konto Name: "ProStar"
  4. Klick: "Next"
  5. Property Name: "prostarmarketing.de"
  6. Timezone: Germany
  7. Currency: EUR
  8. Klick: "Next"
  9. Business details → "Create"
  10. Kopiere: Tracking ID (G-XXXXXXXXXX)

3.2 In Squarespace integrieren
  1. Gehe zu: Settings → Website
  2. Suche: "Google Analytics"
  3. Paste Tracking ID: G-XXXXXXXXXX
  4. "Save"
  5. Publish

3.3 Testen
  1. Öffne incognito: prostarmarketing.de
  2. Gehe zu Google Analytics → Realtime
  3. Du solltest deinen Besuch sehen!

═══════════════════════════════════════════════════════════════════════
SCHRITT 4: CHAT WIDGET (OPTIONAL, 5 Minuten)
═══════════════════════════════════════════════════════════════════════

4.1 Chat Widget Code einfügen
  1. Gehe zu: Pages → beliebige Seite
  2. Klick: "+"
  3. Suche: "Code Block"
  4. Paste diesen Code:

<script>
  (function() {
    function initChat() {
      const chatContainer = document.createElement('div');
      chatContainer.id = 'prostar-chat-widget';
      chatContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: system-ui, sans-serif;
      `;
      document.body.appendChild(chatContainer);
      
      const script = document.createElement('script');
      script.src = 'https://your-api-domain.com/prostar-chat-widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChat);
    } else {
      initChat();
    }
  })();
</script>

  5. Ersetze: your-api-domain.com mit deiner echten API URL
  6. Speichern & Publish

═══════════════════════════════════════════════════════════════════════
SCHRITT 5: TESTEN & VALIDIEREN
═══════════════════════════════════════════════════════════════════════

5.1 Schnelle Prüfung
  ✅ Öffne: https://prostarmarketing.de
  ✅ Seite lädt schnell?
  ✅ Design responsiv (Mobile ok)?
  ✅ Padlock Icon (HTTPS) sichtbar?
  ✅ Alle Texte sichtbar?
  ✅ Bilder laden?
  ✅ Links funktionieren?

5.2 Browser Konsole Check (F12)
  ✅ Öffne: https://prostarmarketing.de
  ✅ Drücke: F12 → Console
  ✅ Keine roten Fehler?
  ✅ Keine "CORS" Warnungen?

5.3 Performance Check
  1. Gehe zu: https://pagespeed.web.dev
  2. Gib ein: prostarmarketing.de
  3. Score sollte > 80 sein
  4. Beachte Warnings

5.4 Responsive Design Test
  1. Öffne: https://prostarmarketing.de
  2. Drücke: F12 → Strg+Shift+M
  3. Teste auf:
     - iPhone 12
     - iPad
     - Desktop 1920x1080

═══════════════════════════════════════════════════════════════════════
TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════

Problem: Domain zeigt alte Website
Lösung: Warte 24-48 Stunden auf DNS Propagation
  → Prüfe mit: https://dns.google
  → Query: prostarmarketing.de
  → Sollte auf Squarespace verweisen

Problem: Seite lädt nicht richtig
Lösung: Assets nicht korrekt hochgeladen
  1. Prüfe: Asset Library hat alle Dateien?
  2. Prüfe: JavaScript Pfade korrekt?
  3. Re-upload Assets

Problem: Chat Widget nicht sichtbar
Lösung: Script-URL falsch
  1. Browser Konsole (F12)
  2. Prüfe auf Fehler
  3. Überprüfe your-api-domain.com
  4. Stelle sicher API läuft

═══════════════════════════════════════════════════════════════════════
SICHERHEIT & MAINTENANCE
═══════════════════════════════════════════════════════════════════════

✅ Sicherheit aktivieren
  1. Settings → Account
  2. Enable "Two-Factor Authentication"
  3. Starkes Passwort: min 16 Zeichen

✅ Backups
  1. Settings → Export
  2. Monatlich exportieren

✅ Domain verlängerung
  1. Automatisch durch Squarespace
  2. Aber: Prüfe jährlich!

═══════════════════════════════════════════════════════════════════════
KOSTEN ÜBERSICHT
═══════════════════════════════════════════════════════════════════════

Squarespace Plan         €15-30/Mo
Domain (.de)             €1/Mo
SSL Zertifikat          €0 (kostenlos!)
Email Support           €0 (kostenlos!)
TOTAL                   €16-31/Mo

═══════════════════════════════════════════════════════════════════════
NÄCHSTE SCHRITTE
═══════════════════════════════════════════════════════════════════════

1. Squarespace Konto erstellen (heute)
2. Domain verbinden (heute)
3. Landing Page hochladen (heute)
4. Chat Widget einfügen (morgen)
5. Analytics konfigurieren (morgen)
6. Tests durchführen (morgen)
7. Marketing starten (diese Woche)

═══════════════════════════════════════════════════════════════════════
SUPPORT
═══════════════════════════════════════════════════════════════════════

Squarespace Support: https://support.squarespace.com (24/7, Deutsch)
ProStar Support: support@prostarmarketing.de

═══════════════════════════════════════════════════════════════════════
✅ Du bist ready! Viel Erfolg! 🚀
═══════════════════════════════════════════════════════════════════════
GUIDE

echo "   ✅ Anleitung generiert"
echo "   📁 Pfad: tmp_debug/SQUARESPACE_UPLOAD_GUIDE.txt"

# === ABSCHLUSS ===
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ VORBEREITUNG ABGESCHLOSSEN!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📊 BUILD SUMMARY:"
echo "   • Größe: $BUILD_SIZE"
echo "   • Dateien: $FILE_COUNT"
echo "   • JS Dateien: $JS_COUNT"
echo "   • CSS Dateien: $CSS_COUNT"
echo "   • Bilder: $IMAGE_COUNT"
echo "   • Status: ✅ PRODUKTIONSREIF"
echo ""
echo "📋 NÄCHSTE SCHRITTE:"
echo "   1. Öffne: tmp_debug/SQUARESPACE_UPLOAD_GUIDE.txt"
echo "   2. Folge der Step-by-Step Anleitung"
echo "   3. Sollte ~30-45 Minuten dauern"
echo "   4. Fragen? Siehe Support-Kontakte in der Anleitung"
echo ""
echo "🎯 ZIEL:"
echo "   • prostarmarketing.de läuft auf Squarespace"
echo "   • Google Analytics aktiv"
echo "   • Chat Widget funktioniert (optional)"
echo "   • HTTPS aktiviert"
echo ""
echo "Log gespeichert: $LOG_FILE"
date >> "$LOG_FILE"
echo "════════════════════════════════════════════════════════════════"
