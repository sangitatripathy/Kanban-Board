import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

const checklistItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [
    {
      text: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
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
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
