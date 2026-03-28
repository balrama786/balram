import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import faqController from '../controllers/faq.controller.js';
const router = express.Router();

router.get('/all', authenticate, authorizeRoles(['super_admin', 'user']), faqController.getAllFaqs);
router.post('/create', authenticate, authorizeRoles(['super_admin']), faqController.createFaq);
router.put('/:id/update', authenticate, authorizeRoles(['super_admin']), faqController.updateFaq);
router.put('/:id/update/status', authenticate, authorizeRoles(['super_admin']), faqController.updateFaqStatus);
router.delete('/delete', authenticate, authorizeRoles(['super_admin']), faqController.deleteFaq);
router.get('/:id' , authenticate , authorizeRoles(['super_admin' , 'user']) , faqController.getFaqById);

export default router;
