"use client";

import { useDeleteUsersMutation, useGetAllUsersQuery } from "@/src/redux/api/userApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { GetUsersParams } from "@/src/types/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import UserList from "./UserList";

const UserListContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const queryParams: GetUsersParams = {
    page,
    limit,
    search: search || undefined,
    role: "all",
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  };

  const { data, isLoading, refetch } = useGetAllUsersQuery(queryParams);
  const [deleteUsers, { isLoading: isDeleting }] = useDeleteUsersMutation();

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.totalItems ?? 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteUsers({ ids: [id] }).unwrap();
      toast.success(t("manage_users.delete_success"));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch {
      toast.error(t("manage_users.delete_error"));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteUsers({ ids: selectedIds }).unwrap();
      toast.success(t("manage_users.bulk_delete_success", { count: selectedIds.length }));
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch {
      toast.error(t("manage_users.bulk_delete_error"));
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info(t("manage_users.refreshed"));
  };

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader title={t("manage_users.title")} description={t("manage_users.description")} searchTerm={search} onSearch={setSearch} onRefresh={handleRefresh} isLoading={isLoading} onAddClick={() => router.push("/manage_users/add")} addLabel={t("manage_users.add_user_label")} addPermission="create.users" bulkDeletePermission="delete.users" selectedCount={selectedIds.length} onBulkDelete={() => setShowBulkDeleteModal(true)} bulkActionLoading={isDeleting} />

      <UserList
        users={users}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        isLoading={isLoading || isDeleting}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onDelete={handleDelete}
        onBulkDelete={() => setShowBulkDeleteModal(true)}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onSortChange={handleSortChange}
      />

      <ConfirmModal isOpen={showBulkDeleteModal} onClose={() => setShowBulkDeleteModal(false)} onConfirm={handleBulkDelete} isLoading={isDeleting} title={t("manage_users.confirm_delete_title")} subtitle={t("manage_users.confirm_delete_subtitle", { count: selectedIds.length })} confirmText={t("manage_users.confirm_delete_btn")} cancelText={t("common.cancel")} variant="danger" />
    </div>
  );
};

export default UserListContainer;
