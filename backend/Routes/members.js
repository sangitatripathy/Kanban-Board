import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { getMembers, updateMemberRole, removeMember } from '../controllers/membersController.js';


const router = express.Router();

router.get("/:orgId",verifyToken,getMembers)
router.put("/:orgId/:userId",verifyToken,updateMemberRole)
router.delete("/:orgId/:userId",verifyToken,removeMember)

export default router;