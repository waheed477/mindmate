import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import passport from "passport";
import { User } from "./models/User";
import { Doctor } from "./models/Doctor";
import { Patient } from "./models/Patient";
import { getIO } from "./socket.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendMagicLinkEmail,
} from "./services/emailService.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mindmate-secret-key-123";
const JWT_EXPIRES_IN = "30d";

// ============ Helpers ============

const generate6DigitCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const setAuthCookie = (res: express.Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Required for OAuth redirects
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

const buildAuthUserPayload = async (user: any) => {
  const authUser: any = {
    id: String(user._id),
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    profilePicture: user.profilePicture || "",
    isEmailVerified: user.isEmailVerified,
  };

  if (user.role === "doctor") {
    const doctorProfile = await Doctor.findOne({ userId: user._id }).lean();
    if (doctorProfile) {
      authUser.doctorProfileId = String(doctorProfile._id);
      authUser.doctor = {
        _id: String(doctorProfile._id),
        fullName: doctorProfile.fullName,
        specialization: doctorProfile.specialization,
        verificationStatus: doctorProfile.verificationStatus,
        consultationFee: doctorProfile.consultationFee,
        profilePicture: doctorProfile.profilePicture || user.profilePicture || "",
      };
    }
  }

  if (user.role === "patient") {
    const patientProfile = await Patient.findOne({ userId: user._id }).lean();
    if (patientProfile) {
      authUser.patientProfileId = String(patientProfile._id);
      authUser.patient = {
        _id: String(patientProfile._id),
        fullName: patientProfile.fullName,
        age: patientProfile.age,
        condition: patientProfile.condition,
      };
    }
  }

  return authUser;
};

// ============ Google OAuth Routes ============

router.get("/google", passport.authenticate("google", { session: false, scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`,
  }),
  async (req: any, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`);
      }

      req.user.lastLogin = new Date();
      req.user.loginCount = (req.user.loginCount || 0) + 1;
      await req.user.save();

      const token = jwt.sign(
        { id: req.user._id.toString(), role: req.user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      setAuthCookie(res, token);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?token=${token}`);
    } catch (error) {
      console.error("Google OAuth redirect error:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`);
    }
  }
);

// ============ Register (unified) ============

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ success: false, message: "email, password, fullName, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Create user with isEmailVerified = false
    const user = await User.create({ email, password, role, fullName, isEmailVerified: false });

    if (role === "doctor") {
      const { specialization, consultationFee, experience, licenseNumber } = req.body;
      await Doctor.create({
        userId: user._id,
        fullName,
        specialization: specialization || "General",
        consultationFee: Number(consultationFee) || 0,
        experience: Number(experience) || 0,
        licenseNumber: licenseNumber || "",
        verificationStatus: "verified",
      });
    } else {
      const { age, condition, contact, contactNumber, gender } = req.body;
      await Patient.create({
        userId: user._id,
        fullName,
        age: Number(age) || 0,
        condition: condition || "General",
        contact: contact || contactNumber || "Not Provided",
        gender: gender || "",
        contactNumber: contactNumber || contact || "Not Provided",
      });
    }

    // Generate Verification Code
    const code = generate6DigitCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, fullName, code);

    res.status(201).json({ success: true, requiresVerification: true, email: user.email });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Register Patient ============

router.post("/register/patient", async (req, res) => {
  try {
    const { email, password, fullName, age, condition, contact } = req.body;

    if (!email || !password || !fullName || age === undefined || !condition || !contact) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required: email, password, fullName, age, condition, contact" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    const user = await User.create({
      email,
      password,
      role: "patient",
      fullName,
      isEmailVerified: false,
    });

    await Patient.create({
      userId: user._id,
      fullName,
      age,
      condition,
      contact,
    });

    const code = generate6DigitCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, fullName, code);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
    });
  } catch (error: any) {
    console.error("Register patient error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Register Doctor ============

router.post("/register/doctor", async (req, res) => {
  try {
    const { email, password, fullName, specialization, consultationFee, experience, licenseNumber } = req.body;

    if (!email || !password || !fullName || !specialization || consultationFee === undefined || !licenseNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required: email, password, fullName, specialization, consultationFee, licenseNumber" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    const user = await User.create({
      email,
      password,
      role: "doctor",
      fullName,
      isEmailVerified: false,
    });

    await Doctor.create({
      userId: user._id,
      fullName,
      specialization,
      consultationFee,
      experience: experience || 0,
      licenseNumber,
      verificationStatus: "verified",
    });

    const code = generate6DigitCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, fullName, code);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
    });
  } catch (error: any) {
    console.error("Register doctor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Login ==========

router.post("/login", loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account is deactivated. Contact support." });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: "Please log in using your Google account or Magic Link." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      const code = generate6DigitCode();
      user.emailVerificationCode = code;
      user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendVerificationEmail(email, user.fullName || email, code);

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: "Email not verified. A verification code has been sent to your email.",
      });
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    setAuthCookie(res, token);
    const payload = await buildAuthUserPayload(user);

    res.json({ success: true, token, user: payload });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ============ Verify Email ============

router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Email and verification code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (
      user.emailVerificationCode !== code ||
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpiresAt = undefined;
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    setAuthCookie(res, token);
    const payload = await buildAuthUserPayload(user);

    res.json({ success: true, token, user: payload });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Resend Verification ============

router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    const code = generate6DigitCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.fullName || email, code);

    res.json({ success: true, message: "Verification code resent successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Magic Link Login ============

router.post("/magic-link", loginRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let user = await User.findOne({ email });
    const isNew = !user;

    if (isNew) {
      const fullName = email.split("@")[0];
      user = await User.create({
        email,
        fullName,
        role: "patient",
        isEmailVerified: false, // Verified once they click the link
      });

      await Patient.create({
        userId: user._id,
        fullName,
        age: 0,
        condition: "General",
        contact: "Magic Link",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.magicLinkToken = hashedToken;
    user.magicLinkExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save();

    await sendMagicLinkEmail(email, user.fullName || email, rawToken);

    res.json({
      success: true,
      message: "Magic link sent successfully.",
      magicToken: process.env.NODE_ENV !== "production" ? rawToken : undefined,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/magic-login", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Magic link token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      magicLinkToken: hashedToken,
      magicLinkExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired magic link" });
    }

    user.isEmailVerified = true;
    user.magicLinkToken = undefined;
    user.magicLinkExpiresAt = undefined;
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    setAuthCookie(res, jwtToken);
    const payload = await buildAuthUserPayload(user);

    res.json({ success: true, token: jwtToken, user: payload });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Get Current User ============

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account deactivated" });
    }

    // Refresh token on page load
    const newToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    setAuthCookie(res, newToken);
    const payload = await buildAuthUserPayload(user);

    res.json({
      success: true,
      token: newToken,
      user: payload,
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ============ Forgot Password ============

router.post("/forgot-password", loginRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpiresAt = new Date(Date.now() + 3600000); // 1 hour
    
    await user.save();

    await sendPasswordResetEmail(email, (user as any).fullName || email, resetToken);

    res.json({ 
      success: true, 
      message: "Password reset link sent to email",
      resetToken: process.env.NODE_ENV !== "production" ? resetToken : undefined
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Reset Password ============

router.post("/reset-password", loginRateLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

