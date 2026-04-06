import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { sendInvite,acceptInvite,verifyInvite,getOrgInvites,cancelInvite } from '../controllers/inviteController.js';

const router = express.Router();

router.post("/",verifyToken,isAdmin,sendInvite)
router.get("/verify/:token",verifyInvite)
router.post("/accept",verifyToken,acceptInvite)
router.get("/org/:orgId",verifyToken,getOrgInvites)
router.delete("/:inviteId", verifyToken, cancelInvite);

export default router;