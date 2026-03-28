export interface WidgetData {
  _id?: string;
  whatsapp_phone_number: string;
  welcome_text: string;
  default_open_popup: boolean;
  default_user_message: string;
  widget_position: "bottom-right" | "bottom-left";
  widget_image?: string;
  widget_image_url?: string;
  widget_color: string;
  body_background_image?: string;
  header_text: string;
  header_text_color: string;
  header_background_color: string;
  body_background_color: string;
  welcome_text_color: string;
  welcome_text_background: string;
  start_chat_button_text: string;
  start_chat_button_background: string;
  start_chat_button_text_color: string;
  script_tag?: string;
  embed_code?: string;
}

export interface WidgetResponse {
  success: boolean;
  data: WidgetData;
  message?: string;
}

export interface WidgetListResponse {
  success: boolean;
  data: {
    widgets: WidgetData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StepProps {
  data: Partial<WidgetData>;
  onChange: (field: keyof WidgetData, value: any) => void;
  isStandalone?: boolean;
}

export interface WidgetWizardFormProps {
  data: Partial<WidgetData>;
  onChange: (field: keyof WidgetData, value: any) => void;
  onSave?: () => void;
}

export interface ChatbotPreviewProps {
  data: Partial<WidgetData>;
}

export interface WidgetSuccessProps {
  scriptTag?: string;
  embedCode?: string;
}

