#!/bin/bash
set -euo pipefail

echo "[OpenAlgo] Starting TypeScript server..."

if [ ! -f .env ] && [ -f .sample.env ]; then
  echo "[OpenAlgo] No .env found — copy .sample.env and configure credentials."
fi

if [ ! -f frontend/dist/index.html ]; then
  echo "[OpenAlgo] Building frontend..."
  (cd frontend && npm ci && npm run build)
fi

npm run build
exec npm start
