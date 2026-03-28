import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let cachedStripe = null;
let cachedStripeKey = null;

function getStripeInstance() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (cachedStripe && cachedStripeKey === key) return cachedStripe;
  cachedStripeKey = key;
  cachedStripe = new Stripe(key);
  return cachedStripe;
}

const stripe = new Proxy({}, {
  get(_, prop) {
    const s = getStripeInstance();
    if (!s) return undefined;
    return s[prop];
  }
});

export function getStripe() {
  return getStripeInstance();
}

let cachedRazorpay = null;
let cachedRazorpayKey = null;

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  const key = `${keyId}:${keySecret}`;
  if (cachedRazorpay && cachedRazorpayKey === key) return cachedRazorpay;
  cachedRazorpayKey = key;
  cachedRazorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  console.log("cachedRazorpay" , cachedRazorpay)
  return cachedRazorpay;
}

const razorpay = new Proxy({}, {
  get(_, prop) {
    const r = getRazorpayInstance();
    if (!r) return undefined;
    return r[prop];
  }
});

export function getRazorpay() {
  return getRazorpayInstance();
}

const getStripeErrorMessage = (error, fallback) =>
    (error && typeof error.message === 'string') ? error.message : fallback;

const getRazorpayErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    const msg = error.error?.description || error.description || error.message;
    return (typeof msg === 'string') ? msg : fallback;
};

export const calculatePeriodEnd = (startDate, billingCycle) => {
    const start = new Date(startDate);
    const end = new Date(start);

    switch (billingCycle) {
        case 'monthly':
            end.setMonth(end.getMonth() + 1);
            break;
        case 'yearly':
            end.setFullYear(end.getFullYear() + 1);
            break;
        case 'lifetime':
            end.setFullYear(end.getFullYear() + 100);
            break;
        default:
            end.setMonth(end.getMonth() + 1);
    }

    return end;
};


