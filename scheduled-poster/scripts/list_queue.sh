#!/bin/bash
# list_queue.sh — List all pending scheduled tweets

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$SCRIPT_DIR/.."

if [ ! -d "$SKILL_DIR/node_modules" ]; then
  cd "$SKILL_DIR" && npm install dotenv --silent
fi

node "$SCRIPT_DIR/queue.js" list
