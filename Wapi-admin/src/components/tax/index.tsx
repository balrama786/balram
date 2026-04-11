"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useBulkDeleteTaxesMutation, useDeleteTaxMutation, useGetAllTaxesQuery } from "@/src/redux/api/taxApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Tax } from "@/src/types/store";
import TaxHeader from "./TaxHeader";
import TaxList from "./TaxList";

interface ColumnItem {
  id: string;
  label: string;
  isVisible: boolean;
}

const TaxContainer = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [columns, setColumns] = useState<ColumnItem[]>([
    { id: "name", label: t("tax.column.name") || "Name", isVisible: true },
    { id: "rate", label: t("tax.column.rate") || "Rate", isVisible: true },
    { id: "type", label: t("tax.column.type") || "Type", isVisible: true },
    { id: "status", label: t("tax.column.status") || "Status", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const { data: taxesData, isLoading } = useGetAllTaxesQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [deleteTax] = useDeleteTaxMutation();
  const [bulkDeleteTaxes, { isLoading: isBulkDeleting }] = useBulkDeleteTaxesMutation();

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

  const handleDelete = async (tax: Tax) => {
    try {
      await deleteTax(tax._id).unwrap();
      toast.success(t("tax.delete_success") || "Tax deleted successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("tax.delete_error") || "Failed to delete tax");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteTaxes(selectedIds).unwrap();
      toast.success(t("tax.bulk_delete_success") || "Taxes deleted successfully");
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("tax.bulk_delete_error") || "Failed to delete taxes");
    }
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="space-y-6">
      <TaxHeader searchTerm={searchTerm} onSearch={handleSearch} isLoading={isLoading} selectedCount={selectedIds.length} onBulkDelete={() => setIsBulkDeleteModalOpen(true)} columns={columns} onColumnToggle={handleColumnToggle} onRefresh={() => setPage(1)} />

      <TaxList taxes={taxesData?.data.taxes || []} isLoading={isLoading} total={taxesData?.data.total || 0} page={page} totalPages={Math.ceil((taxesData?.data.total || 0) / limit)} onPageChange={handlePageChange} limit={limit} onLimitChange={handleLimitChange} onDelete={handleDelete} onBulkDelete={() => setIsBulkDeleteModalOpen(true)} selectedIds={selectedIds} onSelectionChange={setSelectedIds} onSortChange={handleSortChange} visibleColumns={columns.filter((c) => c.isVisible).map((c) => c.id)} />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleBulkDelete} isLoading={isBulkDeleting} title={t("tax.bulk_delete_modal_title") || "Delete Multiple Taxes"} subtitle={t("tax.bulk_delete_modal_subtitle", { count: selectedIds.length }) || `Are you sure you want to delete ${selectedIds.length} selected taxes?`} confirmText={t("common.delete")} cancelText={t("common.cancel")} variant="danger" loadingText="Deleting..." />
    </div>
  );
};

export default TaxContainer;
