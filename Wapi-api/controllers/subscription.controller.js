import { Subscription, Plan, PaymentHistory, User, Tag, Contact, Template, Campaign, CustomField, AutomationFlow } from '../models/index.js';
import mongoose from 'mongoose';
import {
    StripeService,
    RazorpayService,
    calculatePeriodEnd
} from '../utils/payment-gateway.service.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const SUBSCRIPTION_STATUS = ['active', 'trial', 'expired', 'cancelled', 'suspended', 'pending'];
const PAYMENT_STATUS = ['pending', 'paid', 'failed', 'refunded'];


const parsePaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE);
    const limit = Math.max(1, Math.min(MAX_LIMIT, parseInt(query.limit) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};


const buildPaymentHistoryAggregation = (matchQuery, skip, limit) => {
    return [
        { $match: matchQuery },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'plans',
                localField: 'plan_id',
                foreignField: '_id',
                as: 'plan'
            }
        },
        { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'subscription_id',
                foreignField: '_id',
                as: 'subscription'
            }
        },
        { $unwind: { path: '$subscription', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                user_id: 1,
                subscription_id: 1,
                plan_id: 1,
                amount: 1,
                currency: 1,
                payment_method: 1,
                payment_status: 1,
                transaction_id: 1,
                payment_gateway: 1,
                payment_response: 1,
                invoice_number: 1,
                invoice_url: 1,
                paid_at: 1,
                refunded_at: 1,
                notes: 1,
                created_at: 1,
                updated_at: 1,
                user: {
                    _id: '$user._id',
                    name: '$user.name',
                    email: '$user.email',
                    phone: '$user.phone'
                },
                plan: {
                    _id: '$plan._id',
                    name: '$plan.name',
                    slug: '$plan.slug',
                    price: '$plan.price',
                    billing_cycle: '$plan.billing_cycle'
                },
                subscription: {
                    _id: '$subscription._id',
                    status: '$subscription.status',
                    payment_gateway: '$subscription.payment_gateway',
                    payment_status: '$subscription.payment_status',
                    started_at: '$subscription.started_at',
                    current_period_start: '$subscription.current_period_start',
                    current_period_end: '$subscription.current_period_end'
                }
            }
        },
        { $sort: { paid_at: -1, created_at: -1 } },
        { $skip: skip },
        { $limit: limit }
    ];
};


export const getSubscriptionPayments = async (req, res) => {
    try {
        const { page, limit, skip } = parsePaginationParams(req.query);

        const {
            user_id,
            subscription_id,
            plan_id,
            payment_status,
            payment_gateway,
            payment_method,
            start_date,
            end_date,
            search
        } = req.query;

        const matchQuery = { deleted_at: null };

        if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
            matchQuery.user_id = new mongoose.Types.ObjectId(user_id);
        }

        if (subscription_id && mongoose.Types.ObjectId.isValid(subscription_id)) {
            matchQuery.subscription_id = new mongoose.Types.ObjectId(subscription_id);
        }

        if (plan_id && mongoose.Types.ObjectId.isValid(plan_id)) {
            matchQuery.plan_id = new mongoose.Types.ObjectId(plan_id);
        }

        if (payment_status && PAYMENT_STATUS.includes(payment_status)) {
            matchQuery.payment_status = payment_status;
        }

        if (payment_gateway) {
            matchQuery.payment_gateway = payment_gateway;
        }

        if (payment_method) {
            matchQuery.payment_method = payment_method;
        }

        if (start_date || end_date) {
            const dateFilter = {};
            if (start_date) {
                const from = new Date(start_date);
                if (!Number.isNaN(from.getTime())) {
                    dateFilter.$gte = from;
                }
            }
            if (end_date) {
                const to = new Date(end_date);
                if (!Number.isNaN(to.getTime())) {
                    dateFilter.$lte = to;
                }
            }

            if (Object.keys(dateFilter).length > 0) {
                matchQuery.paid_at = dateFilter;
            }
        }

        if (search && String(search).trim()) {
            const term = String(search).trim();
            const regex = new RegExp(term, 'i');
            matchQuery.$or = [
                { transaction_id: regex },
                { invoice_number: regex },
                { notes: regex }
            ];
        }

        const totalCount = await PaymentHistory.countDocuments(matchQuery);
        const pipeline = buildPaymentHistoryAggregation(matchQuery, skip, limit);
        const payments = await PaymentHistory.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            data: {
                payments,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            }
        });
    } catch (error) {
        console.error('Error retrieving subscription payments:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve subscription payments',
            error: error.message
        });
    }
};


