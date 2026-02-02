// backend/src/routes/child.js
import express from "express";
import multer from "multer";
import path from "path";

import Child from "../models/Child.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/children/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    return cb(new Error("Only jpeg, jpg, png allowed"));
  },
});

// ────────────────────────────────────────────────
// POST /api/child/upload-photo
// ✅ Admin only
// ────────────────────────────────────────────────
router.post(
  "/upload-photo",
  requireAuth,
  requireRole("admin"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { childId } = req.body;

      if (!req.file) return res.status(400).json({ msg: "No photo uploaded" });
      if (!childId) return res.status(400).json({ msg: "childId required" });

      const child = await Child.findById(childId);
      if (!child) return res.status(404).json({ msg: "Child not found" });

      child.photo = `/uploads/children/${req.file.filename}`;
      await child.save();

      return res.json({ msg: "Photo uploaded", photo: child.photo });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);

// ────────────────────────────────────────────────
// GET /api/child/my-children
// ✅ Parent: fetch children linked to this user
// ────────────────────────────────────────────────
router.get("/my-children", requireAuth, async (req, res) => {
  try {
    // ✅ IMPORTANT: our middleware sets req.user.id
    const userId = req.user.id;

    const children = await Child.find({ parents: userId }).select(
      "name birthDate classGroup photo"
    );

    return res.json(children);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// GET /api/child/:id
// ✅ Parent: only if linked
// ────────────────────────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const child = await Child.findOne({ _id: req.params.id, parents: userId });
    if (!child) return res.status(404).json({ msg: "Child not found or not linked" });

    return res.json(child);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
