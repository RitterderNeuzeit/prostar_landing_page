#!/bin/bash
set -e

echo "🚀 Railway Auto-Deploy"
echo "===================="

# Prüfe ob Railway CLI installiert ist
if ! command -v railway &> /dev/null; then
    echo "📦 Installiere Railway CLI..."
    npm install -g @railway/cli
fi

# Login und Link zum Projekt
echo "🔐 Railway Setup..."
railway login

# Zum Projekt linken
railway link fb2b6a6c-c10b-4192-89fa-b071b761f619

# ENV Variables setzen
echo "🔑 Setze Environment Variables..."
railway variables set JWT_SECRET="e6f71626e977eb742e6f9fd9c66ef5bb1502e5402fb13b36cf6abaaff2b5cb84"
railway variables set NODE_ENV="production"
railway variables set PORT="3000"
railway variables set SITE_URL="https://kurs.prostarmarketing.de"
railway variables set OAUTH_SERVER_URL="https://kurs.prostarmarketing.de"
railway variables set EMAIL_USER="info@prostarmarketing.de"
railway variables set EMAIL_PASSWORD="apeextssieskueh"
railway variables set EMAIL_FROM="ProStar Marketing <info@prostarmarketing.de>"

# Deploy
echo "🚀 Deploye zu Railway..."
railway up

echo "✅ Deployment gestartet!"
echo "📊 Status: railway status"
echo "📝 Logs: railway logs"
