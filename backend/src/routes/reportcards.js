import express from "express";
import ReportCard from "../models/ReportCard.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import PDFDocument from "pdfkit";

const router = express.Router();

// Parent: list report cards for a child
router.get("/child/:childId", requireAuth, async (req, res) => {
  const { childId } = req.params;
  const docs = await ReportCard.find({ childId, published: true }).sort({ year: -1, term: -1 });
  res.json(docs);
});

// Admin/Teacher: create/update report card for child
router.post("/", requireAuth, requireRole("admin", "teacher"), async (req, res) => {
  const { childId, term, year, skills, teacherNote, published = true } = req.body;

  const doc = await ReportCard.findOneAndUpdate(
    { childId, term, year },
    { childId, term, year, skills, teacherNote, published, createdBy: req.user.id },
    { upsert: true, new: true }
  );

  res.status(201).json(doc);
});

// Parent: download PDF
router.get("/:id/pdf", requireAuth, async (req, res) => {
  const report = await ReportCard.findById(req.params.id).populate("childId");
  if (!report) return res.status(404).json({ message: "Not found" });

  // (Optional) verify parent owns this child; depends on your data model.
  // if (!parentOwnsChild(req.user.id, report.childId._id)) return 403;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="reportcard-${report._id}.pdf"`);

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(20).text("Flaviction Daycare Center", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(14).text(`Report Card: ${report.term} ${report.year}`, { align: "center" });
  doc.moveDown(1);

  doc.fontSize(12).text(`Child: ${report.childId?.name || "N/A"}`);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`);
  doc.moveDown(1);

  doc.fontSize(13).text("Skills", { underline: true });
  doc.moveDown(0.5);

  report.skills.forEach((s) => {
    doc.fontSize(12).text(`${s.label}: ${s.value}%`);
  });

  doc.moveDown(1);
  doc.fontSize(13).text("Teacher Note", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(report.teacherNote || "No note provided.");

  doc.moveDown(2);
  doc.fontSize(10).text("Proudly South African • Flaviction Daycare Center", { align: "center" });

  doc.end();
});

export default router;
