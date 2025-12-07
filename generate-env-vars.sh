#!/bin/bash

# Railway Environment Variables Generator
# =========================================

echo "🔧 Railway Environment Variables Generator"
echo "=========================================="
echo ""
echo "Dieses Script generiert alle benötigten Environment Variables für Railway."
echo ""

# Generiere JWT_SECRET
echo "🔑 Generiere JWT_SECRET..."
JWT_SECRET=$(openssl rand -hex 32)
echo "   ✅ JWT_SECRET generiert: ${JWT_SECRET:0:20}..."
echo ""

# Erstelle .env Datei für Railway
ENV_FILE="railway-env-vars.txt"

cat > "$ENV_FILE" << EOF
# ========================================
# Railway Environment Variables
# ========================================
# Kopiere diese Variablen in Railway:
# 1. Railway Dashboard → Service → Variables Tab
# 2. Klicke "Raw Editor"
# 3. Kopiere ALLES unten und füge es ein
# 4. Ersetze <PLATZHALTER> mit deinen echten Werten
# 5. Klicke "Save"
# ========================================

# Database (Azure MySQL)
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@<SERVER>.mysql.database.azure.com:3306/<DBNAME>?ssl-mode=REQUIRED

# Authentication
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
PORT=3000

# URLs
SITE_URL=https://kurs.prostarmarketing.de
OAUTH_SERVER_URL=https://kurs.prostarmarketing.de

# Email (Gmail mit App-Passwort)
# App-Passwort erstellen: https://myaccount.google.com/apppasswords
EMAIL_USER=<DEINE-EMAIL>@gmail.com
EMAIL_PASSWORD=<GMAIL-APP-PASSWORT-16-ZEICHEN>
EMAIL_FROM=ProStar Marketing <<DEINE-EMAIL>@gmail.com>

# Stripe (Test oder Live Keys)
# Test Keys: https://dashboard.stripe.com/test/apikeys
# Live Keys: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_<DEIN-STRIPE-SECRET-KEY>
STRIPE_WEBHOOK_SECRET=whsec_<DEIN-WEBHOOK-SECRET>
STRIPE_PUBLISHABLE_KEY=pk_test_<DEIN-PUBLISHABLE-KEY>

# Optional: Google OAuth
# GOOGLE_CLIENT_ID=<optional>
# GOOGLE_CLIENT_SECRET=<optional>

# Optional: AWS SES (statt Gmail)
# AWS_REGION=eu-west-1
# AWS_ACCESS_KEY_ID=<optional>
# AWS_SECRET_ACCESS_KEY=<optional>
EOF

echo "✅ Environment Variables Datei erstellt: $ENV_FILE"
echo ""
echo "📋 NÄCHSTE SCHRITTE:"
echo ""
echo "1. Öffne die Datei zum Bearbeiten:"
echo "   open $ENV_FILE"
echo ""
echo "2. Ersetze alle <PLATZHALTER> mit deinen echten Werten:"
echo "   - DATABASE_URL: Dein Azure MySQL Connection String"
echo "   - EMAIL_USER: Deine Gmail-Adresse"
echo "   - EMAIL_PASSWORD: Gmail App-Passwort (16 Zeichen ohne Leerzeichen)"
echo "   - STRIPE_*: Deine Stripe API Keys"
echo ""
echo "3. Kopiere den GESAMTEN Inhalt (inkl. Kommentare)"
echo ""
echo "4. Gehe zu Railway:"
echo "   https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619"
echo ""
echo "5. Service 'prostar_landing_page--1-' → Variables Tab → Raw Editor"
echo ""
echo "6. Füge alles ein und klicke 'Save'"
echo ""
echo "7. Railway startet automatisch ein Re-Deployment"
echo ""
echo "=========================================="
echo ""

# Öffne Datei automatisch
if command -v open &> /dev/null; then
    echo "📝 Öffne Datei zum Bearbeiten..."
    open "$ENV_FILE"
else
    echo "💡 Öffne die Datei manuell:"
    echo "   cat $ENV_FILE"
fi

echo ""
echo "🔄 Nach dem Speichern in Railway:"
echo "   bash check-deployment.sh"
echo ""
