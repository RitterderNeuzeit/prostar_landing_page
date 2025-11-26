#!/usr/bin/env zsh
# Open Admin UI in default browser. If dev server not running, try to start it.
set -euo pipefail

URL="http://localhost:3000/admin"

echo "Opening Admin UI at $URL"
open "$URL"
