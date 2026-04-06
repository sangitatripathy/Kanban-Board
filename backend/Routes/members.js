import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { getMembers } from '../controllers/membersController.js';


const router = express.Router();

router.get("/:orgId",verifyToken,getMembers)

export default router;