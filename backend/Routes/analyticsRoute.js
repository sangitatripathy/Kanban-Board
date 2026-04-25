import express from "express";
import { verifyToken } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  activityAnalytics,
  overView,
  topBoards,
  mostActiveOrganisation,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/activity", verifyToken, isAdmin, activityAnalytics);
router.get("/overview", verifyToken, isAdmin, overView);
router.get("/top-boards", verifyToken, isAdmin, topBoards);
router.get("/active-organisations", verifyToken, isAdmin, mostActiveOrganisation);

export default router;