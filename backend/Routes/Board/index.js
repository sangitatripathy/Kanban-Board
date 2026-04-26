import express from 'express';
import CalendarRoute from "./calendar.js";
import LabelsRoute from "./labels.js";
import ChecklistRoute from "./checklist.js";
import attachmentRoute from "./attachment.js";
import Cards from '../../models/Board/cards.js';

const router = express.Router();

router.use("/:boardId/labels",LabelsRoute);
router.use("/:cardId/checklist",ChecklistRoute);
router.use("/:cardId/attachments",attachmentRoute);
router.use("/:cardId",CalendarRoute);

export default router;