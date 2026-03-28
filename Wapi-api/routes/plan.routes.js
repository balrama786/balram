import express from 'express';
import {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    updatePlanStatus,
    deletePlan,
    getActivePlans,
    getFeaturedPlans
} from '../controllers/plan.controller.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/active', getActivePlans);
router.get('/featured', getFeaturedPlans);
router.get('/:id', getPlanById);

router.get('/', authenticateUser, getAllPlans);

router.post('/create', authenticateUser, authorizeAdmin, createPlan); 
router.put('/:id', authenticateUser, authorizeAdmin, updatePlan);
router.put('/:id/status', authenticateUser, authorizeAdmin, updatePlanStatus);
router.delete('/', authenticateUser, authorizeAdmin, deletePlan);

export default router;