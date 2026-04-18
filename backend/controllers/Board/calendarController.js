import Card from "../../models/Board/cards.js";

const updateDates = async () => {
  try {
    const { cardId } = req.params;
    const { startDate, dueDate } = req.body;

    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      return res.status(400).json({
        message: "Start date cannot be after due date",
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        ...(startDate !== undefined && { startDate }),
        ...(dueDate !== undefined && { dueDate }),
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({
      startDate: updatedCard.startDate,
      dueDate: updatedCard.dueDate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating dates",
      error: error.message,
    });
  }
};

const setReminder = async () => {
  try {
    const { cardId } = req.params;
    const { reminder } = req.body;

    if (!reminder) {
      return res.status(400).json({ message: "Reminder is required" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { reminder },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ reminder: updatedCard.reminder });
  } catch (error) {
    res.status(500).json({
      message: "Error setting reminder",
      error: error.message,
    });
  }
};

const clearDates = async () => {
  try {
    const { cardId } = req.params;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        startDate: null,
        dueDate: null,
        reminder: null,
      },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({
      message: "Dates cleared successfully",
      card: {
        startDate: updatedCard.startDate,
        dueDate: updatedCard.dueDate,
        reminder: updatedCard.reminder,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error clearing dates",
      error: error.message,
    });
  }
};

export { updateDates, setReminder, clearDates };
