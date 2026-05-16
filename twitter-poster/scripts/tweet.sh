#!/bin/bash
# tweet.sh — Wrapper to post a tweet via OpenClaw
# Usage: ./tweet.sh "Your tweet text here"

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Validate args ──────────────────────────────────────────────────────────────
if [[ -z "${1:-}" ]]; then
  echo "Usage: $0 \"Your tweet text here\""
  exit 1
fi

TWEET_TEXT="$1"

# ── Check node is available ────────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo "❌ node is not installed. Run: apt-get install -y nodejs"
  exit 1
fi

# ── Check twitter-api-v2 is installed ─────────────────────────────────────────
if ! node -e "require('twitter-api-v2')" &> /dev/null; then
  echo "📦 Installing required Node packages..."
  npm install -g twitter-api-v2
fi

# ── Run the Node script ────────────────────────────────────────────────────────
node "$SCRIPT_DIR/twitter_post.js" "$TWEET_TEXT"
