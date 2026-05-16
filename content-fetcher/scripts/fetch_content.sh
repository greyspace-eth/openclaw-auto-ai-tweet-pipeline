
#!/bin/bash
# fetch_content.sh — Fetch relevant content suggestions for tweeting
# Usage: ./fetch_content.sh [topic]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$SCRIPT_DIR/.."

TOPIC="${1:-}"

# ── Check node ─────────────────────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo "node is not installed."
  exit 1
fi

# ── Check dependencies ─────────────────────────────────────────────────────────
if [ ! -d "$SKILL_DIR/node_modules" ]; then
  echo "Installing dependencies..."
  cd "$SKILL_DIR" && npm install dotenv axios rss-parser --silent
fi

# ── Run ────────────────────────────────────────────────────────────────────────
node "$SCRIPT_DIR/fetch_content.js" "$TOPIC"
