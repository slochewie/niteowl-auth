#!/usr/bin/env bash
set -euo pipefail
cd /app

HASH_FILE="node_modules/.package-lock.sha256"
CURRENT_HASH="$(sha256sum package.json package-lock.json | sha256sum | awk '{print $1}')"
SAVED_HASH="$(cat "$HASH_FILE" 2>/dev/null || true)"

if [[ ! -x node_modules/.bin/tsc || "$CURRENT_HASH" != "$SAVED_HASH" ]]; then
  echo "Installing Better Auth dependencies..."
  npm ci --include=dev
  printf '%s\n' "$CURRENT_HASH" > "$HASH_FILE"
fi

SOURCE_HASH_FILE="dist/.source.sha256"
CURRENT_SOURCE_HASH="$(find src -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | awk '{print $1}')"
SAVED_SOURCE_HASH="$(cat "$SOURCE_HASH_FILE" 2>/dev/null || true)"

if [[ ! -f dist/server.js || "$CURRENT_SOURCE_HASH" != "$SAVED_SOURCE_HASH" ]]; then
  echo "Building Better Auth..."
  npm run build
  printf '%s\n' "$CURRENT_SOURCE_HASH" > "$SOURCE_HASH_FILE"
fi

echo "Applying Better Auth migrations..."
npm run auth:migrate

echo "Starting Better Auth..."
exec npm start
