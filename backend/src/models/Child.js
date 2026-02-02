// src/models/Child.js
import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: Date,
  classGroup: String,
  photo: String,
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  school: String,
  attendance: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    notes: String,
  }],
  dailyReports: [{
    date: { type: Date, required: true },
    meals: String,
    sleep: String,
    mood: { type: String, enum: ['happy', 'neutral', 'sad'] },
    activities: [String],
    notes: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Child', childSchema);