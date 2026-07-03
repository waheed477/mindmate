import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { Message } from "../server/models/Message";
import { User } from "../server/models/User";
import { Doctor } from "../server/models/Doctor";
import { Appointment } from "../server/models/Appointment";
import { Patient } from "../server/models/Patient";

const router = express.Router();

router.use(authenticate);

// GET /api/messages/doctor/patients — all patients who interacted with logged-in doctor
// MUST be before /:receiverId to avoid being swallowed by the param route
router.get("/doctor/patients", async (req, res) => {
  try {
    const doctorUserId = (req.user as any).id;

    const doctorProfile = await Doctor.findOne({ userId: doctorUserId }).lean();
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({ doctorId: doctorProfile._id })
      .populate({
        path: "patientId",
        model: "Patient",
        populate: { path: "userId", model: "User", select: "fullName email role" },
      })
      .sort({ updatedAt: -1 })
      .lean();

    const conversations = await Message.aggregate([
      { $match: { $or: [{ senderId: doctorUserId }, { receiverId: doctorUserId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$senderId", doctorUserId] }, "$receiverId", "$senderId"] },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", doctorUserId] }, { $eq: ["$read", false] }] },
                1, 0,
              ],
            },
          },
        },
      },
    ]);

    const msgMap: Record<string, { unreadCount: number; lastMessageAt: Date }> = {};
    for (const c of conversations) {
      msgMap[String(c._id)] = {
        unreadCount: c.unreadCount,
        lastMessageAt: new Date(c.lastMessage.createdAt),
      };
    }

    const patientMap: Record<string, any> = {};
    for (const appt of appointments) {
      const patient = appt.patientId as any;
      if (!patient) continue;
      const patUserId = String(patient.userId?._id || patient.userId || "");
      if (!patUserId) continue;

      if (!patientMap[patUserId]) {
        const msgInfo = msgMap[patUserId] || { unreadCount: 0, lastMessageAt: null };
        patientMap[patUserId] = {
          patientUserId: patUserId,
          patientProfileId: String(patient._id),
          fullName: patient.fullName || patient.userId?.fullName || "Unknown",
          email: patient.userId?.email || "",
          age: patient.age,
          gender: patient.gender,
          profilePicture: patient.profilePicture || "",
          unreadCount: msgInfo.unreadCount,
          lastInteractionAt: msgInfo.lastMessageAt || new Date(appt.updatedAt),
          appointmentStatuses: [],
          hasActiveChat: !!msgMap[patUserId],
        };
      }
      patientMap[patUserId].appointmentStatuses.push(appt.status);
    }

    const messageOnlyUserIds = Object.keys(msgMap).filter((uid) => !patientMap[uid]);
    if (messageOnlyUserIds.length > 0) {
      const users = await User.find({ _id: { $in: messageOnlyUserIds } }).select("fullName email role").lean();
      for (const u of users) {
        const uid = String(u._id);
        const msgInfo = msgMap[uid];
        patientMap[uid] = {
          patientUserId: uid,
          patientProfileId: null,
          fullName: u.fullName || u.email || "Unknown",
          email: u.email,
          age: null,
          gender: null,
          profilePicture: "",
          unreadCount: msgInfo.unreadCount,
          lastInteractionAt: msgInfo.lastMessageAt,
          appointmentStatuses: [],
          hasActiveChat: true,
        };
      }
    }

    const patients = Object.values(patientMap).sort(
      (a, b) => new Date(b.lastInteractionAt).getTime() - new Date(a.lastInteractionAt).getTime()
    );

    res.json({ success: true, patients });
  } catch (err: any) {
    console.error("Doctor patients error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch patient interactions" });
  }
});

// GET /api/messages  — list all conversations (latest message per contact)
router.get("/", async (req, res) => {
  try {
    const myId = (req.user as any).id;

    const messages = await Message.aggregate([
      { $match: { $or: [{ senderId: myId }, { receiverId: myId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$senderId", myId] }, "$receiverId", "$senderId"] },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", myId] }, { $eq: ["$read", false] }] },
                1, 0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    res.json({ success: true, conversations: messages });
  } catch (err: any) {
    console.error("Get conversations error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
});

// GET /api/messages/:receiverId  — fetch conversation history
// MUST be last among GET routes to avoid swallowing named paths above
router.get("/:receiverId", async (req, res) => {
  try {
    const myId = (req.user as any).id;
    const { receiverId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const skip = Number(req.query.skip) || 0;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    await Message.updateMany(
      { senderId: receiverId, receiverId: myId, read: false },
      { read: true }
    );

    const receiver = await User.findById(receiverId).select("fullName email role").lean();

    res.json({ success: true, messages, receiver });
  } catch (err: any) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

export default router;


