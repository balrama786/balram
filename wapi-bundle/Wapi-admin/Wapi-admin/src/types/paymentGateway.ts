// Payment Gateway types

export interface StripeSettings {
  stripe_publishable_key: string;
  stripe_secret_key_set?: boolean;
  stripe_secret_key: string;
  is_stripe_active?: boolean;
}

export interface RazorpaySettings {
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_key_secret_set?: string;
  razorpay_webhook_secret_set?: string;
  razorpay_webhook_secret: string;
  is_razorpay_active?: boolean;
}

export interface PayPalSettings {
  paypal_client_id: string;
  paypal_secret_key: string;
  paypal_secret_key_set?: boolean;
  paypal_mode: "sandbox" | "live";
  is_paypal_active?: boolean;
}

export type GatewayId = "stripe" | "razorpay" | "paypal";

export interface GatewayCardProps {
  title: string;
  isActive: boolean;
  onToggle: (active: boolean) => void;
}
