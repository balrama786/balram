import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as importJobController from '../controllers/import-job.controller.js';

const router = express.Router();

router.get('/', authenticate, importJobController.getImportJobs);
router.get('/:id', authenticate, importJobController.getImportJobById);
router.post('/bulk-delete', authenticate, importJobController.bulkDeleteImportJobs);

export default router;
