<<<<<<< HEAD
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
=======
# 🧠 MindMate — Mental Health Telehealth Platform

A full-stack MERN telehealth platform for mental health care. Patients book appointments with licensed psychiatrists and psychologists, chat in real time, use an AI-powered mental health assistant, manage prescriptions, and reset passwords via email — all in one polished application.

---

## 🚀 Quick Start for Recruiters

> **Clone → Install → Run in under 5 minutes**

### Prerequisites

| Tool | Version | Download |
|------|---------|---------|
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 7+ | https://www.mongodb.com/try/download/community |
| Git | any | https://git-scm.com |

---

### Step 1 — Clone

```bash
git clone https://github.com/waheed477/mindmate.git
cd mindmate
```

---

### Step 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
# (Optional) Edit .env to add Gmail credentials for real email sending
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
📁 Collections: users, patients, doctors, appointments, messages, prescriptions
🚀 Backend API running on port 5000
🔌 Socket.io enabled
```

> **MongoDB not running?** Start it with `mongod` in a separate terminal, or paste a free [MongoDB Atlas](https://cloud.mongodb.com) connection string as `MONGODB_URI` in `backend/.env`.

---

### Step 3 — Frontend

Open a **new terminal**:

```bash
cd frontend/client
npm install
cp .env.example .env
npm run dev
```

Expected output:
```
VITE v7.3.0  ready in 705 ms
➜  Local:   http://localhost:3000/
```

---

### Step 4 — Open the App

Go to **http://localhost:3000**

---

### Step 5 — Login with Test Accounts

These accounts are **auto-seeded** on every backend startup — no manual registration needed.

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| 👤 Patient | patient@test.com | 123456 | Book appointments, AI chat |
| 🩺 Doctor | doctor@test.com | 123456 | Accept/Reject, Prescriptions |
| 🩺 Doctor 2 | doctor2@test.com | 123456 | Additional doctor account |

---

## ✅ Feature Checklist

| Feature | How to Test |
|---------|-------------|
| **Registration** | "Sign Up" → fill form → choose Patient or Doctor |
| **Login** | Use test credentials → redirected to dashboard |
| **Session persistence** | Refresh page → still logged in (30-day JWT) |
| **Browse doctors** | Patient dashboard → Find a Doctor → filter by specialization |
| **Book appointment** | Doctor profile → "Book Appointment" → pick date + describe symptoms |
| **Accept/Reject appointment** | Doctor dashboard → incoming requests → Accept / Reject / Complete |
| **Real-time chat** | After appointment is accepted → Chat button → messages appear instantly |
| **AI assistant** | Patient dashboard → AI Assistant → type any mental health concern |
| **Prescriptions** | Doctor creates prescription → patient sees it in their dashboard |
| **Forgot password** | Login page → "Forgot Password?" → enter email → token logged to console in dev |
| **Reset password** | Follow the link from the console (or email if credentials configured) |
| **Profile update** | Dashboard → Edit Profile → update name, bio, photo, contact details |
| **Delete account** | Edit Profile → Danger Zone → enter password → all data removed |
| **Logout** | Navbar → Logout → session cleared |

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database — change to your Atlas URI if not running MongoDB locally
MONGODB_URI=mongodb://127.0.0.1:27017/mindmate

# Auth
JWT_SECRET=mindmate_super_secret_key_change_in_production

# Frontend URL — used in password reset email links
FRONTEND_URL=http://localhost:3000

# Email — OPTIONAL
# Without these the app still works: reset tokens are printed to the console in dev mode
# With these, real emails are sent via Gmail to users
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
```

> **How to get Gmail App Password:**  
> Google Account → Security → 2-Step Verification → App Passwords → create one for "Mail".  
> Use the generated 16-char password, **not** your regular Gmail password.

### Frontend — `frontend/client/.env`

```env
# Vite dev server port (default: 3000)
VITE_PORT=3000

# Backend URL for Vite proxy — must match the backend PORT above
BACKEND_URL=http://localhost:5000
```

---

