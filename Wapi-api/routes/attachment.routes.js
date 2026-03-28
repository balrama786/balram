import express from 'express';
import { createAttachment, getAttachments, getAttachmentById, deleteAttachment, bulkDeleteAttachments } from '../controllers/attachment.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { uploadFiles } from '../utils/upload.js';

const router = express.Router();

router.use(authenticate);

router.post('/', uploadFiles('attachments', 'attachments'), createAttachment);

router.get('/', getAttachments);

router.get('/:id', getAttachmentById);

router.delete('/:id', deleteAttachment);

router.post('/delete', bulkDeleteAttachments);

export default router;
