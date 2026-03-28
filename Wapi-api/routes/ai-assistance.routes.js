import express from 'express';
import { transformMessage, suggestReply, getSupportedLanguages } from '../controllers/ai-assistance.controller.js';
import { authenticate } from '../middlewares/auth.js';
const router = express.Router();


router.post('/transform', authenticate, transformMessage);
router.post('/suggest-reply', authenticate, suggestReply);

router.get('/languages', getSupportedLanguages);

export default router;
