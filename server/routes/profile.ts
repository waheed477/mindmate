import express from "express";
import bcrypt from "bcrypt";
import { authenticate } from "../auth.js";
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { Appointment } from "../models/Appointment.js";
import { Message } from "../models/Message.js";
import { Prescription } from "../models/Prescription.js";

const router = express.Router();
router.use(authenticate);

// PUT /api/profile/user — update name, phone, profilePicture on User + profile doc
router.put("/user", async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { fullName, profilePicture } = req.body;

    const userUpdates: any = {};
    if (fullName) userUpdates.fullName = fullName;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates);
    }

    if (role === "doctor") {
      const docUpdates: any = {};
      if (fullName) docUpdates.fullName = fullName;
      if (profilePicture !== undefined) docUpdates.profilePicture = profilePicture;
      if (Object.keys(docUpdates).length > 0) {
        await Doctor.findOneAndUpdate({ userId }, docUpdates);
      }
    } else if (role === "patient") {
      const patUpdates: any = {};
      if (fullName) patUpdates.fullName = fullName;
      if (profilePicture !== undefined) patUpdates.profilePicture = profilePicture;
      if (Object.keys(patUpdates).length > 0) {
        await Patient.findOneAndUpdate({ userId }, patUpdates);
      }
    }

    const updatedUser = await User.findById(userId).select("-password").lean() as any;
    res.json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error: any) {
    console.error("Update user profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

// PUT /api/profile/patient — update patient-specific fields
router.put("/patient", async (req: express.Request, res: express.Response) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ success: false, message: "Patients only" });
    }
    const userId = req.user.id;
    const { age, gender, contactNumber, address, emergencyContact, medicalHistory, profilePicture, fullName } = req.body;

    const updates: any = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (age !== undefined) updates.age = Number(age);
    if (gender !== undefined) updates.gender = gender;
    if (contactNumber !== undefined) updates.contactNumber = contactNumber;
    if (address !== undefined) updates.address = address;
    if (emergencyContact !== undefined) updates.emergencyContact = emergencyContact;
    if (medicalHistory !== undefined) updates.medicalHistory = medicalHistory;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;

    if (fullName) await User.findByIdAndUpdate(userId, { fullName });

    const patient = await Patient.findOneAndUpdate({ userId }, updates, { new: true }).lean();
    res.json({ success: true, message: "Patient profile updated", patient });
  } catch (error: any) {
    console.error("Update patient profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update patient profile" });
  }
});

// PUT /api/profile/doctor — update doctor-specific fields
router.put("/doctor", async (req: express.Request, res: express.Response) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ success: false, message: "Doctors only" });
    }
    const userId = req.user.id;
    const {
      fullName, specialization, qualification, experience, consultationFee,
      bio, licenseNumber, licensePicture, profilePicture, hospitalAffiliation,
    } = req.body;

    const updates: any = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (specialization !== undefined) updates.specialization = specialization;
    if (qualification !== undefined) updates.qualification = qualification;
    if (experience !== undefined) updates.experience = Number(experience);
    if (consultationFee !== undefined) updates.consultationFee = Number(consultationFee);
    if (bio !== undefined) updates.bio = bio;
    if (licenseNumber !== undefined) updates.licenseNumber = licenseNumber;
    if (licensePicture !== undefined) updates.licensePicture = licensePicture;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (hospitalAffiliation !== undefined) updates.hospitalAffiliation = hospitalAffiliation;

    if (fullName) await User.findByIdAndUpdate(userId, { fullName });

    const doctor = await Doctor.findOneAndUpdate({ userId }, updates, { new: true }).lean();
    res.json({ success: true, message: "Doctor profile updated", doctor });
  } catch (error: any) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update doctor profile" });
  }
});

// DELETE /api/profile/account — delete account with password confirmation
router.delete("/account", async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required to delete account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isValid = await (user as any).comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Delete all related data
    if (role === "doctor") {
      const doctor = await Doctor.findOne({ userId });
      if (doctor) {
        await Appointment.deleteMany({ doctorId: doctor._id });
        await Prescription.deleteMany({ doctorId: userId });
        await Doctor.deleteOne({ userId });
      }
    } else if (role === "patient") {
      const patient = await Patient.findOne({ userId });
      if (patient) {
        await Appointment.deleteMany({ patientId: patient._id });
        await Prescription.deleteMany({ patientId: userId });
        await Patient.deleteOne({ userId });
      }
    }

    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
});

export default router;
