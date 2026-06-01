#!/bin/bash
set -e

MONGO_DATA_DIR="/home/runner/data/mongodb"
MONGO_LOG="/home/runner/data/mongodb.log"

mkdir -p "$MONGO_DATA_DIR"

# Kill any stale mongod processes and restart cleanly
if pgrep -x mongod > /dev/null; then
  echo "Stopping existing MongoDB..."
  pkill -x mongod || true
  sleep 2
fi

echo "Starting MongoDB..."
mongod --dbpath "$MONGO_DATA_DIR" --logpath "$MONGO_LOG" --fork --bind_ip 127.0.0.1

# Wait until MongoDB is actually accepting connections
echo "Waiting for MongoDB to be ready..."
for i in $(seq 1 15); do
  if mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "MongoDB is ready."
    break
  fi
  echo "  attempt $i/15..."
  sleep 1
done

echo "Starting backend API server..."
cd backend && NODE_ENV=development PORT=3000 npx tsx server/index.ts
