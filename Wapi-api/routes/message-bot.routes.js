import express from 'express';
import messageBotController from '../controllers/message-bot.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', messageBotController.createMessageBot);
router.get('/', messageBotController.getAllMessageBots);
router.get('/:id', messageBotController.getMessageBotById);
router.put('/:id', messageBotController.updateMessageBot);
router.delete('/:id', messageBotController.deleteMessageBot);
router.post('/bulk-delete', messageBotController.bulkDeleteMessageBots);

export default router;
