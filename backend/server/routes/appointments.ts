import express from "express";
import { auth } from "../../middleware/auth.ts";
import { Doctor } from "../../models/Doctor.ts";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getPatientAppointments
} from "../../controllers/appointmentController.ts";

const router = express.Router();

router.use(auth);

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

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/my-appointments", getAppointments);
router.get("/doctor/:doctorId", ensureDoctorProfileExists, getDoctorAppointments);
router.get("/patient/:patientId", getPatientAppointments);
router.get("/:id", getAppointmentById);
router.patch("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;