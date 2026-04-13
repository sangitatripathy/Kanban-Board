import Boards from "../models/Board/boards.js";
import Card from "../models/Board/cards.js";
import Column from "../models/Board/column.js";
import mongoose from "mongoose";

export const createBoard = async (req, res) => {
  try {
    const { boardName } = req.body;
    const { orgId } = req.params;

    const board = await Boards.create({
      boardName,
      orgId,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Error creating board" });
  }
};

export const getBoard = async (req, res) => {
  try {
    const { orgId } = req.params;
    const boards = await Boards.find({
      orgId: new mongoose.Types.ObjectId(orgId),
      members: new mongoose.Types.ObjectId(req.user.id),
    }).populate("members", "name email imageUrl");
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error getting board" });
  }
};

export const getBoardDetails = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Boards.findById(boardId).populate(
      "members",
      "name iamgeUrl",
    );
    const columns = await Column.find({ boardId }).sort({ position: 1 });
    const cards = await Card.find({ boardId }).sort({ position: 1 });
    const columnMap = {};
    columns.forEach((col) => {
      columnMap[col._id] = {
        ...col.toObject(),
        cards: [],
      };
    });

    cards.forEach((card)=>{
      const colId = card.columnId.toString()
      if(columnMap[colId]){
        columnMap[colId].cards.push(card)
      }
    })
    const columnsWithCards = Object.values(columnMap)
    res.status(200).json({
      ...board.toObject(),
      columns: columnsWithCards,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting board details" });
  }
};
