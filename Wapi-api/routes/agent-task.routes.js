import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import agentTaskController from '../controllers/agent-task.controller.js';
const router = express.Router();

router.get('/all', authenticate, agentTaskController.getAllAgentTasks);
router.post('/create', authenticate,  agentTaskController.createAgentTask);
router.put('/:id/update', authenticate,  agentTaskController.updateAgentTask);
router.put('/:id/update/status', authenticate,  agentTaskController.updateAgentTaskStatus);
router.delete('/delete', authenticate,  agentTaskController.deleteAgentTask);
router.post('/:id/comment', authenticate,  agentTaskController.addAgentTaskComment );
router.put('/:id/comment/:commentId', authenticate,  agentTaskController.editAgentTaskComment );
router.delete('/:id/comment/:commentId', authenticate,  agentTaskController.deleteAgentTaskComment );
router.get('/:id', authenticate, agentTaskController.getAgentTaskById);

export default router;
