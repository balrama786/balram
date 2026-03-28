"use client";

import { Search, ListFilter, Plus, RefreshCw, Download, Settings2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { CommonHeaderProps } from "@/src/types/components";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setPageTitle } from "../redux/reducers/settingsSlice";

const CommonHeader = ({ title, description, onSearch, searchTerm = "", searchPlaceholder = "Search...", onFilter, onRefresh, onExport, onAddClick, addLabel = "Add New", isLoading, columns, onColumnToggle, selectedCount, onBulkDelete, bulkActionLoading }: CommonHeaderProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (title) {
      dispatch(setPageTitle(title));
    }
  }, [title, dispatch]);

  return (
    <div className="space-y-6 sm:space-y-8 mb-5 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--text-green-primary) tracking-tight mb-2">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          {onAddClick && (
            <Button onClick={onAddClick} className="flex items-center cursor-pointer gap-2 justify-center text-white px-4.5 py-5 rounded-lg dark:shadow-none shadow-md shadow-emerald-100 transition-all active:scale-95" disabled={isLoading}>
              <Plus className="w-5 h-5" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {(onSearch || onFilter || onExport) && (
        <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white p-4 sm:p-6 rounded-lg border border-[#f1f5f9] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4 flex-wrap">
          {onSearch && (
            <div className="relative flex-1">
              <div className="absolute left-4 rtl:right-4 rtl:left-0 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                <Search className="w-5 h-5" />
              </div>
              <Input placeholder={searchPlaceholder === "Search..." ? t("common.search") + "..." : searchPlaceholder} value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="dark:bg-page-body pl-12 rtl:pr-12 rtl:pl-0 py-6 bg-(--input-color) border-(--input-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg text-sm dark:border-(--card-border-color) w-full" />
            </div>
          )}
          {!!(onFilter || onExport || onRefresh || (columns && onColumnToggle) || (selectedCount && selectedCount > 0)) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {columns && onColumnToggle && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="dark:bg-page-body dark:hover:bg-(--dark-sidebar) dark:hover:text-amber-50 dark:border-none dark:text-amber-50 flex items-center gap-2 px-6 py-6 rounded-lg border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b] font-medium transition-all" disabled={isLoading}>
                      <Settings2 className="w-5 h-5" />
                      {t("common.columns")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t("common.toggle_columns")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columns.map((column) => (
                      <DropdownMenuCheckboxItem key={column.id} checked={column.isVisible} onCheckedChange={() => onColumnToggle(column.id)}>
                        {column.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {onFilter && (
                <Button variant="outline" onClick={onFilter} className="dark:bg-page-body dark:border-none dark:hover:bg-(--dark-sidebar) dark:hover:text-amber-50 dark:border-(--card-border-color) dark:text-amber-50 flex items-center gap-2 px-6 py-6 rounded-lg border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b] font-medium transition-all" disabled={isLoading}>
                  <ListFilter className="w-5 h-5" />
                  {t("common.filter_btn")}
                </Button>
              )}
              {onExport && (
                <Button variant="outline" onClick={onExport} className="dark:bg-(--card-color) dark:hover:bg-(--dark-sidebar) dark:border-(--card-border-color) dark:hover:text-amber-50 dark:text-amber-50 flex items-center gap-2 px-6 py-6 rounded-lg border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b] font-medium transition-all" disabled={isLoading}>
                  <Download className="w-5 h-5" />
                  {t("common.export")}
                </Button>
              )}
              {onRefresh && (
                <Button onClick={onRefresh} variant="outline" className="dark:bg-page-body dark:hover:bg-(--dark-sidebar) dark:hover:text-amber-50 dark:border-none dark:text-amber-50 flex items-center gap-2 px-6 py-6 rounded-lg border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] hover:text-[#1e293b] font-medium transition-all" disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  {t("common.refresh")}
                </Button>
              )}
              {!!selectedCount && onBulkDelete && (
                <Button onClick={onBulkDelete} className="flex items-center gap-2 px-6 py-6 border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-all dark:hover:bg-red-900/20 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" disabled={isLoading || bulkActionLoading}>
                  <Trash2 className="w-5 h-5" />
                  {t("common.bulk_delete", { count: selectedCount })}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonHeader;
