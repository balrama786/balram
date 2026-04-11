export interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Called when user selects a file from device. Pass null to clear. */
  onFileChange?: (file: File | null) => void;
  placeholder?: string;
  accept?: string;
}

export interface SettingCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}

export interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}