import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
const router = express.Router();

router.get('/all', authenticate, chatController.getRecentChats);
router.post('/add-tag', authenticate, chatController.addTag);
router.delete('/delete-tag', authenticate, chatController.deleteTag);
router.post('/add-note', authenticate, chatController.addNote);
router.delete('/delete-note', authenticate, chatController.deleteNote);
router.post('/assign', authenticate, authorizeRoles(['super_admin', 'user']), chatController.assignChatToAgent);
router.post('/unassign', authenticate, authorizeRoles(['super_admin', 'user']), chatController.unassignChatFromAgent);
router.post('/status', authenticate, chatController.updateChatStatus);

export default router;

