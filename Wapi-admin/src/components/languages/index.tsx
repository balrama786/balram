/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDeleteLanguageMutation, useGetAllLanguagesQuery, useToggleLanguageStatusMutation } from "@/src/redux/api/languageApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useState } from "react";
import { toast } from "sonner";
import LanguageHeader from "./LanguageHeader";
import LanguageList from "./LanguageList";

const LanguageContainer = () => {
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [columns, setColumns] = useState([
    { id: "flag", label: "Flag", isVisible: true },
    { id: "name", label: "Name", isVisible: true },
    { id: "locale", label: "Locale", isVisible: true },
    { id: "is_rtl", label: "RTL", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "actions", label: "Actions", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const { data, isLoading, refetch, isFetching, error } = useGetAllLanguagesQuery({
    search: searchTerm,
    page: page,
    limit: limit,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [deleteLanguage, { isLoading: isDeleting }] = useDeleteLanguageMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleLanguageStatusMutation();

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleStatus(id).unwrap();
      toast.success(response?.message || "Status updated successfully.");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update status.");
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    try {
      const response = await deleteLanguage([id]).unwrap();
      toast.success(response?.message || "Language deleted successfully.");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete language.");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const response = await deleteLanguage(ids).unwrap();
      toast.success(response?.message || `${ids.length} languages deleted successfully.`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete languages.");
    }
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  if (error && !isLoading && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-(--card-color) rounded-lg border border-dashed border-gray-200 dark:border-slate-800 my-4">
        <div className="text-red-500 mb-4 font-medium flex flex-col items-center gap-2">
          <span>Failed to load languages. The server might be restarting.</span>
          {error && <span className="text-xs opacity-60">{(error as any)?.data?.error || (error as any)?.message}</span>}
        </div>
        <button 
          onClick={() => refetch()} 
          className="px-6 py-2 bg-(--text-green-primary) text-white rounded-lg hover:opacity-90 transition-all font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div>
      <LanguageHeader onSearch={setInputValue} searchTerm={inputValue} isLoading={isFetching} columns={columns} onColumnToggle={handleColumnToggle} selectedCount={selectedIds.length} onBulkDelete={() => setIsBulkDeleteModalOpen(true)} />

      <LanguageList languages={data?.data.languages || []} onDelete={handleDeleteLanguage} onBulkDelete={handleBulkDelete} onToggleStatus={handleToggleStatus} isLoading={isLoading || isFetching || isDeleting || isToggling} total={data?.data.pagination?.totalItems || 0} page={page} totalPages={data?.data.pagination?.totalPages || 1} onPageChange={setPage} limit={limit} onLimitChange={setLimit} onSelectionChange={setSelectedIds} selectedIds={selectedIds} onSortChange={handleSortChange} />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={() => handleBulkDelete(selectedIds)} isLoading={isDeleting} title="Delete Languages" subtitle={`Are you sure you want to delete ${selectedIds.length} selected languages?`} confirmText="Delete" cancelText="Cancel" variant="danger" />
    </div>
  );
};

export default LanguageContainer;
