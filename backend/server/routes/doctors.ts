import express from "express";
import { storage } from "../storage.js";

const router = express.Router();

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/", async (req, res) => {
  try {
    const specialization =
      typeof req.query.specialization === "string" && req.query.specialization.trim()
        ? req.query.specialization.trim()
        : undefined;

    const search =
      typeof req.query.search === "string" && req.query.search.trim()
        ? req.query.search.trim()
        : undefined;

    const minFee =
      typeof req.query.minFee === "string" && req.query.minFee.trim() !== ""
        ? Number(req.query.minFee)
        : undefined;

    const maxFee =
      typeof req.query.maxFee === "string" && req.query.maxFee.trim() !== ""
        ? Number(req.query.maxFee)
        : undefined;

    if (typeof minFee === "number" && Number.isNaN(minFee)) {
      return res.status(400).json({ success: false, message: "minFee must be a valid number" });
    }
    if (typeof maxFee === "number" && Number.isNaN(maxFee)) {
      return res.status(400).json({ success: false, message: "maxFee must be a valid number" });
    }

    const doctors = await storage.getDoctors({ specialization, search, minFee, maxFee });

    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
});

router.get("/specializations", async (_req, res) => {
  try {
    const specializations = await storage.getDoctorSpecializations();
    res.json({ success: true, data: specializations });
  } catch (error) {
    console.error("Get specializations error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch specializations" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await storage.getDoctor(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctor" });
  }
});

export default router;
