// server/auth.ts
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";  // ✅ .js extension
import { Doctor } from "./models/Doctor.js";  // ✅ .js extension
import { Patient } from "./models/Patient.js";  // ✅ .js extension

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mindmate-secret-key-123";
const JWT_EXPIRES_IN = "7d";

const buildAuthUserPayload = async (user: any) => {
  const authUser: any = {
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };

  if (user.role === "doctor") {
    const doctorProfile = await Doctor.findOne({ userId: user._id })
      .select("_id fullName specialization verificationStatus consultationFee profilePicture bio qualification experience licenseNumber")
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
        licenseNumber: doctorProfile.licenseNumber || ""
      };
    }
  }

  if (user.role === "patient") {
    const patientProfile = await Patient.findOne({ userId: user._id })
      .select("_id fullName age gender contactNumber profilePicture address emergencyContact medicalHistory")
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
        medicalHistory: patientProfile.medicalHistory || ""
      };
    }
  }

  return authUser;
};

// Generate JWT Token
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Hash password utility
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import("bcrypt");
  return await bcrypt.hash(password, 10);
};

// Auth Middleware
export const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// For backward compatibility
export const requireAuth = authenticate;

// Setup function for index.ts
export const setupAuth = (app: express.Application) => {
  app.use("/api/auth", router);
};

// Register - Updated to match frontend format
router.post("/register", async (req: express.Request, res: express.Response) => {
  try {
    // Frontend data mapping
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
      consultationFee 
    } = req.body;
    
    // Use email as username
    const username = email;
    
    // Validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      fullName
    });
    
    // Create profile
    const { bio, profilePicture, licensePicture } = req.body;
    if (role === "doctor") {
      await Doctor.create({
        userId: user._id,
        fullName,
        specialization: specialization || "General",
        licenseNumber: licenseNumber || "TEMP123",
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        verificationStatus: "pending",
        bio: bio || "",
        profilePicture: profilePicture || "",
        licensePicture: licensePicture || ""
      });
    } else if (role === "patient") {
      await Patient.create({
        userId: user._id,
        fullName,
        age: age || 18,
        gender: gender || "Other",
        contactNumber: contactNumber || "",
        profilePicture: profilePicture || ""
      });
    }
    
    // Generate token
    const token = generateToken(user);
    const authUser = await buildAuthUserPayload(user);
    
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: authUser
    });
    
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Login - Updated for JWT
router.post("/login", async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required"
      });
    }
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Check password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Generate token
    const token = generateToken(user);
    const authUser = await buildAuthUserPayload(user);
    
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: authUser
    });
    
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get current user
router.get("/me", authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const authUser = await buildAuthUserPayload(user);
    
    res.json({
      success: true,
      user: authUser
    });
    
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Logout
router.post("/logout", authenticate, (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export default router;