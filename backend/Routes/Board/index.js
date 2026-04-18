import express from 'express';
import CalendarRoute from "./calendar.js";
import LabelsRoute from "./labels.js";
import ChecklistRoute from "./checklist.js";
import attachmentRoute from "./attachment.js";

const router = express.Router();

router.use("/:cardId",CalendarRoute);
router.use("/:cardId/labels",LabelsRoute);
router.use("/:cardId/checklist",ChecklistRoute);
router.use("/:cardId/attachments",attachmentRoute)

export default router;