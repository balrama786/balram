import express from 'express';
import * as tagController from '../controllers/tag.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);

router.post('/', checkPlanLimit('tags'), tagController.createTag);
router.get('/', tagController.getTags);
router.get('/:id', tagController.getTagById);
router.put('/:id', tagController.updateTag);
router.delete('/delete', tagController.deleteTags);

router.get('/stats/popular', tagController.getPopularTags);
router.get('/stats/usage', tagController.getTagsWithStats);

export default router;
