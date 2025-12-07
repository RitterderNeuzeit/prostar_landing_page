#!/bin/bash
echo "🚀 ProStar Landing Page - Development Modus"
echo "=========================================="
echo ""

# Stoppe alte Container
echo "🧹 Räume alte Container auf..."
docker-compose down 2>/dev/null

# Baue und starte Container
echo "🏗️  Baue Docker Images..."
docker-compose build

echo "▶️  Starte Container..."
docker-compose up -d

echo ""
echo "⏳ Warte auf MySQL..."
sleep 15

echo ""
echo "✅ Landing Page läuft!"
echo ""
echo "📍 Öffne in deinem Browser:"
echo "   👉 http://localhost:3000"
echo ""
echo "📊 Logs anzeigen: docker-compose logs -f app"
echo "🛑 Stoppen: docker-compose down"
echo ""
