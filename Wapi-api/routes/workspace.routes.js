import express from 'express';
import * as workspaceController from '../controllers/workspace.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/connected', workspaceController.getConnectedWorkspaces);
router.post('/', workspaceController.createWorkspace);
router.get('/', workspaceController.getWorkspaces);
router.get('/:id', workspaceController.getWorkspaceById);
router.patch('/:id', workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);

export default router;
