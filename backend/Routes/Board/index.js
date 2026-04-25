import express from 'express';
import CalendarRoute from "./calendar.js";
import LabelsRoute from "./labels.js";
import ChecklistRoute from "./checklist.js";
import attachmentRoute from "./attachment.js";
import Cards from '../../models/Board/cards.js';

const router = express.Router();

router.use("/:boardId/labels",LabelsRoute);
router.put("/:cardId/labels", async (req, res) => {
  try {
    const { cardId } = req.params;
    const { labels } = req.body; 

    const updatedCard = await Cards.findByIdAndUpdate(
      cardId,
      { labels }, 
      { new: true }
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
});
router.use("/:cardId/checklist",ChecklistRoute);
router.use("/:cardId/attachments",attachmentRoute);
router.use("/:cardId",CalendarRoute);

export default router;