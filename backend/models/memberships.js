import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true },
);

export default mongoose.model("Membership",MembershipSchema)
