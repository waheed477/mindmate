import { z } from "zod";

export const insertUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]),
});

export const insertPatientSchema = z.object({
  userId: z.string(),
  age: z.number().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
});

export const insertDoctorSchema = z.object({
  userId: z.string(),
  specialization: z.string(),
  experience: z.number().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  consultationFee: z.number().optional(),
  availability: z.array(z.string()).optional(),
});

export const insertAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  date: z.string(),
  time: z.string(),
  type: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "accepted", "rejected", "cancelled", "completed"]).default("pending"),
});

export const insertMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
