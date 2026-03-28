import { ReactNode } from "react";

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  section?: string;
  isActive?: boolean;
  order: number;
}

export interface SidebarProps {
  onMenuClick?: (label: string) => void;
  activeMenu?: string;
}

export interface SearchResult {
  label: string;
  path: string;
  icon: ReactNode;
  section?: string;
}

export interface ManageWabaColumn {
  id: string;
  registred_phone_number: string;
  phone_number_id: string;
  name: string;
  whatsapp_business_account_id: string;
  app_id: string;
  is_active: boolean;
  verified_name: string | null;
  quality_rating: string | null;
  created_at: string;
  updated_at: string;
  business_app?: string;
  throughput?: string;
  phone_numbers?: {
    id: string;
    phone_number_id: string;
    display_phone_number: string;
    is_active: boolean;
  }[];
  phone_numbers_count: number;
}

export interface Tag {
  _id: string;
  label: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  _id: string;
  name: string;
  email: string;
  password?: string;
  note?: string;
  country_code: string;
  phone: string;
  status: boolean;
  is_phoneno_hide?: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  _id: string;
  name: string;
  phone_number: string;
  source?: string;
  email?: string;
  assigned_to?: string;
  tags?: string[];
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom_fields?: Record<string, any>;
  allow_duplicate?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  _id: string;
  label: string;
  name: string;
  type: string;
  is_active: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  options?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomFieldType {
  label: string;
  value: string;
}

export interface CommonHeaderProps {
  backBtn?: boolean;
  title: string;
  description: string;
  onSearch?: (value: string) => void;
  searchTerm?: string;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  onSync?: () => void;
  onSyncStatus?: () => void;
  onExport?: () => void;
  isExportDisabled?: boolean;
  onAddClick?: () => void;
  addLabel?: string;
  isLoading?: boolean;
  isSyncingStatus?: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  onBulkDelete?: () => void;
  selectedCount?: number;
  rightContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  featureKey?: string;
  onToggleSidebar?: () => void;
  children?: React.ReactNode;
}

export interface Attachment {
  _id: string;
  original_name: string;
  encoding: string;
  mimeType: string;
  fileName: string;
  path: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  updated_at: string;
  title?: string;
  caption?: string;
  description?: string;
  uploaded_by?: string;
}

export interface AttachmentResponse {
  data: {
    attachments: Attachment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

export interface TemplateHeader {
  format: "text" | "media";
  text?: string;
  media_type?: "image" | "video" | "document" | "location";
  media_url?: string;
  handle?: string;
}

export interface TemplateButton {
  type: "phone_call" | "website" | "quick_reply" | "copy_code" | "catalog";
  text: string;
  phone_number?: string;
  website_url?: string;
}

export interface TemplateVariable {
  key: string;
  example: string;
}

export interface Template {
  _id: string;
  user_id: string;
  waba_id: string;
  template_name: string;
  language: string;
  category: string;
  status: string;
  header?: TemplateHeader;
  message_body: string;
  body_variables?: TemplateVariable[];
  variables_example?: TemplateVariable[];
  variables?: TemplateVariable[];
  footer_text?: string;
  buttons?: TemplateButton[];
  meta_template_id?: string;
  is_limited_time_offer?: boolean;
  offer_text?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  failed_count: number;
  pending_count: number;
}

export interface Recipient {
  phone_number: string;
  status: "sent" | "delivered" | "read" | "failed" | "pending";
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failure_reason?: string;
}

export interface Campaign {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  user_id: string;
  waba_id: string | ManageWabaColumn; // Update to allow populated object
  template_id: string;
  template_name: string;
  language_code: string;
  recipient_type: "specific_contacts" | "all_contacts" | "tags";
  specific_contacts?: string[];
  tag_ids?: string[];
  variables_mapping?: Record<string, string>;
  media_url?: string;
  is_scheduled: boolean;
  scheduled_at?: string;
  sent_at: string;
  completed_at?: string;
  status: "draft" | "scheduled" | "sending" | "completed" | "failed" | "cancelled";
  stats: CampaignStats;
  recipients?: Recipient[];
  created_at: string;
  updated_at: string;
}

export interface CampaignFormValues {
  name: string;
  description: string;
  waba_id: string;
  template_id: string;
  variables_mapping: Record<string, string>;
  recipient_type: "all_contacts" | "specific_contacts" | "tags";
  specific_contacts: string[];
  tag_ids: string[];
  media_url: string;
  is_scheduled: boolean;
  scheduled_at: string;
  // Template-specific campaign fields
  coupon_code?: string;
  offer_expiration_minutes?: string;
  thumbnail_product_retailer_id?: string;
  carousel_cards_data?: {
    header: { type: string; link: string };
    body: { text: string };
    buttons: { type: string; text: string; url_value?: string; payload?: string }[];
  }[];
  carousel_products?: {
    product_retailer_id: string;
    catalog_id: string;
  }[];
}

