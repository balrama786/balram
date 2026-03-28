import express from 'express';
import {
    getAllModels,
    getModelById,
    createModel,
    updateModel,
    bulkDeleteModels,
    toggleModelStatus,
    testModelApi
} from '../controllers/ai-model.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();


router.get('/models', getAllModels);
router.get('/models/:id', getModelById);
router.post('/models', authenticate, authorizeAdmin, createModel);
router.put('/models/:id', authenticate, authorizeAdmin, updateModel);
router.post('/delete', authenticate, authorizeAdmin, bulkDeleteModels);
router.patch('/models/:id/status', authenticate, authorizeAdmin, toggleModelStatus);
router.post('/models/test', authenticate, authorizeAdmin, testModelApi);

export default router;
