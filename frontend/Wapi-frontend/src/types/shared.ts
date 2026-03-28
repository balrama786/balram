/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  isLoading?: boolean

  title?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string

  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info' | 'primary'

  iconId?: string
  showIcon?: boolean
  showCancelButton?: boolean
  loadingText?: string
}

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  copyable?: boolean;
  copyField?: keyof T;
  sortable?: boolean;
  sortKey?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  // Pagination entries
  totalCount?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isFetching?: boolean;
  // Selection
  enableSelection?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  getRowId?: (item: T) => string;
  // Sorting
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export interface ImageProps {
  src: any;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  unoptimized?: boolean;
  fill?: boolean;
}