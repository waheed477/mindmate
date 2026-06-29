import { Doctor } from "./models/Doctor";
import { Patient } from "./models/Patient";
import { Appointment } from "./models/Appointment";
import { User } from "../models/User.ts";
import { Message } from "./models/Message";

interface DoctorFilters {
  specialization?: string;
  search?: string;
  minFee?: number;
  maxFee?: number;
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class DatabaseStorage {
  // ===== USER =====
  async getUser(id: string) {
    return User.findById(id).lean();
  }

  async getUserByUsername(username: string) {
    return User.findOne({ username }).lean();
  }

  async createUser(data: any) {
    const user = await User.create(data);
    return user.toObject();
  }

  // ===== PATIENT =====
  async createPatient(data: any) {
    const patient = await Patient.create(data);
    return patient.toObject();
  }

  async getPatient(id: string) {
    return Patient.findById(id).lean();
  }

  async getPatientByUserId(userId: string) {
    return Patient.findOne({ userId }).lean();
  }

  // ===== DOCTOR =====
  async createDoctor(data: any) {
    const doctor = await Doctor.create(data);
    return doctor.toObject();
  }

  async getDoctor(id: string) {
    return Doctor.findById(id).populate("userId", "email").lean();
  }

  async getDoctorByUserId(userId: string) {
    return Doctor.findOne({ userId }).lean();
  }

  async getAllDoctors() {
    return Doctor.find().populate("userId", "email").lean();
  }

  async getDoctors(filters: DoctorFilters = {}) {
    const query: Record<string, any> = {};

    if (filters.specialization) {
      query.specialization = {
        $regex: `^${escapeRegex(filters.specialization)}$`,
        $options: "i",
      };
    }

    if (filters.search) {
      const searchRegex = {
        $regex: escapeRegex(filters.search),
        $options: "i",
      };
      query.$or = [{ fullName: searchRegex }, { specialization: searchRegex }];
    }

    if (typeof filters.minFee === "number" || typeof filters.maxFee === "number") {
      query.consultationFee = {};
      if (typeof filters.minFee === "number") {
        query.consultationFee.$gte = filters.minFee;
      }
      if (typeof filters.maxFee === "number") {
        query.consultationFee.$lte = filters.maxFee;
      }
    }

    return Doctor.find(query)
      .populate("userId", "email")
      .sort({ rating: -1, fullName: 1 })
      .lean();
  }

  async getDoctorSpecializations() {
    const specializations = (await Doctor.distinct("specialization", {
      specialization: { $exists: true, $nin: [null, ""] },
    })) as string[];

    return specializations.sort((a, b) => a.localeCompare(b));
  }

  // ===== APPOINTMENT =====
  async createAppointment(data: any) {
    const appointment = await Appointment.create(data);
    return appointment.toObject();
  }

  async getAppointmentsByPatient(patientId: string) {
    return Appointment.find({ patientId })
      .populate("doctorId")
      .sort({ date: -1 })
      .lean();
  }

  async getAppointmentsByDoctor(doctorId: string) {
    return Appointment.find({ doctorId })
      .populate("patientId")
      .sort({ date: -1 })
      .lean();
  }

  async updateAppointmentStatus(id: string, status: string, notes?: string) {
    return Appointment.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    ).lean();
  }

  // ===== MESSAGE =====
  async createMessage(data: any) {
    const message = await Message.create(data);
    return message.toObject();
  }

  async getMessages(user1Id: string, user2Id: string) {
    return Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();
  }
}

export const storage = new DatabaseStorage();
