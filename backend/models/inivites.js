import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema(
  {
    email:{type:String,required:true},
    orgId:{type:mongoose.Schema.Types.ObjectId,ref:"Organization"},
    role:{ type:String,enum:["member","admin"]},
    invitedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    token: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    expiresAt: Date,
  },
  { timestamps: true },
)

export default mongoose.model("Invite",InviteSchema)