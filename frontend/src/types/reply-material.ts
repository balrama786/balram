/* eslint-disable @typescript-eslint/no-explicit-any */
export type ReplyMaterialType = "text" | "image" | "document" | "video" | "sticker" | "sequence" | "template" | "catalog" | "chatbot";

export interface ReplyMaterial {
  _id: string;
  name: string;
  type: ReplyMaterialType;
  content?: string;
  file_url?: string | null;
  file_path?: string | null;
  waba_id?: string;
  user_id?: string;
  message?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ReplyMaterialGroup {
  items: ReplyMaterial[];
  pagination: Pagination;
}

export interface ReplyMaterialsResponse {
  success: boolean;
  data: {
    texts: ReplyMaterialGroup;
    images: ReplyMaterialGroup;
    documents: ReplyMaterialGroup;
    videos: ReplyMaterialGroup;
    stickers: ReplyMaterialGroup;
    sequences: any;
  };
}

export interface ReplyMaterialResponse {
  success: boolean;
  message?: string;
  data: ReplyMaterial;
}

export interface BulkDeleteResponse {
  success: boolean;
  message?: string;
  data?: { deletedCount: number };
}

export interface ReplyMaterialSidebarItem {
  type: ReplyMaterialType;
  groupKey?: keyof ReplyMaterialsResponse["data"];
  label: string;
  description: string;
  hasFile: boolean;
  accept?: string;
}

export interface ReplyMaterialFormValues {
  name: string;
  content: string;
  file: File | null;
}

export interface ReplyMaterialQueryParams {
  waba_id: string;
  page?: number;
  limit?: number;
  search?: string;
}
