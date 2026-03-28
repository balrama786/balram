import express from 'express';
import apiKeyController from '../controllers/api-key.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, apiKeyController.createApiKey);
router.get('/', authenticate, apiKeyController.listApiKeys);
router.post('/delete', authenticate, apiKeyController.deleteApiKey);

export default router;

