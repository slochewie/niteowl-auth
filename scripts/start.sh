#!/usr/bin/env bash
set -euo pipefail

cd /app

echo "Installing locked dependencies..."
npm ci --include=dev

echo "Checking TypeScript..."
npm run typecheck

echo "Building NiteOwl Admin for production..."
npm run build

echo "Removing build-only dependencies..."
npm prune --omit=dev

echo "Starting NiteOwl Admin on port ${PORT:-3000}..."
exec npm start
