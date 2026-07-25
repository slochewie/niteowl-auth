#!/usr/bin/env bash
set -euo pipefail

cd /app

echo "Installing locked dependencies..."
npm ci --include=dev

echo "Checking TypeScript..."
npm run typecheck

echo "Building NiteOwl Auth for production..."
npm run build

echo "Applying Better Auth database migrations..."
npm run auth:migrate

echo "Removing build-only dependencies..."
npm prune --omit=dev

echo "Starting NiteOwl Auth on port ${PORT:-3000}..."
exec npm start
