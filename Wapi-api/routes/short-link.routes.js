import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as shortLinkController from '../controllers/short-link.controller.js';

const router = express.Router();

router.post('/', authenticate, shortLinkController.createShortLink);
router.get('/', authenticate, shortLinkController.getShortLinks);
router.get('/:id', authenticate, shortLinkController.getShortLinkById);
router.put('/:id', authenticate, shortLinkController.updateShortLink);
router.post('/bulk-delete', authenticate, shortLinkController.bulkDeleteShortLinks);

export default router;
