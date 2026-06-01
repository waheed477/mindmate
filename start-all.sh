#!/bin/bash

MONGO_DATA_DIR="/home/runner/data/mongodb"
MONGO_LOG="/home/runner/data/mongodb.log"
BACKEND_LOG="/home/runner/data/backend.log"

mkdir -p "$MONGO_DATA_DIR"

# ── MongoDB ────────────────────────────────────────────────────────────────────
if pgrep -x mongod > /dev/null; then
  echo "[mongo] already running"
else
  echo "[mongo] starting..."
  mongod --dbpath "$MONGO_DATA_DIR" --logpath "$MONGO_LOG" --fork --bind_ip 127.0.0.1
  echo "[mongo] waiting for connection..."
  for i in $(seq 1 20); do
    mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1 && echo "[mongo] ready." && break
    sleep 1
  done
fi

# ── Express backend on port 3001 (internal, proxied via Vite) ─────────────────
echo "[backend] starting Express on port 3001..."
cd backend
NODE_ENV=development PORT=3001 npx tsx server/index.ts > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
cd ..

echo "[backend] waiting for port 3001..."
for i in $(seq 1 20); do
  nc -z 127.0.0.1 3001 > /dev/null 2>&1 && echo "[backend] ready (PID $BACKEND_PID)." && break
  sleep 1
done

# ── Vite on port 5000 (webview — proxies /api to Express on 3001) ──────────────
echo "[frontend] starting Vite on port 5000..."
cd frontend/client
exec npx vite --host 0.0.0.0 --port 5000
