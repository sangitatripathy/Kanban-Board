import express from 'express';
import upload from "../middleware/upload.js";
import { verifyToken } from '../middleware/authmiddleware.js';
import { updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.put("/profile", verifyToken,upload.single("image"),updateUserProfile);

export default router;