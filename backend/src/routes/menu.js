import express from "express";
import Menu from "../models/Menu.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const latest = await Menu.findOne({ active: true }).sort({ weekStart: -1 });
  res.json(latest || null);
});

router.post("/", requireAuth, requireRole("admin", "teacher"), async (req, res) => {
  const { weekStart, items } = req.body;
  const doc = await Menu.findOneAndUpdate(
    { weekStart: new Date(weekStart) },
    { weekStart: new Date(weekStart), items, createdBy: req.user.id, active: true },
    { upsert: true, new: true }
  );
  res.status(201).json(doc);
});

export default router;
