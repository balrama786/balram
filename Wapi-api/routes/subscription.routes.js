import express from 'express';
import {
    getAllSubscriptions,
    getSubscriptionPayments,
    getUserSubscription,
    createStripeSubscription,
    createRazorpaySubscription,
    createManualSubscription,
    getPendingManualSubscriptions,
    approveManualSubscription,
    rejectManualSubscription,
    cancelSubscription,
    resumeSubscription,
    changeSubscriptionPlan,
    getManagePortalUrl,
    getSubscriptionUsage,
    getSubscriptionCheckoutUrl
} from '../controllers/subscription.controller.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/my-subscription', authenticateUser, getUserSubscription);
router.get('/usage', authenticateUser, getSubscriptionUsage);
router.get('/checkout-url', authenticateUser, getSubscriptionCheckoutUrl);
router.post('/create-stripe', authenticateUser, createStripeSubscription);
router.post('/create-razorpay', authenticateUser, createRazorpaySubscription);
router.post('/create-manual', authenticateUser, createManualSubscription);
router.get('/:id/manage-portal', authenticateUser, getManagePortalUrl);
router.post('/:id/cancel', authenticateUser, cancelSubscription);
router.post('/:id/resume', authenticateUser, resumeSubscription);
router.post('/:id/change-plan', authenticateUser, changeSubscriptionPlan);

router.get('/', authenticateUser, authorizeAdmin, getAllSubscriptions);
router.get('/payments', authenticateUser, authorizeAdmin, getSubscriptionPayments);
router.get('/pending-manual', authenticateUser, authorizeAdmin, getPendingManualSubscriptions);
router.post('/:id/approve-manual', authenticateUser, authorizeAdmin, approveManualSubscription);
router.post('/:id/reject-manual', authenticateUser, authorizeAdmin, rejectManualSubscription);

export default router;
