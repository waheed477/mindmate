import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Message } from "./models/Message.js";

const JWT_SECRET = process.env.JWT_SECRET || "mindmate-secret-key-123";

let _io: Server | null = null;

export const getIO = (): Server => {
  if (!_io) throw new Error("Socket.io not initialized yet");
  return _io;
};

const getRoomId = (a: string, b: string) => [a, b].sort().join("_");

export const setupSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // JWT auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  _io = io;

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`[Socket] Connected: ${user.id} (${user.role})`);

    // Automatically join own user room (for direct delivery)
    socket.join(`user_${user.id}`);

    // Join a private chat room with another user
    socket.on("join_room", ({ receiverId }: { receiverId: string }) => {
      const roomId = getRoomId(user.id, receiverId);
      socket.join(roomId);
      socket.emit("room_joined", { roomId });
    });

    // Send a message — persist to DB, broadcast to room
    socket.on(
      "send_message",
      async ({ receiverId, content }: { receiverId: string; content: string }) => {
        if (!receiverId || !content?.trim()) return;

        try {
          const message = await Message.create({
            senderId: user.id,
            receiverId,
            content: content.trim(),
          });

          const payload = {
            _id: String(message._id),
            senderId: user.id,
            senderName: user.fullName || user.email,
            receiverId,
            content: content.trim(),
            createdAt: message.createdAt,
            read: false,
          };

          const roomId = getRoomId(user.id, receiverId);
          io.to(roomId).emit("receive_message", payload);

          // Also deliver to receiver's personal room if not already in chat room
          socket.to(`user_${receiverId}`).emit("new_message_notification", payload);
        } catch (err) {
          console.error("[Socket] send_message error:", err);
          socket.emit("message_error", { message: "Failed to send message" });
        }
      }
    );

    // Mark messages as read
    socket.on("mark_read", async ({ senderId }: { senderId: string }) => {
      try {
        await Message.updateMany(
          { senderId, receiverId: user.id, read: false },
          { read: true }
        );
        const roomId = getRoomId(user.id, senderId);
        io.to(roomId).emit("messages_read", { byUserId: user.id });
      } catch (err) {
        console.error("[Socket] mark_read error:", err);
      }
    });

    // Typing indicators
    socket.on("typing", ({ receiverId }: { receiverId: string }) => {
      const roomId = getRoomId(user.id, receiverId);
      socket.to(roomId).emit("user_typing", {
        senderId: user.id,
        senderName: user.fullName || user.email,
      });
    });

    socket.on("stop_typing", ({ receiverId }: { receiverId: string }) => {
      const roomId = getRoomId(user.id, receiverId);
      socket.to(roomId).emit("user_stop_typing", { senderId: user.id });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${user.id}`);
    });
  });

  return io;
};
