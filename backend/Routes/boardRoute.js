import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { getBoard, createBoard, getBoardDetails, toggleLabelOnCard, getAllBoardsForUser, handleBoardAction } from '../controllers/boardController.js';

const router = express.Router();

router.post("/:orgId/board",verifyToken,createBoard);
router.get("/:orgId/boards",verifyToken,getBoard);
router.get("/board/all",verifyToken,getAllBoardsForUser);
router.put("/board/:boardId/action", verifyToken, handleBoardAction);
router.get("/board-details/:boardId",verifyToken,getBoardDetails);
router.put("/board/:boardId/card/:cardId",verifyToken,toggleLabelOnCard);


export default router;