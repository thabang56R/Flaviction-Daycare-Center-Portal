import mongoose from "mongoose";

const DayItemSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // Monday...
    breakfast: { type: String, default: "" },
    snack: { type: String, default: "" },
    lunch: { type: String, default: "" },
  },
  { _id: false }
);

const MenuSchema = new mongoose.Schema(
  {
    weekStart: { type: Date, required: true }, 
    items: { type: [DayItemSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MenuSchema.index({ weekStart: 1 }, { unique: true });

export default mongoose.model("Menu", MenuSchema);
