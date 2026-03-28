/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useGetKeywordActionsQuery, useDeleteKeywordActionMutation, useBulkDeleteKeywordActionsMutation } from "@/src/redux/api/keywordActionApi";
import { KeywordAction } from "@/src/types/keyword-action";

const MATCHING_METHOD_LABELS: Record<string, string> = {
  exact: "Exact",
  contains: "Contains",
  partial: "Partial",
  starts_with: "Starts With",
  ends_with: "Ends With",
};

const MATCHING_METHOD_COLORS: Record<string, string> = {
  exact: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  contains: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400",
  partial: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400",
  starts_with: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-(--card-border-color)",
  ends_with: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400",
};

const KeywordActionPage: React.FC = () => {
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetKeywordActionsQuery({ waba_id: wabaId, page, limit, search }, { skip: !wabaId });
  const [deleteAction, { isLoading: isDeleting }] = useDeleteKeywordActionMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteKeywordActionsMutation();

  const items = data?.data || [];
  const pagination = data?.pagination;

  const columns = useMemo(
    () => [
      {
        header: "Keywords",
        cell: (row: KeywordAction) => (
          <div className="flex flex-wrap gap-1.5">
            {row.keywords.slice(0, 3).map((kw) => (
              <span key={kw} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/10">
                {kw}
              </span>
            ))}
            {row.keywords.length > 3 && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-(--dark-body)">+{row.keywords.length - 3}</span>}
          </div>
        ),
      },
      {
        header: "Method",
        cell: (row: KeywordAction) => (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${MATCHING_METHOD_COLORS[row.matching_method] || ""}`}>
            {MATCHING_METHOD_LABELS[row.matching_method] || row.matching_method}
            {row.matching_method === "partial" && row.partial_percentage !== undefined && <span className="ml-1 opacity-60">({row.partial_percentage}%)</span>}
          </span>
        ),
      },
      {
        header: "Reply Type",
        cell: (row: KeywordAction) => (
          <Badge variant="outline" className="capitalize font-semibold text-slate-500 dark:text-slate-400">
            {row.reply_type}
          </Badge>
        ),
      },
      {
        header: "Reply",
        cell: (row: KeywordAction) => {
          const name = (row.reply_id as any)?.name || (row.reply_id as any)?.template_name || (row.reply_id as any)?.display_name || "—";
          return <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs block">{name}</span>;
        },
      },
      {
        header: "Status",
        cell: (row: KeywordAction) => (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${row.status === "active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${row.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
            {row.status === "active" ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: (row: KeywordAction) => (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/keyword_action/${row._id}/edit`);
              }}
              className="w-10 h-10 text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all"
            >
              <Edit2 size={14} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setItemToDelete(row._id);
              }}
              className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ),
        className: "w-24",
      },
    ],
    [router]
  );

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await deleteAction(itemToDelete).unwrap();
      toast.success(res.message || "Deleted successfully");
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await bulkDelete(selectedIds).unwrap();
      toast.success(res.message || "Deleted successfully");
      setSelectedIds([]);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to bulk delete");
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <CommonHeader title="Keyword Action" description="Automatically reply to messages based on keywords" searchTerm={search} onSearch={setSearch} searchPlaceholder="Search by keyword..." onAddClick={() => router.push("/keyword_action/create")} addLabel="Add Keyword Action" isLoading={isLoading || isFetching} onBulkDelete={selectedIds.length > 0 ? () => setItemToDelete("bulk") : undefined} selectedCount={selectedIds.length} />

      <DataTable<KeywordAction>
        data={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No keyword actions found. Create one to automate keyword-based replies."
        enableSelection
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        totalCount={pagination?.totalItems}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />

      <ConfirmModal isOpen={!!itemToDelete && itemToDelete !== "bulk"} onClose={() => setItemToDelete(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Keyword Action?" subtitle="This will permanently remove this keyword action. This action cannot be undone." />

      <ConfirmModal isOpen={itemToDelete === "bulk"} onClose={() => setItemToDelete(null)} onConfirm={handleBulkDelete} isLoading={isBulkDeleting} title="Bulk Delete Keyword Actions?" subtitle={`You are about to delete ${selectedIds.length} keyword action(s). This action cannot be undone.`} />
    </div>
  );
};

export default KeywordActionPage;
