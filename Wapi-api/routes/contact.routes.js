import express from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';
import { uploadSingle } from '../utils/upload.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);

router.post('/', checkPlanLimit('contacts'), contactController.createContact);
router.get('/', contactController.getContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
// router.delete('/:id', contactController.bulkDeleteContacts);
router.delete('/delete', contactController.bulkDeleteContacts);
router.get('/stats/summary', contactController.getContactStats);

router.post('/import', checkPlanLimit('contacts'), uploadSingle('imports', 'file'), contactController.importContactsFromCSV);
router.post('/export', contactController.exportContacts);
router.get('/export/status/:jobId', contactController.getExportStatus);
router.get('/export/download/:filename', contactController.downloadExport);

export default router;