const buildSubscriptionAggregation = (matchQuery, skip, limit) => {
    return [
        { $match: matchQuery },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'plans',
                localField: 'plan_id',
                foreignField: '_id',
                as: 'plan'
            }
        },
        { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                status: 1,
                started_at: 1,
                trial_ends_at: 1,
                current_period_start: 1,
                current_period_end: 1,
                expires_at: 1,
                cancelled_at: 1,
                payment_gateway: 1,
                payment_method: 1,
                payment_status: 1,
                transaction_id: 1,
                payment_reference: 1,
                approved_by: 1,
                approved_at: 1,
                amount_paid: 1,
                currency: 1,
                usage: 1,
                auto_renew: 1,
                created_at: 1,
                updated_at: 1,
                user: {
                    _id: '$user._id',
                    name: '$user.name',
                    email: '$user.email',
                    phone: '$user.phone'
                },
                plan: {
                    _id: '$plan._id',
                    name: '$plan.name',
                    slug: '$plan.slug',
                    price: '$plan.price',
                    billing_cycle: '$plan.billing_cycle',
                    features: '$plan.features'
                }
            }
        },
        { $sort: { created_at: -1 } },
        { $skip: skip },
        { $limit: limit }
    ];
};

export const getAllSubscriptions = async (req, res) => {
    try {
        const { page, limit, skip } = parsePaginationParams(req.query);
        const { status, user_id } = req.query;

        let matchQuery = { deleted_at: null };

        if (status && SUBSCRIPTION_STATUS.includes(status)) {
            matchQuery.status = status;
        }

        if (req.query.payment_gateway) {
            matchQuery.payment_gateway = req.query.payment_gateway;
        }

        if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
            matchQuery.user_id = new mongoose.Types.ObjectId(user_id);
        }

        const totalCount = await Subscription.countDocuments(matchQuery);
        const pipeline = buildSubscriptionAggregation(matchQuery, skip, limit);
        const subscriptions = await Subscription.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            data: {
                subscriptions,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            }
        });
    } catch (error) {
        console.error('Error retrieving subscriptions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve subscriptions',
            error: error.message
        });
    }
};


export const getPendingManualSubscriptions = async (req, res) => {
    try {
        const { page, limit, skip } = parsePaginationParams(req.query);

        const matchQuery = {
            deleted_at: null,
            payment_gateway: 'manual',
            status: 'pending'
        };

        const totalCount = await Subscription.countDocuments(matchQuery);
        const pipeline = buildSubscriptionAggregation(matchQuery, skip, limit);
        const subscriptions = await Subscription.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            data: {
                subscriptions,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            }
        });
    } catch (error) {
        console.error('Error retrieving pending manual subscriptions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve pending manual subscriptions',
            error: error.message
        });
    }
};


export const approveManualSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const adminUserId = req.user._id;

        const subscription = await Subscription.findOne({
            _id: id,
            payment_gateway: 'manual',
            status: 'pending',
            deleted_at: null
        }).populate('plan_id');

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Pending manual subscription not found'
            });
        }

        subscription.status = 'active';
        subscription.payment_status = 'paid';
        subscription.amount_paid = subscription.plan_id?.price ?? 0;
        subscription.approved_by = adminUserId;
        subscription.approved_at = new Date();
        subscription.auto_renew = false;
        await subscription.save();

        await PaymentHistory.create({
            user_id: subscription.user_id,
            subscription_id: subscription._id,
            plan_id: subscription.plan_id._id,
            amount: subscription.amount_paid,
            currency: subscription.currency || 'INR',
            payment_method: 'manual',
            payment_status: 'success',
            payment_gateway: 'manual',
            payment_response: { approved_by: adminUserId, approved_at: subscription.approved_at },
            paid_at: subscription.approved_at
        });

        return res.status(200).json({
            success: true,
            message: 'Subscription approved successfully',
            data: subscription
        });
    } catch (error) {
        console.error('Error approving manual subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to approve subscription',
            error: error.message
        });
    }
};


