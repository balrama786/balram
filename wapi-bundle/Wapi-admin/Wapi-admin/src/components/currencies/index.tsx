/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDeleteCurrencyMutation, useGetAllCurrenciesQuery, useToggleCurrencyStatusMutation, useToggleDefaultCurrencyMutation } from "@/src/redux/api/currencyApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CurrencyHeader from "./CurrencyHeader";
import CurrencyList from "./CurrencyList";

const CurrencyContainer = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [columns, setColumns] = useState([
    { id: "default", label: "Default", isVisible: true },
    { id: "name", label: "Name", isVisible: true },
    { id: "code", label: "Code", isVisible: true },
    { id: "symbol", label: "Symbol", isVisible: true },
    { id: "exchange_rate", label: "Exchange Rate", isVisible: true },
    { id: "decimal_number", label: "Decimal", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const { data: currenciesData, isLoading } = useGetAllCurrenciesQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [deleteCurrency, { isLoading: isDeleting }] = useDeleteCurrencyMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleCurrencyStatusMutation();
  const [toggleDefault, { isLoading: isTogglingDefault }] = useToggleDefaultCurrencyMutation();

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCurrency([id]).unwrap();
      toast.success(response.message || "Currency deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete currency");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const response = await deleteCurrency(ids).unwrap();
      toast.success(response.message || `${ids.length} currency(s) deleted successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete currencies");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleStatus(id).unwrap();
      toast.success(response.message || "Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update status");
    }
  };

  const handleToggleDefault = async (id: string) => {
    try {
      const response = await toggleDefault(id).unwrap();
      toast.success(response.message || "Default currency updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update default currency");
    }
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="space-y-6">
      <CurrencyHeader searchTerm={searchTerm} onSearch={handleSearch} onAddClick={() => router.push("/currencies/add")} isLoading={isLoading} selectedCount={selectedIds.length} onBulkDelete={() => setIsBulkDeleteModalOpen(true)} columns={columns} onColumnToggle={handleColumnToggle} />
      <CurrencyList currencies={currenciesData?.data?.currencies || []} isLoading={isLoading || isDeleting || isTogglingStatus || isTogglingDefault} total={currenciesData?.data?.pagination?.totalItems || 0} page={page} totalPages={currenciesData?.data?.pagination?.totalPages || 0} onPageChange={handlePageChange} limit={limit} onLimitChange={handleLimitChange} onDelete={handleDelete} onBulkDelete={handleBulkDelete} onToggleStatus={handleToggleStatus} onToggleDefault={handleToggleDefault} selectedIds={selectedIds} onSelectionChange={setSelectedIds} onSortChange={handleSortChange} visibleColumns={columns.filter((c) => c.isVisible).map((c) => c.id)} />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={() => handleBulkDelete(selectedIds)} isLoading={isDeleting} title="Delete Currencies" subtitle={`Are you sure you want to delete ${selectedIds.length} selected currencies? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" variant="danger" loadingText="Deleting..." />
    </div>
  );
};

export default CurrencyContainer;
