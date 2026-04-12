import Card from "../models/Board/cards.js";

export const createCard = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { cardName, boardId } = req.body;

    if (!cardName) {
      return res.status(400).json({ message: "Card name is required" });
    }
    const lastCard = await Card.findOne({ columnId }).sort({ position: -1 });
    const position = lastCard ? lastCard.position + 1 : 0;
    const newCard = await Card.create({
      cardName,
      columnId,
      boardId,
      createdBy: req.user.id,
      position,
    });
    res.status(201).json(newCard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating card", error: error.message });
  }
};

// export const getCards = async (req, res) => {
//   try {
//     const {boardId} = req.body

//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching cards", error: error.message });
//   }
// };

export const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching card", error: error.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { cardName, description, startDate, dueDate, reminder, priority } =
      req.body;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { cardName, description, startDate, dueDate, reminder, priority },
      { new: true },
    );
    res.status(200).json(updatedCard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating card", error: error.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting card", error: error.message });
  }
};
