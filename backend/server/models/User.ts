import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  fullName: { type: String },
  profilePicture: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },
  googleId: { type: String },
  emailVerificationCode: { type: String },
  emailVerificationExpiresAt: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiresAt: { type: Date },
  magicLinkToken: { type: String },
  magicLinkExpiresAt: { type: Date }
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
