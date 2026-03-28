import express from 'express';
import chatbotController from '../controllers/chatbot.controller.js';
import { authenticate , authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', chatbotController.getAllChatbots);
router.get('/:id', chatbotController.getChatbotById);
router.post('/', chatbotController.createChatbot);
router.put('/:id', chatbotController.updateChatbot);
router.delete('/:id', chatbotController.deleteChatbot);
router.post('/:id/train', chatbotController.trainChatbot);

export default router;
