#!/usr/bin/env bash
# One-time developer setup for Pharmacards (macOS / Linux).
# No sudo and no global installs. Run from anywhere:
#   bash scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

# 1. Node.js 20 or newer
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Get version 20 or newer from https://nodejs.org"
  exit 1
fi
major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$major" -lt 20 ]; then
  echo "Node.js $major found, but 20 or newer is needed. Get it from https://nodejs.org"
  exit 1
fi
echo "Node.js $(node -v) OK"

# 2. Install packages (clean install when a lockfile exists)
if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 3. Check content and run tests
npm run validate:content
npm test

echo
echo "Setup complete. Next commands:"
echo "  npm run dev     start the app at http://localhost:3000"
echo "  npm run build   create the static site in out/"
