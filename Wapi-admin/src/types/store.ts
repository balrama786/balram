/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Faq {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetFaqsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetFaqsResponse {
  success: boolean;
  data: {
    faqs: Faq[];
    pagination: {
      total: number;
      totalItems: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface Testimonial {
  _id: string;
  title: string;
  user_name: string;
  user_post: string;
  description: string;
  status: boolean;
  rating?: number;
  user_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetTestimonialsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  rating?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetTestimonialsResponse {
  success: boolean;
  data: {
    testimonials: Testimonial[];
    pagination: {
      total: number;
      totalItems: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
  itemsPerPage: number;
}

export interface GetInquiriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetInquiriesResponse {
  success: boolean;
  data: {
    inquiries: Inquiry[];
    pagination: PaginationInfo;
  };
}

export interface GetInquiryByIdResponse {
  success: boolean;
  data: Inquiry;
}

export interface CreateInquiryRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CreateInquiryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
  };
}

export interface DeleteInquiryRequest {
  ids: string[];
}

export interface DeleteInquiryResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: string[];
    notFoundIds?: string[];
  };
}

export interface UpdateInquiryStatusRequest {
  isRead: boolean;
}

export interface UpdateInquiryStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    isRead: boolean;
  };
}

export interface PlanFeatures {
  contacts?: number;
  template_bots?: number;
  message_bots?: number;
  campaigns?: number;
  ai_prompts?: number;
  staff?: number;
  conversations?: number;
  bot_flow?: number;
  rest_api?: boolean;
  whatsapp_webhook?: boolean;
  auto_replies?: boolean;
  analytics?: boolean;
  priority_support?: boolean;
  custom_fields?: number;
  tags?: number;
  teams?: number;
}

export interface Plan {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  currency: Currency;
  billing_cycle: "monthly" | "yearly" | "lifetime" | "free Trial";
  trial_days: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  stripe_price_id?: string;
  stripe_product_id?: string;
  razorpay_plan_id?: string;
  features: PlanFeatures;
  taxes?: Tax[] | string[];
  created_at?: string;
  updated_at?: string;
}

export interface GetPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetPlansResponse {
  success: boolean;
  data: {
    plans: Plan[];
    pagination: PaginationInfo;
  };
}

export interface GetPlanByIdResponse {
  success: boolean;
  data: Plan;
}

export interface CreatePlanRequest {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  original_price?: number;
  currency?: string;
  billing_cycle: "monthly" | "yearly" | "lifetime" | "free Trial";
  trial_days?: number;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  stripe_price_id?: string;
  stripe_product_id?: string;
  razorpay_plan_id?: string;
  features?: PlanFeatures;
  taxes?: string[];
}

export type UpdatePlanRequest = Partial<CreatePlanRequest>;

export interface DeletePlanRequest {
  ids: string[];
}

export interface DeletePlanResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: string[];
  };
}

export interface PaymentGatewayConfig {
  enabled: boolean;
  title?: string;
  description?: string;
  publishable_key?: string;
  secret_key?: string;
  client_id?: string;
  key_id?: string;
  public_key?: string;
}

export interface PaymentGatewaysResponse {
  success: boolean;
  data: {
    offline_pay: {
      enabled: boolean;
      title: string;
      description: string;
    };
    stripe: {
      enabled: boolean;
      publishable_key: string;
      secret_key: string;
    };
    paypal: {
      enabled: boolean;
      client_id: string;
      secret_key: string;
    };
    razorpay: {
      enabled: boolean;
      key_id: string;
      key_secret: string;
    };
    paystack: {
      enabled: boolean;
      public_key: string;
      secret_key: string;
    };
  };
}

export interface UpdatePaymentGatewaysRequest {
  offline_pay?: {
    enabled: boolean;
    title?: string;
    description?: string;
  };
  stripe?: {
    enabled: boolean;
    publishable_key?: string;
    secret_key?: string;
  };
  paypal?: {
    enabled: boolean;
    client_id?: string;
    secret_key?: string;
  };
  razorpay?: {
    enabled: boolean;
    key_id?: string;
    key_secret?: string;
  };
  paystack?: {
    enabled: boolean;
    public_key?: string;
    secret_key?: string;
  };
}