export const rejectManualSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findOne({
            _id: id,
            payment_gateway: 'manual',
            status: 'pending',
            deleted_at: null
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Pending manual subscription not found'
            });
        }

        subscription.status = 'cancelled';
        subscription.payment_status = 'failed';
        subscription.cancelled_at = new Date();
        await subscription.save();

        return res.status(200).json({
            success: true,
            message: 'Subscription request rejected',
            data: subscription
        });
    } catch (error) {
        console.error('Error rejecting manual subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reject subscription',
            error: error.message
        });
    }
};


const PLAN_SENSITIVE_FIELDS = '-stripe_price_id -stripe_product_id -stripe_payment_link_id -stripe_payment_link_url -razorpay_plan_id';

const fetchDynamicUsage = async (userId) => {
    const [tagsCount, contactsCount, templatesCount, campaignsCount, customFieldsCount, staffCount, botFlowsCount] = await Promise.all([
        Tag.countDocuments({ created_by: userId, deleted_at: null }),
        Contact.countDocuments({ created_by: userId, deleted_at: null }),
        Template.countDocuments({ user_id: userId }),
        Campaign.countDocuments({ user_id: userId, deleted_at: null }),
        CustomField.countDocuments({ created_by: userId, deleted_at: null }),
        User.countDocuments({ created_by: userId }),
        AutomationFlow.countDocuments({ user_id: userId, deleted_at: null })
    ]);
    return {
        tags_used: tagsCount,
        contacts_used: contactsCount,
        template_bots_used: templatesCount,
        campaigns_used: campaignsCount,
        custom_fields_used: customFieldsCount,
        staff_used: staffCount,
        bot_flow_used: botFlowsCount,
        message_bots_used: botFlowsCount,
        ai_prompts_used: 0,
        canned_replies_used: 0,
        conversations_used: 0,
        broadcast_messages_used: 0
    };
};

export const getUserSubscription = async (req, res) => {
    try {
        const userId = req.user._id;

        const subscription = await Subscription.findOne({
            user_id: userId,
            deleted_at: null,
            $or: [
                { status: { $in: ['active', 'trial'] } },
                { payment_gateway: 'manual', status: 'pending' }
            ]
        }).populate('plan_id', PLAN_SENSITIVE_FIELDS).sort({ created_at: -1 }).lean();

        if (!subscription) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No subscription found'
            });
        }

        const usage = await fetchDynamicUsage(userId);
        const data = { ...subscription, usage };

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error retrieving user subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve subscription',
            error: error.message
        });
    }
};



