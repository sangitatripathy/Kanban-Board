import Card from "../../models/Board/cards.js";
import Board from "../../models/Board/boards.js";
import mongoose from "mongoose";

const createLabel = async (req, res) => {
  try {
    const { boardId } = req.params;
    console.log(boardId)
    const { color, name } = req.body;

    const board = await Board.findByIdAndUpdate(
      boardId,
      { $push: { labels: { name, color } } },
      { new: true },
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board.labels);
  } catch (error) {
    return res.status(500).json({
      message: "Error adding label",
      error: error.message,
    });
  }
};

const getLabels = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.json(board.labels);
  } catch (error) {
    return res.status(500).json({
      message: "Error getting labels",
      error: error.message,
    });
  }
};

const editLabel = async (req, res) => {
  try {
    const { boardId, labelId } = req.params;
    const { color, name } = req.body;

    const updateFields = {};

    if (name !== undefined) {
      updateFields["labels.$.name"] = name;
    }

    if (color !== undefined) {
      updateFields["labels.$.color"] = color;
    }

    const updatedBoard = await Board.findOneAndUpdate(
      {
        _id: boardId,
        "labels._id": labelId,
      },
      {
        $set: updateFields,
      },
      { new: true },
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board or Label not found" });
    }

    return res.json(updatedBoard.labels);
  } catch (error) {
    return res.status(500).json({
      message: "Error editing label",
      error: error.message,
    });
  }
};

export { createLabel, getLabels, editLabel };
