// Landing page section component prop types

export interface HeroFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface FeaturesFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface PricingFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface TestimonialsFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface PlatformFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface FaqFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface FooterFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface ContactFormProps {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export interface ImageSelectorProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
}

export interface MediaUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}
