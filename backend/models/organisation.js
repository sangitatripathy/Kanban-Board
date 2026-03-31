import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPersonal: { type: Boolean, default: false },
    logo: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Organization",OrganisationSchema)