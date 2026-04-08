import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import {
  createColumn,
  getColumn,
  getAllColumn,
  updateColumn,
  deleteColumn,
} from "../controllers/columnController.js";

const router = express.Router();

router.post("/:boardId/columns", verifyToken, createColumn);
router.get("/:boardId/columns", verifyToken, getAllColumn);

router.get("/:boardId/:id", verifyToken, getColumn);
router.put("/:boardId/column/:id", verifyToken, updateColumn);
router.delete("/:boardId/column/:id", verifyToken, deleteColumn);

export default router;