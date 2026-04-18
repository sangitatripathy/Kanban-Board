import Card from "../../models/Board/cards.js";
import mongoose from "mongoose";

const createLabel = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { color, name } = req.body;
    const card = await Card.find({ _id: cardId });
    if (!card) {
      return res.status(404).json({ message: "No card Exist" });
    }
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $push: { labels: { name, color } } },
      { new: true },
    );
    res.json(updatedCard.labels);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding label", error: error.message });
  }
};

const getLabels = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.find({ _id: cardId });
    if (!card) {
      return res.status(404).json({ message: "No card Exist" });
    }
    const cards = await Card.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(cardId) } },
      { $project: { labels: 1 } },
    ]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting label", error: error.message });
  }
};

const editLabel = async (req, res) => {
  try {
    const { cardId, labelId } = req.params;
    const { color, name } = req.body;

    const updateFields = {};

    if (name !== undefined) {
      updateFields["labels.$.name"] = name;
    }

    if (color !== undefined) {
      updateFields["labels.$.color"] = color;
    }

    const cardWithUpdatedLabel = await Card.findOneAndUpdate(
      {
        _id: cardId,
        "labels._id": labelId,
      },
      {
        $set: updateFields,
      },
      { new: true },
    );

    if (!cardWithUpdatedLabel) {
      return res.status(404).json({ message: "Card or Label not found" });
    }

    return res.json(cardWithUpdatedLabel.labels);
  } catch (error) {
    return res.status(500).json({
      message: "Error editing label",
      error: error.message,
    });
  }
};

export { createLabel, getLabels, editLabel };
