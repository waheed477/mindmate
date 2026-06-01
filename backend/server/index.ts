import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import { setupAuth } from "./auth";
import { setupSocket } from "./socket";
import appointmentRoutes from "./routes/appointments";
import messageRoutes from "./routes/messages";
import prescriptionRoutes from "./routes/prescriptions";
import profileRoutes from "./routes/profile";
import aiChatRoutes from "./routes/ai-chat.js";
import doctorRoutes from "./routes/doctors.js";

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS — allow all origins (Replit proxy + local dev)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

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

    setupAuth(app);
    await registerRoutes(httpServer, app);

    // Socket.io — must be after HTTP server is created
    setupSocket(httpServer);

    if (process.env.NODE_ENV === "production") {
      const { serveStatic } = await import("./static.js");
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite.js");
      await setupVite(httpServer, app);
    }

    const port = Number(process.env.PORT || 5000);
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log("🔌 Socket.io enabled");
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
