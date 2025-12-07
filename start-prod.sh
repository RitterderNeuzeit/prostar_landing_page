#!/bin/bash
echo "🚀 ProStar Landing Page - PRODUCTION Modus"
echo "============================================"
echo ""

# Prüfe ob .env.production existiert
if [ ! -f .env.production ]; then
    echo "❌ Fehler: .env.production nicht gefunden!"
    echo "Bitte kopiere .env.production und fülle die Werte aus."
    exit 1
fi

# Stoppe alte Container
echo "🧹 Räume alte Container auf..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null

# Baue Production Images
echo "🏗️  Baue Production Docker Images (kann einige Minuten dauern)..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "▶️  Starte Production Container..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Warte auf Startup..."
sleep 20

echo ""
echo "✅ Landing Page läuft im Production-Modus!"
echo ""
echo "📍 Zugriff:"
echo "   👉 http://localhost (Port 80)"
echo "   👉 https://localhost (Port 443, wenn SSL konfiguriert)"
echo ""
echo "📊 Logs: docker-compose -f docker-compose.prod.yml logs -f app"
echo "🛑 Stoppen: docker-compose -f docker-compose.prod.yml down"
echo ""
echo "⚠️  WICHTIG für öffentlichen Zugriff:"
echo "   1. Firewall/Router: Ports 80 und 443 freigeben"
echo "   2. Domain konfigurieren (A-Record auf deine IP)"
echo "   3. SSL-Zertifikat einrichten (Let's Encrypt empfohlen)"
echo ""
