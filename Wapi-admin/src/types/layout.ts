// Layout, guard, and shared UI component prop types

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CountrySelectProps {
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export interface DynamicSettingsProviderProps {
  children: React.ReactNode;
}

export interface SearchResult {
  id: string;
  label: string;
  href?: string;
}
