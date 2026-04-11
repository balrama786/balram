/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Faq, Inquiry, Plan, Subscription, Testimonial } from "./store";

export interface TestimonialListProps {
  testimonials: Testimonial[];
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onUpdate: (id: string, data: FormData) => void;
  onUpdateStatus?: (id: string, status: boolean) => void;
  isLoading: boolean;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  total?: number;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  onSelectionChange?: (ids: string[]) => void;
  selectedIds?: string[];
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export interface EditTestimonialModalProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: FormData) => void;
  isLoading: boolean;
}

export interface AddTestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (testimonial: FormData) => void;
  isLoading: boolean;
}

export interface AddFaqFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (faq: { title: string; description: string; status: boolean }) => void;
  isLoading: boolean;
}

export interface EditFaqModalProps {
  faq: Faq | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: { title: string; description: string; status: boolean }) => void;
  isLoading: boolean;
}

export interface AddTestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: FormData) => void;
  isLoading: boolean;
}

export interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  isSubmitDisabled?: boolean;
  maxWidth?: string;
  maxHeight?: string;
}

export interface FaqHeaderProps {
  onRefresh: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
  onFilter?: () => void;
  isLoading: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
}

export interface FaqListProps {
  faqs: Faq[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onUpdate: (id: string, data: { title: string; description: string; status: boolean }) => void;
  isLoading: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  limit?: number;
  onLimitChange?: (limit: number) => void;
  onSelectionChange?: (ids: string[]) => void;
  selectedIds?: string[];
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export interface FaqTableProps {
  faqs: Faq[];
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onUpdate: (id: string, data: { title: string; description: string; status: boolean }) => void;
  isLoading: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface HeaderIconButtonProps {
  icon: React.ReactNode;
  label: string;
  showDot?: boolean;
}

export interface InquiryHeaderProps {
  onRefresh: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
  isLoading: boolean;
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
}

export interface CommonHeaderProps {
  title: string;
  description: string;
  onSearch?: (value: string) => void;
  searchTerm?: string;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  onExport?: (format: "csv" | "excel" | "pdf") => void;
  onAddClick?: () => void;
  addLabel?: string;
  isLoading: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
  bulkActionLoading?: boolean;
  extraActions?: React.ReactNode;
}

export interface InquiryListProps {
  inquiries: Inquiry[];
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onUpdateStatus: (id: string, isRead: boolean) => void;
  isLoading: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  onSelectionChange?: (ids: string[]) => void;
  selectedIds?: string[];
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { status?: string; rating?: string }) => void;
  currentFilters?: { status?: string; rating?: string };
}

export interface PlanFeaturesProps {
  features: {
    contacts: string;
    template_bots: string;
    message_bots: string;
    campaigns: string;
    ai_prompts: string;
    staff: string;
    conversations: string;
    bot_flow: string;
    rest_api: boolean;
    whatsapp_webhook: boolean;
    auto_replies: boolean;
    analytics: boolean;
    priority_support: boolean;
    custom_fields: string;
    tags: string;
    teams: string;
  };
  onFeatureChange: (field: string, value: string | boolean) => void;
}

export interface PlanBasicInfoProps {
  formData: {
    name: string;
    slug: string;
    description: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

export interface PlanCardProps {
  plan: Plan;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  isHighlighted?: boolean;
}

export interface PlanHeaderProps {
  isLoading?: boolean;
  onFreeTrialClick?: () => void;
}

export interface PlanListProps {
  plans: Plan[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export interface PlanPricingProps {
  formData: {
    price: string;
    original_price: string;
    currency: string;
    billing_cycle: "monthly" | "yearly" | "lifetime" | "free Trial";
    trial_days: string;
    sort_order: string;
    taxes: string[];
  };
  onFieldChange: (field: string, value: any) => void;
}

export interface FeatureNumericInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export interface FeatureToggleProps {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface PlanStatusProps {
  formData: {
    is_featured: boolean;
    is_active: boolean;
  };
  onFieldChange: (field: string, value: boolean) => void;
}

export interface SubscriptionPlansSummaryProps {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  expiringSoonSubscriptions: number;
  monthlyRevenue: number;
  isLoading: boolean;
  onCardClick?: (filterType: string) => void;
  activeFilter?: string;
}

export interface PlanWithSubscribers extends Plan {
  subscriber_count?: number;
  active_subscriber_count?: number;
}

export interface SubscriptionPlansTableProps {
  subscriptions: Subscription[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface SubscriptionPlansSearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onFilter: () => void;
  onExport: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  isLoading: boolean;
  canExport: boolean;
}

export interface SubscriptionPlansHeaderProps {
  onCreatePlan: () => void;
  isLoading: boolean;
}

export interface FilterOptions {
  status?: string;
  billing_cycle?: string;
  is_featured?: string;
  is_expiring_soon?: boolean;
}

export interface SubscriptionFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions;
}

export interface PlanWithSubscribers extends Plan {
  subscriber_count?: number;
  active_subscriber_count?: number;
}

export interface OfflinePayFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export interface PaymentGatewayHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  isFetching: boolean;
}

export interface PlanWithSubscribers extends Plan {
  subscriber_count?: number;
  active_subscriber_count?: number;
}

export interface PlanWithSubscribers extends Plan {
  subscriber_count?: number;
  active_subscriber_count?: number;
}

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  hasSubmenu?: boolean;
  active?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
  collapsed: boolean;
}

export interface SubNavItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SectionHeaderProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  collapsed: boolean;
}

export interface LanguageHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  onFilter?: () => void;
  isLoading: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
}

export interface CurrencyHeaderProps {
  onSearch: (value: string) => void;
  searchTerm: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isLoading: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
  onAddClick?: () => void;
}
