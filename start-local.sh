#!/bin/bash
echo "🚀 ProStar Landing Page - Lokaler Start (OHNE Docker)"
echo "======================================================"
echo ""

# Prüfe ob pnpm installiert ist
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installiere pnpm..."
    npm install -g pnpm
fi

# Prüfe ob MySQL läuft (lokal oder Docker)
echo "🔍 Prüfe MySQL-Verbindung..."
if ! mysql -h 127.0.0.1 -P 3306 -u root -pProStar2025DB! -e "SELECT 1" &> /dev/null; then
    echo "⚠️  MySQL nicht erreichbar!"
    echo ""
    echo "Option 1: MySQL Container starten"
    echo "  docker run -d --name prostar-mysql \\"
    echo "    -e MYSQL_ROOT_PASSWORD=ProStar2025DB! \\"
    echo "    -e MYSQL_DATABASE=prostar_db \\"
    echo "    -p 3306:3306 \\"
    echo "    mysql:8.0"
    echo ""
    echo "Option 2: Lokales MySQL installieren"
    echo "  brew install mysql"
    echo ""
    read -p "MySQL Container jetzt starten? (j/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[JjYy]$ ]]; then
        docker run -d --name prostar-mysql \
          -e MYSQL_ROOT_PASSWORD=ProStar2025DB! \
          -e MYSQL_DATABASE=prostar_db \
          -p 3306:3306 \
          mysql:8.0
        echo "⏳ Warte 20 Sekunden auf MySQL..."
        sleep 20
    else
        exit 1
    fi
fi

# Aktualisiere .env für lokalen Host
cat > .env << 'ENVEOF'
NODE_ENV=development
PORT=3000

# Database - Local MySQL
DATABASE_URL=mysql://root:ProStar2025DB!@127.0.0.1:3306/prostar_db

# JWT Secret
JWT_SECRET=dev_secret_key_not_secure

# Email
EMAIL_USER=info@prostarmarketing.de
EMAIL_PASSWORD=pefn vhlu yeqm ghll
EMAIL_FROM=ProStar AI <info@prostarmarketing.de>
REPLY_TO_EMAIL=info@prostarmarketing.de
SITE_URL=http://localhost:3000

# ProStar AI
VITE_PROSTAR_AI_URL=https://ai-sales-agent-for-prostar-marketing-1013733494627.us-west1.run.app
VITE_PROSTAR_AI_KEY=AIzaSyDpxE_NS-6pmYrSuUvsv4D_NODVJ8CrjwQ

# Stripe Test
STRIPE_SECRET_KEY=sk_test_dev_mode
STRIPE_WEBHOOK_SECRET=whsec_dev_mode

DEBUG=true
LOG_LEVEL=debug
ENVEOF

# Installiere Dependencies (falls noch nicht geschehen)
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    pnpm install
fi

# Migriere Datenbank
echo "🗄️  Migriere Datenbank..."
pnpm db:push

echo ""
echo "✅ Starte Development Server..."
echo ""
pnpm dev
