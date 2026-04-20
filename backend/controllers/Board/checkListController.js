import Card from "../../models/Board/cards.js";

const addChecklist = async (req, res) => {
  try {
    const { title } = req.body;
    const { cardId } = req.params;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $push: { checklist: { title, items: [] } },
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(updatedCard.checklist);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding checklist", error: error.message });
  }
};

const updateChecklist = async (req, res) => {
  try {
    const { cardId, checklistId } = req.params;
    const { title } = req.body;

    const updatedCard = await Card.findOneAndUpdate(
      {
        _id: cardId,
        "checklist._id": checklistId,
      },
      {
        $set: {
          "checklist.$.title": title,
        },
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(updatedCard.checklist);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating checklist", error: error.message });
  }
};

const deleteChecklist = async (req,res) => {
  try {
    const { cardId, checklistId } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $pull: {
          checklist: { _id: checklistId },
        },
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(updatedCard.checklist);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting checklist", error: error.message });
  }
};

const addItem = async (req,res) => {
  try {
    const { cardId, checklistId } = req.params;
    const { text } = req.body;

    const updatedCard = await Card.findOneAndUpdate(
      {
        _id: cardId,
        "checklist._id": checklistId,
      },
      {
        $push: {
          "checklist.$.items": { text },
        },
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.json(updatedCard.checklist);
  } catch (error) {
    return res.status(500).json({
      message: "Error adding item to checklist",
      error: error.message,
    });
  }
};

const updateItem = async (req,res) => {
  try {
    const { cardId, checklistId, itemId } = req.params;
    const { text, completed } = req.body;

    const updateFields = {};

    if (text !== undefined) {
      updateFields["checklist.$[c].items.$[i].text"] = text;
    }

    if (completed !== undefined) {
      updateFields["checklist.$[c].items.$[i].completed"] = completed;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $set: updateFields,
      },
      {
        arrayFilters: [{ "c._id": checklistId }, { "i._id": itemId }],
        new: true,
      },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedCard);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating item in checklist",
      error: error.message,
    });
  }
};

const deleteItem = async (req,res) => {
  try {
    const { cardId, checklistId, itemId } = req.params;

    const updatedCard = await Card.findOneAndUpdate(
      {
        _id: cardId,
        "checklist._id": checklistId,
      },
      {
        $pull: {
          "checklist.$.items": { _id: itemId },
        },
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedCard);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting checklist", error: error.message });
  }
};

export {
  addChecklist,
  updateChecklist,
  deleteChecklist,
  addItem,
  updateItem,
  deleteItem,
};
