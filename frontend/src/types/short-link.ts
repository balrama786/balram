export interface ShortLinkData {
  _id: string;
  user_id: string | { _id: string; name: string; email: string };
  short_code: string;
  mobile: string;
  first_message: string;
  click_count: number;
  short_link: string;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface ShortLinkResponse {
  success: boolean;
  message?: string;
  data: ShortLinkData;
}

export interface ShortLinksList {
  short_links: ShortLinkData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ShortLinksListResponse {
  success: boolean;
  data: ShortLinksList;
}
