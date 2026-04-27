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
      members: [
        {
          user: req.user.id,
          role: "admin",
        },
      ],
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
      members: {
        $elemMatch: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
    }).populate("members.user", "name email imageUrl");
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error getting board" });
  }
};

export const getBoardDetails = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Boards.findOne({
      _id: boardId,
      members: {
        $elemMatch: {
          user: req.user.id,
        },
      },
    }).populate("members.user", "name email imageUrl");
    const columns = await Column.find({ boardId }).sort({ position: 1 });
    const cards = await Card.find({ boardId }).sort({ position: 1 });
    const columnMap = {};
    columns.forEach((col) => {
      columnMap[col._id] = {
        ...col.toObject(),
        cards: [],
      };
    });

    cards.forEach((card) => {
      const colId = card.columnId.toString();

      if (columnMap[colId]) {
        const cardLabels = board.labels.filter((label) =>
          card.labels.includes(label._id),
        );

        columnMap[colId].cards.push({
          ...card.toObject(),
          labels: cardLabels,
        });
      }
    });
    const columnsWithCards = Object.values(columnMap);
    res.status(200).json({
      ...board.toObject(),
      columns: columnsWithCards,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting board details" });
  }
};

export const toggleLabelOnCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { labels } = req.body;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { labels },
      { new: true },
    );

    return res.status(200).json({
      message: "Labels updated successfully",
      labels: updatedCard.labels,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding label",
      error: error.message,
    });
  }
};

export const getAllBoardsForUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const boards = await Boards.find({
      "members.user": userId,
      isArchived: false,
    })
      .populate("members.user", "name email imageUrl")
      .sort({ updatedAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching boards",
      error: error.message,
    });
  }
};

export const handleBoardAction = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { action } = req.query;

    if (!action) {
      return res.status(400).json({ message: "Action is required" });
    }

    let board;

    switch (action) {
      case "archive":
        board = await Boards.findByIdAndUpdate(
          boardId,
          { isArchived: true },
          { new: true },
        );
        return res.json({ message: "Board archived", board });

      case "unarchive":
        board = await Boards.findByIdAndUpdate(
          boardId,
          { isArchived: false },
          { new: true },
        );
        return res.json({ message: "Board restored", board });

      case "delete":
        await Boards.findByIdAndDelete(boardId);
        await Column.deleteMany({ boardId });
        await Card.deleteMany({ boardId });

        return res.json({ message: "Board deleted" });

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error performing action",
      error: error.message,
    });
  }
};
