import express from "express";
import Announcement from "../models/Announcement.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Parent/any logged in can view
router.get("/", requireAuth, async (req, res) => {
  const items = await Announcement.find({ active: true })
    .sort({ pinned: -1, createdAt: -1 })
    .limit(50);
  res.json(items);
});

// Admin/Teacher can post
router.post("/", requireAuth, requireRole("admin", "teacher"), async (req, res) => {
  const { title, body, type = "info", audience = "all", pinned = false } = req.body;
  const doc = await Announcement.create({
    title,
    body,
    type,
    audience,
    pinned,
    createdBy: req.user.id,
  });
  res.status(201).json(doc);
});


export default router;