export const createStripeSubscription = async (req, res) => {
    try {
        const { plan_id } = req.body;
        const userId = req.user._id;

        if (!plan_id || !mongoose.Types.ObjectId.isValid(plan_id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid plan ID is required'
            });
        }

        const plan = await Plan.findOne({ _id: plan_id, is_active: true, deleted_at: null });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found or inactive'
            });
        }

        if (!plan.stripe_payment_link_url) {
            return res.status(400).json({
                success: false,
                message: 'Plan does not have a Stripe payment link configured'
            });
        }

        const existingActive = await Subscription.findOne({
            user_id: userId,
            status: { $in: ['active', 'trial'] },
            deleted_at: null
        });
        if (existingActive) {
            return res.status(409).json({
                success: false,
                message: 'User already has an active subscription'
            });
        }

        let subscription = await Subscription.findOne({
            user_id: userId,
            plan_id: plan._id,
            status: 'pending',
            payment_gateway: 'stripe',
            stripe_subscription_id: null,
            deleted_at: null
        });

        if (!subscription) {
            const now = new Date();
            const periodEnd = calculatePeriodEnd(now, plan.billing_cycle || 'monthly');
            subscription = await Subscription.create({
                user_id: userId,
                plan_id: plan._id,
                status: 'pending',
                started_at: now,
                current_period_start: now,
                current_period_end: periodEnd,
                payment_gateway: 'stripe',
                payment_method: 'card',
                payment_status: 'pending',
                currency: (plan.currency || 'INR').toUpperCase(),
                stripe_subscription_id: null,
                auto_renew: true
            });
        }

        const separator = plan.stripe_payment_link_url.includes('?') ? '&' : '?';
        const params = new URLSearchParams();
        params.set('client_reference_id', userId.toString());
        if (req.user?.email) {
            params.set('prefilled_email', req.user.email);
        }
        const paymentLink = `${plan.stripe_payment_link_url}${separator}${params.toString()}`;

        return res.status(200).json({
            success: true,
            message: 'Redirect user to the payment link to complete subscription',
            data: {
                subscription,
                payment_link: paymentLink,
                plan_id: plan._id,
                plan_name: plan.name
            }
        });
    } catch (error) {
        console.error('Error creating Stripe subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create subscription',
            error: error.message
        });
    }
};


export const createManualSubscription = async (req, res) => {
    try {
        const { plan_id, payment_reference } = req.body;
        const userId = req.user._id;

        if (!plan_id || !mongoose.Types.ObjectId.isValid(plan_id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid plan ID is required'
            });
        }

        const plan = await Plan.findOne({ _id: plan_id, is_active: true, deleted_at: null });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found or inactive'
            });
        }

        const existingActive = await Subscription.findOne({
            user_id: userId,
            status: { $in: ['active', 'trial'] },
            deleted_at: null
        });
        if (existingActive) {
            return res.status(409).json({
                success: false,
                message: 'User already has an active subscription'
            });
        }

        const existingPending = await Subscription.findOne({
            user_id: userId,
            plan_id: plan._id,
            payment_gateway: 'manual',
            status: 'pending',
            deleted_at: null
        });
        if (existingPending) {
            return res.status(200).json({
                success: true,
                message: 'Manual payment subscription request already submitted. Awaiting admin approval.',
                data: existingPending
            });
        }

        const now = new Date();
        const periodEnd = calculatePeriodEnd(now, plan.billing_cycle || 'monthly');

        const subscription = await Subscription.create({
            user_id: userId,
            plan_id: plan._id,
            status: 'pending',
            started_at: now,
            current_period_start: now,
            current_period_end: periodEnd,
            payment_gateway: 'manual',
            payment_method: 'manual',
            payment_status: 'pending',
            payment_reference: payment_reference?.trim() || null,
            currency: (plan.currency || 'INR').toUpperCase(),
            amount_paid: 0,
            auto_renew: false
        });

        return res.status(201).json({
            success: true,
            message: 'Manual payment subscription requested. Your subscription will be active after admin approval.',
            data: subscription
        });
    } catch (error) {
        console.error('Error creating manual subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create manual subscription request',
            error: error.message
        });
    }
};


