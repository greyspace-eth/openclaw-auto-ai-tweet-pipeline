#!/bin/bash
# format_tweet.sh — Format AI content into a tweet in your personal voice
# Usage: ./format_tweet.sh "<title>" "<summary>" "<url>"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$SCRIPT_DIR/.."

TITLE="${1:-}"
SUMMARY="${2:-}"
URL="${3:-}"

if [[ -z "$TITLE" && -z "$SUMMARY" ]]; then
  echo "Usage: $0 \"<title>\" \"<summary>\" \"<url>\""
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "node is not installed."
  exit 1
fi

if [ ! -d "$SKILL_DIR/node_modules" ]; then
  echo "Installing dependencies..."
  cd "$SKILL_DIR" && npm install dotenv --silent
fi

# ── Run and capture output safely ─────────────────────────────────────────────
OUTPUT=$(node "$SCRIPT_DIR/format_tweet.js" "$TITLE" "$SUMMARY" "$URL" 2>&1)
echo "$OUTPUT"
