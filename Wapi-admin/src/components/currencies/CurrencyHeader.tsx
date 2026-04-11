"use client";

import { CurrencyHeaderProps } from "@/src/types/components";
import CommonHeader from "@/src/shared/CommonHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const CurrencyHeader = ({ onSearch, searchTerm, onFilter, onRefresh, onExport, onAddClick, isLoading, columns, onColumnToggle, selectedCount, onBulkDelete }: CurrencyHeaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return <CommonHeader title="Currencies" description="Add, edit, or delete currencies in your system." onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("common.search") + "..."} onAddClick={onAddClick || (() => router.push("/currencies/add"))} addLabel="Add Currency" addPermission="create.currencies" bulkDeletePermission="delete.currencies" isLoading={isLoading} columns={columns} onColumnToggle={onColumnToggle} selectedCount={selectedCount} onBulkDelete={onBulkDelete} onFilter={onFilter} onRefresh={onRefresh} onExport={onExport} />;
};

export default CurrencyHeader;
