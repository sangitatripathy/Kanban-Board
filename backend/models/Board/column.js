import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  title: String,
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  position: Number,
});
