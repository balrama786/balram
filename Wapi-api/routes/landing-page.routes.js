import express from 'express';
const router = express.Router();
import { getLandingPage, updateLandingPage, uploadLandingImage } from '../controllers/landing-page.controller.js';
import { uploader } from '../utils/upload.js';
import { authenticateUser } from '../middlewares/auth.js';

router.get('/', getLandingPage);

router.put('/', authenticateUser, updateLandingPage);
router.post('/upload-image', authenticateUser, uploader('landing').single('image'), uploadLandingImage);

export default router;
