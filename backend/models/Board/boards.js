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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    boardDescription: { type: String },
    isArchived: { type: Boolean, default: false },
    labels:[labelSchema]
  },
  { timestamps: true },
);

export default mongoose.model("Board", BoardSchema);
