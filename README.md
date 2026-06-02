# MindMate — Mental Health Telehealth Platform

A full-stack MERN application connecting patients with mental health doctors. Features JWT authentication, email verification, real-time chat (Socket.io), appointment booking, prescriptions, and an AI assistant.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, TanStack Query |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT + Passport.js |
| Real-time | Socket.io |
| Email | Nodemailer (Gmail) |

---

## Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **MongoDB** running locally on port 27017 — [Download](https://www.mongodb.com/try/download/community)
  - Or use **MongoDB Compass** to connect visually
- **Git**

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd MindMate
```

---

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/mindmate
PORT=5000
JWT_SECRET=any-long-random-string-here
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=your-16-char-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords

Start the backend (with hot reload):

```bash
npm run dev
# ✅ Should show: 🚀 Backend API running on port 5000
```

---

### 3. Frontend

Open a **new terminal**:

```bash
cd frontend/client

# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env
```

Start the frontend:

```bash
npm run dev
# ✅ Should show: VITE ready on http://localhost:3000
```

---

### 4. Open the app

Visit **http://localhost:3000** in your browser.

---

## Project Structure

```
MindMate/
├── backend/
│   ├── server/
│   │   ├── index.ts          ← Entry point
│   │   ├── auth.ts           ← JWT + Passport auth
│   │   ├── db.ts             ← MongoDB connection
│   │   ├── socket.ts         ← Socket.io setup
│   │   ├── routes.ts         ← Core API routes
│   │   ├── models/           ← Mongoose models
│   │   ├── routes/           ← Feature route handlers
│   │   ├── services/         ← Email service
│   │   └── controllers/
│   ├── shared/
│   │   ├── schema.ts         ← Zod validation schemas
│   │   └── routes.ts         ← API route definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/            ← Route pages
│   │   ├── components/       ← UI components
│   │   ├── hooks/            ← Custom React hooks
│   │   ├── services/         ← API calls
│   │   └── types/
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/verify-email` | Verify email with code |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/messages` | Get messages |
| POST | `/api/messages` | Send message |
| GET | `/api/prescriptions` | Get prescriptions |
| POST | `/api/ai/chat` | AI assistant |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mindmate` |
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret for signing tokens | Any long random string |
| `EMAIL_USER` | Gmail address for sending emails | `app@gmail.com` |
| `EMAIL_APP_PASSWORD` | Gmail App Password | 16-char code from Google |
| `FRONTEND_URL` | Frontend URL for email links | `http://localhost:3000` |

### Frontend (`frontend/client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_PORT` | Frontend dev server port | `3000` |
| `BACKEND_URL` | Backend URL for Vite proxy | `http://localhost:5000` |

---

## Common Issues

**MongoDB connection refused**
→ Make sure MongoDB is running: `mongod` or open MongoDB Compass

**Email not sending**
→ Use a Gmail App Password, not your regular Gmail password

**Port already in use**
→ Change `PORT` in `backend/.env` or `VITE_PORT` in `frontend/client/.env`