export const createRazorpaySubscription = async (req, res) => {
    try {
        const { plan_id } = req.body;
        const userId = req.user._id;

        if (!plan_id || !mongoose.Types.ObjectId.isValid(plan_id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid plan ID is required'
            });
        }

        const plan = await Plan.findOne({ _id: plan_id, is_active: true, deleted_at: null });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found or inactive'
            });
        }

        if (!plan.razorpay_plan_id) {
            return res.status(400).json({
                success: false,
                message: 'Plan does not have Razorpay plan ID configured'
            });
        }

        const existingActive = await Subscription.findOne({
            user_id: userId,
            status: { $in: ['active', 'trial'] },
            deleted_at: null
        });
        if (existingActive) {
            return res.status(409).json({
                success: false,
                message: 'User already has an active subscription'
            });
        }

        const linkResult = await RazorpayService.createSubscriptionLink(
            plan.razorpay_plan_id,
            userId.toString(),
            {
                billingCycle: plan.billing_cycle,
                planIdDb: plan._id,
                notifyEmail: req.user?.email || undefined,
                notifyPhone: req.user?.phone || undefined
            }
        );

        const now = new Date();
        const periodEnd = calculatePeriodEnd(now, plan.billing_cycle);

        let subscription = await Subscription.findOne({
            user_id: userId,
            plan_id: plan._id,
            status: 'pending',
            payment_gateway: 'razorpay',
            deleted_at: null
        });

        if (subscription) {
            subscription.razorpay_subscription_id = linkResult.id;
            subscription.current_period_end = periodEnd;
            await subscription.save();
        } else {
            subscription = await Subscription.create({
                user_id: userId,
                plan_id: plan._id,
                status: 'pending',
                started_at: now,
                current_period_start: now,
                current_period_end: periodEnd,
                payment_gateway: 'razorpay',
                payment_method: 'card',
                payment_status: 'pending',
                currency: (plan.currency || 'INR').toUpperCase(),
                razorpay_subscription_id: linkResult.id,
                auto_renew: true
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Redirect user to the subscription link to complete payment',
            data: {
                subscription,
                subscription_link: linkResult.short_url,
                payment_link: linkResult.short_url,
                plan_id: plan._id,
                plan_name: plan.name,
                razorpay_key_id: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        console.error('Error creating Razorpay subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create subscription',
            error: error.message
        });
    }
};


export const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { cancel_at_period_end = true } = req.body;

        const subscription = await Subscription.findOne({
            _id: id,
            user_id: userId,
            deleted_at: null
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        if (subscription.payment_gateway === 'stripe' && subscription.stripe_subscription_id) {
            await StripeService.cancelSubscription(
                subscription.stripe_subscription_id,
                cancel_at_period_end
            );
        } else if (subscription.payment_gateway === 'razorpay' && subscription.razorpay_subscription_id) {
            await RazorpayService.cancelSubscription(
                subscription.razorpay_subscription_id,
                cancel_at_period_end
            );
        }

        if (cancel_at_period_end) {
            subscription.auto_renew = false;
            subscription.cancelled_at = new Date();

        } else {
            subscription.cancelled_at = new Date();
            subscription.auto_renew = false;
        }

        await subscription.save();

        return res.status(200).json({
            success: true,
            message: cancel_at_period_end
                ? 'Subscription will be cancelled at period end'
                : 'Subscription cancelled immediately',
            data: subscription
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription',
            error: error.message
        });
    }
};


export const resumeSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const subscription = await Subscription.findOne({
            _id: id,
            user_id: userId,
            deleted_at: null
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        if (subscription.status !== 'cancelled' && !subscription.cancelled_at) {
            return res.status(400).json({
                success: false,
                message: 'Subscription is not cancelled'
            });
        }

        if (subscription.payment_gateway === 'stripe' && subscription.stripe_subscription_id) {
            await StripeService.resumeSubscription(subscription.stripe_subscription_id);
        } else if (subscription.payment_gateway === 'razorpay' && subscription.razorpay_subscription_id) {
            await RazorpayService.resumeSubscription(subscription.razorpay_subscription_id);
        }

        subscription.auto_renew = true;
        subscription.cancelled_at = null;
        if (subscription.status === 'cancelled' && new Date() <= subscription.current_period_end) {
            subscription.status = 'active';
        }

        await subscription.save();

        return res.status(200).json({
            success: true,
            message: 'Subscription resumed successfully',
            data: subscription
        });
    } catch (error) {
        console.error('Error resuming subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resume subscription',
            error: error.message
        });
    }
};


