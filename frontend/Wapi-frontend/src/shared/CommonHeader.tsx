"use client";

import { Search, ListFilter, Plus, RefreshCw, Download, Settings2, Trash2, ArrowLeft, LayoutList } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { CommonHeaderProps } from "../types/components";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setPageTitle } from "../redux/reducers/settingSlice";
import UsageIndicator from "./UsageIndicator";

const CommonHeader = ({ backBtn, title, description, onSearch, searchTerm = "", searchPlaceholder = "Search...", onFilter, onRefresh, onSync, onSyncStatus, onExport, isExportDisabled, onAddClick, addLabel = "Add New", isLoading, isSyncingStatus, columns, onColumnToggle, onBulkDelete, selectedCount = 0, rightContent, middleContent, featureKey, onToggleSidebar, children }: CommonHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (title) {
      dispatch(setPageTitle(title));
    }
  }, [title, dispatch]);

  return (
    <div className="space-y-6 sm:space-y-8 mb-8">
      <div className="flex justify-between items-start [@media(max-width:870px)]:flex-col [@media(max-width:870px)]:gap-3 [@media(max-width:870px)]:w-full">
        <div className="flex sm:flex-row gap-4 m-0 transition-all duration-300">
          {backBtn && (
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all mt-0.5">
              <ArrowLeft size={20} />
            </Button>
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-primary tracking-tight leading-none">{title}</h1>
              {onToggleSidebar && (
                <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="[@media(min-width:1600px)]:hidden rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all text-primary/80">
                  <LayoutList size={22} strokeWidth={2.5} />
                </Button>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium max-w-2xl dark:text-gray-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-col sm:flex-row">
          {featureKey && <UsageIndicator featureKey={featureKey} />}
          {rightContent}
          {onAddClick && (
            <Button onClick={onAddClick} className="flex items-center gap-2.5 px-4.5! py-5 bg-primary text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group ml-auto sm:ml-0 rtl:mr-auto rtl:sm:mr-0 rtl:ml-0 rtl:sm:ml-0" disabled={isLoading}>
              <Plus className="w-5 h-5 transition-transform" />
              <span className="inline">{addLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {middleContent}

      {(onSearch || onFilter || onExport || onRefresh || (columns && onColumnToggle)) && (
        <div className="dark:bg-(--card-color) backdrop-blur-xl bg-white/70 p-4 sm:p-6 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm flex flex-col justify-between lg:flex-row items-stretch lg:items-center gap-3 flex-wrap">
          {onSearch && (
            <div className="relative flex-1 group">
              <div className="absolute left-4 rtl:right-4 rtl:left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <Input placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-11 pl-12 pr-4 rtl:pr-12 rtl:pl-0 bg-(--input-color) dark:bg-(--page-body-bg) dark:focus:bg-(--page-body-bg) hover:border-slate-200 dark:hover:border-(--card-border-color) focus:bg-(--input-color) focus:border-primary dark:focus-visible:shadow-none dark:focus:border-primary rounded-lg text-sm transition-all placeholder:text-slate-400" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {children}
            {onExport && (
              <Button variant="outline" onClick={onExport} className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 text-slate-600 dark:border-none dark:text-gray-400 hover:text-slate-900 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading || isExportDisabled}>
                <Download className="w-4.5 h-4.5 text-slate-400 dark:text-amber-50" />
                <span className="inline text-sm">Export</span>
              </Button>
            )}
            {columns && onColumnToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 cursor-pointer px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none dark:hover:bg-(--table-hover) text-slate-600 dark:text-amber-50 rounded-lg font-semibold transition-all shadow-sm" disabled={isLoading}>
                    <Settings2 className="w-4.5 h-4.5 text-slate-400" />
                    <span className="inline text-sm">Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1 rounded-lg border-slate-200/60 dark:border-(--card-border-color) shadow-xl custom-scrollbar">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-500">Display Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-(--card-color)" />
                  <div className="py-1">
                    {columns.map((column) => (
                      <DropdownMenuCheckboxItem key={column.id} checked={column.isVisible} onCheckedChange={() => onColumnToggle(column.id)} className="rounded-lg mx-1 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 transition-colors">
                        {column.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {onFilter && (
              <Button variant="outline" onClick={onFilter} className="h-11 px-4 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-gray-500 hover:text-slate-900 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading}>
                <ListFilter className="w-4.5 h-4.5 text-slate-400" />
                <span className="inline text-sm">Filter</span>
              </Button>
            )}
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" className="h-11 px-4 gap-2 bg-white cursor-pointer dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-amber-50 ${isLoading ? "animate-spin text-primary" : ""}`} />
                <span className="inline text-sm">Refresh</span>
              </Button>
            )}
            {onSync && (
              <Button onClick={onSync} variant="outline" className="h-11 px-4 gap-2 bg-white  border-slate-200 dark:border-none dark:bg-(--page-body-bg) text-slate-600 dark:text-gray-500 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoading ? "animate-spin text-primary" : ""}`} />
                <span className="inline text-sm">Sync</span>
              </Button>
            )}
            {onSyncStatus && (
              <Button onClick={onSyncStatus} variant="outline" className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-500 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading || isSyncingStatus}>
                <RefreshCw className={`w-4 h-4 text-slate-400 ${isSyncingStatus ? "animate-spin text-primary" : ""}`} />
                <span className="inline text-sm">Sync Status</span>
              </Button>
            )}
            {selectedCount > 0 && onBulkDelete && (
              <Button onClick={onBulkDelete} variant="outline" className="h-11 px-4 gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border-red-200 dark:border-red-500/20 text-red-600 hover:text-red-600 rounded-lg font-semibold transition-all shadow-xs active:scale-95" disabled={isLoading}>
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete ({selectedCount})</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonHeader;
