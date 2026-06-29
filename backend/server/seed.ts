import { User } from "./models/User.js";
import { Doctor } from "./models/Doctor.js";
import { Patient } from "./models/Patient.js";

const TEST_ACCOUNTS = [
  {
    email: "patient@test.com",
    password: "123456",
    fullName: "Alex Johnson",
    role: "patient" as const,
    profile: {
      age: 28,
      gender: "Male",
      contactNumber: "+1 555-0100",
    },
  },
  {
    email: "doctor@test.com",
    password: "123456",
    fullName: "Dr. Sarah Williams",
    role: "doctor" as const,
    profile: {
      specialization: "Psychiatrist",
      licenseNumber: "PSY-2024-001",
      experience: 8,
      consultationFee: 150,
      bio: "Board-certified psychiatrist with 8 years of experience in anxiety, depression, and mood disorders.",
      verificationStatus: "verified",
    },
  },
  {
    email: "doctor2@test.com",
    password: "123456",
    fullName: "Dr. Michael Chen",
    role: "doctor" as const,
    profile: {
      specialization: "Psychologist",
      licenseNumber: "PSY-2024-002",
      experience: 12,
      consultationFee: 120,
      bio: "Clinical psychologist specialising in cognitive-behavioural therapy for stress and trauma.",
      verificationStatus: "verified",
    },
  },
];

export async function seedDatabase() {
  let created = 0;

  for (const account of TEST_ACCOUNTS) {
    const exists = await User.findOne({ email: account.email });
    if (exists) continue;

    const user = await User.create({
      email: account.email,
      password: account.password,
      fullName: account.fullName,
      role: account.role,
      isEmailVerified: true,
    });

    if (account.role === "doctor") {
      const p = account.profile as any;
      await Doctor.create({
        userId: user._id,
        fullName: account.fullName,
        specialization: p.specialization,
        licenseNumber: p.licenseNumber,
        experience: p.experience,
        consultationFee: p.consultationFee,
        bio: p.bio,
        verificationStatus: p.verificationStatus,
      });
    } else {
      const p = account.profile as any;
      await Patient.create({
        userId: user._id,
        fullName: account.fullName,
        age: p.age,
        gender: p.gender,
        contactNumber: p.contactNumber,
        condition: "General",
        contact: p.contactNumber,
      });
    }

    created++;
  }

  if (created > 0) {
    console.log(`\n✅ Seeded ${created} test account(s):`);
    console.log("   👤 patient@test.com  /  123456  (Patient)");
    console.log("   🩺 doctor@test.com   /  123456  (Doctor)");
    console.log("   🩺 doctor2@test.com  /  123456  (Doctor)\n");
  }
}
