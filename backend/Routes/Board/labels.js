import express from "express";
import {verifyToken} from "../../middleware/authMiddleware.js";
import { createLabel, getLabels, editLabel, deleteLabel } from "../../controllers/Board/index.js";

const router = express.Router();

router.post("/",verifyToken,createLabel)
router.get("/",verifyToken,getLabels)
router.put("/:labelId",verifyToken,editLabel)
router.delete("/:labelId",verifyToken,deleteLabel)

export default router