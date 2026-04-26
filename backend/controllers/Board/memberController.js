import Card from "../../models/Board/cards.js";

export const updateCardAssignees = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { userId } = req.body;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const isAssigned = card.assignees.some(
      (id) => id.toString() === userId
    );

    let updatedCard;

    if (isAssigned) {
      updatedCard = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { assignees: userId } },
        { new: true }
      );
    } else {
      updatedCard = await Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { assignees: userId } }, 
        { new: true }
      );
    }

    res.json({
      message: isAssigned ? "Member removed" : "Member assigned",
      assignees: updatedCard.assignees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating assignees",
      error: error.message,
    });
  }
};