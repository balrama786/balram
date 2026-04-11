/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useGetAllTestimonialsQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialStatusMutation,
} from "@/src/redux/api/testimonialApi";
import TestimonialHeader from "./TestimonialHeader";
import TestimonialList from "./TestimonialList";
import FilterModal from "./FilterModal";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { toast } from "sonner";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useTranslation } from "react-i18next";

const TestimonialContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ status?: string; rating?: string }>(
    {},
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data, isLoading, isFetching, refetch } = useGetAllTestimonialsQuery({
    page,
    limit: limit,
    search: searchTerm,
    status: filters.status,
    rating: filters.rating,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [updateTestimonial, { isLoading: isUpdating }] =
    useUpdateTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeleting }] =
    useDeleteTestimonialMutation();
  const [updateTestimonialStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTestimonialStatusMutation();

  const handleUpdateTestimonial = async (id: string, data: FormData) => {
    try {
      await updateTestimonial({ id, data }).unwrap();
      toast.success(t("testimonial.success_updated"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("testimonial.error_update");
      toast.error(errorMessage);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteTestimonial([id]).unwrap();
      toast.success(t("testimonial.success_deleted"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("testimonial.error_delete");
      toast.error(errorMessage);
    }
  };

  const handleBulkDeleteTestimonials = async (ids: string[]) => {
    try {
      await deleteTestimonial(ids).unwrap();
      toast.success(ids.length > 1 ? t("testimonial.success_deleted_plural", { count: ids.length }) : t("testimonial.success_deleted"));
      setSelectedIds([]);
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("testimonial.error_delete");
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    try {
      await updateTestimonialStatus({ id, status }).unwrap();
      toast.success(status ? t("testimonial.success_published") : t("testimonial.success_hidden"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("testimonial.error_update_status");
      toast.error(errorMessage);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (newFilters: {
    status?: string;
    rating?: string;
  }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const testimonials = data?.data.testimonials || [];

  return (
    <div>
      <TestimonialHeader
        onRefresh={handleRefresh}
        onFilter={handleFilter}
        onSearch={handleSearch}
        searchTerm={inputValue}
        isLoading={isFetching}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
      />

      <TestimonialList
        testimonials={testimonials}
        onDelete={handleDeleteTestimonial}
        onBulkDelete={handleBulkDeleteTestimonials}
        onUpdate={handleUpdateTestimonial}
        onUpdateStatus={handleUpdateStatus}
        isLoading={
          isLoading ||
          isDeleting ||
          isUpdating ||
          isUpdatingStatus ||
          isFetching
        }
        currentPage={data?.data.pagination?.currentPage || page}
        totalPages={data?.data.pagination?.totalPages || 1}
        totalCount={data?.data.pagination?.totalItems || 0}
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
          handleBulkDeleteTestimonials(selectedIds);
          setIsBulkDeleteModalOpen(false);
        }}
        isLoading={isDeleting}
        title={t("testimonial.delete_multiple_modal_title")}
        subtitle={t("testimonial.delete_multiple_modal_subtitle", { count: selectedIds.length })}
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

export default TestimonialContainer;
