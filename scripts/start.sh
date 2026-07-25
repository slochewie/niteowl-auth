#!/usr/bin/env bash
set -euo pipefail

cd /app

echo "Starting NiteOwl Auth on port ${PORT:-3000}..."
exec npm start
