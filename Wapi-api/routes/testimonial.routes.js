import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import testimonialController from '../controllers/testimonial.controller.js';
import { uploadSingle } from '../utils/upload.js';
const router = express.Router();

router.get('/all', authenticate, authorizeRoles(['super_admin', 'user']), testimonialController.getAllTestimonials);
router.post('/create', authenticate, authorizeRoles(['super_admin']), uploadSingle('user_profiles','user_image') , testimonialController.createTestimonial);
router.put('/:id/update', authenticate, authorizeRoles(['super_admin']) , uploadSingle('user_profiles','user_image') , testimonialController.updateTestimonial);
router.put('/:id/update/status', authenticate, authorizeRoles(['super_admin']) , testimonialController.updateTestimonialStatus);
router.delete('/delete', authenticate, authorizeRoles(['super_admin']), testimonialController.deleteTestimonial);
router.get('/:id' , authenticate , authorizeRoles(['super_admin' , 'user']) , testimonialController.getTestimonialById);

export default router;
