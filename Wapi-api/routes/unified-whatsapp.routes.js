import express from 'express';
import unifiedWhatsAppController from '../controllers/unified-whatsapp.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { uploadSingle } from '../utils/upload.js';
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024
  }
});

const router = express.Router();

router.post('/send', authenticate, upload.single('file_url'), unifiedWhatsAppController.sendMessage);
router.get('/messages', authenticate, unifiedWhatsAppController.getMessages);
router.get('/chats', authenticate, unifiedWhatsAppController.getRecentChats);
router.post('/pin-chat', authenticate, unifiedWhatsAppController.togglePinChat);
router.post('/assign-chat', authenticate, authorizeRoles(['super_admin', 'user']), unifiedWhatsAppController.assignChatToAgent);
router.get('/status', authenticate, unifiedWhatsAppController.getConnectionStatus);
router.post('/connect', authenticate, unifiedWhatsAppController.connectWhatsApp);
router.get('/baileys/qrcode/:wabaId', authenticate, unifiedWhatsAppController.getBaileysQRCode);
router.put('/connect/:id', authenticate, unifiedWhatsAppController.updateConnection);
router.post('/delete', authenticate, unifiedWhatsAppController.deleteConnections);
router.get('/connections', authenticate, unifiedWhatsAppController.getUserConnections);
router.get('/phone-numbers', authenticate, unifiedWhatsAppController.getMyPhoneNumbers);
router.put('/phone-numbers/:phoneNumberId/set-primary', authenticate, unifiedWhatsAppController.setPrimaryPhoneNumber);
router.get('/:wabaId/phone-numbers', authenticate, unifiedWhatsAppController.getWabaPhoneNumbers);
router.post('/embedded-signup/connection', authenticate, unifiedWhatsAppController.getEmbbededSignupConnection);
router.get('/contact-profile', authenticate, unifiedWhatsAppController.getContactProfile);
export default router;
