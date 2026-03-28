/* eslint-disable @typescript-eslint/no-explicit-any */
// API Key and Developer types

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at?: string;
}

export interface GenericApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ApiKeyListResponse {
  success: boolean;
  data: ApiKey[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface DeveloperSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export interface ApiDocViewerProps {
  section: string;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
}
