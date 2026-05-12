import express from "express";
import { authenticate } from "../auth.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

const router = express.Router();

router.use(authenticate);

// GET /api/messages/:receiverId  — fetch conversation history
router.get("/:receiverId", async (req, res) => {
  try {
    const myId = req.user.id;
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

    // Mark received messages as read
    await Message.updateMany(
      { senderId: receiverId, receiverId: myId, read: false },
      { read: true }
    );

    // Get receiver info
    const receiver = await User.findById(receiverId).select("fullName email role").lean();

    res.json({
      success: true,
      messages,
      receiver,
    });
  } catch (err: any) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

// GET /api/messages  — list all conversations (latest message per contact)
router.get("/", async (req, res) => {
  try {
    const myId = req.user.id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: myId }, { receiverId: myId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$senderId", myId] }, "$receiverId", "$senderId"],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", myId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
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

export default router;
