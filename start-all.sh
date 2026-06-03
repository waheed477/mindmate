#!/bin/bash

BACKEND_LOG="/tmp/backend.log"
mkdir -p /tmp

# ── Express backend + in-memory MongoDB ────────────────────────────────────────
echo "[backend] starting with in-memory MongoDB on port 3001..."
cd backend
NODE_ENV=development PORT=3001 node start-with-memory-db.mjs > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
cd ..

echo "[backend] waiting for port 3001..."
for i in $(seq 1 30); do
  nc -z 127.0.0.1 3001 > /dev/null 2>&1 && echo "[backend] ready (PID $BACKEND_PID)." && break
  sleep 1
done

# ── Vite on port 5000 (webview — proxies /api to Express on 3001) ──────────────
echo "[frontend] starting Vite on port 5000..."
cd frontend/client
BACKEND_URL=http://localhost:3001 exec npx vite --host 0.0.0.0 --port 5000
