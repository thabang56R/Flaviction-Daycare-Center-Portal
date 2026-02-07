// backend/src/routes/child.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Child from "../models/Child.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { auditLog } from "../utils/audit.js";

const router = express.Router();

// Ensure upload folder exists
const uploadDir = "./uploads/children";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Safer filename helper
function safeName(name) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

// Multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const base = safeName(path.basename(file.originalname || "photo", ext));
    const uniqueName = `${Date.now()}-${base}${ext}`;
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
// POST /api/child
// ✅ Admin/Staff/Teacher can create child
// body: { name, birthDate, classGroup, school, allergies, medicalNotes }
// ────────────────────────────────────────────────
router.post("/", requireAuth, requireRole("admin", "staff", "teacher"), async (req, res) => {
  try {
    const { name, birthDate, classGroup, school, allergies, medicalNotes } = req.body;

    if (!name?.trim()) return res.status(400).json({ msg: "Child name is required" });

    const child = await Child.create({
      name: name.trim(),
      birthDate: birthDate ? new Date(birthDate) : null,
      classGroup: classGroup || "",
      school: school || "",
      allergies: allergies || "",
      medicalNotes: medicalNotes || "",
      parents: [],
    });

    await auditLog({
      req,
      action: "CHILD_CREATED",
      entityType: "Child",
      entityId: child._id,
      before: null,
      after: { name: child.name, classGroup: child.classGroup, school: child.school },
      tags: ["CHILD"],
    });

    return res.status(201).json(child);
  } catch (err) {
    console.error("Create child error:", err);

    await auditLog({
      req,
      action: "CHILD_CREATED",
      entityType: "Child",
      status: "FAILED",
      error: err.message,
      tags: ["CHILD"],
    });

    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// PATCH /api/child/:id
// ✅ Admin/Staff/Teacher can update child profile
// ────────────────────────────────────────────────
router.patch("/:id", requireAuth, requireRole("admin", "staff", "teacher"), async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const before = child.toObject();

    const updatable = ["name", "birthDate", "classGroup", "school", "allergies", "medicalNotes"];
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) {
        child[k] = k === "birthDate" && req.body[k] ? new Date(req.body[k]) : req.body[k];
      }
    });

    await child.save();

    await auditLog({
      req,
      action: "CHILD_UPDATED",
      entityType: "Child",
      entityId: child._id,
      before,
      after: child.toObject(),
      tags: ["CHILD"],
    });

    return res.json(child);
  } catch (err) {
    console.error("Update child error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// POST /api/child/upload-photo
// ✅ Admin only (or add staff if you want)
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

      const before = { photo: child.photo || "" };

      child.photo = `/uploads/children/${req.file.filename}`;
      await child.save();

      await auditLog({
        req,
        action: "CHILD_PHOTO_UPLOADED",
        entityType: "Child",
        entityId: child._id,
        before,
        after: { photo: child.photo },
        tags: ["CHILD", "UPLOAD"],
      });

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
    const userId = req.user.id;

    const children = await Child.find({ parents: userId })
      .select("name birthDate classGroup photo allergies medicalNotes assignedTeacher")
      .populate("assignedTeacher", "name email role");

    return res.json(children);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// GET /api/child/:id
// ✅ Parent can fetch only if linked
// (Admin/Staff/Teacher can fetch any)
// ────────────────────────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    const query =
      role === "admin" || role === "staff" || role === "teacher"
        ? { _id: req.params.id }
        : { _id: req.params.id, parents: userId };

    const child = await Child.findOne(query).populate("assignedTeacher", "name email role");
    if (!child) return res.status(404).json({ msg: "Child not found or not linked" });

    return res.json(child);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// PATCH /api/child/:id/assign-teacher
// ✅ Admin/Staff only
// body: { teacherId }
// ────────────────────────────────────────────────
router.patch("/:id/assign-teacher", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) return res.status(400).json({ msg: "teacherId required" });

    const teacher = await User.findById(teacherId);
    if (!teacher || !["teacher", "staff"].includes(teacher.role)) {
      return res.status(400).json({ msg: "Invalid teacher user" });
    }

    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const before = { assignedTeacher: child.assignedTeacher || null };

    child.assignedTeacher = teacherId;
    await child.save();

    await auditLog({
      req,
      action: "CHILD_TEACHER_ASSIGNED",
      entityType: "Child",
      entityId: child._id,
      before,
      after: { assignedTeacher: child.assignedTeacher },
      tags: ["CHILD", "TEACHER"],
    });

    return res.json({ msg: "Teacher assigned", child });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// POST /api/child/:id/attendance
// ✅ Teacher/Staff/Admin
// body: { date, status, notes }
// ────────────────────────────────────────────────
router.post("/:id/attendance", requireAuth, requireRole("admin", "staff", "teacher"), async (req, res) => {
  try {
    const { date, status = "present", notes = "" } = req.body;

    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const entry = { date: date ? new Date(date) : new Date(), status, notes };
    child.attendance = child.attendance || [];
    child.attendance.push(entry);

    await child.save();

    await auditLog({
      req,
      action: "ATTENDANCE_ADDED",
      entityType: "Child",
      entityId: child._id,
      before: null,
      after: entry,
      tags: ["ATTENDANCE"],
    });

    return res.status(201).json({ msg: "Attendance added", entry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ────────────────────────────────────────────────
// POST /api/child/:id/daily-report
// ✅ Teacher/Staff/Admin
// body: { date, meals, sleep, mood, activities, notes }
// ────────────────────────────────────────────────
router.post("/:id/daily-report", requireAuth, requireRole("admin", "staff", "teacher"), async (req, res) => {
  try {
    const { date, meals, sleep, mood, activities = [], notes = "" } = req.body;

    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const entry = {
      date: date ? new Date(date) : new Date(),
      meals: meals || "",
      sleep: sleep || "",
      mood: mood || "neutral",
      activities: Array.isArray(activities) ? activities : [],
      notes,
      teacher: req.user.id,
    };

    child.dailyReports = child.dailyReports || [];
    child.dailyReports.push(entry);
    await child.save();

    await auditLog({
      req,
      action: "DAILY_REPORT_ADDED",
      entityType: "Child",
      entityId: child._id,
      before: null,
      after: entry,
      tags: ["DAILY_REPORT"],
    });

    return res.status(201).json({ msg: "Daily report saved", entry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;

