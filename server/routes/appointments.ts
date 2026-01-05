// server/routes/appointments.ts
import express from "express";
import { authenticate } from "../auth";
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

// Create appointment (Patient only)
router.post("/", createAppointment);

// Get all appointments (Admin/Doctor)
router.get("/", getAppointments);

// Get appointments for current user
router.get("/my-appointments", getAppointments);

// Get doctor's appointments
router.get("/doctor/:doctorId", getDoctorAppointments);

// Get patient's appointments  
router.get("/patient/:patientId", getPatientAppointments);

// Get single appointment
router.get("/:id", getAppointmentById);

// Update appointment (Status, notes, etc.)
router.patch("/:id", updateAppointment);

// Delete appointment
router.delete("/:id", deleteAppointment);

export default router;