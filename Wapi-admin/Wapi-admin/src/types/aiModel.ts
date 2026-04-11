// AI Models types

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface AIModelFormValues {
  name: string;
  provider: string;
  api_key: string;
  model: string;
  base_url?: string;
  headers?: KeyValuePair[];
  is_active?: boolean;
}

export interface AIModelFormProps {
  initialData?: Partial<AIModelFormValues>;
  onSubmit: (values: AIModelFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface AIModelsListProps {
  onEdit?: (id: string) => void;
}

export interface TestModelModalProps {
  modelId: string;
  onClose: () => void;
}
