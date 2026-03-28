import express from 'express';
import {
  getCampaignStatistics,
  updateCampaignStatsFromMessageEndpoint,
  bulkUpdateCampaignStatsEndpoint,
  getCampaignStatsWithMessages
} from '../controllers/campaign-stats.controller.js';

const router = express.Router();

router.get('/:campaignId/stats', getCampaignStatistics);

router.get('/:campaignId/stats/messages', getCampaignStatsWithMessages);

router.post('/update-from-message', updateCampaignStatsFromMessageEndpoint);
router.post('/bulk-update', bulkUpdateCampaignStatsEndpoint);

export default router;
