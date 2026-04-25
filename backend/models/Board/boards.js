import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  name: { type: String },
  color: { type: String, required: true },
});

const BoardSchema = new mongoose.Schema(
  {
    boardName: { type: String, required: true },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    boardDescription: { type: String },
    isArchived: { type: Boolean, default: false },
    labels: [labelSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Board", BoardSchema);