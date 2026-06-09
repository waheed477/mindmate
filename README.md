# MindMate — Mental Health Telehealth Platform

A full-stack MERN application connecting patients with mental health professionals. Features JWT authentication with email verification, real-time chat (Socket.io), appointment booking, prescriptions, and an AI assistant.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, TanStack Query |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT + email OTP verification |
| Real-time | Socket.io |
| Email | Nodemailer (Gmail) |

---

## Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **MongoDB** running locally on port 27017 — [Download](https://www.mongodb.com/try/download/community)
- **Git**

---

## Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd MindMate
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` — the defaults work out of the box with a local MongoDB. Only the email variables are optional (needed for sending real OTPs; in dev mode the code is printed to the console anyway).

```bash
npm run dev
# ✅ Backend running on http://localhost:5000
# ✅ Test accounts seeded automatically
```

---

### 3. Frontend

Open a **new terminal**:

```bash
cd frontend/client
npm install
npm run dev
# ✅ Frontend running on http://localhost:3000
```

---

### 4. Open the app

Visit **[http://localhost:3000](http://localhost:3000)**

---

## Test Accounts

These accounts are created automatically when the backend starts in development mode — no registration needed.

| Role | Email | Password |
|------|-------|----------|
| 👤 Patient | `patient@test.com` | `123456` |
| 🩺 Doctor | `doctor@test.com` | `123456` |
| 🩺 Doctor 2 | `doctor2@test.com` | `123456` |

---

## Project Structure

```
MindMate/
├── backend/
│   ├── server/
│   │   ├── index.ts          ← Entry point + auto-seed
│   │   ├── auth.ts           ← JWT auth + OTP email verification
│   │   ├── db.ts             ← MongoDB connection
│   │   ├── socket.ts         ← Socket.io setup
│   │   ├── seed.ts           ← Test account seeder
│   │   ├── routes.ts         ← Core API routes
│   │   ├── models/           ← Mongoose models
│   │   ├── routes/           ← Feature route handlers
│   │   ├── services/         ← Email service
│   │   └── controllers/      ← Appointment controller
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
| POST | `/api/auth/verify-email` | Verify email OTP |
| POST | `/api/auth/resend-verification` | Resend OTP |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/appointments/my-appointments` | Patient's appointments |
| GET | `/api/appointments/doctor/:id` | Doctor's appointments |
| POST | `/api/appointments` | Book appointment |
| PATCH | `/api/appointments/:id` | Update appointment status |
| GET | `/api/messages/:receiverId` | Get conversation |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/doctor/patients` | Doctor's patient list |
| GET | `/api/prescriptions` | Get prescriptions |
| POST | `/api/prescriptions` | Create prescription |
| POST | `/api/ai/chat` | AI mental health assistant |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mindmate` |
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret for signing tokens | `mindmate-secret-key-123` |
| `EMAIL_USER` | Gmail address (optional) | — |
| `EMAIL_APP_PASSWORD` | Gmail App Password (optional) | — |
| `FRONTEND_URL` | Frontend URL for email links | `http://localhost:3000` |

> **Email is optional in dev mode** — verification codes are printed to the backend console so you can always complete sign-up without configuring Gmail.

### Frontend (`frontend/client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PORT` | Frontend dev server port | `3000` |
| `BACKEND_URL` | Backend URL for Vite proxy | `http://localhost:5000` |

---

## Common Issues

**MongoDB connection refused**
→ Make sure MongoDB is running: `mongod` or start it via MongoDB Compass.

**Email OTP not received**
→ Check the backend console — in dev mode the code is always logged:
```
📧 [DEV] Verification code for you@email.com: 123456
```

**Port already in use**
→ Change `PORT` in `backend/.env` and `BACKEND_URL` in `frontend/client/.env` to match.

**Gmail App Password setup**
→ Google Account → Security → 2-Step Verification → App Passwords → create one for "Mail".
