/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useDeleteFaqMutation,
  useGetAllFaqsQuery,
  useUpdateFaqMutation,
} from "@/src/redux/api/faqApi";
import FaqList from "./FaqList";
import FaqHeader from "./FaqHeader";
import FilterModal from "./FilterModal";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { toast } from "sonner";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useTranslation } from "react-i18next";

const FaqContainer = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const [columns, setColumns] = useState([
    { id: "title", label: "FAQ Title", isVisible: true },
    { id: "description", label: "Description", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "actions", label: "Actions", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  const { data, isLoading, refetch, isFetching } = useGetAllFaqsQuery({
    search: searchTerm,
    page: page,
    limit: limit,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  const handleUpdateFaq = async (
    id: string,
    faqData: { title: string; description: string; status: boolean },
  ) => {
    try {
      await updateFaq({ id, data: faqData }).unwrap();
      toast.success(t("faq.success_updated"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || t("faq.error_update");
      toast.error(errorMessage);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await deleteFaq([id]).unwrap();
      toast.success(t("faq.success_deleted"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || t("faq.error_delete");
      toast.error(errorMessage);
    }
  };

  const handleBulkDeleteFaqs = async (ids: string[]) => {
    try {
      await deleteFaq(ids).unwrap();
      toast.success(ids.length > 1 ? t("faq.success_deleted_plural", { count: ids.length }) : t("faq.success_deleted"));
      setSelectedIds([]);
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || t("faq.error_delete");
      toast.error(errorMessage);
    }
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (newFilters: { status?: string }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  let filteredFaqs = data?.data.faqs || [];
  let filteredTotal = data?.data.pagination?.totalItems || 0;
  let filteredTotalPages = data?.data.pagination?.totalPages || 1;

  // Check if any filters are active
  const hasActiveFilters =
    Object.keys(filters).length > 0 &&
    Object.values(filters).some((v) => v !== undefined);

  if (hasActiveFilters && filters.status) {
    const isActive = filters.status === "active";
    filteredFaqs = filteredFaqs.filter((f) => f.status === isActive);
    filteredTotal = filteredFaqs.length;
    filteredTotalPages = 1;
  }

  return (
    <div>
      <FaqHeader
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        searchTerm={inputValue}
        onFilter={handleFilter}
        isLoading={isFetching}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
      />

      <FaqList
        faqs={filteredFaqs}
        onDelete={handleDeleteFaq}
        onBulkDelete={handleBulkDeleteFaqs}
        onUpdate={handleUpdateFaq}
        isLoading={isLoading || isDeleting || isUpdating || isFetching}
        total={filteredTotal}
        page={data?.data.pagination?.currentPage || page}
        totalPages={filteredTotalPages}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={handleLimitChange}
        onSelectionChange={setSelectedIds}
        selectedIds={selectedIds}
        onSortChange={handleSortChange}
      />

      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          handleBulkDeleteFaqs(selectedIds);
          setIsBulkDeleteModalOpen(false);
        }}
        isLoading={isDeleting}
        title={t("faq.delete_multiple_modal_title")}
        subtitle={t("faq.delete_multiple_modal_subtitle", { count: selectedIds.length })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        loadingText={t("common.deleting")}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default FaqContainer;
