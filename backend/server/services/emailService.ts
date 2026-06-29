import nodemailer from "nodemailer";

const APP_NAME = "MindMate";
const BASE_URL = process.env.FRONTEND_URL || "http://localhost:5000";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

export async function sendVerificationEmail(
  toEmail: string,
  fullName: string,
  code: string
): Promise<void> {
  // Always log in dev so you can verify without waiting for email delivery
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n📧 [DEV] Verification code for ${toEmail}: ${code}\n`);
  }

  // Skip actual send if email credentials aren't configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("[Email] EMAIL_USER / EMAIL_APP_PASSWORD not set — skipping real send.");
    return;
  }

  await createTransporter().sendMail({
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${APP_NAME} — Verify your email`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #0d9488; margin-bottom: 8px;">Welcome to ${APP_NAME}, ${fullName}!</h2>
        <p style="color: #374151; font-size: 15px;">Thanks for signing up. Use the verification code below to confirm your email address.</p>
        <div style="margin: 32px 0; text-align: center;">
          <span style="display: inline-block; background: #0d9488; color: #fff; font-size: 36px; font-weight: bold; letter-spacing: 10px; padding: 16px 32px; border-radius: 10px;">
            ${code}
          </span>
        </div>
        <p style="color: #6b7280; font-size: 13px;">This code expires in <strong>15 minutes</strong>. If you didn't create a ${APP_NAME} account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  fullName: string,
  token: string
): Promise<void> {
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`\n🔑 [DEV] Password reset link for ${toEmail}: ${resetLink}\n`);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("[Email] EMAIL_USER / EMAIL_APP_PASSWORD not set — skipping real send.");
    return;
  }

  await createTransporter().sendMail({
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${APP_NAME} — Reset your password`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #0d9488; margin-bottom: 8px;">Password Reset Request</h2>
        <p style="color: #374151; font-size: 15px;">Hi ${fullName}, we received a request to reset your ${APP_NAME} password.</p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${resetLink}" style="display: inline-block; background: #0d9488; color: #fff; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px;">This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 16px; word-break: break-all;">Or copy this link: ${resetLink}</p>
      </div>
    `,
  });
}