export interface PaymentHistory {
  _id: string;
  user_id: string;
  subscription_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  payment_gateway: string;
  invoice_number?: string;
  invoice_url?: string;
  paid_at: string;
  refunded_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  plan?: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    billing_cycle: string;
  };
}

export interface GetPaymentHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
  payment_status?: string;
  payment_gateway?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetPaymentHistoryResponse {
  success: boolean;
  data: {
    payments: PaymentHistory[];
    pagination: PaginationInfo;
  };
}

export interface Subscription {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  plan: {
    _id: string;
    name: string;
    price: number;
    billing_cycle: string;
    features?: PlanFeatures;
    currency?: Currency;
  };
  status: "active" | "trial" | "expired" | "cancelled" | "suspended" | "pending";
  amount: number;
  amount_paid: number;
  currency: string;
  payment_id?: string;
  payment_gateway: string;
  payment_method?: string;
  payment_status?: string;
  transaction_id?: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  current_period_end: string;
  current_period_start: string;
}

export interface GetSubscriptionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  is_expiring_soon?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetSubscriptionSummaryResponse {
  success: boolean;
  data: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    expiringSoonSubscriptions: number;
    monthlyRevenue: number;
  };
}

export interface GetSubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
    pagination: PaginationInfo;
  };
}

export interface Language {
  _id: string;
  name: string;
  locale: string;
  is_rtl: boolean;
  is_active: boolean;
  translation_json: any;
  flag: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetLanguagesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetLanguagesResponse {
  success: boolean;
  data: {
    languages: Language[];
    pagination: PaginationInfo;
  };
}

export interface GetLanguageByIdResponse {
  success: boolean;
  data: Language;
}

export interface CreateLanguageRequest {
  name: string;
  locale: string;
  is_rtl?: boolean;
  is_active?: boolean;
  translation_json?: File;
  flag?: File;
}

export type UpdateLanguageRequest = Partial<CreateLanguageRequest>;

export interface DeleteLanguageResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: string[];
  };
}

export interface Currency {
  _id: string;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  decimal_number: number;
  is_active: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetCurrenciesParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface GetCurrenciesResponse {
  success: boolean;
  data: {
    currencies: Currency[];
    pagination: PaginationInfo;
  };
}

export interface GetCurrencyByIdResponse {
  success: boolean;
  data: Currency;
}

export interface CreateCurrencyRequest {
  name: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  decimal_number: number;
  is_active: boolean;
}

export type UpdateCurrencyRequest = Partial<CreateCurrencyRequest>;

export interface DeleteCurrencyResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: string[];
    usedIds?: string[];
    notFoundIds?: string[];
  };
}

