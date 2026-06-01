#!/bin/bash

MONGO_DATA_DIR="/home/runner/data/mongodb"
MONGO_LOG="/home/runner/data/mongodb.log"
BACKEND_LOG="/home/runner/data/backend.log"

mkdir -p "$MONGO_DATA_DIR"

# ── MongoDB ────────────────────────────────────────────────────────────────────
if pgrep -x mongod > /dev/null; then
  echo "[mongo] already running, skipping start"
else
  echo "[mongo] starting..."
  mongod --dbpath "$MONGO_DATA_DIR" --logpath "$MONGO_LOG" --fork --bind_ip 127.0.0.1

  echo "[mongo] waiting for connection..."
  for i in $(seq 1 20); do
    if mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
      echo "[mongo] ready."
      break
    fi
    sleep 1
  done
fi

# ── Backend (Express on port 3000, internal only) ─────────────────────────────
echo "[backend] starting..."
cd backend
NODE_ENV=development PORT=3000 npx tsx server/index.ts > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
cd ..

echo "[backend] waiting for port 3000..."
for i in $(seq 1 20); do
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1 || \
     nc -z 127.0.0.1 3000 > /dev/null 2>&1; then
    echo "[backend] ready (PID $BACKEND_PID)."
    break
  fi
  sleep 1
done

# ── Frontend (Vite on port 5000, webview) ─────────────────────────────────────
echo "[frontend] starting Vite on port 5000..."
cd frontend/client
exec npx vite --host 0.0.0.0 --port 5000
