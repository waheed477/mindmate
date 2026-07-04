import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { Prescription } from "../models/Prescription.ts";
import { User } from "../models/User.ts";
import { getIO } from "../socket.js";

const router = express.Router();
router.use(authenticate);

// POST /api/prescriptions — Doctor creates a prescription
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user as any;
    if (user.role !== "doctor") {
      return res.status(403).json({ success: false, message: "Only doctors can create prescriptions" });
    }

    const { patientId, medicines, notes, appointmentId, patientName } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: "patientId is required" });
    }
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ success: false, message: "At least one medicine is required" });
    }
    for (const med of medicines) {
      if (!med.name?.trim() || !med.dosage?.trim() || !med.duration?.trim()) {
        return res.status(400).json({ success: false, message: "Each medicine must have name, dosage, and duration" });
      }
    }

    // Look up patient name server-side as authoritative fallback
    let resolvedPatientName = patientName || "";
    if (!resolvedPatientName) {
      const patientUser = await User.findById(patientId).select("fullName").lean() as any;
      resolvedPatientName = patientUser?.fullName || "";
    }

    const prescription = await Prescription.create({
      doctorId: user.id,
      patientId,
      medicines,
      notes: notes || "",
      appointmentId: appointmentId || null,
      doctorName: user.fullName || "",
      patientName: resolvedPatientName,
    });

    // Emit real-time notification to patient
    try {
      const io = getIO();
      io.to(`user_${patientId}`).emit("prescription_notification", {
        prescriptionId: String(prescription._id),
        doctorName: user.fullName || "Your doctor",
        medicineCount: medicines.length,
      });
    } catch (socketErr) {
      // Non-fatal — socket may not be initialized in test environments
      console.warn("[Socket] Failed to emit prescription notification:", socketErr);
    }

    res.status(201).json({ success: true, data: prescription });
  } catch (error: any) {
    console.error("Create prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create prescription",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/prescriptions/my — Patient fetches their own prescriptions
router.get("/my", async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user as any;
    if (user.role !== "patient") {
      return res.status(403).json({ success: false, message: "Only patients can access this endpoint" });
    }

    const prescriptions = await Prescription.find({ patientId: user.id })
      .populate("doctorId", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: prescriptions });
  } catch (error: any) {
    console.error("Get patient prescriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/prescriptions/doctor — Doctor fetches all prescriptions they created
router.get("/doctor", async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user as any;
    if (user.role !== "doctor") {
      return res.status(403).json({ success: false, message: "Only doctors can access this endpoint" });
    }

    const prescriptions = await Prescription.find({ doctorId: user.id })
      .populate("patientId", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: prescriptions });
  } catch (error: any) {
    console.error("Get doctor prescriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
