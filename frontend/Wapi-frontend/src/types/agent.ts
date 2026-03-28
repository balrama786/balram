/* eslint-disable @typescript-eslint/no-explicit-any */
// Agent types

export interface AgentFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export interface AgentTaskCommentsProps {
  taskId: string;
}

export interface AgentTaskDetailProps {
  taskId: string;
  onClose?: () => void;
}

export interface AgentTaskListSidebarProps {
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string | null;
}

export interface AgentTaskCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface AgentTaskFormFieldsProps {
  values: any;
  onChange: (field: string, value: any) => void;
  agents?: any[];
  contacts?: any[];
}
