import express from 'express';
import * as customFieldController from '../controllers/custom-field.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription, checkPlanLimit } from '../middlewares/plan-permission.js';

const router = express.Router();

router.use(authenticate);
router.use(requireSubscription);

router.post('/', checkPlanLimit('custom_fields'), customFieldController.createCustomField);
router.get('/', customFieldController.getCustomFields);
router.get('/:id', customFieldController.getCustomFieldById);
router.put('/:id', customFieldController.updateCustomField);
router.post('/delete', customFieldController.deleteCustomFields);
router.post('/status', customFieldController.updateCustomFieldsStatus);

export default router;
