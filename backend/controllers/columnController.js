import Column from "../models/Board/column.js";

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

    if(newIndex !== undefined){
      const columns = await Column.find({boardId: column.boardId}).sort({position: 1});
      const filtered = columns.filter(col => col._id.toString() !== id);
      filtered.splice(newIndex, 0, column);
      for(let i=0; i<filtered.length; i++){
        await Column.findByIdAndUpdate(filtered[i]._id, {
          position: i,
        })
      }
    }
    const updatedColumn = await column.save();
    res.status(200).json({message:"Column updated successfully",updatedColumn});
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
