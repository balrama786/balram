/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from "lucide-react";

export interface Plan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  billing_cycle: "monthly" | "yearly" | "lifetime";
  features: {
    contacts: number;
    template_bots: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  stripe_price_id?: string;
  stripe_product_id?: string;
  stripe_payment_link_id?: string;
  stripe_payment_link_url?: string;
  razorpay_plan_id?: string;
  is_active: boolean;
  trial_days: number;
  is_featured?: boolean;
  description?: string;
  sort_order?: number;
}

export interface Subscription {
  _id: string;
  user_id: string;
  plan_id: string | Plan;
  status: "active" | "trial" | "expired" | "cancelled" | "suspended" | "pending";
  started_at: string;
  trial_ends_at?: string;
  current_period_start: string;
  current_period_end: string;
  expires_at?: string;
  cancelled_at?: string;
  payment_gateway: "stripe" | "razorpay" | "manual";
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  transaction_id?: string;
  amount_paid: number;
  currency: string;
  usage: {
    contacts_used?: number;
    template_bots_used?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  auto_renew: boolean;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  razorpay_subscription_id?: string;
  razorpay_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UsageDetails {
  used: number;
  limit: number;
  percentage: string;
}

export interface SubscriptionUsage {
  subscription_id: string;
  plan_name: string;
  usage: {
    contacts: UsageDetails;
    template_bots: UsageDetails;
  };
  period: {
    start: string;
    end: string;
  };
  days_left?: number;
  is_trial?: boolean;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: Subscription;
    payment_link?: string;
    client_secret?: string; // For Stripe
    razorpay_subscription_id?: string; // For Razorpay
    razorpay_key_id?: string; // For Razorpay
    plan_id?: string;
    plan_name?: string;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  data: Subscription;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface SubscriptionsListResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface UsageResponse {
  success: boolean;
  data: SubscriptionUsage;
}

export interface UsageMappingConfig {
  label: string;
  icon: LucideIcon;
  featureKey: string;
}

export interface UsageStatsGridProps {
  usageMapping: Record<string, UsageMappingConfig>;
  currentUsage: Record<string, number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activePlanFeatures: Record<string, any>;
}

export interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  mode?: "upgrade" | "downgrade" | "none";
  currentSubscriptionId?: string;
  currentPaymentGateway?: string;
}

export interface SubscriptionModal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentSubscription: any;
}

export interface PlanSliderProps {
  plans: Plan[];
  activePlanId?: string;
  mode?: "upgrade" | "downgrade" | "none";
  onSubscribe: (plan: Plan) => void;
  onBack: () => void;
}

export interface ActivePlanCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentSubscription: any;
}

export interface EmptyStateProps {
  onShowPlans: () => void;
}
