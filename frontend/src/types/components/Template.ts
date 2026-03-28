import { Template } from "../components";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UseTemplateFormProps {
  wabaId: string;
  templateId?: string;
  adminTemplateId?: string;
}

export type OTPType = "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";

export interface OTPButton {
  otp_type: OTPType;
  copy_button_text?: string;
}

export interface AuthFormData {
  message_body: string;
  footer_text: string;
  add_security_recommendation: boolean;
  code_expiration_minutes: number | "";
  otp_code_length: number | "";
  otp_buttons: OTPButton[];
  variables_example: { key: string; example: string }[];
}

export interface AuthenticationSectionProps {
  authData: AuthFormData;
  setAuthData: (data: AuthFormData) => void;
}

export type MarketingType = "none" | "limited_time_offer" | "coupon_code" | "catalog" | "call_permission" | "carousel_product" | "carousel_media";

export interface MarketingTypeOption {
  label: string;
  value: MarketingType;
  icon: React.ReactNode;
  description: string;
}

export interface BodySectionProps {
  messageBody: string;
  handleBodyChange: (data: string) => void;
  addVariable: () => void;
  setEditor: (editor: any) => void;
  variables_example: { key: string; example: string }[];
  updateVariable: (index: number, value: string) => void;
}

export interface ButtonSectionProps {
  interactiveType: string;
  setInteractiveType: (type: string) => void;
  buttons: any[];
  addButton: (type: "quick_reply" | "website" | "phone_call" | "copy_code") => void;
  removeButton: (id: string) => void;
  updateButton: (id: string, updates: any) => void;
  interactiveActions: { label: string; value: string }[];
  isLimitedTimeOffer?: boolean;
}

export interface ButtonTemplate {
  id: string;
  type: "url" | "quick_reply";
}

export interface CardButtonValue {
  templateId: string;
  text: string;
  url?: string;
}

export interface MediaCard {
  id: string;
  body_text: string;
  file: File | null;
  buttonValues: CardButtonValue[];
}

export interface CarouselMediaSectionProps {
  buttonTemplates: ButtonTemplate[];
  cards: MediaCard[];
  onAddButtonTemplate: (type: "url" | "quick_reply") => void;
  onRemoveButtonTemplate: (id: string) => void;
  onMoveButtonTemplate?: (id: string, direction: "up" | "down") => void;
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<MediaCard>) => void;
  onUpdateCardButtonValue: (cardId: string, templateId: string, updates: Partial<CardButtonValue>) => void;
}

export interface ProductCard {
  id: string;
  button_text: string;
}

export interface CarouselProductSectionProps {
  cards: ProductCard[];
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<ProductCard>) => void;
}

export interface FooterSectionProps {
  footerText: string;
  setFooterText: (text: string) => void;
}

export interface HeaderSectionProps {
  templateType: string;
  setTemplateType: (type: string) => void;
  headerText: string;
  setHeaderText: (text: string) => void;
  templateTypes: { label: string; value: string; icon: React.ReactNode }[];
  setHeaderFile: (file: File | null) => void;
  headerFile: File | null;
}

export interface AITemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export interface FormLivePreviewProps {
  templateType: string;
  headerText: string;
  messageBody: string;
  variables_example: { key: string; example: string }[];
  footerText: string;
  buttons: any[];
  headerFile: File | null;
  mediaUrl?: string;
  marketingType?: MarketingType;
  offerText?: string;
  productCards?: ProductCard[];
  mediaCards?: MediaCard[];
  mediaButtonTemplates?: ButtonTemplate[];
  authData?: {
    add_security_recommendation?: boolean;
    otp_buttons?: { otp_type: string; copy_button_text?: string }[];
    otp_code_length?: number | "";
    code_expiration_minutes?: number | "";
  };
}

export interface TemplatePreviewBubbleProps {
  templateType: string;
  headerText: string;
  bodyText: string;
  footerText?: string;
  buttons: any[];
  fileUrl: string | null;
  marketingType?: string;
  offerText?: string;
  productCards?: any[];
  mediaCards?: any[];
  mediaButtonTemplates?: any[];
  authData?: {
    add_security_recommendation?: boolean;
    otp_buttons?: { otp_type: string; copy_button_text?: string }[];
    otp_code_length?: number | "";
    code_expiration_minutes?: number | "";
  };
}

export interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
}

export interface MessageTemplatesProps {
  wabaId: string;
}

export interface TemplateFormProps {
  wabaId: string;
  templateId?: string;
  adminTemplateId?: string;
}
