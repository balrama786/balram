import express from 'express';
import automationController from '../controllers/automation.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);

router.get('/', automationController.getAutomationFlows);
router.get('/:flowId', automationController.getAutomationFlow);
router.post('/', checkPlanLimit('bot_flow'), automationController.createAutomationFlow);
router.put('/:flowId', automationController.updateAutomationFlow);
router.delete('/:flowId', automationController.deleteAutomationFlow);
router.patch('/:flowId/toggle', automationController.toggleAutomationFlow);
router.post('/:flowId/test', automationController.testAutomationFlow);
router.get('/:flowId/executions', automationController.getAutomationExecutions);
router.get('/executions/:executionId', automationController.getAutomationExecution);
router.get('/statistics', automationController.getAutomationStatistics);
router.get('/node-types', automationController.getAvailableNodeTypes);

export default router;