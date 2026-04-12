import express from "express";
import {verifyToken} from "../middleware/authMiddleware.js";
import {createCard, getCardById, updateCard, deleteCard} from "../controllers/cardController.js";

const router = express.Router();

router.post("/:columnId/", verifyToken, createCard);
// router.get("/", verifyToken, getCards);

router.get("/card/:cardId", verifyToken, getCardById);
router.put("/card/:cardId", verifyToken, updateCard);
router.delete("/card/:cardId", verifyToken, deleteCard);

export default router;