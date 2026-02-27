// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Require a valid JWT in Authorization: Bearer <token>
 * Attaches a normalized req.user with:
 *  - id (always present if token contains id/_id/userId/sub)
 *  - role
 *  - email (optional)
 *  - originalRole / impersonating (optional for recruiter mode)
 */
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ normalize the user id across all code paths
    const id =
      decoded.id ||
      decoded._id ||
      decoded.userId ||
      decoded.sub || // some systems use "sub" as the user identifier
      null;

    if (!id) {
      return res.status(401).json({ message: "Invalid token payload (missing id)" });
    }

    // ✅ normalized user object used everywhere in routes/controllers
    req.user = {
      ...decoded,
      id,
    };

    return next();
  } catch (err) {
    // Helpful error messages for debugging; keep generic for security in production
    const msg =
      err?.name === "TokenExpiredError"
        ? "Token expired"
        : err?.name === "JsonWebTokenError"
        ? "Invalid token"
        : "Unauthorized";

    return res.status(401).json({ message: msg });
  }
}

/**
 * Require one of the allowed roles.
 * Usage:
 *   router.get("/admin", requireAuth, requireRole("admin"), handler)
 *   router.post("/staff", requireAuth, requireRole("admin", "staff", "teacher"), handler)
 */
export function requireRole(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(403).json({ message: "Forbidden (missing role)" });
    }

    if (!allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

/**
 * Optional helper: allow admin OR same user id.
 * Good for endpoints like /users/:id (profile).
 */
export function requireSelfOrRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    const userId = req.user?.id;
    const targetId = req.params?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // If user is allowed role, pass
    if (role && allowedRoles.includes(role)) return next();

    // Otherwise must match the route param
    if (targetId && String(targetId) === String(userId)) return next();

    return res.status(403).json({ message: "Forbidden" });
  };
}



