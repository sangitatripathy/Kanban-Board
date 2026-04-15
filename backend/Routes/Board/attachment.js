import express from "express";
import {verifyToken} from "../../middleware/authMiddleware.js";
import { addAttachment, removeAttachment } from "../../controllers/Board/index.js";

const router = express.Router();

router.post("/",verifyToken,addAttachment);
router.delete("/:attachmentId",verifyToken,removeAttachment);

export default router