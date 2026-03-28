import express from 'express';
import {
    getWabaConfiguration,
    updateWabaConfiguration
} from '../controllers/waba-configuration.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/:waba_id', getWabaConfiguration);
router.put('/:waba_id', updateWabaConfiguration);

export default router;
