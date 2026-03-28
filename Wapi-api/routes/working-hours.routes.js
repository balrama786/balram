import express from 'express';
import {
    upsertWorkingHours,
    getWorkingHoursByWaba,
    deleteWorkingHours
} from '../controllers/working-hours.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upsertWorkingHours);
router.get('/:waba_id', getWorkingHoursByWaba);
router.delete('/:waba_id', deleteWorkingHours);

export default router;
