import express from 'express';
import { createOrganization, getOrganization, getOrganizationById } from '../controllers/organizationController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post("/",verifyToken,createOrganization)
router.get("/",verifyToken,getOrganization)
router.get("/:orgId",verifyToken,getOrganizationById)

export default router;