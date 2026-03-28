export type SectorKey = 'healthcare' | 'ecommerce' | 'fashion' | 'financial_service' | 'general';

export const SECTORS: SectorKey[] = [
  'healthcare',
  'ecommerce',
  'fashion',
  'financial_service',
  'general',
];

export const SECTOR_LABELS: Record<SectorKey, string> = {
  healthcare: 'Healthcare',
  ecommerce: 'E-Commerce',
  fashion: 'Fashion',
  financial_service: 'Financial Service',
  general: 'General',
};

export const SECTOR_TEMPLATE_CATEGORIES: Record<SectorKey, string[]> = {
  healthcare: [
    'appointment_booking',
    'appointment_reminder',
    'lab_reports',
    'prescription_ready',
    'health_tips',
  ],
  ecommerce: [
    'order_summary',
    'order_management',
    'order_tracking',
    'new_arrivals',
    'cart_reminder',
    'delivery_update',
    'payment_confirmation',
    'return_refund',
  ],
  fashion: [
    'new_collection',
    'sale_offer',
    'style_recommendation',
    'back_in_stock',
    'order_update',
  ],
  financial_service: [
    'transaction_alert',
    'payment_due_reminder',
    'loan_update',
    'kyc_update',
    'policy_update',
  ],
  general: [
    'customer_feedback',
    'welcome_message',
    'promotion',
    'announcement',
    'reminder',
  ],
};
