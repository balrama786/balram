"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetAllModelsQuery,
  useBulkDeleteModelsMutation,
  useToggleModelStatusMutation,
} from "@/src/redux/api/aiModelApi";
import { toast } from "sonner";
import CommonHeader from "@/src/shared/CommonHeader";
import AIModelsList from "./AIModelsList";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import { AIModel } from "@/src/types/store";

const AIModelsContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data, isLoading, refetch, isFetching } = useGetAllModelsQuery({
    search: searchTerm,
    page,
    limit,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [bulkDeleteModels, { isLoading: isBulkDeleting }] =
    useBulkDeleteModelsMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleModelStatusMutation();

  const handleToggleStatus = async (
    id: string,
    currentStatus: AIModel["status"],
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await toggleStatus({ id: id, status: newStatus }).unwrap();
      toast.success(t("ai_models.status_update_success"));
      refetch();
    } catch {
      toast.error(t("ai_models.status_update_error"));
    }
  };

  const handleDelete = async () => {
    if (!modelToDelete) return;
    try {
      await bulkDeleteModels([modelToDelete]).unwrap();
      toast.success(t("ai_models.delete_success"));
      setIsDeleteModalOpen(false);
      setModelToDelete(null);
      refetch();
    } catch {
      toast.error(t("ai_models.delete_error"));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteModels(selectedModels).unwrap();
      toast.success(
        t("ai_models.bulk_delete_success", { count: selectedModels.length }),
      );
      setSelectedModels([]);
      refetch();
    } catch {
      toast.error(t("ai_models.bulk_delete_error"));
    }
  };

  const [columns, setColumns] = useState([
    { id: "display_name", label: t("ai_models.name"), isVisible: true },
    { id: "provider", label: t("ai_models.provider"), isVisible: true },
    { id: "model_id", label: t("ai_models.model_name"), isVisible: true },
    { id: "api_endpoint", label: t("ai_models.base_url"), isVisible: true },
    { id: "status", label: t("common.status"), isVisible: true },
    { id: "is_default", label: t("ai_models.is_default"), isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  return (
    <div>
      <CommonHeader
        title={t("ai_models.title")}
        description={t("ai_models.add_subtitle")}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onAddClick={() => router.push("/ai_models/create")}
        addLabel={t("ai_models.add_new")}
        onRefresh={refetch}
        isLoading={isLoading || isFetching}
        selectedCount={selectedModels.length}
        onBulkDelete={handleBulkDelete}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="mt-8">
        <AIModelsList
          models={data?.data.models || []}
          isLoading={isLoading || isFetching || isBulkDeleting || isToggling}
          selectedIds={selectedModels}
          onSelectionChange={setSelectedModels}
          onToggleStatus={handleToggleStatus}
          onDelete={(model) => {
            setModelToDelete(model._id);
            setIsDeleteModalOpen(true);
          }}
          onEdit={(id) => router.push(`/ai_models/edit/${id}`)}
          columns={columns}
          page={page}
          limit={limit}
          totalCount={data?.data.pagination.totalItems || 0}
          totalPages={data?.data.pagination.totalPages || 1}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onBulkDelete={handleBulkDelete}
          onSortChange={handleSortChange}
        />
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t("ai_models.delete_modal_title")}
        subtitle={t("ai_models.delete_modal_subtitle", {
          name:
            data?.data.models.find((m) => m._id === modelToDelete)
              ?.display_name || "",
        })}
        isLoading={isBulkDeleting}
      />
    </div>
  );
};

export default AIModelsContainer;
