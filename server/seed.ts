import mongoose from "mongoose";
import { Doctor } from "./models/Doctor";
import { User } from "./models/User";

export async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // First create users - FIX: Your User model uses 'username' not 'email'
    const user1 = await User.create({
      username: "doctor1@example.com",  // CHANGE: email → username
      password: "password123",
      role: "doctor"
      // REMOVE: fullName (not in your User schema)
    });

    const user2 = await User.create({
      username: "doctor2@example.com",  // CHANGE: email → username
      password: "password123",
      role: "doctor"
      // REMOVE: fullName (not in your User schema)
    });

    // Then create doctors with userIds
    await Doctor.create([
      {
        userId: user1._id,
        fullName: "Dr. John Smith",  // fullName goes in Doctor, not User
        specialization: "Psychiatrist",
        licenseNumber: "MED12345",
        bio: "Experienced psychiatrist",
        experience: 10,
        consultationFee: 150,
        verificationStatus: "verified",
        rating: 4.8
      },
      {
        userId: user2._id,
        fullName: "Dr. Sarah Johnson",  // fullName goes in Doctor, not User
        specialization: "Psychologist",
        licenseNumber: "PSY67890",
        bio: "Clinical psychologist",
        experience: 8,
        consultationFee: 120,
        verificationStatus: "verified",
        rating: 4.6
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}