#!/usr/bin/env bash
# Start dev server in background, wait for it to respond on ports 3000-3020 and open the URL

set -euo pipefail

LOGFILE=".dev-server.log"
PIDFILE=".dev-server.pid"

echo "Starting dev server (pnpm dev)... logs -> $LOGFILE"

# Start pnpm dev in background if it's not already running
if pgrep -f "tsx watch server/_core/index.ts" >/dev/null 2>&1; then
  echo "Dev server already running; will try to detect its port."
else
  nohup pnpm dev > "$LOGFILE" 2>&1 &
  echo $! > "$PIDFILE"
  echo "Started (pid=$(cat $PIDFILE)). Waiting for server to respond..."
fi

MAX_WAIT=30
SLEEP_INTERVAL=1
end=$((SECONDS + MAX_WAIT))

while [ $SECONDS -lt $end ]; do
  for port in $(seq 3000 3020); do
    # quick probe; allow short timeout
    if curl -s --max-time 1 "http://127.0.0.1:${port}/" >/dev/null 2>&1; then
      echo "Dev server responded on port ${port} — opening http://localhost:${port}"
      open "http://localhost:${port}"
      exit 0
    fi
  done
  sleep $SLEEP_INTERVAL
done

echo "Timed out waiting for dev server to respond. Last $MAX_WAIT seconds of log:" >&2
if [ -f "$LOGFILE" ]; then
  tail -n 200 "$LOGFILE" >&2
fi
exit 1
