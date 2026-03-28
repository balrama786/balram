/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useBulkDeleteImportJobsMutation, useGetImportJobsQuery } from "@/src/redux/api/importJobApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { ImportJobData } from "@/src/types/import";
import { Trash2, FileText, CheckCircle2, XCircle, Clock, Loader2, AlertCircle, FileDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/src/elements/ui/badge";
import { cn } from "@/src/lib/utils";

const ImportJobTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({ key: "created_at", order: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetImportJobsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteImportJobsMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleSingleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await bulkDelete({ ids: [deleteId] }).unwrap();
      if (result.success) {
        toast.success("Import job deleted successfully");
        setDeleteId(null);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete import job");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const result = await bulkDelete({ ids: selectedIds }).unwrap();
      if (result.success) {
        toast.success(`${selectedIds.length} import jobs deleted successfully`);
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete import jobs");
    }
  };

  const handleDownloadErrors = (item: ImportJobData) => {
    if (!item.errors || item.errors.length === 0) {
      toast.error("No errors found for this import job");
      return;
    }

    const cleanErrorMessage = (msg: string) => {
      if (!msg) return msg;
      let cleaned = msg;
      if (cleaned.includes("Cast to Map failed for value")) {
        cleaned = cleaned.replace(/"{[\s\S]*?}"/g, "{...[Internal Data Object]...}");
      }
      if (cleaned.length > 1000) {
        cleaned = cleaned.substring(0, 1000) + "... [Full error truncated]";
      }
      return cleaned;
    };

    const content = [`IMPORT JOB REPORT`, `-----------------`, `File Name: ${item.original_filename || "Unknown"}`, `Status: ${item.status?.toUpperCase()}`, `Date: ${new Date(item.created_at).toLocaleString().replace(/\s+/g, " ")}`, `Total Records: ${item.total_records}`, `Processed Successfully: ${item.processed_count}`, `Failed Records: ${item.error_count}`, `\nERROR DETAILS`, `-------------`, ...item.errors.map((error, index) => `${index + 1}. ${cleanErrorMessage(error)}`), `\n--- End of Report ---`].join("\n");

    const fileName = item.original_filename ? item.original_filename.split(".")[0] : "import-job";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `import-${fileName}-${item._id.substring(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Error log downloaded successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
            <CheckCircle2 size={12} /> Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
            <XCircle size={12} /> Failed
          </Badge>
        );
      case "progress":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1.5 px-2.5 py-0.5 animate-pulse font-bold">
            <Loader2 size={12} className="animate-spin" /> In Progress
          </Badge>
        );
      case "started":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
            <Clock size={12} /> Started
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
            <AlertCircle size={12} /> Idle
          </Badge>
        );
    }
  };

  const initialColumns = [
    { id: "File Name", label: "File Name", isVisible: true },
    { id: "Progress", label: "Progress", isVisible: true },
    { id: "Errors", label: "Errors", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
    { id: "Created At", label: "Created At", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const columns = useMemo<Column<ImportJobData>[]>(
    () => [
      {
        header: "File Name",
        className: "[@media(max-width:1540px)]:min-w-[290px]",
        accessorKey: "original_filename",
        sortable: true,
        sortKey: "original_filename",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-500">
              <FileText size={16} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">{item.original_filename}</div>
          </div>
        ),
      },
      {
        header: "Progress",
        className: "[@media(max-width:1540px)]:min-w-[195px]",
        accessorKey: "processed_count",
        sortable: true,
        sortKey: "processed_count",
        cell: (item) => (
          <div className="space-y-1.5 min-w-30">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>{Math.round((item.processed_count / (item.total_records || 1)) * 100)}%</span>
              <span>
                {item.processed_count} / {item.total_records}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={cn("h-full transition-all duration-500", item.status === "completed" ? "bg-emerald-500" : item.status === "failed" ? "bg-red-500" : "bg-primary animate-pulse")} style={{ width: `${(item.processed_count / (item.total_records || 1)) * 100}%` }} />
            </div>
          </div>
        ),
      },
      {
        header: "Errors",
        className: "[@media(max-width:1540px)]:min-w-[135px]",
        accessorKey: "error_count",
        sortable: true,
        sortKey: "error_count",
        cell: (item) => <div className={cn("font-bold text-center", item.error_count > 0 ? "text-red-500" : "text-slate-400")}>{item.error_count}</div>,
      },
      {
        header: "Status",
        className: "[@media(max-width:1540px)]:min-w-[180px]",
        accessorKey: "status",
        sortable: true,
        sortKey: "status",
        cell: (item) => getStatusBadge(item.status),
      },
      {
        header: "Created At",
        className: "[@media(max-width:1540px)]:min-w-[210px]",
        accessorKey: "created_at",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{new Date(item.created_at).toLocaleString()}</div>,
      },
      {
        header: "Actions",
        className: "text-right [@media(max-width:1540px)]:min-w-[160px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className={cn("h-10 w-10 border-none p-0 text-slate-500 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-500/10", (!item.errors || item.errors.length === 0) && "opacity-50 cursor-not-allowed")} onClick={() => handleDownloadErrors(item)} title="Download Error Log" disabled={!item.errors || item.errors.length === 0}>
              <FileDown size={16} />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 border-none hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" onClick={() => setDeleteId(item._id)} title="Delete">
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title="Import Jobs"
        description="Monitor and manage your background contact import tasks."
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search by file name..."
        onRefresh={() => {
          refetch();
          toast.success("Refreshed");
        }}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable<ImportJobData> data={response?.data?.import_jobs || []} columns={columns.filter((col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching} totalCount={response?.data?.pagination?.totalItems || 0} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} onSortChange={handleSortChange} enableSelection selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No import jobs found for "${searchTerm}"` : "No import tasks found."} />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleSingleDelete} isLoading={isBulkDeleting} title="Delete Import Job" subtitle="Are you sure you want to delete this import job history? This will not affect imported contacts." variant="danger" />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleBulkDelete} isLoading={isBulkDeleting} title="Bulk Delete" subtitle={`Are you sure you want to delete ${selectedIds.length} import jobs? This action cannot be undone.`} variant="danger" />
    </div>
  );
};

export default ImportJobTable;
