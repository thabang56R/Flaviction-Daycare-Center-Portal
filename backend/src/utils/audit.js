import crypto from "crypto";
import AuditLog from "../models/AuditLog.js";

export function attachRequestId(req, res, next) {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}

export function getRequestMeta(req) {
  return {
    requestId: req.requestId,
    ip: (req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "").trim(),
    userAgent: req.headers["user-agent"] || "",
  };
}

/**
 * Log an audited action.
 */
export async function auditLog({
  req,
  action,
  entityType,
  entityId,
  before,
  after,
  status = "SUCCESS",
  error,
  tags = [],
}) {
  const meta = getRequestMeta(req);

  const actorId = req.user?.id || req.user?.userId; // depending on your JWT payload
  const actorRole = req.user?.role;

  const doc = {
    action,
    entityType,
    entityId,
    before,
    after,
    status,
    error,
    tags,
    ...meta,
    actorId,
    actorRole,
    actorEmail: req.user?.email,
    actorOriginalRole: req.user?.originalRole, // when impersonating
  };

  // never crash the request if audit fails
  try {
    await AuditLog.create(doc);
  } catch (e) {
    console.error("AUDIT LOG FAILED:", e.message);
  }
}
