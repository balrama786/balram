import express from 'express';
import {
    createSequence,
    getSequences,
    getSequenceById,
    updateSequence,
    deleteSequence,
    createSequenceStep,
    updateSequenceStep,
    deleteSequenceStep,
    reorderSequenceSteps
} from '../controllers/sequence.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createSequence);
router.get('/', getSequences);
router.get('/:id', getSequenceById);
router.put('/:id', updateSequence);
router.delete('/:id', deleteSequence);

router.post('/steps', createSequenceStep);
router.put('/steps/reorder', reorderSequenceSteps);
router.put('/steps/:id', updateSequenceStep);
router.delete('/steps/:id', deleteSequenceStep);

export default router;
