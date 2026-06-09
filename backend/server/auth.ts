import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { getIO } from "./socket.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./services/emailService.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mindmate-secret-key-123";
const JWT_EXPIRES_IN = "7d";

// ============ Helpers ============

const generate6DigitCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const buildAuthUserPayload = async (user: any) => {
  const authUser: any = {
    id: String(user._id),
    email: user.email,
    role: user.role,
    fullName: user.fullName,
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
        profilePicture: doctorProfile.profilePicture || "",
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

// ============ Register Patient ============

router.post("/register/patient", async (req, res) => {
  try {
    const { email, password, fullName, age, condition, contact } = req.body;

    // Validate required fields
    if (!email || !password || !fullName || !age || !condition || !contact) {
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

    // Create user
    const user = await User.create({
      email,
      password,
      role: "patient",
      fullName,
      isEmailVerified: true,
    });

    // Create patient profile
    await Patient.create({
      userId: user._id,
      fullName,
      age,
      condition,
      contact,
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const payload = await buildAuthUserPayload(user);

    res.status(201).json({
      success: true,
      token,
      user: payload,
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

    // Validate required fields
    if (!email || !password || !fullName || !specialization || !consultationFee || !licenseNumber) {
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

    // Create user
    const user = await User.create({
      email,
      password,
      role: "doctor",
      fullName,
      isEmailVerified: true,
    });

    // Create doctor profile
    await Doctor.create({
      userId: user._id,
      fullName,
      specialization,
      consultationFee,
      experience: experience || 0,
      licenseNumber,
      verificationStatus: "verified",
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const payload = await buildAuthUserPayload(user);

    res.status(201).json({
      success: true,
      token,
      user: payload,
    });
  } catch (error: any) {
    console.error("Register doctor error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Login ==========
// FIXED: Login endpoint accepts ONLY email and password

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;  // ✅ Only email and password
    
    console.log("Login attempt for:", email);
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// ============ Get Current User ============

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const payload = await buildAuthUserPayload(user);

    res.json({
      success: true,
      user: payload,
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ============ Forgot Password ============

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpiresAt = new Date(Date.now() + 3600000);
    
    await user.save();

    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ 
      success: true, 
      message: "Password reset link sent to email",
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Reset Password ============

router.post("/reset-password", async (req, res) => {
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

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;