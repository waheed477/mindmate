import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  specialization: { type: String, required: true },
  consultationFee: { type: Number, required: true },
  experience: { type: Number, default: 0 },
  licenseNumber: { type: String },
  profilePicture: { type: String },
  verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'verified' },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);