#!/usr/bin/env bash
set -euo pipefail

cd /app

if [ -f package-lock.json ]; then
  echo "Installing locked build dependencies..."
  npm ci --include=dev
else
  echo "Creating package-lock.json and installing build dependencies..."
  npm install --include=dev
fi

echo "Checking TypeScript..."
npm run typecheck

echo "Building NiteOwl Auth for production..."
npm run build

echo "Applying Better Auth database migrations..."
npm run auth:migrate

echo "Removing build-only dependencies..."
npm prune --omit=dev
