import express from 'express';
import {
    createReplyMaterial,
    getReplyMaterials,
    getReplyMaterialById,
    updateReplyMaterial,
    deleteReplyMaterial,
    bulkDeleteReplyMaterials
} from '../controllers/reply-material.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { uploader } from '../utils/upload.js';

const router = express.Router();

router.use(authenticate);

const upload = uploader('reply-materials');

router.post('/', upload.single('file'), createReplyMaterial);
router.get('/', getReplyMaterials);
router.post('/bulk-delete', bulkDeleteReplyMaterials);
router.get('/:id', getReplyMaterialById);
router.put('/:id', upload.single('file'), updateReplyMaterial);
router.delete('/:id', deleteReplyMaterial);

export default router;
