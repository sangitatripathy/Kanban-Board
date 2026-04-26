import Column from "../models/Board/column.js";
import Board from "../models/Board/boards.js";

export const createColumn = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;
    const lastColumn = await Column.findOne({ boardId }).sort({ position: -1 });
    const position = lastColumn ? lastColumn.position + 1 : 0;
    const newColumn = await Column.create({
      title,
      boardId,
      position,
    });

    res.status(201).json(newColumn);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create column", error: error.message });
  }
};

export const getAllColumn = async (req, res) => {
  try {
    const { boardId } = req.params;
    const columns = await Column.find({ boardId }).sort({ position: 1 });
    res.status(200).json(columns);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get column", error: error.message });
  }
};

export const getColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }
    res.status(200).json(column);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get column", error: error.message });
  }
};

export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, newIndex } = req.body;

    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    if (title) {
      column.title = title;
    }

    if (newIndex !== undefined) {
      const columns = await Column.find({ boardId: column.boardId }).sort({
        position: 1,
      });
      const filtered = columns.filter((col) => col._id.toString() !== id);
      filtered.splice(newIndex, 0, column);
      for (let i = 0; i < filtered.length; i++) {
        await Column.findByIdAndUpdate(filtered[i]._id, {
          position: i,
        });
      }
    }
    const updatedColumn = await column.save();
    res
      .status(200)
      .json({ message: "Column updated successfully", updatedColumn });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update column", error: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const boardId = column.boardId;

    await Column.findByIdAndDelete(id);

    const columns = await Column.find({ boardId }).sort({ position: 1 });

    for (let i = 0; i < columns.length; i++) {
      await Column.findByIdAndUpdate(columns[i]._id, {
        position: i,
      });
    }

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete column",
      error: error.message,
    });
  }
};

export const reorderColumn = async (req, res) => {
  try {
    const { columns } = req.body;

    if (!columns || !Array.isArray(columns)) {
      return res.status(400).json({ message: "Invalid columns data" });
    }

    const bulkOps = columns.map((col) => ({
      updateOne: {
        filter: { _id: col._id },
        update: { position: col.position },
      },
    }));
    await Column.bulkWrite(bulkOps);
    res.status(200).json({ message: "Columns reordered successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reorder columns",
      error: error.message,
    });
  }
};

export const addMembersToBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId, role } = req.body;
    const board = await Board.findById(boardId);
    const alreadyMember = board.members.find(
      (member) => member.user.toString() === userId,
    );
    if (alreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of the board" });
    }
    board.members.push({user: userId, role:role || "member"});
    await board.save();
    res.status(200).json({ message: "Member added to board successfully", members: board.members });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add members to board",
      error: error.message,
    });
  }
};
