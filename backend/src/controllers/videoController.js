// backend/src/controllers/videoController.js
import Video from '../models/Videos.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// ────────────────────────────────────────────────
// Multer setup for video + thumbnail
// ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'video' ? 'videos' : 'thumbnails';
    cb(null, `./uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max for videos
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      const allowed = /mp4|mov|avi|wmv|mkv/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.test(ext)) return cb(null, true);
      return cb(new Error('Only video formats allowed (mp4, mov, avi, wmv, mkv)'));
    }
    if (file.fieldname === 'thumbnail') {
      const allowed = /jpeg|jpg|png/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.test(ext)) return cb(null, true);
      return cb(new Error('Only jpeg, jpg, png thumbnails allowed'));
    }
    cb(new Error('Invalid field name'));
  },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// ────────────────────────────────────────────────
// Upload new video (teacher/admin/parent)
// ────────────────────────────────────────────────
export const uploadVideo = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ msg: err.message || 'File upload error' });
    }

    try {
      const { title, description, category, childId, isPublic } = req.body;

      if (!req.files?.video?.[0]) {
        return res.status(400).json({ msg: 'Video file is required' });
      }

      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail?.[0];

      const newVideo = new Video({
        title: title?.trim() || 'Untitled Video',
        description: description?.trim() || '',
        category: category || 'other',
        child: childId || null,
        uploadedBy: req.user.userId,
        videoUrl: `/uploads/videos/${videoFile.filename}`,
        thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : null,
        isPublic: isPublic === 'true' || false,
        duration: Number(req.body.duration) || 0,
      });

      await newVideo.save();

      res.status(201).json({
        message: 'Video uploaded successfully',
        video: newVideo,
      });
    } catch (error) {
      console.error('Video save error:', error);
      res.status(500).json({ msg: 'Server error while saving video' });
    }
  });
};

// ────────────────────────────────────────────────
// Get list of videos (filtered by role & permissions)
// ────────────────────────────────────────────────
export const getVideos = async (req, res) => {
  try {
    const { childId, category, isPublic } = req.query;
    const filter = {};

    // Parents can only see videos linked to their children or public ones
    if (req.user.role === 'parent') {
      filter.$or = [
        { child: { $in: req.user.children || [] } },
        { isPublic: true }
      ];
    }

    if (childId) filter.child = childId;
    if (category) filter.category = category;
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

    const videos = await Video.find(filter)
      .populate('uploadedBy', 'name username role')
      .populate('child', 'name classGroup photo')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(videos);
  } catch (err) {
    console.error('Get videos error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ────────────────────────────────────────────────
// Get single video (with access check)
// ────────────────────────────────────────────────
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'name username role')
      .populate('child', 'name classGroup photo');

    if (!video) return res.status(404).json({ msg: 'Video not found' });

    // Access control
    if (req.user.role === 'parent') {
      const isLinked = req.user.children?.some(id => id.toString() === video.child?.toString());
      if (!isLinked && !video.isPublic) {
        return res.status(403).json({ msg: 'Not authorized to view this video' });
      }
    }

    // Optional: increment view count
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (err) {
    console.error('Get video by ID error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ────────────────────────────────────────────────
// Delete video (uploader or admin only)
// ────────────────────────────────────────────────
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ msg: 'Video not found' });

    // Authorization check
    const isUploader = video.uploadedBy.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isUploader && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to delete this video' });
    }

    // Delete physical files (ignore errors if file missing)
    if (video.videoUrl) {
      const videoPath = path.join(process.cwd(), video.videoUrl);
      await fs.unlink(videoPath).catch(() => {});
    }
    if (video.thumbnailUrl) {
      const thumbPath = path.join(process.cwd(), video.thumbnailUrl);
      await fs.unlink(thumbPath).catch(() => {});
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Video deleted successfully' });
  } catch (err) {
    console.error('Delete video error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};