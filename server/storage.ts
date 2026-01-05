import { Doctor } from "./models/Doctor";
import { Patient } from "./models/Patient";
import { Appointment } from "./models/Appointment";
import { User } from "./models/User";
import { Message } from "./models/Message";

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
    return Doctor.findById(id).lean();
  }

  async getDoctorByUserId(userId: string) {
    return Doctor.findOne({ userId }).lean();
  }

  async getAllDoctors() {
    return Doctor.find().lean();
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
