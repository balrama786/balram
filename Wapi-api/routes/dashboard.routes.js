import express from 'express';
import { getDashboardData, getDashboardCounts } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription } from '../middlewares/plan-permission.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);


router.get('/', getDashboardData);


router.get('/counts', getDashboardCounts);

export default router;