export const StripeService = {

    async createOrGetCustomer(user) {
        try {
            if (user.stripe_customer_id) {
                const customer = await stripe.customers.retrieve(user.stripe_customer_id);
                if (!customer.deleted) {
                    return customer;
                }
            }

            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                phone: user.phone,
                metadata: {
                    user_id: user._id.toString()
                }
            });

            return customer;
        } catch (error) {
            console.error('Error creating Stripe customer:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to create Stripe customer'));
        }
    },


    async createSubscription(customerId, priceId, trialDays = 0) {
        try {
            const subscriptionData = {
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                    payment_method_types: ['card']
                },
                expand: ['latest_invoice.payment_intent']
            };

            if (trialDays > 0) {
                subscriptionData.trial_period_days = trialDays;
            }

            const subscription = await stripe.subscriptions.create(subscriptionData);
            return subscription;
        } catch (error) {
            console.error('Error creating Stripe subscription:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to create Stripe subscription'));
        }
    },

    async attachPaymentMethod(paymentMethodId, customerId) {
        try {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId
            });

            await stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });

            return true;
        } catch (error) {
            console.error('Error attaching payment method:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to attach payment method'));
        }
    },


    async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
        try {
            if (cancelAtPeriodEnd) {
                return await stripe.subscriptions.update(subscriptionId, {
                    cancel_at_period_end: true
                });
            } else {
                return await stripe.subscriptions.cancel(subscriptionId);
            }
        } catch (error) {
            console.error('Error canceling Stripe subscription:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to cancel Stripe subscription'));
        }
    },


    async resumeSubscription(subscriptionId) {
        try {
            return await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: false
            });
        } catch (error) {
            console.error('Error resuming Stripe subscription:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to resume Stripe subscription'));
        }
    },


    async updateSubscription(subscriptionId, newPriceId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            return await stripe.subscriptions.update(subscriptionId, {
                items: [{
                    id: subscription.items.data[0].id,
                    price: newPriceId
                }],
                proration_behavior: 'create_prorations'
            });
        } catch (error) {
            console.error('Error updating Stripe subscription:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to update Stripe subscription'));
        }
    },

    async getSubscription(subscriptionId) {
        try {
            return await stripe.subscriptions.retrieve(subscriptionId);
        } catch (error) {
            console.error('Error retrieving Stripe subscription:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to retrieve Stripe subscription'));
        }
    },


    async createBillingPortalSession(customerId, returnUrl) {
        try {
            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: returnUrl
            });
            return { url: session.url };
        } catch (error) {
            console.error('Error creating Stripe billing portal session:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to create billing portal session'));
        }
    },


    async createProduct(name, description = null, metadata = {}) {
        try {
            const product = await stripe.products.create({
                name,
                description: description || undefined,
                metadata
            });
            return product;
        } catch (error) {
            console.error('Error creating Stripe product:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to create Stripe product'));
        }
    },


    async createPrice(productId, plan) {
        try {
            const currency = (plan.currency || 'usd').toLowerCase();
            const amount = plan.price;
            const unitAmount = Math.round(amount * 100);

            const isRecurring = plan.billing_cycle === 'monthly' || plan.billing_cycle === 'yearly';
            const priceParams = {
                product: productId,
                currency,
                unit_amount: unitAmount,
                metadata: { plan_slug: plan.slug || '' }
            };

            if (isRecurring) {
                priceParams.recurring = {
                    interval: plan.billing_cycle === 'yearly' ? 'year' : 'month'
                };
            }

            const price = await stripe.prices.create(priceParams);
            return price;
        } catch (error) {
            console.error('Error creating Stripe price:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to create Stripe price'));
        }
    },


    async createPaymentLink(priceId, options = {}) {
        try {
            const params = {
                line_items: [{ price: priceId, quantity: 1 }],
                metadata: options.metadata || {}
            };
            if (options.afterCompletionUrl) {
                params.after_completion = {
                    type: 'redirect',
                    redirect: { url: options.afterCompletionUrl }
                };
            }
            const paymentLink = await stripe.paymentLinks.create(params);
            return { id: paymentLink.id, url: paymentLink.url };
        } catch (error) {
            console.error('Error creating Stripe payment link:', error);
            throw new Error(getStripeErrorMessage(error, 'Failed to create Stripe payment link'));
        }
    },


    async createPriceAndPaymentLinkForExistingProduct(plan, productId) {
        try {
            if (!process.env.STRIPE_SECRET_KEY || !productId) return null;
            const price = await this.createPrice(productId, plan);
            const paymentLink = await this.createPaymentLink(price.id, {
                metadata: { plan_id: plan._id.toString() }
            });
            return {
                priceId: price.id,
                paymentLinkId: paymentLink.id,
                paymentLinkUrl: paymentLink.url
            };
        } catch (error) {
            console.error('Error creating Stripe price/payment link for plan update:', error);
            throw error;
        }
    },


    async createProductPriceAndPaymentLink(plan) {
        try {
            if (!process.env.STRIPE_SECRET_KEY) return null;

            const product = await this.createProduct(
                plan.name,
                plan.description || undefined,
                { plan_id: plan._id.toString() }
            );

            const price = await this.createPrice(product.id, plan);

            const paymentLink = await this.createPaymentLink(price.id, {
                metadata: { plan_id: plan._id.toString() }
            });

            return {
                productId: product.id,
                priceId: price.id,
                paymentLinkId: paymentLink.id,
                paymentLinkUrl: paymentLink.url
            };
        } catch (error) {
            console.error('Error creating Stripe product/price/payment link for plan:', error);
            return null;
        }
    }
};


