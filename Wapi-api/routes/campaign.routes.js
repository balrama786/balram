import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';
import campaignController from '../controllers/campaign.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);

router.post('/', authorizeRoles(['super_admin', 'user']), checkPlanLimit('campaigns'), campaignController.createCampaign);
router.get('/', authorizeRoles(['super_admin', 'user']), campaignController.getAllCampaigns);
router.get('/:id', authorizeRoles(['super_admin', 'user']), campaignController.getCampaignById);
router.put('/:id', authorizeRoles(['super_admin', 'user']), campaignController.updateCampaign);
router.delete('/:id', authorizeRoles(['super_admin', 'user']), campaignController.deleteCampaign);
router.post('/:id/send', authorizeRoles(['super_admin', 'user']), campaignController.sendCampaign);

export default router;
