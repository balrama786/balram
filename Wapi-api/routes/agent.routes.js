import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';
import agentController from '../controllers/agent.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);

router.get('/all', authorizeRoles(['super_admin', 'user']), agentController.getAllAgents);
router.post('/create', authorizeRoles(['super_admin', 'user']), checkPlanLimit('staff'), agentController.createAgent);
router.put('/:id/update', authorizeRoles(['super_admin', 'user']), agentController.updateAgent);
router.put('/:id/update/status', authorizeRoles(['super_admin', 'user']), agentController.updateAgentStatus);
router.delete('/delete', authorizeRoles(['super_admin', 'user']), agentController.deleteAgent);
router.get('/:id', authorizeRoles(['super_admin', 'user']), agentController.getAgentById);
router.put('/:id/phone-no', authorizeRoles(['super_admin', 'user']), agentController.updatePhonenoStatus);

export default router;
