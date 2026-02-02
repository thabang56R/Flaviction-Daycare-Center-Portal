// backend/src/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: false   // optional - if video is tied to specific child
  },
  category: {
    type: String,
    enum: ['daily_activity', 'event', 'learning', 'fun', 'other'],
    default: 'other'
  },
  duration: {
    type: Number,     // in seconds
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false    // only parents/admins/teachers can see private videos
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
videoSchema.index({ uploadedBy: 1, createdAt: -1 });
videoSchema.index({ child: 1 });

export default mongoose.model('Video', videoSchema);