// server/controllers/appointmentController.ts
import { Request, Response } from "express";
import { Appointment } from "../models/Appointment.js";  // ✅ .js
import { Doctor } from "../models/Doctor.js";  // ✅ .js
import { Patient } from "../models/Patient.js";  // ✅ .js

// Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, date, symptoms, healthCondition, type, duration } = req.body;
    
    // Get patient ID from authenticated user
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient profile not found" 
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date: new Date(date),
      symptoms,
      healthCondition,
      type: type || "online",
      duration: duration || 30,
      activityLog: [{
        action: "Appointment requested",
        performedBy: "patient",
        details: `Request sent to Dr. ${doctor.fullName}`
      }]
    });

    // Populate doctor and patient details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "fullName specialization consultationFee verificationStatus")
      .populate("patient", "fullName age gender contactNumber");

    res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
      appointment: populatedAppointment
    });

  } catch (error: any) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get appointments with filters
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { status, type, startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query: any = {};

    // Filter by role
    if (userRole === "doctor") {
      const doctor = await Doctor.findOne({ userId });
      if (doctor) {
        query.doctorId = doctor._id;
      }
    } else if (userRole === "patient") {
      const patient = await Patient.findOne({ userId });
      if (patient) {
        query.patientId = patient._id;
      }
    }

    // Additional filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "fullName specialization consultationFee verificationStatus")
      .populate("patient", "fullName age gender contactNumber")
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error: any) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query;

    const query: any = { doctorId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate("patient", "fullName age gender contactNumber")
      .sort({ date: 1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error: any) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor appointments",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get patient's appointments
export const getPatientAppointments = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    const query: any = { patientId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate("doctor", "fullName specialization consultationFee verificationStatus")
      .sort({ date: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error: any) {
    console.error("Get patient appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient appointments",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get single appointment
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor", "fullName specialization consultationFee verificationStatus")
      .populate("patient", "fullName age gender contactNumber");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.json({
      success: true,
      appointment
    });

  } catch (error: any) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, doctorNotes, prescription, followUpDate, rating, review } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Update fields
    const updates: any = {};
    if (status) updates.status = status;
    if (notes) updates.notes = notes;
    if (doctorNotes) updates.doctorNotes = doctorNotes;
    if (prescription) updates.prescription = prescription;
    if (followUpDate) updates.followUpDate = followUpDate;
    if (rating) updates.rating = rating;
    if (review) updates.review = review;

    // Add activity log
    if (Object.keys(updates).length > 0) {
      if (!updates.$push) updates.$push = {};
      
      let action = "";
      if (status === "accepted") action = "Appointment accepted by doctor";
      else if (status === "rejected") action = "Appointment rejected by doctor";
      else if (status === "completed") action = "Appointment completed";
      else action = "Appointment updated";

      updates.$push.activityLog = {
        action,
        performedBy: userRole,
        details: doctorNotes || notes || `Status: ${status}`
      };
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("doctor", "fullName specialization consultationFee verificationStatus")
      .populate("patient", "fullName age gender contactNumber");

    res.json({
      success: true,
      message: "Appointment updated successfully",
      appointment: updatedAppointment
    });

  } catch (error: any) {
    console.error("Update appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.json({
      success: true,
      message: "Appointment deleted successfully"
    });

  } catch (error: any) {
    console.error("Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};