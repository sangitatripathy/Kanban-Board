import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { getUserDashboard, getUserActivity } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/activity", verifyToken, getUserActivity);

export default router;