export const changeSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_plan_id } = req.body;
        const userId = req.user._id;

        if (!new_plan_id || !mongoose.Types.ObjectId.isValid(new_plan_id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid new plan ID is required'
            });
        }

        const subscription = await Subscription.findOne({
            _id: id,
            user_id: userId,
            status: { $in: ['active', 'trial'] },
            deleted_at: null
        });

        if (!subscription) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Active subscription not found'
            });
        }

        const newPlan = await Plan.findOne({
            _id: new_plan_id,
            is_active: true,
            deleted_at: null
        });

        if (!newPlan) {
            return res.status(404).json({
                success: false,
                message: 'New plan not found or inactive'
            });
        }

        if (subscription.plan_id?.toString() === new_plan_id) {
            return res.status(400).json({
                success: false,
                message: 'Already subscribed to this plan'
            });
        }

        if (subscription.payment_gateway === 'stripe') {
            if (!newPlan.stripe_payment_link_url) {
                return res.status(400).json({
                    success: false,
                    message: 'New plan does not have a Stripe payment link configured'
                });
            }
            const separator = newPlan.stripe_payment_link_url.includes('?') ? '&' : '?';
            const params = new URLSearchParams();
            params.set('client_reference_id', userId.toString());
            if (req.user?.email) {
                params.set('prefilled_email', req.user.email);
            }
            const paymentLink = `${newPlan.stripe_payment_link_url}${separator}${params.toString()}`;

            return res.status(200).json({
                success: true,
                message: 'Redirect user to the payment link. Existing subscribers will see "You already have a subscription with us - Click continue to manage it."',
                data: {
                    payment_link: paymentLink,
                    new_plan_id: newPlan._id,
                    new_plan_name: newPlan.name
                }
            });
        }

        if (subscription.payment_gateway === 'razorpay' && newPlan.razorpay_plan_id) {
            if (subscription.razorpay_subscription_id) {
                try {
                    await RazorpayService.cancelSubscription(subscription.razorpay_subscription_id, false);
                } catch (cancelErr) {
                    console.error('Error cancelling Razorpay subscription on plan change:', cancelErr);
                }
                subscription.status = 'cancelled';
                subscription.cancelled_at = new Date();
                subscription.auto_renew = false;
                await subscription.save();
            }

            const linkResult = await RazorpayService.createSubscriptionLink(
                newPlan.razorpay_plan_id,
                userId.toString(),
                {
                    billingCycle: newPlan.billing_cycle,
                    planIdDb: newPlan._id,
                    notifyEmail: req.user?.email || undefined,
                    notifyPhone: req.user?.phone || undefined
                }
            );

            const now = new Date();
            const periodEnd = calculatePeriodEnd(now, newPlan.billing_cycle);

            const newSubscription = await Subscription.create({
                user_id: userId,
                plan_id: newPlan._id,
                status: 'pending',
                started_at: now,
                current_period_start: now,
                current_period_end: periodEnd,
                payment_gateway: 'razorpay',
                payment_method: 'card',
                payment_status: 'pending',
                currency: (newPlan.currency || 'INR').toUpperCase(),
                razorpay_subscription_id: linkResult.id,
                auto_renew: true
            });

            return res.status(200).json({
                success: true,
                message: 'Current subscription cancelled. Redirect user to the subscription link to activate the new plan.',
                data: {
                    subscription: newSubscription,
                    subscription_link: linkResult.short_url,
                    payment_link: linkResult.short_url,
                    new_plan_id: newPlan._id,
                    new_plan_name: newPlan.name
                }
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Plan change not supported for this subscription'
        });
    } catch (error) {
        console.error('Error changing subscription plan:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change subscription plan',
            error: error.message
        });
    }
};


export const getManagePortalUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const subscription = await Subscription.findOne({
            _id: id,
            user_id: userId,
            status: { $in: ['active', 'trial'] },
            deleted_at: null
        });

        if (!subscription) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Active subscription not found'
            });
        }

        if (subscription.payment_gateway !== 'stripe') {
            return res.status(400).json({
                success: false,
                message: 'Manage portal is only available for Stripe subscriptions'
            });
        }

        let stripeCustomerId = subscription.stripe_customer_id;
        if (!stripeCustomerId) {
            const user = await User.findById(userId).select('stripe_customer_id').lean();
            stripeCustomerId = user?.stripe_customer_id;
        }
        if (!stripeCustomerId) {
            const stripeSub = await StripeService.getSubscription(subscription.stripe_subscription_id);
            stripeCustomerId = typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer?.id;
        }
        if (!stripeCustomerId) {
            return res.status(400).json({
                success: false,
                message: 'Stripe customer ID not found. Unable to open subscription management.'
            });
        }

        const returnUrl = req.body.return_url || req.query.return_url ||
            process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        const { url } = await StripeService.createBillingPortalSession(stripeCustomerId, returnUrl);

        return res.status(200).json({
            success: true,
            message: 'Redirect user to manage subscription (cancel, update payment, etc.)',
            data: { portal_url: url }
        });
    } catch (error) {
        console.error('Error getting manage portal URL:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get manage portal URL',
            error: error.message
        });
    }
};


