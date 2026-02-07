// backend/src/routes/invite.js
import express from "express";
import crypto from "crypto";
import Invite from "../models/Invite.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { auditLog } from "../utils/audit.js";

const router = express.Router();

/**
 * Helper: generate secure token
 */
function makeInviteToken() {
  return `INV-${crypto.randomBytes(16).toString("hex")}`;
}

/**
 * CREATE INVITE
 * POST /api/invite
 * Admin/Staff/Teacher can create invites (parents cannot)
 *
 * body: { email, role="parent", childId? }
 */
router.post("/", requireAuth, requireRole("admin", "staff", "teacher"), async (req, res) => {
  try {
    const { email, role = "parent", childId = null } = req.body;

    if (!email) return res.status(400).json({ msg: "Email is required" });

    // Only allow inviting these roles (you can expand later)
    const allowedInviteRoles = ["parent", "staff", "teacher", "admin"];
    if (!allowedInviteRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role for invite" });
    }

    // Prevent inviting existing user
    const existing = await User.findOne({ email });
    if (existing) {
      await auditLog({
        req,
        action: "INVITE_CREATE_FAILED_USER_EXISTS",
        entityType: "Invite",
        before: null,
        after: { email, role, childId },
        status: "FAILED",
        error: "User already exists",
        tags: ["SECURITY", "INVITE"],
      });

      return res.status(400).json({ msg: "User already exists" });
    }

    const token = makeInviteToken();

    const invite = await Invite.create({
      email,
      role,
      childId,
      token,
      createdBy: req.user.id,
      used: false,
    });

    await auditLog({
      req,
      action: "INVITE_CREATED",
      entityType: "Invite",
      entityId: invite._id,
      before: null,
      after: {
        email: invite.email,
        role: invite.role,
        childId: invite.childId,
        used: invite.used,
      },
      tags: ["INVITE"],
    });

    return res.status(201).json(invite);
  } catch (err) {
    console.error("Invite create error:", err);

    await auditLog({
      req,
      action: "INVITE_CREATED",
      entityType: "Invite",
      before: null,
      after: req.body,
      status: "FAILED",
      error: err.message,
      tags: ["INVITE"],
    });

    return res.status(500).json({ msg: "Server error creating invite" });
  }
});

/**
 * LIST INVITES (Admin only)
 * GET /api/invite?used=true|false&email=
 */
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { used, email } = req.query;

    const filter = {};
    if (used === "true") filter.used = true;
    if (used === "false") filter.used = false;
    if (email) filter.email = new RegExp(email, "i");

    const invites = await Invite.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json(invites);
  } catch (err) {
    console.error("Invite list error:", err);
    return res.status(500).json({ msg: "Server error fetching invites" });
  }
});

/**
 * VERIFY INVITE TOKEN (Public)
 * GET /api/invite/verify/:token
 * Return minimal info (don’t leak internal IDs unnecessarily)
 */
router.get("/verify/:token", async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token, used: false });

    if (!invite) {
      return res.status(404).json({ msg: "Invite not found or already used" });
    }

    return res.json({
      ok: true,
      invite: {
        email: invite.email,
        role: invite.role,
        childId: invite.childId,
        token: invite.token,
      },
    });
  } catch (err) {
    console.error("Invite verify error:", err);
    return res.status(500).json({ msg: "Server error verifying invite" });
  }
});

/**
 * MARK INVITE AS USED
 * POST /api/invite/use/:token
 * Admin/Staff/Teacher can mark used (or you can call internally from signup route)
 */
router.post("/use/:token", requireAuth, requireRole("admin", "staff", "teacher"), async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token, used: false });

    if (!invite) {
      return res.status(404).json({ msg: "Invite not found or already used" });
    }

    const before = {
      used: invite.used,
      usedAt: invite.usedAt || null,
    };

    invite.used = true;
    invite.usedAt = new Date();
    await invite.save();

    await auditLog({
      req,
      action: "INVITE_MARKED_USED",
      entityType: "Invite",
      entityId: invite._id,
      before,
      after: {
        used: invite.used,
        usedAt: invite.usedAt,
      },
      tags: ["INVITE"],
    });

    return res.json({ msg: "Invite marked as used" });
  } catch (err) {
    console.error("Invite use error:", err);

    await auditLog({
      req,
      action: "INVITE_MARKED_USED",
      entityType: "Invite",
      status: "FAILED",
      error: err.message,
      tags: ["INVITE"],
    });

    return res.status(500).json({ msg: "Server error updating invite" });
  }
});

export default router;
