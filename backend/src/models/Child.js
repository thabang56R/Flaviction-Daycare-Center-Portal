// backend/src/models/Child.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent", "late"], default: "present" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const dailyReportSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },

    meals: { type: String, default: "" },
    sleep: { type: String, default: "" },

    mood: { type: String, enum: ["happy", "neutral", "sad"], default: "neutral" },
    activities: [{ type: String }],

    notes: { type: String, default: "" },

    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relationship: { type: String, default: "" },
  },
  { _id: false }
);

const childSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    birthDate: { type: Date, default: null },

    classGroup: { type: String, default: "" },

    photo: { type: String, default: "" },

    // ✅ Parents linked to this child
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],

    school: { type: String, default: "" },

    // ✅ Optional fields for Kid Profile
    allergies: { type: String, default: "" },
    medicalNotes: { type: String, default: "" },
    emergencyContact: emergencyContactSchema,

    // ✅ So you can auto-message teacher / attach class teacher
    assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    attendance: [attendanceSchema],
    dailyReports: [dailyReportSchema],
  },
  {
    timestamps: true, // ✅ adds createdAt + updatedAt
  }
);

// ✅ Virtual age (don’t store age in DB)
childSchema.virtual("age").get(function () {
  if (!this.birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - this.birthDate.getFullYear();
  const m = today.getMonth() - this.birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) age--;
  return age;
});

// Ensure virtuals appear in JSON
childSchema.set("toJSON", { virtuals: true });
childSchema.set("toObject", { virtuals: true });

// Helpful indexes
childSchema.index({ name: 1 });
childSchema.index({ classGroup: 1 });
childSchema.index({ parents: 1 });

export default mongoose.model("Child", childSchema);
