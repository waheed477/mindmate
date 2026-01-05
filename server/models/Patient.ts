import { Schema, model, Types } from "mongoose";

const PatientSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  fullName: String,
  age: Number,
  gender: String,
  contactNumber: String,
  condition: String,
  severity: String,
  medicalHistory: String,
});

export const Patient = model("Patient", PatientSchema);
