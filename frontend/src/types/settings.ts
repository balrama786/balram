/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SettingResponse {
  is_demo_mode: boolean;
  whatsapp_webhook_url: string;
  webhook_verification_token: string;
  _id: string;

  app_id: string;
  app_secret: string;
  configuration_id: string;

  app_name: string;
  app_description: string;
  app_email: string;
  support_email: string;

  favicon_url: string;
  logo_light_url: string;
  logo_dark_url: string;
  sidebar_logo_url: string;
  mobile_logo_url: string;
  landing_logo_url: string;
  favicon_notification_logo_url: string;
  onboarding_logo_url: string;
  sidebar_light_logo_url: string;
  sidebar_dark_logo_url: string;

  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_message: string;
  maintenance_image_url: string;
  maintenance_allowed_ips: string[];

  page_404_title: string;
  page_404_content: string;
  page_404_image_url: string;

  no_internet_title: string;
  no_internet_content: string;
  no_internet_image_url: string;

  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;

  mail_from_name: string;
  mail_from_email: string;

  default_theme_mode: "light" | "dark";
  display_customizer: boolean;

  audio_calls_enabled: boolean;
  video_calls_enabled: boolean;
  allow_voice_message: boolean;
  allow_archive_chat: boolean;
  allow_media_send: boolean;
  allow_user_block: boolean;
  allow_user_signup: boolean;

  call_timeout_seconds: number;
  session_expiration_days: number;

  document_file_limit: number;
  audio_file_limit: number;
  video_file_limit: number;
  image_file_limit: number;
  multiple_file_share_limit: number;

  maximum_message_length: number;
  allowed_file_upload_types: string[];

  max_groups_per_user: number;
  max_group_members: number;

  created_at: string;
  updated_at: string;
  __v: number;
}

export interface UserSetting {
  success: boolean;
  data: {
    ai_model: string | null;
    api_key: string | null;
    is_show_phone_no?: boolean;
    is_subscribed?: boolean;
    app_name?: string;
    features?: {
      rest_api: boolean;
      [key: string]: any;
    };
  };
}

export interface SettingState {
  setting: SettingResponse | null;
  userSetting: UserSetting | null;
  pageTitle: string;
}

export interface AIModel {
  _id: string;
  display_name: string;
  description: string;
  icon?: string;
  provider: string;
  model_id: string;
  status: string;
  is_default: boolean;
}

export interface AISettings {
  ai_model: string | null;
  api_key: string | null;
  is_subscribed?: boolean;
  is_show_phone_no?: boolean;
  is_free_trial?: boolean;
  free_trial_days_remaining?: number;
  features?: {
    rest_api: boolean;
    [key: string]: any;
  };
}

export interface AISettingsResponse {
  success: boolean;
  data: AISettings;
}

export interface AIModelsResponse {
  success: boolean;
  data: {
    models: AIModel[];
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
