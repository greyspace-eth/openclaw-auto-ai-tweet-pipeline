#!/bin/bash
# remove_tweet.sh — Remove a tweet from the queue by ID
# Usage: ./remove_tweet.sh <id>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$SCRIPT_DIR/.."

ID="${1:-}"

if [[ -z "$ID" ]]; then
  echo "Usage: $0 <id>"
  exit 1
fi

node "$SCRIPT_DIR/queue.js" remove "$ID"
