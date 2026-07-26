#!/usr/bin/env bash
set -euo pipefail
cd /app

corepack enable

DEPENDENCY_HASH_FILE="node_modules/.pnpm-lock.sha256"
BUILD_HASH_FILE=".next/.source.sha256"
CURRENT_DEPENDENCY_HASH="$(sha256sum package.json pnpm-lock.yaml | sha256sum | awk '{print $1}')"
SAVED_DEPENDENCY_HASH="$(cat "$DEPENDENCY_HASH_FILE" 2>/dev/null || true)"

if [[ ! -x node_modules/.bin/next || "$CURRENT_DEPENDENCY_HASH" != "$SAVED_DEPENDENCY_HASH" ]]; then
  echo "Installing BTST admin dependencies..."
  pnpm install --frozen-lockfile
  printf '%s\n' "$CURRENT_DEPENDENCY_HASH" > "$DEPENDENCY_HASH_FILE"
fi

CURRENT_SOURCE_HASH="$(
  {
    find app components hooks lib public -type f -print0
    printf '%s\0' components.json eslint.config.mjs next.config.ts postcss.config.mjs tsconfig.json
  } \
    | sort -z \
    | xargs -0 sha256sum \
    | sha256sum \
    | awk '{print $1}'
)"
SAVED_SOURCE_HASH="$(cat "$BUILD_HASH_FILE" 2>/dev/null || true)"

if [[ ! -f .next/BUILD_ID || "$CURRENT_SOURCE_HASH" != "$SAVED_SOURCE_HASH" ]]; then
  echo "Building BTST admin..."
  pnpm run typecheck
  pnpm run build
  printf '%s\n' "$CURRENT_SOURCE_HASH" > "$BUILD_HASH_FILE"
fi

echo "Starting BTST admin..."
exec pnpm start
