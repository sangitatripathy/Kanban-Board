import express from "express";
import {verifyToken} from "../../middleware/authMiddleware.js";
import { createLabel, getLabels, editLabel } from "../../controllers/Board/index.js";

const router = express.Router({ mergeParams: true });

router.put("/",verifyToken,createLabel)
router.get("/",verifyToken,getLabels)
router.put("/:labelId",verifyToken,editLabel)

export default router