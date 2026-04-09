import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

const checklistItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const CardSchema = new mongoose.Schema(
  {
    cardName: { type: String, required: true },
    description: { type: String },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },
    position: Number,
    isArchived: { type: Boolean, default: false },
    startDate: { type: Date },
    dueDate: { type: Date },
    reminder: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    labels: [labelSchema],
    checklist: [checklistItemSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Card", CardSchema);
