import express from "express";
import {verifyToken} from "../../middleware/authMiddleware.js";
import { updateCardAssignees } from "../../controllers/Board/memberController.js";

const router = express.Router({ mergeParams: true });

router.put("/", verifyToken,updateCardAssignees)

export default router;