import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from './auth.js';
import { User } from "./models/User.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/auth', authRouter);

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/mindmate_test';

beforeAll(async () => {
  process.env.MONGODB_URI = TEST_DB_URI;
  process.env.JWT_SECRET = 'test-secret-key-123';
  process.env.NODE_ENV = 'development'; // to make sure resetToken and magicToken are exposed for tests
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('MindMate Authentication API Endpoints', () => {
  it('should register a new patient and require email verification', async () => {
    const res = await request(app)
      .post('/api/auth/register/patient')
      .send({
        email: 'patient@example.com',
        password: 'password123',
        fullName: 'Jane Doe',
        age: 25,
        condition: 'Anxiety',
        contact: '1234567890'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.requiresVerification).toBe(true);
    expect(res.body.email).toBe('patient@example.com');

    const user = await User.findOne({ email: 'patient@example.com' });
    expect(user).toBeDefined();
    expect(user?.isEmailVerified).toBe(false);
    expect(user?.emailVerificationCode).toBeDefined();
  });

  it('should verify email with correct OTP code', async () => {
    // 1. Create a user needing verification
    await request(app)
      .post('/api/auth/register/patient')
      .send({
        email: 'verify@example.com',
        password: 'password123',
        fullName: 'Verify Test',
        age: 30,
        condition: 'Depression',
        contact: '0987654321'
      });

    const user = await User.findOne({ email: 'verify@example.com' });
    const code = user?.emailVerificationCode;

    // 2. Submit verification code
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: 'verify@example.com', code });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.isEmailVerified).toBe(true);

    const updatedUser = await User.findOne({ email: 'verify@example.com' });
    expect(updatedUser?.isEmailVerified).toBe(true);
  });

  it('should generate a magic link and complete login', async () => {
    // 1. Request Magic Link (auto-creates patient profile)
    const magicRes = await request(app)
      .post('/api/auth/magic-link')
      .send({ email: 'magic@example.com' });

    expect(magicRes.status).toBe(200);
    expect(magicRes.body.success).toBe(true);
    expect(magicRes.body.magicToken).toBeDefined();

    const token = magicRes.body.magicToken;

    // 2. Login with magic token
    const loginRes = await request(app)
      .post('/api/auth/magic-login')
      .send({ token });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe('magic@example.com');
  });

  it('should block login after 5 invalid attempts due to rate limiting', async () => {
    // Attempt invalid logins 6 times
    let lastRes;
    for (let i = 0; i < 6; i++) {
      lastRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'rate@example.com', password: 'wrong' });
    }

    expect(lastRes?.status).toBe(429);
    expect(lastRes?.body.success).toBe(false);
    expect(lastRes?.body.message).toContain('Too many login attempts');
  });
});
