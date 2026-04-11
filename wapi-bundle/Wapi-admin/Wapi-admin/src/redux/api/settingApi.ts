/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface AppSettings {
  _id?: string;
  // General
  app_name: string;
  app_description: string;
  app_email: string;
  support_email: string;
  default_theme_mode: string;
  display_customizer: boolean;
  allow_user_signup: boolean;
  is_demo_mode: boolean;
  demo_user_email?: string;
  demo_user_password?: string;
  demo_agent_email?: string;
  demo_agent_password?: string;
  session_expiration_days: number;
  // Branding
  favicon_url: string;
  logo_light_url: string;
  logo_dark_url: string;
  sidebar_logo_url: string;
  mobile_logo_url: string;
  landing_logo_url: string;
  favicon_notification_logo_url: string;
  onboarding_logo_url: string;
  // WhatsApp
  app_id: string | null;
  app_secret: string | null;
  configuration_id: string | null;
  whatsapp_webhook_url: string | null;
  webhook_verification_token: string | null;
  // Email
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  mail_from_name: string;
  mail_from_email: string;
  // Features
  free_trial_enabled: boolean;
  free_trial_days: number;
  audio_calls_enabled: boolean;
  video_calls_enabled: boolean;
  allow_voice_message: boolean;
  allow_archive_chat: boolean;
  allow_media_send: boolean;
  allow_user_block: boolean;
  call_timeout_seconds: number;
  // Limits
  document_file_limit: number;
  audio_file_limit: number;
  video_file_limit: number;
  image_file_limit: number;
  multiple_file_share_limit: number;
  maximum_message_length: number;
  max_groups_per_user: number;
  max_group_members: number;
  allowed_file_upload_types: string[];
  // Maintenance
  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_message: string;
  maintenance_image_url: string;
  maintenance_allowed_ips: string[];
  client_ip?: string;
  page_404_title: string;
  page_404_content: string;
  page_404_image_url: string;
  no_internet_title: string;
  no_internet_content: string;
  no_internet_image_url: string;
  sidebar_light_logo_url: string;
  sidebar_dark_logo_url: string;
  // Config Visibility
  show_email_config: boolean;
  show_whatsapp_config: boolean;
  default_currency?: any;
}

export interface TestMailPayload {
  to: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  mail_from_name: string;
  mail_from_email: string;
}

export interface TestMailResponse {
  success: boolean;
  message: string;
  data?: { to: string };
}

export const settingApi = baseApi.enhanceEndpoints({ addTagTypes: ["Settings"] }).injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<AppSettings, void>({
      query: () => "/setting",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<AppSettings, FormData | Partial<AppSettings>>({
      query: (body) => ({
        url: "/setting",
        method: "PUT",
        body,
        // Don't set Content-Type — let browser set multipart boundary for FormData
        formData: body instanceof FormData,
      }),
      invalidatesTags: ["Settings"],
    }),
    testMail: builder.mutation<TestMailResponse, TestMailPayload>({
      query: (body) => ({
        url: "/setting/mail/test",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation, useTestMailMutation } = settingApi;
