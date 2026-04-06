import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema(
  {
    boardName:{type:String,required:true},
    orgId:{ type: mongoose.Schema.Types.ObjectId, ref: "Organization",required:true },
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
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export default mongoose.model("Board", BoardSchema);