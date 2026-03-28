/* eslint-disable @typescript-eslint/no-explicit-any */

export type MatchingMethod = "exact" | "contains" | "partial" | "starts_with" | "ends_with";

export type KeywordActionReplyType =
  | "text"
  | "media"
  | "template"
  | "catalog"
  | "chatbot"
  | "agent"
  | "sequence";

export interface KeywordAction {
  _id: string;
  user_id: string;
  waba_id: string;
  keywords: string[];
  matching_method: MatchingMethod;
  partial_percentage?: number;
  reply_type: KeywordActionReplyType;
  reply_id: any; // populated
  reply_type_ref: string;
  variables_mapping?: Record<string, any>;
  media_url?: string;
  carousel_cards_data?: any[];
  coupon_code?: string;
  catalog_id?: string;
  product_retailer_id?: string;
  status: "active" | "inactive";
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KeywordActionPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface KeywordActionsResponse {
  success: boolean;
  data: KeywordAction[];
  pagination: KeywordActionPagination;
}

export interface KeywordActionResponse {
  success: boolean;
  message?: string;
  data: KeywordAction;
}

export interface BulkDeleteKeywordActionsResponse {
  success: boolean;
  message?: string;
  data?: { deletedCount: number };
}

export interface KeywordActionCreatePayload {
  waba_id: string;
  keywords: string[];
  matching_method: MatchingMethod;
  partial_percentage?: number;
  reply_type: KeywordActionReplyType;
  reply_id: string;
  variables_mapping?: Record<string, string>;
  media_url?: string;
  carousel_cards_data?: any[];
  coupon_code?: string;
  catalog_id?: string;
  product_retailer_id?: string;
}

export interface KeywordActionUpdatePayload extends Partial<KeywordActionCreatePayload> {
  status?: "active" | "inactive";
}

// Step state for the multi-step wizard
export interface KeywordActionWizardStep1 {
  keywords: string[];
  matching_method: MatchingMethod;
  partial_percentage: number;
}

export interface KeywordActionWizardStep2 {
  reply_type: KeywordActionReplyType;
  reply_id: string;
  reply_type_ref: string;
}

export interface KeywordActionWizardStep3 {
  variables_mapping: Record<string, string>;
  media_url?: string;
  carousel_cards_data?: any[];
  coupon_code?: string;
  catalog_id?: string;
  product_retailer_id?: string;
}
