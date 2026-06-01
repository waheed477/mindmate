#!/bin/bash
set -e

MONGO_DATA_DIR="/home/runner/data/mongodb"
MONGO_LOG="/home/runner/data/mongodb.log"

mkdir -p "$MONGO_DATA_DIR"

if ! pgrep -x mongod > /dev/null; then
  echo "Starting MongoDB..."
  mongod --dbpath "$MONGO_DATA_DIR" --logpath "$MONGO_LOG" --fork --bind_ip 127.0.0.1
  sleep 2
  echo "MongoDB started."
else
  echo "MongoDB already running."
fi

echo "Starting backend API server..."
cd backend && NODE_ENV=development PORT=3000 npx tsx server/index.ts
