/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { useDeleteAgentMutation, useGetAgentDataQuery, useUpdateAgentStatusMutation, useUpdatePhonenoStatusMutation } from "@/src/redux/api/agentApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Agent } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { ClipboardList, Edit2, Mail, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AgentPage = () => {
  const router = useRouter();
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const initialColumns = [
    { id: "Agent Info", label: "Agent Info", isVisible: true },
    { id: "Contact Details", label: "Contact Details", isVisible: true },
    { id: "Note", label: "Note", isVisible: true },
    { id: "Hide Phone", label: "Hide Phone", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
    { id: "Created", label: "Created", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const {
    data: agentsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetAgentDataQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [updateAgentStatus, { isLoading: isStatusUpdating }] = useUpdateAgentStatusMutation();
  const [updatePhonenoStatus, { isLoading: isPhonenoUpdating }] = useUpdatePhonenoStatusMutation();
  const [deleteAgent, { isLoading: isDeleting }] = useDeleteAgentMutation();

  const agents: Agent[] = agentsResult?.data?.agents || [];
  const totalCount = agentsResult?.data?.pagination?.totalItems || 0;

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateAgentStatus({ id, status: !currentStatus }).unwrap();
      toast.success(`Agent ${!currentStatus ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handlePhonenoToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updatePhonenoStatus({ id, is_phoneno_hide: !currentStatus }).unwrap();
      toast.success(`Phone number ${!currentStatus ? "hidden" : "visible"} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update phone status");
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteAgent([deleteId]).unwrap();
        toast.success("Agent deleted successfully");
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.data?.message || "Failed to delete agent");
      }
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteAgent(selectedIds).unwrap();
      toast.success(`${selectedIds.length} agents deleted successfully`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to delete agents");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const columns: Column<Agent>[] = [
    {
      header: "Agent Info",
      sortable: true,
      sortKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-(--page-body-bg) dark:border-none flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0">
            <User size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-700 dark:text-white text-base">{row.name}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Mail size={13} className="text-slate-400" />
              <span>{maskSensitiveData(row.email, "email", is_demo_mode)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Details",
      sortable: true,
      sortKey: "country_code",
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            <span>
              {row.country_code} {maskSensitiveData(row.phone, "phone", is_demo_mode)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Note",
      cell: (row) => <span className="text-slate-500 dark:text-slate-300 font-medium py-0.5 rounded-md line-clamp-1 max-w-55">{row.note}</span>,
    },
    {
      header: "Hide Phone",
      sortable: true,
      sortKey: "is_phoneno_hide",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Switch checked={row.is_phoneno_hide || false} onCheckedChange={() => handlePhonenoToggle(row._id, row.is_phoneno_hide || false)} disabled={isPhonenoUpdating} className="data-[state=checked]:bg-primary shadow-xs" />
        </div>
      ),
    },
    {
      header: "Status",
      sortable: true,
      sortKey: "status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Switch checked={row.status} onCheckedChange={() => handleStatusToggle(row._id, row.status)} disabled={isStatusUpdating} className="data-[state=checked]:bg-primary shadow-xs" />
          <Badge variant="outline" className={`font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg border-2 transition-colors ${row.status ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20" : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-(--page-body-bg) dark:text-gray-500 dark:border-(--card-border-color)"}`}>
            {row.status ? "Active" : "InActive"}
          </Badge>
        </div>
      ),
    },
    {
      header: "Created",
      sortable: true,
      sortKey: "created_at",
      cell: (row) => (
        <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
          <div className="p-1.5 bg-slate-50 dark:bg-(--dark-sidebar) rounded-lg"></div>
          <span className="dark:text-gray-400">{formatDate(row.created_at)}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg bg-white border-slate-200 text-slate-500 border-none hover:text-primary hover:border-primary/20 dark:hover:text-amber-50 hover:bg-primary/5 dark:bg-(--card-color) shadow-xs transition-all" onClick={() => router.push(`/agents/task/${row._id}`)}>
            <ClipboardList size={16} />
          </Button>
          <Button variant="outline" size="icon" disabled={is_demo_mode} className="w-10 h-10 border-none text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" onClick={() => router.push(`/agents/${row._id}/edit`)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 border-none" onClick={() => setDeleteId(row._id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:p-8 p-4 space-y-8 min-h-screen bg-slate-50/30 dark:bg-transparent animate-in fade-in duration-500">
      <CommonHeader
        title="Agent Directory"
        description="Streamline your team operations by managing agent profiles and permissions in one place."
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Find agents by name, email, or role..."
        onRefresh={() => {
          refetch();
          toast.success("Agent directory synced");
        }}
        onAddClick={() => router.push("/agents/create")}
        addLabel="Add New Agent"
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onBulkDelete={() => setBulkConfirmOpen(true)}
        selectedCount={selectedIds.length}
        featureKey="staff_used"
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg mt-8 border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable data={agents} columns={columns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching || isDeleting} totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No agents found matching "${searchTerm}"` : "Your directory is empty. Start by adding your team members!"} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Permanently Remove Agent?" subtitle="This will disconnect the agent from all active chats and revoke their access immediately. This action is final." confirmText="Yes, remove agent" variant="danger" />

      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Sync Removal" subtitle={`You are about to permanently delete ${selectedIds.length} agents from your directory. Confirm to proceed?`} confirmText="Delete selected" variant="danger" />
    </div>
  );
};

export default AgentPage;
