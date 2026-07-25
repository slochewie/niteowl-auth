#!/usr/bin/env bash
set -euo pipefail

cd /app

if [ ! -f package.json ]; then
  echo "ERROR: /app/package.json is missing."
  exit 1
fi

if [ -f package-lock.json ]; then
  echo "Installing locked npm dependencies..."
  npm ci
else
  echo "Creating package-lock.json and installing dependencies..."
  npm install
fi

echo "Applying Better Auth database migrations..."
npm run auth:migrate

echo "Checking TypeScript..."
npm run typecheck

echo "Building NiteOwl Auth for production..."
npm run build

echo "Starting NiteOwl Auth on port ${PORT:-3000}..."
exec npm start
