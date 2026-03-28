import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import contactInquiryController from '../controllers/contact-inquiries.controller.js';
const router = express.Router();

router.get('/all', authenticate, authorizeRoles(['super_admin']), contactInquiryController.getAllInquiries);
router.post('/create', authenticate, contactInquiryController.createInquiry);
router.delete('/delete', authenticate, authorizeRoles(['super_admin']), contactInquiryController.deleteInquiry);

export default router;