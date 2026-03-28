import express from 'express';
import { getAdminDashboardData, getAdminDashboardCounts } from '../controllers/admin-dashboard.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/', getAdminDashboardData);

router.get('/counts', getAdminDashboardCounts);

export default router;
