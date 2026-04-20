import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import {
  addChecklist,
  updateChecklist,
  deleteChecklist,
  addItem,
  updateItem,
  deleteItem,
} from "../../controllers/Board/index.js";

const router = express.Router({ mergeParams: true });

router.put("/", verifyToken, addChecklist);
router.put("/:checklistId", verifyToken, updateChecklist);
router.delete("/:checklistId", verifyToken, deleteChecklist);
router.put("/:checklistId/item", verifyToken, addItem);
router.put("/:checklistId/item/:itemId", verifyToken, updateItem);
router.delete("/:checklistId/item/:itemId", verifyToken, deleteItem);

export default router;
