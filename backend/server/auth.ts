import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "./models/User.js";
import { Doctor } from "./models/Doctor.js";
import { Patient } from "./models/Patient.js";
import { getIO } from "./socket.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./services/emailService.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mindmate-secret-key-123";
const JWT_EXPIRES_IN = "7d";

// ─── Helpers ────────────────────────────────────────────────────────────────

const generate6DigitCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const buildAuthUserPayload = async (user: any) => {
  const authUser: any = {
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    isEmailVerified: user.isEmailVerified,
  };

  if (user.role === "doctor") {
    const doctorProfile = await Doctor.findOne({ userId: user._id })
      .select(
        "_id fullName specialization verificationStatus consultationFee profilePicture bio qualification experience licenseNumber"
      )
      .lean() as any;

    if (doctorProfile) {
      authUser.doctorProfileId = String(doctorProfile._id);
      authUser.doctor = {
        _id: String(doctorProfile._id),
        fullName: doctorProfile.fullName,
        specialization: doctorProfile.specialization,
        verificationStatus: doctorProfile.verificationStatus,
        consultationFee: doctorProfile.consultationFee,
        profilePicture: doctorProfile.profilePicture || "",
        bio: doctorProfile.bio || "",
        qualification: doctorProfile.qualification || "",
        experience: doctorProfile.experience ?? 0,
        licenseNumber: doctorProfile.licenseNumber || "",
      };
    }
  }

  if (user.role === "patient") {
    const patientProfile = await Patient.findOne({ userId: user._id })
      .select(
        "_id fullName age gender contactNumber profilePicture address emergencyContact medicalHistory"
      )
      .lean() as any;

    if (patientProfile) {
      authUser.patientProfileId = String(patientProfile._id);
      authUser.patient = {
        _id: String(patientProfile._id),
        fullName: patientProfile.fullName,
        age: patientProfile.age,
        gender: patientProfile.gender,
        contactNumber: patientProfile.contactNumber,
        profilePicture: patientProfile.profilePicture || "",
        address: patientProfile.address || "",
        emergencyContact: patientProfile.emergencyContact || "",
        medicalHistory: patientProfile.medicalHistory || "",
      };
    }
  }

  return authUser;
};

const generateToken = (user: any) =>
  jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import("bcrypt");
  return bcrypt.hash(password, 10);
};

// ─── Auth Middleware ─────────────────────────────────────────────────────────

export const authenticate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireAuth = authenticate;

export const setupAuth = (app: express.Application) => {
  app.use("/api/auth", router);
};

// ─── POST /register ──────────────────────────────────────────────────────────

router.post("/register", async (req: express.Request, res: express.Response) => {
  try {
    const {
      email,
      password,
      name: fullName,
      role = "patient",
      age,
      gender,
      contactNumber,
      specialization,
      licenseNumber,
      experience,
      consultationFee,
    } = req.body;

    const username = email;

    if (!username || !email || !password || !fullName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const user = await User.create({
      username,
      email,
      password,
      role,
      fullName,
      isEmailVerified: false,
      verificationCode: code,
      verificationExpiresAt: expiresAt,
    });

    const { bio, profilePicture, licensePicture } = req.body;

    if (role === "doctor") {
      const newDoctor = await Doctor.create({
        userId: user._id,
        fullName,
        specialization: specialization || "General",
        licenseNumber: licenseNumber || "TEMP123",
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        verificationStatus: "pending",
        bio: bio || "",
        profilePicture: profilePicture || "",
        licensePicture: licensePicture || "",
      });
      try {
        getIO().emit("doctor:registered", {
          doctorId: String(newDoctor._id),
          fullName,
          specialization: specialization || "General",
        });
      } catch (_) {}
    } else if (role === "patient") {
      await Patient.create({
        userId: user._id,
        fullName,
        age: age || 18,
        gender: gender || "Other",
        contactNumber: contactNumber || "",
        profilePicture: profilePicture || "",
      });
    }

    // Send verification email (non-blocking — don't fail registration if email fails)
    sendVerificationEmail(email, fullName, code).catch((err) =>
      console.error("Verification email failed:", err.message)
    );

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for a 6-digit verification code.",
      requiresVerification: true,
      email,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ─── POST /verify-email ───────────────────────────────────────────────────────

router.post("/verify-email", async (req: express.Request, res: express.Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Email and code are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    if (!user.verificationCode || user.verificationCode !== String(code).trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    if (!user.verificationExpiresAt || user.verificationExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    user.isEmailVerified = true;
    user.verificationCode = null as any;
    user.verificationExpiresAt = null as any;
    await user.save();

    const token = generateToken(user);
    const authUser = await buildAuthUserPayload(user);

    res.json({
      success: true,
      message: "Email verified successfully!",
      token,
      user: authUser,
    });
  } catch (error: any) {
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ─── POST /resend-verification ────────────────────────────────────────────────

router.post(
  "/resend-verification",
  async (req: express.Request, res: express.Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.isEmailVerified) {
        return res
          .status(400)
          .json({ success: false, message: "Email already verified" });
      }

      const code = generate6DigitCode();
      user.verificationCode = code;
      user.verificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      sendVerificationEmail(email, user.fullName, code).catch((err) =>
        console.error("Resend verification email failed:", err.message)
      );

      res.json({
        success: true,
        message: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to resend verification code" });
    }
  }
);

// ─── POST /login ──────────────────────────────────────────────────────────────

router.post("/login", async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username and password required" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in. Check your inbox for a verification code.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user);
    const authUser = await buildAuthUserPayload(user);

    res.json({ success: true, message: "Login successful", token, user: authUser });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ─── POST /forgot-password ────────────────────────────────────────────────────

router.post(
  "/forgot-password",
  async (req: express.Request, res: express.Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      }

      const user = await User.findOne({ email: email.toLowerCase() });

      // Always respond success to prevent email enumeration
      if (!user) {
        return res.json({
          success: true,
          message:
            "If that email is registered, you will receive a password reset link shortly.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hr
      await user.save();

      sendPasswordResetEmail(email, user.fullName, token).catch((err) =>
        console.error("Password reset email failed:", err.message)
      );

      res.json({
        success: true,
        message:
          "If that email is registered, you will receive a password reset link shortly.",
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to process request" });
    }
  }
);

// ─── POST /reset-password ─────────────────────────────────────────────────────

router.post(
  "/reset-password",
  async (req: express.Request, res: express.Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token. Please request a new link.",
        });
      }

      user.password = newPassword; // pre-save hook will hash it
      user.resetPasswordToken = null as any;
      user.resetPasswordExpiresAt = null as any;
      await user.save();

      res.json({
        success: true,
        message: "Password reset successfully. You can now log in.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to reset password" });
    }
  }
);

// ─── GET /me ──────────────────────────────────────────────────────────────────

router.get("/me", authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const authUser = await buildAuthUserPayload(user);
    res.json({ success: true, user: authUser });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ─── POST /logout ─────────────────────────────────────────────────────────────

router.post("/logout", authenticate, (_req: express.Request, res: express.Response) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
