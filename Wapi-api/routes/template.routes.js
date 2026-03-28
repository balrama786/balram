import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';
import templateController from '../controllers/template.controller.js';
const router = express.Router();
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024
  }
});

router.use(authenticate);
router.use(requireSubscription);
router.post('/create', authorizeRoles(['super_admin', 'user']), checkPlanLimit('template_bots'), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'card_media', maxCount: 10 }]), templateController.createTemplate);
router.get('/', authorizeRoles(['super_admin', 'user']), templateController.getAllTemplates);
router.get('/meta-list', authorizeRoles(['super_admin', 'user']), templateController.getTemplatesFromMeta);
router.get('/:id', authorizeRoles(['super_admin', 'user']), templateController.getTemplateById);
router.post('/sync', authorizeRoles(['super_admin', 'user']), templateController.syncTemplatesFromMeta);
router.post('/sync-status', authorizeRoles(['super_admin', 'user']), templateController.syncTemplatesStatusFromMeta);

router.post('/suggest', authorizeRoles(['super_admin', 'user']), templateController.suggestTemplate);
router.put('/:id', authorizeRoles(['super_admin', 'user']), templateController.updateTemplate);
router.delete('/:id', authorizeRoles(['super_admin', 'user']), templateController.deleteTemplate);
router.get('/admin-templates/list', authorizeRoles(['super_admin', 'user']), templateController.getAdminTemplatesForUsers);

export default router;

