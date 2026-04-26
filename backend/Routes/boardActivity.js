import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import {
  createColumn,
  getColumn,
  getAllColumn,
  updateColumn,
  deleteColumn,
  reorderColumn,
  addMembersToBoard,
} from "../controllers/boardActivityController.js";

const router = express.Router();

router.post("/:boardId/columns", verifyToken, createColumn);
router.get("/:boardId/columns", verifyToken, getAllColumn);
router.put("/:boardId/add-members",verifyToken,addMembersToBoard);

router.get("/:boardId/:id", verifyToken, getColumn);
router.put("/:boardId/column/:id", verifyToken, updateColumn);
router.delete("/:boardId/column/:id", verifyToken, deleteColumn);
router.put("/reorder-columns",verifyToken,reorderColumn, reorderColumn);


export default router;