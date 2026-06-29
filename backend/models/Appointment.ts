import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'], default: 'pending' },
  symptoms: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