export const RazorpayService = {

    async createOrGetCustomer(user) {
        try {
            if (user.razorpay_customer_id) {
                try {
                    const customer = await razorpay.customers.fetch(user.razorpay_customer_id);
                    return customer;
                } catch (error) {
                }
            }

            const customer = await razorpay.customers.create({
                name: user.name,
                email: user.email,
                contact: user.phone,
                fail_existing: 0,
                notes: {
                    user_id: user._id.toString()
                }
            });

            return customer;
        } catch (error) {
            console.error('Error creating Razorpay customer:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to create Razorpay customer'));
        }
    },


    async createSubscription(customerId, planId, totalCount = 0, startAt = null) {
        try {
            const subscriptionData = {
                plan_id: planId,
                customer_id: customerId,
                total_count: totalCount,
                quantity: 1,
                notify: 1,
                notes: {
                    created_by: 'wapi_app'
                }
            };

            if (startAt) {
                subscriptionData.start_at = Math.floor(new Date(startAt).getTime() / 1000);
            }

            const subscription = await razorpay.subscriptions.create(subscriptionData);
            return subscription;
        } catch (error) {
            console.error('Error creating Razorpay subscription:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to create Razorpay subscription'));
        }
    },

    async cancelSubscription(subscriptionId, immediate = false) {
        try {
            const cancelType = immediate ? 0 : 1;

            const response = await razorpay.subscriptions.cancel(
                subscriptionId,
                cancelType
            );

            console.log('Razorpay cancel response:', response);
            return response;
        } catch (error) {
            console.error('Error canceling Razorpay subscription:', error?.error || error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to cancel Razorpay subscription'));
        }
    },

    async pauseSubscription(subscriptionId) {
        try {
            return await razorpay.subscriptions.pause(subscriptionId);
        } catch (error) {
            console.error('Error pausing Razorpay subscription:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to pause Razorpay subscription'));
        }
    },


    async resumeSubscription(subscriptionId) {
        try {
            return await razorpay.subscriptions.resume(subscriptionId);
        } catch (error) {
            console.error('Error resuming Razorpay subscription:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to resume Razorpay subscription'));
        }
    },


    async updateSubscription(subscriptionId, updateData) {
        try {
            return await razorpay.subscriptions.update(subscriptionId, updateData);
        } catch (error) {
            console.error('Error updating Razorpay subscription:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to update Razorpay subscription'));
        }
    },


    async getSubscription(subscriptionId) {
        try {
            return await razorpay.subscriptions.fetch(subscriptionId);
        } catch (error) {
            console.error('Error retrieving Razorpay subscription:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to retrieve Razorpay subscription'));
        }
    },


    verifyPaymentSignature(razorpayPaymentId, razorpaySubscriptionId, razorpaySignature) {
        try {
            const generatedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpayPaymentId}|${razorpaySubscriptionId}`)
                .digest('hex');

            return generatedSignature === razorpaySignature;
        } catch (error) {
            console.error('Error verifying payment signature:', error);
            return false;
        }
    },

    verifyWebhookSignature(body, signature) {
        try {
            const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
            if (!secret) return false;

            const bodyString = typeof body === 'string'
                ? body
                : JSON.stringify(body);

            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(bodyString)
                .digest('hex');

            return expectedSignature === signature;
        } catch (error) {
            console.error('Error verifying webhook signature:', error);
            return false;
        }
    },

    async createPlan(plan) {
        try {
            const currency = (plan.currency || 'INR').toUpperCase();
            console.log("currency" , currency)
            const amount = Math.max(100, Math.round((plan.price || 0) * 100));
            const period = (plan.billing_cycle === 'yearly' || plan.billing_cycle === 'lifetime') ? 'yearly' : 'monthly';
            const interval = 1;

            const item = {
                name: plan.name || 'Plan',
                amount,
                currency,
                description: (plan.description || '').substring(0, 500)
            };

            const notes = { plan_id: plan._id?.toString() || '' };

            const created = await razorpay.plans.create({
                period,
                interval,
                item,
                notes
            });

            return created;
        } catch (error) {
            console.error('Error creating Razorpay plan:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to create Razorpay plan'));
        }
    },


    async createSubscriptionLink(planId, userId, options = {}) {
        try {
            const billingCycle = options.billingCycle || 'monthly';
            const totalCount = options.totalCount != null
                ? options.totalCount
                : 10;

            const payload = {
                plan_id: planId,
                total_count: totalCount,
                quantity: 1,
                customer_notify: options.customerNotify !== false,
                notes: {
                    user_id: userId.toString(),
                    ...(options.planIdDb && { plan_id_db: options.planIdDb.toString() })
                }
            };

            if (options.expireBy) {
                payload.expire_by = Math.floor(new Date(options.expireBy).getTime() / 1000);
            }

            if (options.notifyEmail || options.notifyPhone) {
                payload.notify_info = {};
                if (options.notifyEmail) payload.notify_info.notify_email = options.notifyEmail;
                if (options.notifyPhone) payload.notify_info.notify_phone = options.notifyPhone;
            }

            const subscription = await razorpay.subscriptions.create(payload);
            return {
                id: subscription.id,
                short_url: subscription.short_url
            };
        } catch (error) {
            console.error('Error creating Razorpay subscription link:', error);
            throw new Error(getRazorpayErrorMessage(error, 'Failed to create Razorpay subscription link'));
        }
    }
};

export { stripe, razorpay };
