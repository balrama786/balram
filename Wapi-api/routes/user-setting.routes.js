import express from 'express';
import { getUserSettings, updateUserSettings } from '../controllers/user-setting.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getUserSettings);

router.put('/', authenticate, updateUserSettings);

export default router;
