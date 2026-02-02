// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['parent', 'teacher', 'admin'], default: 'parent' },
  name: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);