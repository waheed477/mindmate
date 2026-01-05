// server/models/Appointment.ts - UPDATED
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Patient", 
      required: true 
    },
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Doctor", 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    symptoms: { 
      type: String, 
      required: true,
      trim: true 
    },
    healthCondition: {
      type: String,
      trim: true
    },
    notes: { 
      type: String,
      trim: true 
    },
    doctorNotes: {
      type: String,
      trim: true
    },
    type: { 
      type: String, 
      enum: ["online", "in-person"], 
      default: "online" 
    },
    duration: {
      type: Number,
      default: 30 // minutes
    },
    followUpDate: Date,
    prescription: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    activityLog: [{
      action: String,
      performedBy: String, // "patient" or "doctor"
      timestamp: { type: Date, default: Date.now },
      details: String
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual population
AppointmentSchema.virtual("patient", {
  ref: "Patient",
  localField: "patientId",
  foreignField: "userId",
  justOne: true
});

AppointmentSchema.virtual("doctor", {
  ref: "Doctor",
  localField: "doctorId",
  foreignField: "userId",
  justOne: true
});

// Indexes for better query performance
AppointmentSchema.index({ doctorId: 1, status: 1 });
AppointmentSchema.index({ patientId: 1, status: 1 });
AppointmentSchema.index({ date: 1 });
AppointmentSchema.index({ status: 1 });

// Pre-save middleware to add activity log
AppointmentSchema.pre("save", function(next) {
  if (this.isModified("status")) {
    if (!this.activityLog) {
      this.activityLog = [];
    }
    
    const actionMap: Record<string, string> = {
      pending: "Appointment requested",
      accepted: "Appointment accepted",
      rejected: "Appointment rejected",
      cancelled: "Appointment cancelled",
      completed: "Appointment completed"
    };
    
    this.activityLog.push({
      action: actionMap[this.status] || `Status changed to ${this.status}`,
      performedBy: "system",
      details: this.doctorNotes || `Appointment ${this.status}`
    });
  }
  next();
});

export const Appointment = mongoose.model("Appointment", AppointmentSchema);