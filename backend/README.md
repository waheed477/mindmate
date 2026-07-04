---
title: MindMate Backend
emoji: 🧠
colorFrom: blue
colorTo: indigo
sdk: docker
sdk_version: "20"
app_file: Dockerfile
pinned: false
license: mit
---

# MindMate Backend API

Mental Health Support Platform Backend

## API Endpoints

- `/api/health` - Health check
- `/api/auth` - Authentication routes
- `/api/doctors` - Doctor management
- `/api/appointments` - Appointment booking
- `/api/ai/chat` - AI Assistant

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `FRONTEND_URL` | Frontend URL for CORS |