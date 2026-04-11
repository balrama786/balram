/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ButtonTemplate {
  id: string;
  type: "url" | "quick_reply";
}

export interface MediaCard {
  id: string;
  body_text: string;
  file: File | null;
  buttonValues: { templateId: string; text: string; url?: string }[];
}

export interface ProductCard {
  id: string;
  button_text?: string;
}

export interface AuthFormData {
  message_body: string;
  footer_text: string;
  add_security_recommendation: boolean;
  code_expiration_minutes: number | string;
  otp_code_length: number | string;
  otp_buttons: { otp_type: "COPY_CODE"; copy_button_text?: string }[];
  variables_example: { key: string; example: string }[];
}

export type OTPType = "COPY_CODE" | "ONE_TAP";

export interface OTPButton {
  otp_type: OTPType;
  copy_button_text?: string;
}

export interface AuthFormDatasection {
  message_body: string;
  footer_text: string;
  add_security_recommendation: boolean;
  code_expiration_minutes: number | string;
  otp_code_length: number | string;
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

export interface BasicInfoSectionProps {
  language: string;
  setLanguage: (lang: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  marketingType: MarketingType;
  setMarketingType: (type: MarketingType) => void;
  offerText: string;
  setOfferText: (val: string) => void;
  sector: string;
  setSector: (val: string) => void;
  templateCategory: string;
  setTemplateCategory: (val: string) => void;
}

export interface Variable {
  key: string;
  example: string;
}

export interface BodySectionProps {
  messageBody: string;
  handleBodyChange: (data: string) => void;
  addVariable: () => void;
  setEditor: (editor: any) => void;
  variables_example: Variable[];
  updateVariable: (index: number, value: string) => void;
}

export interface InteractiveAction {
  label: string;
  value: string;
}

export interface Button {
  id: string;
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
  website_url?: string;
}

export interface ButtonSectionProps {
  interactiveType: string;
  setInteractiveType: (val: string) => void;
  buttons: Button[];
  addButton: (type: "quick_reply" | "website" | "phone_call" | "copy_code") => void;
  removeButton: (id: string) => void;
  updateButton: (id: string, updates: any) => void;
  interactiveActions: InteractiveAction[];
  isLimitedTimeOffer: boolean;
  isCouponCode: boolean;
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

export interface MediaCard2 {
  id: string;
  body_text: string;
  file: File | null;
  buttonValues: CardButtonValue[];
}

export interface CarouselMediaSectionProps {
  buttonTemplates: ButtonTemplate[];
  cards: MediaCard2[];
  onAddButtonTemplate: (type: "url" | "quick_reply") => void;
  onRemoveButtonTemplate: (id: string) => void;
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<MediaCard2>) => void;
  onUpdateCardButtonValue: (cardId: string, tmplId: string, updates: Partial<CardButtonValue>) => void;
}

export interface ProductCard {
  id: string;
  button_text?: string;
}

export interface CarouselProductSectionProps {
  cards: ProductCard[];
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<ProductCard>) => void;
}

export interface FooterSectionProps {
  footerText: string;
  setFooterText: (val: string) => void;
}

export interface TemplateTypeOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export interface HeaderSectionProps {
  templateType: string;
  setTemplateType: (val: string) => void;
  headerText: string;
  setHeaderText: (val: string) => void;
  templateTypes: TemplateTypeOption[];
  setHeaderFile: (file: File | null) => void;
  headerFile: File | null;
}

export interface FormLivePreviewProps {
  templateType: string;
  headerText: string;
  messageBody: string;
  variables_example: { key: string; example: string }[];
  footerText: string;
  buttons?: any[];
  headerFile?: File | null;
  mediaUrl?: string;
  marketingType?: string;
  offerText?: string;
  productCards?: any[];
  mediaCards?: any[];
  mediaButtonTemplates?: any[];
  authData?: any;
}

export interface AuthData {
  add_security_recommendation?: boolean;
  code_expiration_minutes?: number | string;
  otp_buttons?: { otp_type: string; copy_button_text?: string }[];
}

export interface TemplatePreviewBubbleProps {
  templateType: string;
  headerText: string;
  bodyText: string;
  footerText: string;
  buttons?: any[];
  fileUrl?: string | null;
  marketingType?: string;
  offerText?: string;
  productCards?: any[];
  mediaCards?: any[];
  mediaButtonTemplates?: any[];
  authData?: AuthData;
}

export interface AdminTemplateFormProps {
  templateId?: string;
}
