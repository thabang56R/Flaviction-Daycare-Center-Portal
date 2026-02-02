// backend/src/models/Invite.js
import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["parent", "teacher", "admin"], default: "parent" },

    // Optional linking helpers
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", default: null },

    token: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    usedAt: { type: Date, default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Invite", InviteSchema);

