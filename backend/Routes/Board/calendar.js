import express from "express";
import {verifyToken} from "../../middleware/authMiddleware.js";
import { updateDates, setReminder, clearDates } from "../../controllers/Board/index.js";

const router = express.Router();

router.put("/dates",verifyToken,updateDates);
router.put("/reminder", verifyToken, setReminder);
router.delete("/dates", verifyToken, clearDates);

export default router;