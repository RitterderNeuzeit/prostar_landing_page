#!/bin/bash
# Auto-Monitoring für DNS Propagation
# Läuft im Hintergrund

DOMAIN="prostarmarketing.de"
LOG_FILE="/Users/user/Downloads/prostar_landing_page (1)/tmp_debug/dns_monitor.log"

while true; do
    NS=$(dig NS $DOMAIN +short 2>/dev/null | head -1)
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    if echo "$NS" | grep -q "squarespace.com"; then
        echo "[$TIMESTAMP] ✅ DNS PROPAGIERT: $NS" >> "$LOG_FILE"
        echo "DNS ist jetzt ready - Deployment kann starten!"
        break
    else
        echo "[$TIMESTAMP] ⏳ Noch nicht propagiert: $NS" >> "$LOG_FILE"
        sleep 3600  # Prüfe jede Stunde
    fi
done
