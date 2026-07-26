#!/usr/bin/env bash
set -euo pipefail

cd /app

LOCK_HASH_FILE="node_modules/.package-lock.sha256"
CURRENT_LOCK_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
SAVED_LOCK_HASH="$(cat "$LOCK_HASH_FILE" 2>/dev/null || true)"

if [[ ! -d node_modules ]] || [[ "$CURRENT_LOCK_HASH" != "$SAVED_LOCK_HASH" ]]; then
  echo "Installing locked Better Auth dependencies..."
  npm ci
  printf '%s\n' "$CURRENT_LOCK_HASH" > "$LOCK_HASH_FILE"
else
  echo "Better Auth dependencies are current."
fi

echo "Applying Better Auth migrations..."
npm run auth:migrate

echo "Starting NiteOwl Auth on port ${PORT:-3000}..."
exec npm start
