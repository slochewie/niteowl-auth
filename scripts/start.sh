#!/usr/bin/env bash
set -euo pipefail

cd /app

if [ ! -f package.json ]; then
  echo "ERROR: /app/package.json is missing."
  exit 1
fi

LOCK_STAMP="node_modules/.niteowl-package-lock.sha256"

if [ -f package-lock.json ]; then
  CURRENT_LOCK_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
  INSTALLED_LOCK_HASH=""

  if [ -f "$LOCK_STAMP" ]; then
    INSTALLED_LOCK_HASH="$(cat "$LOCK_STAMP")"
  fi

  if [ "$CURRENT_LOCK_HASH" != "$INSTALLED_LOCK_HASH" ] || [ ! -x node_modules/.bin/react-router ]; then
    echo "Installing locked npm dependencies, including build tooling..."
    npm ci --include=dev
    printf '%s\n' "$CURRENT_LOCK_HASH" > "$LOCK_STAMP"
  else
    echo "npm dependencies are already current."
  fi
else
  echo "Cleaning any partial first-install state..."
  if [ -d node_modules ]; then
    find node_modules -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
  fi

  echo "Creating package-lock.json and installing dependencies, including build tooling..."
  npm install --include=dev
  sha256sum package-lock.json | awk '{print $1}' > "$LOCK_STAMP"
fi

echo "Applying Better Auth database migrations..."
npm run auth:migrate

echo "Checking TypeScript..."
npm run typecheck

echo "Building NiteOwl Auth for production..."
npm run build

echo "Starting NiteOwl Auth on port ${PORT:-3000}..."
exec npm start
