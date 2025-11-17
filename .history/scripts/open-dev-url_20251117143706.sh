#!/usr/bin/env bash
# Detect running dev server on ports 3000-3020 and open it in the default browser

set -euo pipefail

for port in $(seq 3000 3020); do
  if curl -s --max-time 1 "http://127.0.0.1:${port}/" >/dev/null 2>&1; then
    echo "Found dev server on port ${port}. Opening http://localhost:${port}"
    open "http://localhost:${port}"
    exit 0
  fi
done

echo "No dev server found on ports 3000-3020" >&2
exit 1
