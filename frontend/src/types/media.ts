// Media types

export interface MediaGridProps {
  mediaType?: string;
  onSelect?: (url: string) => void;
}

export interface MediaUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: (url: string) => void;
}

export interface MediaDetailModalProps {
  media: {
    _id: string;
    url: string;
    media_type: string;
    file_name?: string;
    file_size?: number;
    created_at?: string;
  };
  onClose: () => void;
}
