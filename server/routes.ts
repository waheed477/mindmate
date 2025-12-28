import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  setupAuth(app);

  // Doctors
  app.get(api.doctors.list.path, async (req, res) => {
    const doctors = await storage.getAllDoctors();
    res.json(doctors);
  });

  app.get(api.doctors.get.path, async (req, res) => {
    const doctor = await storage.getDoctor(Number(req.params.id));
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  });

  // Patients
  app.get(api.patients.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const patient = await storage.getPatient(Number(req.params.id));
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    // Authorization check: Only the patient themselves or a doctor can view? 
    // For now, allow logged in users for simplicity, or refine.
    res.json(patient);
  });

  // Appointments
  app.get(api.appointments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any; // Cast to any to access role/id easily

    let appointments = [];
    if (user.role === 'patient') {
      const patient = await storage.getPatientByUserId(user.id);
      if (patient) {
        appointments = await storage.getAppointmentsByPatient(patient.id);
      }
    } else if (user.role === 'doctor') {
      const doctor = await storage.getDoctorByUserId(user.id);
      if (doctor) {
        appointments = await storage.getAppointmentsByDoctor(doctor.id);
      }
    }
    
    res.json(appointments);
  });

  app.post(api.appointments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;

    if (user.role !== 'patient') return res.status(403).json({ message: "Only patients can book appointments" });

    try {
      const patient = await storage.getPatientByUserId(user.id);
      if (!patient) return res.status(404).json({ message: "Patient profile not found" });

      const input = api.appointments.create.input.parse(req.body);
      const appointment = await storage.createAppointment({
        ...input,
        patientId: patient.id,
      });
      res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.appointments.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    
    // Simple check: Allow doctors to accept/reject, Patients to cancel?
    // For MVP, just allow update if authenticated for now, ideally restrict based on ownership.
    
    const { status, notes } = req.body;
    const appointment = await storage.updateAppointmentStatus(Number(req.params.id), status, notes);
    res.json(appointment);
  });

  // Messages
  app.get(api.messages.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const otherUserId = Number(req.query.otherUserId);

    if (!otherUserId) return res.status(400).json({ message: "otherUserId required" });

    const messages = await storage.getMessages(user.id, otherUserId);
    res.json(messages);
  });

  app.post(api.messages.send.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;

    try {
      const input = api.messages.send.input.parse(req.body);
      const message = await storage.createMessage({
        ...input,
        senderId: user.id,
      });
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  // Seed Data (Basic check)
  await seedData();

  return httpServer;
}

import { hashPassword } from "./auth";

async function seedData() {
  const usersCount = await storage.getUserByUsername("doctor");
  if (!usersCount) {
    console.log("Seeding data...");
    
    // Create Doctor User
    const docPassword = await hashPassword("password");
    const docUser = await storage.createUser({
      username: "doctor",
      password: docPassword,
      role: "doctor"
    });

    await storage.createDoctor({
      userId: docUser.id,
      fullName: "Dr. Sarah Smith",
      specialization: "Psychiatrist",
      licenseNumber: "LIC12345",
      bio: "Experienced psychiatrist with 10 years in treating anxiety and depression.",
      experience: 10,
      consultationFee: 150,
      availability: [
        { day: "Monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
        { day: "Wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
        { day: "Friday", startTime: "09:00", endTime: "13:00", isAvailable: true }
      ]
    });

    // Create Patient User
    const patPassword = await hashPassword("password");
    const patUser = await storage.createUser({
      username: "patient",
      password: patPassword,
      role: "patient"
    });

    const patient = await storage.createPatient({
      userId: patUser.id,
      fullName: "John Doe",
      age: 30,
      gender: "Male",
      contactNumber: "555-0123",
      condition: "Anxiety",
      severity: "Moderate",
      medicalHistory: "None"
    });

    console.log("Seeding complete. Credentials: doctor/password, patient/password");
  }
}
