import express from 'express';
import { authenticate, authorizeAdmin, authorizeRoles } from "../middlewares/auth.js";
import adminTemplateController from '../controllers/admin-template.controller.js';
import { uploader } from '../utils/upload.js';
const upload = uploader();

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeAdmin , upload.fields([{ name: 'file', maxCount: 1 }, { name: 'card_media', maxCount: 10 }]), adminTemplateController.createAdminTemplate);
router.get("/", authorizeAdmin ,adminTemplateController.getAllAdminTemplates);
router.get('/:id',  authorizeRoles(['super_admin', 'user']), adminTemplateController.getAdminTemplateById);
router.put('/:id', authorizeAdmin , upload.fields([{ name: 'file', maxCount: 1 }, { name: 'card_media', maxCount: 10 }]), adminTemplateController.updateAdminTemplate);
router.delete("/:id", authorizeAdmin , adminTemplateController.deleteAdminTemplate);
router.delete("/", authorizeAdmin ,adminTemplateController.bulkDeleteAdminTemplates);

export default router;
