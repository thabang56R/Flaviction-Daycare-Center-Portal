import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const ReportCardSchema = new mongoose.Schema(
  {
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    term: { type: String, required: true }, 
    year: { type: Number, required: true },
    skills: { type: [SkillSchema], default: [] },
    teacherNote: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // teacher/admin
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReportCardSchema.index({ childId: 1, term: 1, year: 1 }, { unique: true });

export default mongoose.model("ReportCard", ReportCardSchema);
