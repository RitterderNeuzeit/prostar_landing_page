#!/bin/bash

# === DNS MONITORING DAEMON ===
# 🤖 Überwacht DNS Propagation automatisch
# Prüft jede Stunde auf Squarespace Nameserver

PROJECT_DIR="/Users/user/Downloads/prostar_landing_page (1)"
LOG_DIR="$PROJECT_DIR/tmp_debug"
DNS_LOG="$LOG_DIR/dns_monitor.log"
DOMAIN="prostarmarketing.de"
EXPECTED_NS="squarespace.com"
MAX_RETRIES=48  # 48 Stunden
RETRY_INTERVAL=3600  # 1 Stunde

mkdir -p "$LOG_DIR"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] DNS Monitor Started" >> "$DNS_LOG"
echo "Domain: $DOMAIN" >> "$DNS_LOG"
echo "Expected: ns1.squarespace.com" >> "$DNS_LOG"
echo "Interval: Every $RETRY_INTERVAL seconds (1h)" >> "$DNS_LOG"
echo "Max Retries: $MAX_RETRIES (48h timeout)" >> "$DNS_LOG"
echo "=====================================" >> "$DNS_LOG"

RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  CURRENT_NS=$(dig NS $DOMAIN +short 2>/dev/null | head -1 || echo "unknown")
  TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')
  
  if echo "$CURRENT_NS" | grep -q "$EXPECTED_NS"; then
    echo "[$TIMESTAMP] ✅ DNS READY! Nameserver propagiert!" | tee -a "$DNS_LOG"
    echo "[$TIMESTAMP] Current NS: $CURRENT_NS" >> "$DNS_LOG"
    echo "[$TIMESTAMP] Triggering Deployment Pipeline..." >> "$DNS_LOG"
    
    # Deployment triggern
    bash "$PROJECT_DIR/scripts/auto-deploy-pipeline.sh" >> "$DNS_LOG" 2>&1
    
    exit 0
  else
    RETRY=$((RETRY + 1))
    PERCENT=$((($RETRY * 100) / $MAX_RETRIES))
    
    echo "[$TIMESTAMP] Retry #$RETRY/$MAX_RETRIES ($PERCENT%) - Current: $CURRENT_NS" >> "$DNS_LOG"
    
    if [ $((RETRY % 6)) -eq 0 ]; then
      echo "[$TIMESTAMP] ⏳ DNS still propagating... (Retry $RETRY/48)" >> "$DNS_LOG"
    fi
    
    sleep $RETRY_INTERVAL
  fi
done

# Timeout erreicht
echo "[$(date +'%Y-%m-%d %H:%M:%S')] ❌ DNS TIMEOUT nach 48 Stunden!" >> "$DNS_LOG"
echo "[$(date +'%Y-%m-%d %H:%M:%S')] User Alert erforderlich!" >> "$DNS_LOG"

exit 1
