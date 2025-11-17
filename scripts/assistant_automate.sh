#!/usr/bin/env zsh
# Automation assisten - simple interactive automaton for developer tasks
# Behavior:
# - Asks for a semicolon-separated list of shell commands to run.
# - Waits up to 10 seconds for input (configurable via TIMEOUT). If no input
#   is provided, falls back to a default sequence.
# - Executes each command in order, logging a checkpoint before and after
#   execution to `tmp_debug/assistant_checkpoints.md`.
# - Long-running commands containing the word `dev` are started in background
#   (nohup) so the script can continue to the next steps and log PID.

set -euo pipefail

TIMEOUT=${TIMEOUT:-10}
CHECKPOINT_FILE="$(dirname "$0")/../tmp_debug/assistant_checkpoints.md"
DEFAULT_TASKS=("pnpm run check" "pnpm dev" "bash scripts/open-dev-url.sh")

mkdir -p "$(dirname "$CHECKPOINT_FILE")"
touch "$CHECKPOINT_FILE"

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log_checkpoint() {
  local status="${1:-info}"
  local task="${2:-}" 
  local note="${3:-}"
  printf "- time: %s\n  status: %s\n  task: \"%s\"\n  note: \"%s\"\n\n" "$(timestamp)" "$status" "$task" "$note" >> "$CHECKPOINT_FILE"
}

echo "Automation assisten: Bitte gib eine durch Semikolon getrennte Aufgabenliste ein (z.B. 'pnpm run check; pnpm dev')." 
echo "Warte $TIMEOUT Sekunden auf Eingabe, danach werden Standardaufgaben verwendet." 
echo -n "> "

IFS= read -t $TIMEOUT -r user_input || true

if [[ -z "${user_input:-}" ]]; then
  echo "Keine Eingabe empfangen — verwende Standardaufgaben: ${DEFAULT_TASKS[*]}"
  tasks=("${DEFAULT_TASKS[@]}")
else
  # split by semicolon
  IFS=';' read -r -A tasks <<< "$user_input"
  # trim spaces
  for i in "${!tasks[@]}"; do
    tasks[$i]="$(echo "${tasks[$i]}" | sed -e 's/^ *//' -e 's/ *$//')"
  done
fi

echo "Starte ${#tasks[@]} Aufgaben..."

for cmd in "${tasks[@]}"; do
  if [[ -z "$cmd" ]]; then
    continue
  fi
  log_checkpoint "start" "$cmd" "starting"
  echo "-> Ausführen: $cmd"
  # handle long-running dev server commands heuristically
  if echo "$cmd" | grep -q "dev"; then
    # run in background with nohup so we can continue
    nohup zsh -c "$cmd" > "/tmp/assistant_automation_$(date +%s).log" 2>&1 &
    pid=$!
    note="started-in-background pid=$pid"
    echo "  (Hintergrund) PID=$pid"
    log_checkpoint "done" "$cmd" "$note"
    continue
  fi

  # run the command, capture output and exit code
  output_file="/tmp/assistant_automation_$(date +%s).out"
  if zsh -c "$cmd" > "$output_file" 2>&1; then
    log_checkpoint "done" "$cmd" "exit=0 output=$(head -c 400 "$output_file" | sed ':a;N;s/\n/ /g;ta')"
  else
    exitcode=$?
    log_checkpoint "error" "$cmd" "exit=$exitcode output=$(head -c 400 "$output_file" | sed ':a;N;s/\n/ /g;ta')"
    echo "  Kommando $cmd schlug fehl (exit $exitcode). Weiter mit nächster Aufgabe."
  fi
  # small pause between tasks
  sleep 1
done

echo "Automation assisten: Fertig. Checkpoints in $CHECKPOINT_FILE"
