/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonHTMLAttributes, ImgHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { DecoupledEditor as DecoupledEditorType } from "@ckeditor/ckeditor5-editor-decoupled";
import type { CKEditor as CKEditorType } from "@ckeditor/ckeditor5-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;

  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;

  variant?: "default" | "danger" | "warning" | "success" | "info";

  iconId?: string;
  showIcon?: boolean;
  showCancelButton?: boolean;
  loadingText?: string;
}

export interface SvgProps {
  id?: string;
  iconId: string | undefined;
  className?: string;
  style?: {
    height?: number;
    width?: number;
    fill?: string;
    marginRight?: number;
  };
  onClick?: (e?: any) => void;
  title?: string;
}

export interface SolidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: string;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  iconClass?: string;
}

export interface EditorModules {
  CKEditor: typeof CKEditorType;
  DecoupledEditor: typeof DecoupledEditorType;
}

export interface CkEditorProps {
  onChange: (data: string) => void;
  name?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  disabled?: boolean;
  minHeight?: string;
  toolbar?: string[];
}

import { ImageProps as NextImageProps } from "next/image";

export type ImageProps = Omit<NextImageProps, "src" | "alt"> & {
  src: any;
  alt?: string;
  baseUrl?: string;
  fallbackSrc?: string;
};

export interface CKEditorComponentProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  minHeight?: string;
  onReady?: (editor: any) => void;
}

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  accessor?: (item: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  copyable?: boolean;
  copyField?: keyof T;
  sortable?: boolean;
  sortKey?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];

  // Pagination
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  tableClassName?: string;

  // Actions
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  customActions?: (item: T) => ReactNode;

  // State
  isLoading?: boolean;
  emptyMessage?: string;

  // ID accessor
  getRowId?: (item: T) => string;

  // Styling
  minWidth?: string;
  showActionsOnHover?: boolean;
  renderActions?: (row: T) => ReactNode;
  onBulkDelete?: (ids: string[]) => void;
  itemLabel?: string;
  itemLabelSingular?: string;
  onSelectionChange?: (ids: string[]) => void;
  selectedIds?: string[];
  selectionClassName?: string;
  actionClassName?: string;
  columnClassNames?: string[];
  pagination?: boolean;
  // Sorting
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}
