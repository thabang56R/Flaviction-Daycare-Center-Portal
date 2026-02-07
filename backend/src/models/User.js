// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    // ✅ Added "staff" while keeping "teacher" for backward compatibility
    role: {
      type: String,
      enum: ["parent", "teacher", "staff", "admin"],
      default: "parent",
      index: true,
    },

    name: { type: String, default: "" },

    // Link parent to children
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],

    // Optional: who created this user (admin/staff)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Optional: enable/disable accounts without deleting
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // ✅ creates createdAt & updatedAt automatically
  }
);

// Helpful indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.model("User", userSchema);
