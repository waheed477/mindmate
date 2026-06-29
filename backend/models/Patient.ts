import mongoose from 'mongoose';

// FIXED: Patient model with correct fields including userId
const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  condition: { type: String, required: true },
  contact: { type: String, required: true }
}, { timestamps: true });

export const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);