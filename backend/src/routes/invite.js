// backend/src/routes/invite.js
import express from "express";
import Invite from "../models/Invite.js"; // make sure this exists
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * Admin/Teacher can create invites
 * Parents can’t create invites.
 */
router.post("/", requireAuth, requireRole("admin", "teacher"), async (req, res) => {
  try {
    const { email, role = "parent", childId } = req.body;

    if (!email) return res.status(400).json({ msg: "Email is required" });

    // Optional: prevent inviting existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    // Create invite token (simple)
    const token = `INV-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const invite = await Invite.create({
      email,
      role,
      childId: childId || null,
      token,
      createdBy: req.user.id,
      used: false,
    });

    return res.status(201).json(invite);
  } catch (err) {
    console.error("Invite create error:", err);
    return res.status(500).json({ msg: "Server error creating invite" });
  }
});

/**
 * Anyone can verify invite token (public)
 */
router.get("/verify/:token", async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token, used: false });
    if (!invite) return res.status(404).json({ msg: "Invite not found or already used" });

    return res.json({ ok: true, invite });
  } catch (err) {
    console.error("Invite verify error:", err);
    return res.status(500).json({ msg: "Server error verifying invite" });
  }
});

/**
 * Mark invite as used (after successful signup)
 * Admin/Teacher only OR your signup route can do this internally.
 */
router.post("/use/:token", requireAuth, requireRole("admin", "teacher"), async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token, used: false });
    if (!invite) return res.status(404).json({ msg: "Invite not found or already used" });

    invite.used = true;
    invite.usedAt = new Date();
    await invite.save();

    return res.json({ msg: "Invite marked as used" });
  } catch (err) {
    console.error("Invite use error:", err);
    return res.status(500).json({ msg: "Server error updating invite" });
  }
});

export default router;