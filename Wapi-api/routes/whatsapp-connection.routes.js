import express from 'express';
import whatsappConnectionController from '../controllers/whatsapp-connection.controller.js';
import { authenticate } from '../middlewares/auth.js';
import multer from "multer";
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024
  }
});

router.post('/create', authenticate,whatsappConnectionController.createWhatsappConnection);
router.get('/show',authenticate,whatsappConnectionController.getWhatsappConnection);
router.put('/update', authenticate,whatsappConnectionController.updateWhatsappConnection);
router.post('/send-message', authenticate, upload.single('file'), whatsappConnectionController.sendMessage);

export default router;

