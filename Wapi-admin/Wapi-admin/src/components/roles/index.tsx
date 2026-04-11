/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteRolesMutation, useGetAllRolesQuery, useToggleRoleStatusMutation } from "@/src/redux/api/roleApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import RoleHeader from "./RoleHeader";
import RoleList from "./RoleList";

const RoleContainer = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [columns, setColumns] = useState([
    { id: "name", label: "Role Name", isVisible: true },
    { id: "description", label: "Description", isVisible: true },
    { id: "sort_order", label: "Sort Order", isVisible: true },
    { id: "system_reserved", label: "System", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
  ]);

  const { data: rolesData, isLoading } = useGetAllRolesQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [deleteRoles, { isLoading: isDeleting }] = useDeleteRolesMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleRoleStatusMutation();

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteRoles([id]).unwrap();
      toast.success(res.message || "Role deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete role");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await deleteRoles(ids).unwrap();
      toast.success(res.message || `${ids.length} role(s) deleted successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete roles");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await toggleStatus(id).unwrap();
      toast.success(res.message || "Status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  return (
    <div className="space-y-6">
      <RoleHeader searchTerm={searchTerm} onSearch={handleSearch} onAddClick={() => router.push("/roles/add")} isLoading={isLoading} selectedCount={selectedIds.length} onBulkDelete={() => setIsBulkDeleteModalOpen(true)} columns={columns} onColumnToggle={handleColumnToggle} />

      <RoleList
        roles={rolesData?.data?.roles || []}
        isLoading={isLoading || isDeleting || isToggling}
        total={rolesData?.data?.pagination?.totalItems || 0}
        page={page}
        totalPages={rolesData?.data?.pagination?.totalPages || 0}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onToggleStatus={handleToggleStatus}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onSortChange={(by, order) => {
          setSortBy(by);
          setSortOrder(order);
        }}
        visibleColumns={columns.filter((c) => c.isVisible).map((c) => c.id)}
      />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={() => handleBulkDelete(selectedIds)} isLoading={isDeleting} title="Delete Roles" subtitle={`Are you sure you want to delete ${selectedIds.length} selected role(s)? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" variant="danger" loadingText="Deleting..." />
    </div>
  );
};

export default RoleContainer;