export const getSubscriptionUsage = async (req, res) => {
    try {
        const userId = req.user._id;

        const subscription = await Subscription.findOne({
            user_id: userId,
            deleted_at: null,
            $or: [
                { status: { $in: ['active', 'trial'] } },
                { payment_gateway: 'manual', status: 'pending' }
            ]
        }).populate('plan_id');

        if (!subscription) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No subscription found'
            });
        }

        const plan = subscription.plan_id;
        const features = plan?.features || {};

        const [tagsCount, contactsCount, templatesCount, campaignsCount] = await Promise.all([
            Tag.countDocuments({ created_by: userId, deleted_at: null }),
            Contact.countDocuments({ created_by: userId, deleted_at: null }),
            Template.countDocuments({ user_id: userId }),
            Campaign.countDocuments({ user_id: userId, deleted_at: null })
        ]);

        const limitOrUnlimited = (limit) => (limit > 0 ? limit : Infinity);
        const percentage = (used, limit) =>
            limit > 0 ? ((used / limit) * 100).toFixed(2) : 0;

        const usageDetails = {
            tags: {
                used: tagsCount,
                limit: features.tags ?? 0,
                percentage: percentage(tagsCount, features.tags ?? 0)
            },
            contacts: {
                used: contactsCount,
                limit: features.contacts ?? 0,
                percentage: percentage(contactsCount, features.contacts ?? 0)
            },
            template_bots: {
                used: templatesCount,
                limit: features.template_bots ?? 0,
                percentage: percentage(templatesCount, features.template_bots ?? 0)
            },
            campaigns: {
                used: campaignsCount,
                limit: features.campaigns ?? 0,
                percentage: percentage(campaignsCount, features.campaigns ?? 0)
            }
        };

        return res.status(200).json({
            success: true,
            data: {
                subscription_id: subscription._id,
                plan_name: plan.name,
                subscription_status: subscription.status,
                usage: usageDetails,
                period: {
                    start: subscription.current_period_start,
                    end: subscription.current_period_end
                }
            }
        });
    } catch (error) {
        console.error('Error retrieving subscription usage:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve subscription usage',
            error: error.message
        });
    }
};

export const getSubscriptionCheckoutUrl = async (req, res) => {
    try {
        const planId = req.query.plan_id || req.body?.plan_id;
        const userId = req.user._id;

        if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid plan_id is required'
            });
        }

        const plan = await Plan.findOne({
            _id: planId,
            is_active: true,
            deleted_at: null
        });

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found or inactive'
            });
        }

        if (!plan.stripe_payment_link_url) {
            return res.status(400).json({
                success: false,
                message: 'Plan does not have a Stripe payment link configured'
            });
        }

        const separator = plan.stripe_payment_link_url.includes('?') ? '&' : '?';
        const params = new URLSearchParams();
        params.set('client_reference_id', userId.toString());
        if (req.user?.email) {
            params.set('prefilled_email', req.user.email);
        }
        const checkoutUrl = `${plan.stripe_payment_link_url}${separator}${params.toString()}`;

        return res.status(200).json({
            success: true,
            data: {
                checkout_url: checkoutUrl,
                plan_id: plan._id,
                plan_name: plan.name
            }
        });
    } catch (error) {
        console.error('Error getting subscription checkout URL:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get checkout URL',
            error: error.message
        });
    }
};

export default {
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
};
