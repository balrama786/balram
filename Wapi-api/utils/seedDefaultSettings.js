import { Setting } from '../models/index.js';

async function seedDefaultSettings() {
  try {
    const existingSettings = await Setting.findOne();

    if (existingSettings) {
      console.log('Default settings already exist.');
      return;
    }

    await Setting.create({
      app_name: 'Wapi',
      app_description: 'A modern chat application',
      app_email: 'support@example.com',
      support_email: 'support@example.com',


      favicon_url: '',
      logo_light_url: '',
      logo_dark_url: '',
      sidebar_logo_url: '',
      mobile_logo_url: '',
      landing_logo_url: '',
      favicon_notification_logo_url: '',
      onboarding_logo_url: '',


      maintenance_mode: false,
      maintenance_title: 'Under Maintenance',
      maintenance_message: 'We are performing some maintenance. Please check back later.',
      maintenance_image_url: '',
      maintenance_allowed_ips: [],


      page_404_title: 'Page Not Found',
      page_404_content: 'The page you are looking for does not exist.',
      page_404_image_url: '',
      no_internet_title: 'No Internet Connection',
      no_internet_content: 'Please check your internet connection and try again.',
      no_internet_image_url: '',


      smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtp_port: parseInt(process.env.SMTP_PORT) || 587,
      smtp_user: process.env.SMTP_USER || '',
      smtp_pass: process.env.SMTP_PASS || '',
      mail_from_name: 'Wapi',
      mail_from_email: process.env.SMTP_USER || 'noreply@myapplication.com',

      default_theme_mode: 'light',
      display_customizer: true,
      audio_calls_enabled: true,
      video_calls_enabled: true,
      allow_voice_message: true,
      allow_archive_chat: true,
      allow_media_send: true,
      allow_user_block: true,
      allow_user_signup: true,
      call_timeout_seconds: 25,
      session_expiration_days: 7,


      document_file_limit: 15,
      audio_file_limit: 15,
      video_file_limit: 20,
      image_file_limit: 10,
      multiple_file_share_limit: 10,
      maximum_message_length: 40000,
      allowed_file_upload_types: [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
        'mp4', 'mpeg', 'mov', 'webm',
        'mp3', 'wav', 'ogg',
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'
      ],


      max_groups_per_user: 500,
      max_group_members: 1024,

      free_trial_enabled: false,
      free_trial_days: 7,
    });

    console.log('Default settings created successfully!');
  } catch (error) {
    console.error('Error seeding default settings:', error);
    throw error;
  }
}

export default seedDefaultSettings;

