import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. "USER_ROLE_CHANGED", "MENU_UPDATED"
    entityType: { type: String, required: true }, // "User", "Child", "Menu", "ReportCard"
    entityId: { type: mongoose.Schema.Types.ObjectId, required: false },

    // who did it
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actorEmail: { type: String },
    actorRole: { type: String, required: true }, // admin/staff/parent
    actorOriginalRole: { type: String }, // if impersonating

    // before/after snapshots (store only what you need!)
    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },

    // request metadata
    requestId: { type: String },
    ip: { type: String },
    userAgent: { type: String },

    // extra info
    status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
    error: { type: String },
    tags: [{ type: String }], // e.g. ["SECURITY", "ROLE", "PAYMENT"]
  },
  { timestamps: true }
);

// indexes for fast filtering
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export default mongoose.model("AuditLog", AuditLogSchema);
