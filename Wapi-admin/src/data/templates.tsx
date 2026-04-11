import { FileText, ImageIcon, Layout, MapPin, MessageSquare, Shield, Video } from 'lucide-react';

export const LANGUAGES = [
  { label: 'English (US)', value: 'en_US' },
  { label: 'English (UK)', value: 'en_GB' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Gujarati', value: 'gu' },
];

export const CATEGORIES = [
  { label: 'Utility', value: 'UTILITY', icon: <MessageSquare size={18} /> },
  { label: 'Marketing', value: 'MARKETING', icon: <Layout size={18} /> },
  { label: 'Authentication', value: 'AUTHENTICATION', icon: <Shield size={18} /> },
];

export const TEMPLATE_TYPES = [
  { label: 'Image', value: 'image', icon: <ImageIcon size={20} /> },
  { label: 'Video', value: 'video', icon: <Video size={20} /> },
  { label: 'Document', value: 'document', icon: <FileText size={20} /> },
  { label: 'Location', value: 'location', icon: <MapPin size={20} /> },
];

export const INTERACTIVE_ACTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Call to Action', value: 'cta' },
  { label: 'Quick Replies', value: 'quick_reply' },
  { label: 'All', value: 'all' },
];
