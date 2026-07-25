#!/usr/bin/env bash
set -euo pipefail

cd /app

echo "Applying Better Auth database migrations..."
npm run auth:migrate

echo "Starting NiteOwl Auth on port ${PORT:-3000}..."
exec npm start
