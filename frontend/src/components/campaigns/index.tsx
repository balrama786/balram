/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useDeleteCampaignMutation, useGetCampaignsQuery } from "@/src/redux/api/campaignApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Campaign } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { AlertCircle, Calendar, CheckCircle2, Clock, Edit2, Info, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Progress } from "@/src/elements/ui/progress";
import CampaignDetailModal from "./CampaignDetailModal";
import CampaignStats from "./CampaignStats";

const CampaignsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [infoCampaignId, setInfoCampaignId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: campaignsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetCampaignsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const campaigns: Campaign[] = campaignsResult?.data?.campaigns || [];
  const totalCount = campaignsResult?.data?.pagination?.totalItems || 0;

  const columns: Column<Campaign>[] = [
    {
      header: "Campaign Name",
      accessorKey: "name",
      sortable: true,
      sortKey: "name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-200">{row.name}</span>
          <span className="text-xs text-gray-400 truncate max-w-50">{row.description || "No description"}</span>
        </div>
      ),
    },
    {
      header: "Template",
      sortable: true,
      sortKey: "template_name",
      accessorKey: "template_name",
      cell: (row) => (
        <Badge variant="outline" className="bg-gray-50 text-slate-600 border-blue-100 dark:bg-(--dark-sidebar) dark:text-amber-50 dark:border-(--card-border-color)">
          {row.template_name}
        </Badge>
      ),
    },
    {
      header: "Progress",
      cell: (row) => {
        const stats = row.stats;
        const progress = stats?.total_recipients ? Math.round(((stats.total_recipients - (stats.pending_count || 0)) / stats.total_recipients) * 100) : 0;
        return (
          <div className="flex flex-col gap-1 w-24">
            <Progress value={progress} className="h-1.5" />
            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
              {progress}% ({stats?.total_recipients - (stats?.pending_count || 0)}/{stats?.total_recipients})
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const statusConfig: any = {
          draft: { icon: Clock, className: "bg-gray-100 text-gray-600 border-gray-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)", label: "Draft" },
          scheduled: { icon: Calendar, className: "bg-amber-50 text-amber-600 border-amber-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)", label: "Scheduled" },
          sending: { icon: Loader2, className: "bg-blue-50 text-blue-600 dark:text-primary border-blue-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover) animate-pulse", label: "Sending" },
          completed: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)", label: "Completed" },
          failed: { icon: AlertCircle, className: "bg-red-50 text-red-600 border-red-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)", label: "Failed" },
          completed_with_errors: { icon: AlertCircle, className: "bg-red-50 text-red-600 border-red-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)", label: "Failed" },
          cancelled: { icon: AlertCircle, className: "bg-slate-100 text-slate-600 border-slate-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)", label: "Cancelled" },
        };
        const config = statusConfig[row.status] || statusConfig.draft;
        const Icon = config.icon;
        return (
          <Badge className={`flex items-center gap-1 border ${config.className}`}>
            <Icon size={12} className={row.status === "sending" ? "animate-spin" : ""} />
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Send",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-blue-600 font-bold" title="Sent">
            {row.stats?.sent_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Delivered",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-emerald-600 font-bold" title="Delivered">
            {row.stats?.delivered_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Read",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-purple-600 font-bold" title="Read">
            {row.stats?.read_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Failed",
      cell: (row) => (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-red-500 font-bold" title="Failed">
            {row.stats?.failed_count || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Sent At",
      sortable: true,
      sortKey: "sent_at",
      cell: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs">{row?.sent_at ? formatDate(row.sent_at) : "-"}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg bg-gray-50 text-gray-500 hover:text-primary dark:bg-transparent dark:border-none border-gray-100 transition-all"
            onClick={() => {
              setInfoCampaignId(row._id || (row as any).id);
            }}
            title="Info"
          >
            <Info size={14} />
          </Button>
          {(row.status === "draft" || row.status === "scheduled") && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg bg-gray-50 text-gray-500 hover:text-amber-600 dark:bg-transparent dark:border-none border-gray-100 transition-all"
              onClick={() => {
                //edit
              }}
              title="Edit"
            >
              <Edit2 size={14} />
            </Button>
          )}
          {(row.status === "draft" || row.status === "scheduled" || row.status === "failed" || row.status === "cancelled") && (
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 dark:border-none dark:bg-transparent hover:text-white border-red-100 transition-all" onClick={() => setDeleteId(row._id || (row as any).id)} title="Delete">
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCampaign([deleteId]).unwrap();
        toast.success("Campaign deleted successfully");
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete campaign");
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const idsToDelete = selectedIds.filter((id) => !!id);
      if (idsToDelete.length === 0) return;
      await deleteCampaign(idsToDelete).unwrap();
      toast.success(`${selectedIds.length} campaigns deleted successfully`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete campaigns");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Campaigns refreshed");
  };

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader
        title="Campaigns"
        description="Broadcast messages to your audience using templates"
        middleContent={<CampaignStats stats={campaignsResult?.data?.campaignStatistics} isLoading={isLoading} />}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        featureKey="contacts_used"
        searchPlaceholder="Search campaigns..."
        onRefresh={handleRefresh}
        onAddClick={() => {
          router.push("/campaigns/create");
        }}
        addLabel="Create Campaign"
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedIds.length}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:border-(--card-border-color) dark:bg-(--card-color)">
        <DataTable data={campaigns} columns={columns} isLoading={isLoading} isFetching={isFetching} totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id || (item as any).id} emptyMessage={searchTerm ? `No campaigns found matching "${searchTerm}"` : "No campaigns created yet."} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <CampaignDetailModal isOpen={!!infoCampaignId} onClose={() => setInfoCampaignId(null)} campaignId={infoCampaignId} />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Campaign" subtitle="Are you sure you want to delete this campaign? This action cannot be undone." confirmText="Delete" variant="danger" />

      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Campaigns" subtitle={`Are you sure you want to delete ${selectedIds.length} selected campaigns? Only draft or scheduled campaigns will be deleted.`} confirmText="Delete All" variant="danger" />
    </div>
  );
};

export default CampaignsPage;
