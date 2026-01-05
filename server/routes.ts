// server/routes.ts - CORS KE BAGAIR
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";
import appointmentRoutes from "./routes/appointments.js";
import authRoutes from "./auth.js";
import express from "express";

// Local implementations
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const setupAuth = (app: any) => {
  app.use("/api/auth", authRoutes);
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup JSON middleware
  app.use(express.json());

  // ✅ CORS HATA DIYA - Simple headers daal diye
  app.use((req, res, next) => {
    // Allow all origins during development
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    
    next();
  });

  // Setup auth routes
  setupAuth(app);

  // Setup appointment routes
  app.use("/api/appointments", appointmentRoutes);

  // Doctors
  app.get(api.doctors.list.path, async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json({
        success: true,
        data: doctors
      });
    } catch (error) {
      console.error("Get doctors error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctors"
      });
    }
  });

  app.get(api.doctors.get.path, async (req, res) => {
    try {
      const doctor = await storage.getDoctor(Number(req.params.id));
      if (!doctor) {
        return res.status(404).json({ 
          success: false,
          message: "Doctor not found" 
        });
      }
      res.json({
        success: true,
        data: doctor
      });
    } catch (error) {
      console.error("Get doctor error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctor"
      });
    }
  });

  // Patients
  app.get(api.patients.get.path, requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatient(Number(req.params.id));
      if (!patient) {
        return res.status(404).json({ 
          success: false,
          message: "Patient not found" 
        });
      }
      res.json({
        success: true,
        data: patient
      });
    } catch (error) {
      console.error("Get patient error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch patient"
      });
    }
  });

  // Appointments
  app.get(api.appointments.list.path, requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      let appointmentsList: any[] = [];
      
      if (user.role === "patient") {
        const patient = await storage.getPatientByUserId(user.id);
        if (patient) {
          appointmentsList = await storage.getAppointmentsByPatient(patient.id);
        }
      } else if (user.role === "doctor") {
        const doctor = await storage.getDoctorByUserId(user.id);
        if (doctor) {
          appointmentsList = await storage.getAppointmentsByDoctor(doctor.id);
        }
      }
      
      res.json({
        success: true,
        data: appointmentsList
      });
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch appointments"
      });
    }
  });

  app.post(api.appointments.create.path, requireAuth, async (req, res) => {
    try {
      const user = req.user as any;

      if (user.role !== "patient") {
        return res.status(403).json({ 
          success: false,
          message: "Only patients can book appointments" 
        });
      }

      const patient = await storage.getPatientByUserId(user.id);
      if (!patient) {
        return res.status(404).json({ 
          success: false,
          message: "Patient profile not found" 
        });
      }

      const input = api.appointments.create.input.parse(req.body);
      const appointment = await storage.createAppointment({
        ...input,
        patientId: patient.id,
      });
      
      res.status(201).json({
        success: true,
        data: appointment
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Create appointment error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to create appointment"
      });
    }
  });

  app.patch(api.appointments.updateStatus.path, requireAuth, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const appointment = await storage.updateAppointmentStatus(
        Number(req.params.id),
        status,
        notes
      );
      
      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error("Update appointment error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update appointment"
      });
    }
  });

  // Messages
  app.get(api.messages.list.path, requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const otherUserId = Number(req.query.otherUserId);

      if (!otherUserId) {
        return res.status(400).json({ 
          success: false,
          message: "otherUserId required" 
        });
      }

      const messages = await storage.getMessages(user.id, otherUserId);
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages"
      });
    }
  });

  app.post(api.messages.send.path, requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const input = api.messages.send.input.parse(req.body);
      
      const message = await storage.createMessage({
        ...input,
        senderId: user.id,
      });
      
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: err.errors[0].message,
        });
      }
      console.error("Send message error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to send message"
      });
    }
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "MindMate API" 
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ 
      success: false, 
      message: "Route not found" 
    });
  });

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  });

  return httpServer;
}