import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import authRouter from "./auth.js";
import { setupSocket } from "./socket";
import { seedDatabase } from "./seed";
import appointmentRoutes from "./routes/appointments";
import messageRoutes from "./routes/messages";
import prescriptionRoutes from "./routes/prescriptions";
import profileRoutes from "./routes/profile";
import aiChatRoutes from "./routes/ai-chat.js";
import doctorRoutes from "./routes/doctors.js";

const app = express();
const httpServer = createServer(app);

// ✅ FIX: Increase payload limits to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS — allow all origins (Replit proxy + local dev)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Auth routes (must be before other routes)
app.use("/api/auth", authRouter);

// API Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiChatRoutes);

(async () => {
  try {
    await connectDB();
    await registerRoutes(httpServer, app);
    setupSocket(httpServer);

    // Auto-seed test accounts in development
    if (process.env.NODE_ENV !== "production") {
      await seedDatabase();
    }

    const port = Number(process.env.PORT || 5000);
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Backend API running on port ${port}`);
      console.log("🔌 Socket.io enabled");
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();