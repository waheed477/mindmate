import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false,
    unique: true
  },
  fullName: {
    type: String,
    required: false
  },
  specialization: {
    type: String,
    required: false
  },
  licenseNumber: {
    type: String,
    required: false,
    unique: true
  },
  bio: String,
  experience: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number,
    required: false
  },
  verificationStatus: {
    type: String,
    enum: ["unverified", "pending", "verified", "rejected"],
    default: "unverified",
  },
  availability: [{
    day: String,
    slots: [String]
  }],
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  profilePicture: String,
  hospitalAffiliation: String,
  education: [{
    degree: String,
    university: String,
    year: Number
  }],
  languages: [String],
  consultationTypes: [String]
}, { timestamps: true });

// Index for faster queries
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ verificationStatus: 1 });
DoctorSchema.index({ rating: -1 });

export const Doctor = mongoose.model("Doctor", DoctorSchema);
