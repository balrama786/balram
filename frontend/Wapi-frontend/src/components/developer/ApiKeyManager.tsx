/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { ApiKey, useCreateApiKeyMutation, useDeleteApiKeyMutation, useGetApiKeysQuery } from "@/src/redux/api/apiKeyApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { Clock, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ApiKeyManager = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  const {
    data: result,
    isLoading,
    refetch,
    isFetching,
  } = useGetApiKeysQuery({
    page,
    limit,
    // Note: The backend controller doesn't seem to support 'search' in listApiKeys yet,
    // but we can pass it if we update the backend later.
  });

  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();
  const [deleteApiKeys, { isLoading: isDeleting }] = useDeleteApiKeyMutation();

  const apiKeys = result?.data || [];
  const totalCount = result?.pagination?.totalItems || 0;

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    try {
      const res = await createApiKey({ name: newKeyName }).unwrap();
      if (res.success) {
        setNewKeyName("");
        setIsCreateModalOpen(false);
        toast.success(t("api_keys.create_success"));

        // Optionally copy the key to clipboard since we close immediately
        if ((res as any).api_key) {
          navigator.clipboard.writeText((res as any).api_key);
          toast.info("API Key copied to clipboard");
        }
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create API key");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      const res = await deleteApiKeys({ ids }).unwrap();
      if (res.success) {
        toast.success(ids.length > 1 ? t("api_keys.delete_success") : "API key deleted successfully");
        setSelectedIds([]);
        setDeleteId(null);
        setBulkConfirmOpen(false);
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete API key");
    }
  };

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const columns: Column<ApiKey>[] = [
    {
      header: t("api_keys.key_name"),
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-primary flex items-center justify-center">
            <Key size={14} />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-tight">{row.name}</span>
        </div>
      ),
    },
    {
      header: t("api_keys.api_key"),
      accessorKey: "prefix",
      copyable: true,
      cell: (row) => {
        const isRevealed = revealedIds.includes(row.id);
        return (
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono bg-slate-100 dark:bg-(--dark-body) px-2 py-1 rounded text-slate-600 dark:text-emerald-400 min-w-30">{isRevealed ? `${row.prefix}••••••••••••` : `${row.prefix}••••••••••••`}</code>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleReveal(row.id);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-all flex items-center justify-center"
              title={isRevealed ? "Hide Prefix" : "Show Prefix"}
            >
              {isRevealed ? <EyeOff size={14} className="text-primary" /> : <Eye size={14} />}
            </button>
          </div>
        );
      },
    },
    {
      header: t("api_keys.created_at"),
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-gray-300">
          <Clock size={12} className="text-slate-400" />
          {formatDate(row.created_at)}
        </div>
      ),
    },
    {
      header: t("api_keys.actions"),
      className: "text-right",
      cell: (row) => (
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg bg-white border-none text-slate-500 hover:text-red-600 dark:bg-transparent dark:hover:bg-red-900/20 hover:border-red-200 hover:bg-red-50 shadow-xs transition-all" onClick={() => setDeleteId(row.id)}>
          <Trash2 size={14} />
        </Button>
      ),
    },
  ];

  // Client-side filtering as the backend doesn't support search yet
  const filteredData = apiKeys.filter((k) => k.name?.toLowerCase().includes(searchTerm.toLowerCase()) || k.prefix?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-8 pb-20 overflow-y-auto h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 custom-scrollbar">
      <CommonHeader
        title={t("api_keys.title")}
        description={t("api_keys.subtitle")}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        searchPlaceholder={t("api_keys.search_placeholder")}
        onRefresh={() => {
          refetch();
          toast.success("Successfully refresh table.");
        }}
        onAddClick={() => setIsCreateModalOpen(true)}
        addLabel={t("api_keys.create_key")}
        isLoading={isLoading}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setBulkConfirmOpen(true)}
      />

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        totalCount={searchTerm ? filteredData.length : totalCount}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        enableSelection={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowId={(item) => item.id}
        emptyMessage={searchTerm ? `No API keys found matching "${searchTerm}"` : "No API keys found. Create your first one."}
      />

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            setNewKeyName("");
          }
        }}
      >
        <DialogContent className="sm:max-w-106.25 dark:bg-(--card-color) dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-(--dark-body) text-primary flex items-center justify-center">
                <Plus size={18} />
              </div>
              {t("api_keys.create_key")}
            </DialogTitle>
            <DialogDescription>Provide a name for your API key to help you identify it later.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Key Name</label>
              <Input placeholder="e.g. My Website Bot" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="rounded-lg h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color)" autoFocus />
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1 rounded-lg h-11 border-slate-200">
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating} className="flex-1 rounded-lg text-white h-11">
                {isCreating ? "Creating..." : "Create Key"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modals */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) handleDelete([deleteId]);
        }}
        isLoading={isDeleting}
        title="Delete API Key"
        subtitle={t("api_keys.delete_confirm")}
        confirmText="Delete"
        variant="danger"
      />

      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={() => handleDelete(selectedIds)} isLoading={isDeleting} title="Bulk Delete API Keys" subtitle={t("api_keys.bulk_delete_confirm")} confirmText="Delete All" variant="danger" />
    </div>
  );
};

export default ApiKeyManager;
