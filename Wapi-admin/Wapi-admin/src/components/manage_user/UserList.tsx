"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { User } from "@/src/types/store";
import { format } from "date-fns";
import { CreditCard, Edit, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Can from "../shared/Can";
import AssignPlanModal from "./AssignPlanModal";

interface UserListProps {
  users: User[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const UserList = ({ users, page, totalPages, total, limit, isLoading, onPageChange, onLimitChange, onDelete, onBulkDelete, selectedIds, onSelectionChange, onSortChange }: UserListProps) => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleOpenAssignModal = (user: User) => {
    setSelectedUser(user);
    setIsAssignModalOpen(true);
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "User",
      className: "[@media(max-width:1240px)]:min-w-[160px]",
      copyable: true,
      copyField: "email",
      sortable: true,
      sortKey: "name",
      accessor: (user) => (
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push(`/manage_users/add?id=${user._id}`)}>
          <div className="w-8 h-8 rounded-lg bg-(--light-primary) dark:bg-(--dark-body) flex items-center justify-center shrink-0">
            <UserIcon className="w-4 h-4 text-(--text-green-primary)" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      className: "[@media(max-width:1240px)]:min-w-[120px]",
      sortable: true,
      sortKey: "role_id",
      accessor: (user) => {
        const roleName = typeof user.role_id === "object" ? user.role_id?.name : user.role || "—";
        return <Badge className="bg-blue-50 text-blue-600 border-none hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 capitalize">{roleName}</Badge>;
      },
    },
    {
      header: "Phone",
      className: "[@media(max-width:1240px)]:min-w-[160px]",
      copyable: true,
      copyField: "phone",
      sortable: true,
      sortKey: "phone",
      accessor: (user) => <span className="text-sm text-gray-600 dark:text-gray-400">{user.phone || "—"}</span>,
    },
    {
      header: "Status",
      className: "[@media(max-width:1240px)]:min-w-[125px]",
      sortable: true,
      sortKey: "status",
      accessor: (user) => <Badge className={`border-none text-xs font-medium ${user.status ? "bg-(--light-primary) hover:bg-(--light-primary) text-primary dark:bg-emerald-900/20 dark:text-primary" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>{user.status ? "Active" : "Inactive"}</Badge>,
    },
    {
      header: "Plan",
      className: "[@media(max-width:1240px)]:min-w-[120px]",
      accessor: (user) =>
        user.current_plan ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{user.current_plan.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user.current_plan.billing_cycle}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">No plan</span>
        ),
    },
    {
      header: "Joined",
      className: "[@media(max-width:1240px)]:min-w-[140px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (user) => <span className="text-sm text-gray-500 dark:text-gray-400">{user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "—"}</span>,
    },
  ];

  const renderActions = (user: User) => {
    const roleName = (typeof user.role_id === "object" ? user.role_id?.name : user.role) || "—";
    const isSuperAdmin = roleName.toLowerCase() === "super_admin";

    return (
      <div className="flex items-center gap-1">
        {!isSuperAdmin && (
          <Can permission="create.subscriptions">
            <Button variant="ghost" size="icon" onClick={() => handleOpenAssignModal(user)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Assign plan" disabled={isLoading}>
              <CreditCard className="w-4 h-4" />
            </Button>
          </Can>
        )}
        <Can permission="update.users">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/manage_users/add?id=${user._id}`)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Edit user" disabled={isLoading}>
            <Edit className="w-4 h-4" />
          </Button>
        </Can>
      </div>
    );
  };

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        limit={limit}
        onDelete={(item: User) => onDelete(item._id)}
        canDelete={(user: User) => {
          const role = typeof user.role_id === "object" ? user.role_id?.name : user.role;
          return role?.toLowerCase() !== "super_admin";
        }}
        deletePermission="delete.users"
        actionPermissions={["update.users"]}
        onBulkDelete={onBulkDelete}
        isLoading={isLoading}
        itemLabel="Users"
        itemLabelSingular="User"
        renderActions={renderActions}
        onSelectionChange={onSelectionChange}
        selectedIds={selectedIds}
        onSortChange={onSortChange}
      />
      <AssignPlanModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} user={selectedUser} />
    </>
  );
};

export default UserList;
