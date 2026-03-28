"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { User } from "@/src/types/store";
import { format } from "date-fns";
import { Edit, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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

const UserList = ({
  users,
  page,
  totalPages,
  total,
  limit,
  isLoading,
  onPageChange,
  onLimitChange,
  onDelete,
  onBulkDelete,
  selectedIds,
  onSelectionChange,
  onSortChange,
}: UserListProps) => {
  const router = useRouter();

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

  const renderActions = (user: User) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => router.push(`/manage_users/add?id=${user._id}`)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Edit user" disabled={isLoading}>
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <DataTable
      data={users}
      columns={columns}
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      isLoading={isLoading}
      onDelete={(user) => onDelete(user._id)}
      onBulkDelete={onBulkDelete}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      emptyMessage="No users found"
      itemLabel="Users"
      renderActions={renderActions}
      onSortChange={onSortChange}
    />
  );
};

export default UserList;
