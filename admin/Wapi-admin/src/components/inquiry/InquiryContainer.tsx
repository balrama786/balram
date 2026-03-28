/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useDeleteInquiryMutation,
  useGetAllInquiriesQuery,
  useUpdateInquiryStatusMutation,
} from "@/src/redux/api/inquiryApi";
import InquiryList from "./InquiryList";
import InquiryHeader from "./InquiryHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { toast } from "sonner";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useTranslation } from "react-i18next";

const InquiryContainer = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data, isLoading, refetch, isFetching } = useGetAllInquiriesQuery({
    search: searchTerm,
    page: page,
    limit: limit,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();
  const [updateInquiryStatus, { isLoading: isUpdating }] =
    useUpdateInquiryStatusMutation();

  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteInquiry([id]).unwrap();
      toast.success(t("inquiry.success_deleted"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || t("inquiry.error_delete");
      toast.error(errorMessage);
    }
  };

  const handleBulkDeleteInquiries = async (ids: string[]) => {
    try {
      await deleteInquiry(ids).unwrap();
      toast.success(ids.length > 1 ? t("inquiry.success_deleted_plural", { count: ids.length }) : t("inquiry.success_deleted"));
      setSelectedIds([]);
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || t("inquiry.error_delete");
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (id: string, isRead: boolean) => {
    try {
      await updateInquiryStatus({ id, isRead }).unwrap();
      toast.success(isRead ? t("inquiry.marked_read") : t("inquiry.marked_unread"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("inquiry.error_update_status");
      toast.error(errorMessage);
    }
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      <InquiryHeader
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        searchTerm={inputValue}
        isLoading={isFetching}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
      />

      <InquiryList
        inquiries={data?.data.inquiries || []}
        onDelete={handleDeleteInquiry}
        onBulkDelete={handleBulkDeleteInquiries}
        onUpdateStatus={handleUpdateStatus}
        isLoading={isLoading || isDeleting || isUpdating || isFetching}
        total={data?.data.pagination?.totalItems || 0}
        page={data?.data.pagination?.currentPage || page}
        totalPages={data?.data.pagination?.totalPages || 1}
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
          handleBulkDeleteInquiries(selectedIds);
          setIsBulkDeleteModalOpen(false);
        }}
        isLoading={isDeleting}
        title={t("inquiry.delete_multiple_modal_title")}
        subtitle={t("inquiry.delete_multiple_modal_subtitle", { count: selectedIds.length })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        loadingText={t("common.deleting")}
      />
    </div>
  );
};

export default InquiryContainer;
