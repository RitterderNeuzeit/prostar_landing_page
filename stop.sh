#!/bin/bash
echo "🛑 Stoppe ProStar Landing Page..."
echo ""

docker-compose down 2>/dev/null
docker-compose -f docker-compose.prod.yml down 2>/dev/null

echo "✅ Alle Container gestoppt!"
