"use client";

import { Search, ListFilter, Download } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { SubscriptionPlansSearchBarProps } from "@/src/types/components";
import { useTranslation } from "react-i18next";

const SubscriptionPlansSearchBar = ({
  searchTerm,
  onSearch,
  onFilter,
  onExport,
  hasActiveFilters,
  activeFilterCount,
  isLoading,
  canExport,
}: SubscriptionPlansSearchBarProps) => {
  const { t } = useTranslation();
  return (
    <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white p-4 sm:p-6 rounded-lg border border-[#f1f5f9] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute left-4 rtl:right-4 rtl:left-0 top-1/2 -translate-y-1/2 text-[#94a3b8]">
          <Search className="w-5 h-5" />
        </div>
        <Input placeholder={t("subscription.search_placeholder")} value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="dark:bg-page-body dark:border-none pl-12 rtl:pr-12 rtl:pl-0 py-6 border-(--input-border-color) bg-(--input-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg text-sm w-full" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={onFilter} className={`dark:bg-page-body dark:hover:text-amber-50 dark:text-amber-50 flex items-center gap-2 px-6 py-6 rounded-lg border-[#e2e8f0] text-[#475569] dark:hover:bg-(--dark-sidebar) dark:border-none hover:text-[#1e293b] font-medium transition-all ${hasActiveFilters ? "bg-emerald-50 border-(--text-green-primary)" : ""}`} disabled={isLoading}>
          <ListFilter className="w-5 h-5" />
          {t("common.filter")}
          {hasActiveFilters && <span className="ml-1 bg-(--text-green-primary) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
        </Button>
        <Button variant="outline" onClick={onExport} className="dark:bg-page-body dark:border-none dark:hover:text-amber-50 dark:text-amber-50 flex items-center gap-2 px-6 py-6 rounded-lg border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b] font-medium transition-all dark:hover:bg-(--table-hover)" disabled={isLoading || !canExport}>
          <Download className="w-5 h-5" />
          {t("common.export")}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlansSearchBar;
