import express from "express";
import AuditLog from "../models/AuditLog.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/audit?from=&to=&action=&actorId=&role=&entityType=&status=&q=&page=&limit=
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const {
    from,
    to,
    action,
    actorId,
    role,
    entityType,
    status,
    q,
    page = 1,
    limit = 30,
  } = req.query;

  const filter = {};

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (action) filter.action = action;
  if (actorId) filter.actorId = actorId;
  if (role) filter.actorRole = role;
  if (entityType) filter.entityType = entityType;
  if (status) filter.status = status;

  // basic search
  if (q) {
    filter.$or = [
      { action: new RegExp(q, "i") },
      { entityType: new RegExp(q, "i") },
      { actorEmail: new RegExp(q, "i") },
      { requestId: new RegExp(q, "i") },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET /api/audit/export.csv?... same filters
router.get("/export.csv", requireAuth, requireRole("admin"), async (req, res) => {
  const { Parser } = await import("json2csv"); // install json2csv
  const {
    from,
    to,
    action,
    actorId,
    role,
    entityType,
    status,
    q,
  } = req.query;

  const filter = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (action) filter.action = action;
  if (actorId) filter.actorId = actorId;
  if (role) filter.actorRole = role;
  if (entityType) filter.entityType = entityType;
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { action: new RegExp(q, "i") },
      { entityType: new RegExp(q, "i") },
      { actorEmail: new RegExp(q, "i") },
      { requestId: new RegExp(q, "i") },
    ];
  }

  const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(5000);

  const fields = [
    "createdAt",
    "action",
    "status",
    "actorEmail",
    "actorRole",
    "actorOriginalRole",
    "entityType",
    "entityId",
    "requestId",
    "ip",
    "userAgent",
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(logs.map(l => l.toObject()));

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="audit-logs.csv"`);
  res.send(csv);
});

export default router;
