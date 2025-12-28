import { db } from "./db";
import { 
  users, patients, doctors, appointments, messages,
  type User, type InsertUser,
  type Patient, type InsertPatient,
  type Doctor, type InsertDoctor,
  type Appointment, type InsertAppointment,
  type Message, type InsertMessage
} from "@shared/schema";
import { eq, or, and, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patient
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByUserId(userId: number): Promise<Patient | undefined>;

  // Doctor
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: number): Promise<Doctor | undefined>;
  getAllDoctors(): Promise<Doctor[]>;

  // Appointment
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByPatient(patientId: number): Promise<(Appointment & { doctor: Doctor })[]>;
  getAppointmentsByDoctor(doctorId: number): Promise<(Appointment & { patient: Patient })[]>;
  updateAppointmentStatus(id: number, status: string, notes?: string): Promise<Appointment>;

  // Message
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(user1Id: number, user2Id: number): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Patient
  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getPatientByUserId(userId: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.userId, userId));
    return patient;
  }

  // Doctor
  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  // Appointment
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByPatient(patientId: number): Promise<(Appointment & { doctor: Doctor })[]> {
    // In a real app, use joins. For simplicity with Drizzle/TS inference here, I'll fetch and map or use query builder if setup.
    // Let's use db.query if relations are set up, or manual join.
    // Using manual join for clarity and type safety with basic drizzle usage.
    const results = await db.select({
      appointment: appointments,
      doctor: doctors,
    })
    .from(appointments)
    .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.date));

    return results.map(r => ({ ...r.appointment, doctor: r.doctor }));
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<(Appointment & { patient: Patient })[]> {
    const results = await db.select({
      appointment: appointments,
      patient: patients,
    })
    .from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.doctorId, doctorId))
    .orderBy(desc(appointments.date));

    return results.map(r => ({ ...r.appointment, patient: r.patient }));
  }

  async updateAppointmentStatus(id: number, status: string, notes?: string): Promise<Appointment> {
    const [updated] = await db.update(appointments)
      .set({ status, notes })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  // Message
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessages(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(messages.createdAt);
  }
}

export const storage = new DatabaseStorage();
