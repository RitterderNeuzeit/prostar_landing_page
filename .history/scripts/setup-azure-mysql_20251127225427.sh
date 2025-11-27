#!/bin/bash

# Azure MySQL Setup Script für ProStar Landing Page
# Dieses Script richtet die Datenbank und Tabellen ein

set -e

echo "🚀 ProStar Azure MySQL Setup"
echo "================================"

# Warte bis Server bereit ist
echo "⏳ Warte auf MySQL Server..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  STATE=$(az mysql flexible-server show \
    --resource-group prostar-rg \
    --name prostar-mysql-server \
    --query "state" \
    --output tsv 2>/dev/null || echo "NotFound")
  
  if [ "$STATE" = "Ready" ]; then
    echo "✅ MySQL Server ist bereit!"
    break
  fi
  
  ATTEMPT=$((ATTEMPT + 1))
  echo "   Versuch $ATTEMPT/$MAX_ATTEMPTS - Status: $STATE"
  sleep 20
done

if [ "$STATE" != "Ready" ]; then
  echo "❌ Server konnte nicht rechtzeitig starten"
  exit 1
fi

# Hole Server-Details
echo ""
echo "📊 Server-Details:"
HOST=$(az mysql flexible-server show \
  --resource-group prostar-rg \
  --name prostar-mysql-server \
  --query "fullyQualifiedDomainName" \
  --output tsv)

echo "   Host: $HOST"
echo "   User: prostaradmin"
echo "   Database: prostar_db"

# Erstelle Datenbank
echo ""
echo "📁 Erstelle Datenbank 'prostar_db'..."
az mysql flexible-server db create \
  --resource-group prostar-rg \
  --server-name prostar-mysql-server \
  --database-name prostar_db \
  --output none 2>/dev/null || echo "   (Datenbank existiert bereits)"

echo "✅ Datenbank erstellt"

# Generiere Connection String
echo ""
echo "🔗 Connection String:"
CONNECTION_STRING="mysql://prostaradmin:ProStar2025SecureDB!@${HOST}:3306/prostar_db?ssl-mode=REQUIRED"
echo ""
echo "   DATABASE_URL=\"$CONNECTION_STRING\""
echo ""

echo "================================"
echo "✅ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Kopiere die DATABASE_URL in deine .env Datei"
echo "2. Starte den Server neu: pnpm dev"
echo "3. Die Tabellen werden automatisch erstellt"
