import express from 'express';
import {
  updateMessageDeliveryStatus,
  updateMessageReadStatus,
  updateWhatsAppMessageStatus,
  bulkUpdateDeliveryStatus,
  bulkUpdateReadStatus,
  getMessageStatus,
  getMessagesStatus
} from '../controllers/message-status.controller.js';

const router = express.Router();

router.patch('/:messageId/delivery', updateMessageDeliveryStatus);
router.patch('/:messageId/read', updateMessageReadStatus);

router.post('/whatsapp/status', updateWhatsAppMessageStatus);

router.patch('/bulk/delivery', bulkUpdateDeliveryStatus);
router.patch('/bulk/read', bulkUpdateReadStatus);

router.get('/user/:userId/status', getMessageStatus);
router.post('/status', getMessagesStatus);

export default router;
