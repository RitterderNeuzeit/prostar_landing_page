#!/bin/bash
set -e

echo "🚀 AUTO-FIX MODE GESTARTET"
echo "=========================="

MAX_ATTEMPTS=20
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo ""
  echo "[$ATTEMPT/$MAX_ATTEMPTS] Prüfe Railway Status..."
  
  # Teste Railway
  HTTP_CODE=$(curl --max-time 5 -s -o /dev/null -w "%{http_code}" https://prostarlandingpage-1-production.up.railway.app/ || echo "000")
  
  echo "HTTP Status: $HTTP_CODE"
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "✅✅✅ SUCCESS! Railway läuft mit HTTP 200 ✅✅✅"
    echo ""
    echo "Teste Vollständigkeit..."
    RESPONSE=$(curl -s https://prostarlandingpage-1-production.up.railway.app/ | head -100)
    if echo "$RESPONSE" | grep -q "<!DOCTYPE html>"; then
      echo "✅ HTML wird korrekt ausgeliefert!"
      echo ""
      echo "🎉 DEPLOYMENT ERFOLGREICH 🎉"
      exit 0
    else
      echo "⚠️  HTML fehlerhaft, aber Server läuft"
    fi
  elif [ "$HTTP_CODE" = "404" ]; then
    echo "⚠️  Server läuft, aber Route fehlt (404)"
  elif [ "$HTTP_CODE" = "502" ] || [ "$HTTP_CODE" = "000" ]; then
    echo "❌ Server crashed oder deployt noch..."
  fi
  
  echo "Warte 30 Sekunden..."
  sleep 30
  ATTEMPT=$((ATTEMPT + 1))
done

echo ""
echo "❌ MAX ATTEMPTS erreicht - manueller Check nötig"
exit 1
