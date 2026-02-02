// backend/src/routes/videos.js
import express from "express";
import multer from "multer";
import path from "path";

import * as videoCtrl from "../controllers/videoController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ────────────────────────────────────────────────
// Multer setup
// ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "video" ? "videos" : "thumbnails";
    cb(null, `./uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video") {
      const allowed = /mp4|mov|avi|wmv|mkv/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.test(ext)) return cb(null, true);
      return cb(new Error("Only video formats allowed"));
    }

    if (file.fieldname === "thumbnail") {
      const allowed = /jpeg|jpg|png/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.test(ext)) return cb(null, true);
      return cb(new Error("Only jpeg/jpg/png thumbnails allowed"));
    }

    return cb(new Error("Invalid field"));
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// ────────────────────────────────────────────────
// POST /api/videos
// Upload video + optional thumbnail
// ✅ Admin/Teacher only (recommended)
// ────────────────────────────────────────────────
router.post("/", requireAuth, requireRole("admin", "teacher"), (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ msg: err.message || "File upload error" });
    }

    // Call your controller function
    return videoCtrl.uploadVideo(req, res);
  });
});

// ────────────────────────────────────────────────
// GET /api/videos
// List videos
// ────────────────────────────────────────────────
router.get("/", requireAuth, videoCtrl.getVideos);

// ────────────────────────────────────────────────
// GET /api/videos/:id
// Get single video
// ────────────────────────────────────────────────
router.get("/:id", requireAuth, videoCtrl.getVideoById);

// ────────────────────────────────────────────────
// DELETE /api/videos/:id
// Delete video (controller should enforce uploader/admin)
// ────────────────────────────────────────────────
router.delete("/:id", requireAuth, videoCtrl.deleteVideo);

export default router;
