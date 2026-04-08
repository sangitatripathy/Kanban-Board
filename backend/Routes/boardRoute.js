import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { getBoard, createBoard } from '../controllers/boardController.js';

const router = express.Router();

router.post("/:orgId/board",verifyToken,createBoard)
router.get("/:orgId/boards",verifyToken,getBoard)

export default router;