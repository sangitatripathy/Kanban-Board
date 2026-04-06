import Boards from "../models/Board/boards.js";
import mongoose from 'mongoose';

export const createBoard = async (req, res) => {
  try {
    const { boardName } = req.body;
    const { orgId } = req.params;

    const board = await Boards.create({
      boardName,
      orgId,
      createdBy:req.user.id,
      members:[req.user.id]
    })
    res.status(201).json(board)
  } catch (error) {
    res.status(500).json({ message: "Error creating board" });
  }
};

export const getBoards = async (req,res) => {
  try{
    const { orgId } = req.params;
    const boards = await Boards.find({
      orgId:new mongoose.Types.ObjectId(orgId),
      members: new mongoose.Types.ObjectId(req.user.id)
    })
    res.status(200).json(boards)
  }catch(error){
    res.status(500).json({ message: "Error getting board" });
  }
};
