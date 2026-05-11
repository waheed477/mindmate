// server/routes/appointments.ts
import express from "express";
import { authenticate } from "../auth";
import { Doctor } from "../models/Doctor.js";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getPatientAppointments
} from "../controllers/appointmentController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

const ensureDoctorProfileExists = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "doctorId is required"
      });
    }

    const doctorProfile = await Doctor.findById(doctorId).select("_id").lean();
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to validate doctor profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Create appointment (Patient only)
router.post("/", createAppointment);

// Get all appointments (Admin/Doctor)
router.get("/", getAppointments);

// Get appointments for current user
router.get("/my-appointments", getAppointments);

// Get doctor's appointments
router.get("/doctor/:doctorId", ensureDoctorProfileExists, getDoctorAppointments);

// Get patient's appointments  
router.get("/patient/:patientId", getPatientAppointments);

// Get single appointment
router.get("/:id", getAppointmentById);

// Update appointment (Status, notes, etc.)
router.patch("/:id", updateAppointment);

// Delete appointment
router.delete("/:id", deleteAppointment);

export default router;