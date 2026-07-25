#!/usr/bin/env bash
set -euo pipefail

cd /app

if [ ! -f package.json ]; then
  echo "ERROR: /app/package.json is missing."
  exit 1
fi

if [ ! -f package-lock.json ]; then
  echo "ERROR: /app/package-lock.json is missing."
  echo "Run npm install inside ./app before the first docker compose up."
  exit 1
fi

echo "Installing locked npm dependencies..."
npm ci

echo "Applying Better Auth database migrations..."
npm run auth:migrate

echo "Building NiteOwl Auth for production..."
npm run build

echo "Starting NiteOwl Auth in production mode..."
exec npm start