export interface AIModel {
  _id: string;
  name: string;
  display_name: string;
  provider: "openai" | "anthropic" | "google" | "cohere" | "mistral" | "groq" | "custom";
  model_id: string;
  apiEndpoint: string;
  api_endpoint: string;
  api_key?: string;
  api_version?: string;
  capabilities: {
    translate: boolean;
    summarize: boolean;
    improve: boolean;
    formalize: boolean;
    casualize: boolean;
    reply_suggestion: boolean;
  };
  config: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  headers_template: Record<string, string>;
  request_format: "openai" | "anthropic" | "google" | "custom";
  response_path: string;
  status: "active" | "inactive";
  is_default: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetAIModelsParams {
  page?: number;
  limit?: number;
  search?: string;
  provider?: string;
  capability?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetAIModelsResponse {
  success: boolean;
  data: {
    models: AIModel[];
    pagination: PaginationInfo;
  };
}

export interface GetAIModelByIdResponse {
  success: boolean;
  data: AIModel;
}

export interface CreateAIModelRequest {
  displayName: string;
  provider: string;
  modelId: string;
  api_endpoint?: string;
  apiEndpoint?: string;
  apiKey?: string;
  apiVersion?: string;
  capabilities?: Partial<AIModel["capabilities"]>;
  config?: AIModel["config"] & Record<string, any>;
  headersTemplate?: Record<string, string>;
  requestFormat?: string;
  responsePath?: string;
  description?: string;
  status?: "active" | "inactive";
  is_default?: boolean;
}

export type UpdateAIModelRequest = Partial<CreateAIModelRequest>;

export type UserRole = "user" | "agent" | "super_admin";

export interface UserSubscription {
  _id: string;
  status: string;
  started_at?: string;
  trial_ends_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  expires_at?: string;
  cancelled_at?: string;
  payment_gateway?: string;
  payment_method?: string;
  payment_status?: string;
  auto_renew?: boolean;
}

export interface UserPlan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  billing_cycle: string;
  features?: Record<string, unknown>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  role_id?: string | Role;
  status: boolean;
  country?: string | null;
  country_code?: string | null;
  note?: string | null;
  email_verified: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
  current_subscription?: UserSubscription | null;
  current_plan?: UserPlan | null;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
  role?: UserRole | "all";
  status?: boolean;
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  country_code?: string;
  note?: string;
  role?: UserRole;
  role_id?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  country_code?: string;
  note?: string;
  role?: UserRole;
  role_id?: string;
  status?: boolean;
  email_verified?: boolean;
}

// ─── Admin Templates ─────────────────────────────────────────────────────────

export type AdminTemplateSector = "healthcare" | "ecommerce" | "fashion" | "financial_service" | "general";

export interface AdminTemplateHeader {
  format?: string;
  text?: string;
  media_type?: string;
  media_url?: string;
  handle?: string;
}

export interface AdminTemplateButton {
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
  website_url?: string;
  example?: string[];
}

export interface AdminTemplate {
  _id: string;
  template_name: string;
  language: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  status: "draft" | "pending" | "approved" | "rejected";
  sector?: AdminTemplateSector;
  template_category?: string;
  is_admin_template: boolean;
  header?: AdminTemplateHeader;
  message_body?: string;
  footer_text?: string;
  buttons?: AdminTemplateButton[];
  template_type?: string;
  is_limited_time_offer?: boolean;
  offer_text?: string;
  has_expiration?: boolean;
  call_permission?: boolean;
  variables_example?: { key: string; example: string }[];
  carousel_cards?: any[];
  authentication_options?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface GetAdminTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  sector?: string;
  category?: string;
  template_category?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetAdminTemplatesResponse {
  success: boolean;
  data: {
    templates: AdminTemplate[];
    pagination: PaginationInfo;
  };
}

export interface ShortLink {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  short_code: string;
  mobile: string;
  first_message: string;
  click_count: number;
  short_link: string;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface GetShortLinksParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface GetShortLinksResponse {
  success: boolean;
  data: {
    short_links: ShortLink[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_image?: string;
  status: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GetPagesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetPagesResponse {
  success: boolean;
  data: {
    pages: Page[];
    pagination: PaginationInfo;
  };
}

export interface Tax {
  _id: string;
  name: string;
  rate: number;
  type: "percentage" | "fixed";
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetTaxesParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface GetTaxesResponse {
  success: boolean;
  data: {
    taxes: Tax[];
    total: number;
    pagination?: PaginationInfo;
  };
}

export interface PermissionSubmodule {
  name: string;
  slug: string;
  description?: string;
}

export interface Permission {
  _id: string;
  module: string;
  description?: string;
  submodules: PermissionSubmodule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  sort_order?: number;
  system_reserved?: boolean;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface GetRolesResponse {
  success: boolean;
  data: {
    roles: Role[];
    pagination: PaginationInfo;
  };
}

export interface GetRoleByIdResponse {
  success: boolean;
  data: Role & { permissions: string[] };
}

export interface GetPermissionsResponse {
  success: boolean;
  data: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  status?: "active" | "inactive";
  sort_order?: number;
  permissions?: string[];
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;
