import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicines: {
      type: [MedicineSchema],
      required: true,
      validate: {
        validator: (arr: any[]) => arr.length > 0,
        message: "At least one medicine is required",
      },
    },
    notes: { type: String, trim: true, default: "" },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    doctorName: { type: String, trim: true },
    patientName: { type: String, trim: true },
  },
  { timestamps: true }
);

PrescriptionSchema.index({ patientId: 1, createdAt: -1 });
PrescriptionSchema.index({ doctorId: 1, createdAt: -1 });

export const Prescription = mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
