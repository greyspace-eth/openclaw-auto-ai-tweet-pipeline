#!/bin/bash
# schedule_tweet.sh — Add a tweet to the schedule queue
# Usage: ./schedule_tweet.sh "<tweet text>" "<YYYY-MM-DD HH:MM>"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$SCRIPT_DIR/.."

TWEET="${1:-}"
DATETIME="${2:-}"

if [[ -z "$TWEET" || -z "$DATETIME" ]]; then
  echo "Usage: $0 \"<tweet text>\" \"<YYYY-MM-DD HH:MM>\""
  exit 1
fi

if [ ! -d "$SKILL_DIR/node_modules" ]; then
  cd "$SKILL_DIR" && npm install dotenv --silent
fi

node "$SCRIPT_DIR/queue.js" add "$TWEET" "$DATETIME"
