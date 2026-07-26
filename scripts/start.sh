#!/usr/bin/env bash
set -euo pipefail

cd /app

DEPENDENCY_HASH_FILE="node_modules/.dependency-files.sha256"
BUILD_HASH_FILE="build/.source.sha256"
CURRENT_DEPENDENCY_HASH="$(cat package.json package-lock.json | sha256sum | awk '{print $1}')"
SAVED_DEPENDENCY_HASH="$(cat "$DEPENDENCY_HASH_FILE" 2>/dev/null || true)"

if [[ ! -d node_modules ]] || [[ "$CURRENT_DEPENDENCY_HASH" != "$SAVED_DEPENDENCY_HASH" ]]; then
  echo "Installing BTST admin dependencies..."
  npm install --include=dev --package-lock=false
  printf '%s\n' "$CURRENT_DEPENDENCY_HASH" > "$DEPENDENCY_HASH_FILE"
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
