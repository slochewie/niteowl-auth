#!/usr/bin/env bash
set -euo pipefail

cd /app

LOCK_HASH_FILE="node_modules/.package-lock.sha256"
BUILD_HASH_FILE="build/.source.sha256"
CURRENT_LOCK_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
SAVED_LOCK_HASH="$(cat "$LOCK_HASH_FILE" 2>/dev/null || true)"

if [[ ! -d node_modules ]] || [[ "$CURRENT_LOCK_HASH" != "$SAVED_LOCK_HASH" ]]; then
  echo "Installing locked BTST admin dependencies..."
  npm ci --include=dev
  printf '%s\n' "$CURRENT_LOCK_HASH" > "$LOCK_HASH_FILE"
else
  echo "BTST admin dependencies are current."
fi

CURRENT_SOURCE_HASH="$(
  find app public -type f -print0 2>/dev/null \
    | sort -z \
    | xargs -0 sha256sum \
    | sha256sum \
    | awk '{print $1}'
)"
SAVED_SOURCE_HASH="$(cat "$BUILD_HASH_FILE" 2>/dev/null || true)"

if [[ ! -f build/server/index.js ]] || [[ "$CURRENT_SOURCE_HASH" != "$SAVED_SOURCE_HASH" ]]; then
  echo "Checking TypeScript..."
  npm run typecheck

  echo "Building NiteOwl Admin for production..."
  npm run build
  printf '%s\n' "$CURRENT_SOURCE_HASH" > "$BUILD_HASH_FILE"
else
  echo "BTST admin build is current."
fi

echo "Starting NiteOwl Admin on port ${PORT:-3000}..."
exec npm start
