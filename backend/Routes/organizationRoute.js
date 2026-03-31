import express from 'express';
import { createOrganization } from '../controllers/organizationController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post("/",verifyToken,createOrganization)

export default router;