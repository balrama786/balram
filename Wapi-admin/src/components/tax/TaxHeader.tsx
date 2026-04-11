"use client";

import CommonHeader from "@/src/shared/CommonHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface TaxHeaderProps {
  onSearch: (query: string) => void;
  searchTerm: string;
  onFilter?: () => void;
  onRefresh?: () => void;
  onExport?: (type: "csv" | "excel" | "pdf") => void;
  onAddClick?: () => void;
  isLoading?: boolean;
  columns?: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle?: (columnId: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
}

const TaxHeader = ({ onSearch, searchTerm, onFilter, onExport, onAddClick, isLoading = false, columns, onColumnToggle, selectedCount, onBulkDelete }: TaxHeaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return <CommonHeader title={t("tax.title") || "Taxes"} description={t("tax.description") || "Manage tax rates and types for your products and services."} onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("tax.search_placeholder") || "Search taxes..."} onAddClick={onAddClick || (() => router.push("/taxes/create"))} addLabel={t("tax.add_new") || "Add New Tax"} addPermission="create.taxes" bulkDeletePermission="delete.taxes" isLoading={isLoading} columns={columns} onColumnToggle={onColumnToggle} selectedCount={selectedCount} onBulkDelete={onBulkDelete} onFilter={onFilter} onExport={onExport} />;
};

export default TaxHeader;
