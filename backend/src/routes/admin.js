// backend/src/routes/admin.js
import express from "express";
import User from "../models/User.js";
import Child from "../models/Child.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ✅ everything here is admin-only
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
      .populate("parents", "name email username")
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

    child.parents = child.parents || [];
    if (!child.parents.some((id) => id.toString() === parentId)) {
      child.parents.push(parentId);
      await child.save();
    }

    parent.children = parent.children || [];
    if (!parent.children.some((id) => id.toString() === childId)) {
      parent.children.push(childId);
      await parent.save();
    }

    return res.json({ msg: "Parent linked to child successfully" });
  } catch (err) {
    console.error("Linking error:", err);
    return res.status(500).json({ msg: "Server error during linking" });
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

    child.parents = (child.parents || []).filter((id) => id.toString() !== parentId);
    await child.save();

    const parent = await User.findById(parentId);
    if (parent) {
      parent.children = (parent.children || []).filter((id) => id.toString() !== childId);
      await parent.save();
    }

    return res.json({ msg: "Unlinked successfully" });
  } catch (err) {
    console.error("Unlink error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