## 📊 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/auth/register` | — | Register patient or doctor |
| POST | `/api/auth/login` | — | Login → returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/auth/forgot-password` | — | Request password reset link |
| POST | `/api/auth/reset-password` | — | Reset password with token |
| GET | `/api/doctors` | ✅ | List all doctors |
| GET | `/api/doctors/:id` | ✅ | Get single doctor profile |
| GET | `/api/doctors/specializations` | ✅ | Available specializations |
| POST | `/api/appointments` | ✅ | Book an appointment |
| GET | `/api/appointments/my-appointments` | ✅ | User's appointments |
| PATCH | `/api/appointments/:id` | ✅ | Update appointment status |
| DELETE | `/api/appointments/:id` | ✅ | Cancel appointment |
| POST | `/api/ai/chat` | ✅ | AI mental health assistant |
| GET | `/api/messages/:receiverId` | ✅ | Get conversation history |
| GET | `/api/messages/doctor/patients` | ✅ | Doctor's patient list |
| GET | `/api/prescriptions/my` | ✅ | Patient's prescriptions |
| POST | `/api/prescriptions` | ✅ | Create prescription (doctor) |
| PUT | `/api/profile/patient` | ✅ | Update patient profile |
| PUT | `/api/profile/doctor` | ✅ | Update doctor profile |
| PUT | `/api/profile/user` | ✅ | Update user basics (name, photo) |
| DELETE | `/api/profile/account` | ✅ | Delete account (requires password) |

---

## 🏗️ Project Structure

```
mindmate/
├── backend/
│   ├── controllers/
│   │   └── appointmentController.ts   ← Appointment CRUD
│   ├── middleware/
│   │   └── auth.ts                    ← JWT authenticate middleware
│   ├── models/                        ← Mongoose models
│   │   ├── User.ts
│   │   ├── Patient.ts
│   │   ├── Doctor.ts
│   │   ├── Appointment.ts
│   │   ├── Message.ts
│   │   └── Prescription.ts
│   ├── server/
│   │   ├── index.ts                   ← Express app entry point
│   │   ├── auth.ts                    ← Auth routes (login, register, forgot/reset)
│   │   ├── db.ts                      ← MongoDB connection
│   │   ├── socket.ts                  ← Socket.io real-time chat
│   │   ├── seed.ts                    ← Auto-seeds 3 test accounts
│   │   ├── data/
│   │   │   └── mentalHealthResponses.ts  ← AI: 30+ categories, 240+ responses
│   │   ├── models/                    ← Schema definitions (also used by routes)
│   │   ├── routes/                    ← Feature route handlers
│   │   │   ├── appointments.ts
│   │   │   ├── messages.ts
│   │   │   ├── prescriptions.ts
│   │   │   ├── profile.ts
│   │   │   ├── doctors.ts
│   │   │   └── ai-chat.ts
│   │   └── services/
│   │       └── emailService.ts        ← Nodemailer (Gmail)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    └── client/
        ├── src/
        │   ├── App.tsx                ← Routes + providers
        │   ├── pages/                 ← Page components
        │   │   ├── login.tsx
        │   │   ├── register.tsx
        │   │   ├── ForgotPassword.tsx
        │   │   ├── ResetPassword.tsx
        │   │   ├── EditProfile.tsx
        │   │   ├── AIAssistant.tsx
        │   │   ├── Chat.tsx
        │   │   └── dashboard/
        │   │       ├── patient.tsx
        │   │       └── doctor.tsx
        │   ├── components/            ← Reusable UI components
        │   ├── hooks/
        │   │   ├── use-auth.tsx       ← Auth context (login, register, profile, delete)
        │   │   └── use-appointments.ts
        │   └── services/
        │       └── api.ts             ← Axios client (relative /api base)
        ├── .env.example
        ├── index.html
        ├── package.json
        └── vite.config.ts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui |
| **Backend** | Node.js 20, Express 4, TypeScript |
| **Database** | MongoDB 7 + Mongoose 9 |
| **Auth** | JWT (30-day), bcrypt |
| **Real-time** | Socket.io 4 |
| **Email** | Nodemailer (Gmail SMTP) |
| **AI Assistant** | Rule-based NLP — 30+ categories, 240+ responses |
| **State management** | TanStack Query v5 |
| **Forms** | react-hook-form + zod |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|---------|
| `MongoDB connection failed` | Run `mongod` in terminal, or set `MONGODB_URI` to an Atlas URI |
| `Port 5000 already in use` | Change `PORT=5001` in backend `.env` and `BACKEND_URL=http://localhost:5001` in frontend `.env` |
| `Port 3000 already in use` | Set `VITE_PORT=3001` in frontend `.env` |
| Registration fails | Check backend terminal for validation error messages |
| Email not received | In dev mode, reset tokens are printed to the backend console — no email credentials required |
| WebSocket errors | Start backend before opening the frontend |

---

## 🔐 Production Checklist

- [ ] Change `JWT_SECRET` to a long random string (`openssl rand -hex 64`)
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas with IP whitelist and strong password
- [ ] Enable HTTPS (nginx reverse proxy or Heroku)
- [ ] Never commit `.env` — it's already in `.gitignore`

---

## 📄 License

MIT — free to use for portfolio and demonstration purposes.
>>>>>>> 86341301cf3917797c7059dbcf9d2fc0af585679
