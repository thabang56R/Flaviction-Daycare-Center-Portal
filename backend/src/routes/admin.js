// backend/src/routes/admin.js
import express from "express";
import User from "../models/User.js";
import Child from "../models/Child.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { auditLog } from "../utils/audit.js";

const router = express.Router();

// ✅ everything here is admin-only (one guard for all routes below)
router.use(requireAuth, requireRole("admin"));

// GET /api/admin/users?parent=true
router.get("/users", async (req, res) => {
  try {
    const filter = {};
    if (req.query.parent === "true") filter.role = "parent";

    const users = await User.find(filter)
      .select("name email username role createdAt")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ msg: "Server error while fetching users" });
  }
});

// GET /api/admin/children
router.get("/children", async (req, res) => {
  try {
    const children = await Child.find()
      .select("name birthDate classGroup photo parents school")
      .populate("parents", "name email username role")
      .sort({ name: 1 });

    return res.json(children);
  } catch (err) {
    console.error("Error fetching children:", err);
    return res.status(500).json({ msg: "Server error while fetching children" });
  }
});

// POST /api/admin/link-parent-child
router.post("/link-parent-child", async (req, res) => {
  const { parentId, childId } = req.body;

  if (!parentId || !childId) {
    return res.status(400).json({ msg: "parentId and childId are required" });
  }

  try {
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ msg: "Invalid parent user" });
    }

    // BEFORE state for audit
    const before = {
      childParents: (child.parents || []).map((id) => id.toString()),
      parentChildren: (parent.children || []).map((id) => id.toString()),
    };

    // Ensure arrays exist
    child.parents = child.parents || [];
    parent.children = parent.children || [];

    // Link child -> parent
    const childHasParent = child.parents.some((id) => id.toString() === parentId);
    if (!childHasParent) {
      child.parents.push(parentId);
      await child.save();
    }

    // Link parent -> child
    const parentHasChild = parent.children.some((id) => id.toString() === childId);
    if (!parentHasChild) {
      parent.children.push(childId);
      await parent.save();
    }

    // AFTER state for audit
    const after = {
      childParents: (child.parents || []).map((id) => id.toString()),
      parentChildren: (parent.children || []).map((id) => id.toString()),
    };

    await auditLog({
      req,
      action: "PARENT_LINKED_TO_CHILD",
      entityType: "Child",
      entityId: child._id,
      before,
      after,
      tags: ["ADMIN", "LINKING"],
    });

    return res.json({ msg: "Parent linked to child successfully" });
  } catch (err) {
    console.error("Linking error:", err);

    await auditLog({
      req,
      action: "PARENT_LINKED_TO_CHILD",
      entityType: "Child",
      entityId: childId,
      status: "FAILED",
      error: err.message,
      tags: ["ADMIN", "LINKING"],
    });

    return res.status(500).json({ msg: "Server error during linking" });
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["admin", "staff", "teacher", "parent"];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const before = { role: user.role };

    user.role = role;
    await user.save();

    await auditLog({
      req,
      action: "USER_ROLE_CHANGED",
      entityType: "User",
      entityId: user._id,
      before,
      after: { role: user.role },
      tags: ["SECURITY", "ROLE"],
    });

    return res.json({
      msg: "Role updated",
      user: { id: user._id, role: user.role },
    });
  } catch (err) {
    console.error("Role update error:", err);

    await auditLog({
      req,
      action: "USER_ROLE_CHANGED",
      entityType: "User",
      entityId: req.params.id,
      status: "FAILED",
      error: err.message,
      tags: ["SECURITY", "ROLE"],
    });

    return res.status(500).json({ msg: "Server error updating role" });
  }
});

// DELETE /api/admin/unlink-parent-child
router.delete("/unlink-parent-child", async (req, res) => {
  const { parentId, childId } = req.body;

  if (!parentId || !childId) {
    return res.status(400).json({ msg: "parentId and childId required" });
  }

  try {
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: "Child not found" });

    const parent = await User.findById(parentId);

    const before = {
      childParents: (child.parents || []).map((id) => id.toString()),
      parentChildren: (parent?.children || []).map((id) => id.toString()),
    };

    child.parents = (child.parents || []).filter((id) => id.toString() !== parentId);
    await child.save();

    if (parent) {
      parent.children = (parent.children || []).filter((id) => id.toString() !== childId);
      await parent.save();
    }

    const after = {
      childParents: (child.parents || []).map((id) => id.toString()),
      parentChildren: (parent?.children || []).map((id) => id.toString()),
    };

    await auditLog({
      req,
      action: "PARENT_UNLINKED_FROM_CHILD",
      entityType: "Child",
      entityId: child._id,
      before,
      after,
      tags: ["ADMIN", "LINKING"],
    });

    return res.json({ msg: "Unlinked successfully" });
  } catch (err) {
    console.error("Unlink error:", err);

    await auditLog({
      req,
      action: "PARENT_UNLINKED_FROM_CHILD",
      entityType: "Child",
      entityId: childId,
      status: "FAILED",
      error: err.message,
      tags: ["ADMIN", "LINKING"],
    });

    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;

