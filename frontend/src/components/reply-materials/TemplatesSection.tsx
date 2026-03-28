/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useDeleteTemplateMutation, useGetTemplatesQuery, useSyncTemplatesStatusMutation } from "@/src/redux/api/templateApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Template } from "@/src/types/components";
import { WABAConnection } from "@/src/types/whatsapp";
import { Database, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SyncTemplateModal } from "../templates/list/SyncTemplateModal";
import { TemplateCard } from "../templates/list/TemplateCard";
import { TemplatePreviewModal } from "../templates/list/TemplatePreviewModal";

interface TemplatesSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

const TemplatesSection: React.FC<TemplatesSectionProps> = ({ wabaId, onToggleSidebar }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  const { data: connectionsResponse } = useGetConnectionsQuery({ limit: 100 });
  const connections: WABAConnection[] = connectionsResponse?.data || [];
  const currentWaba = connections.find((c) => c.id === wabaId);

  const [syncTemplatesStatus, { isLoading: isSyncingStatus }] = useSyncTemplatesStatusMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetTemplatesQuery(
    {
      waba_id: wabaId,
      search: searchQuery || undefined,
      category: categoryFilter === "all-categories" ? undefined : categoryFilter,
      status: statusFilter === "all-statuses" ? undefined : statusFilter,
    },
    { skip: !wabaId }
  );

  const templates: Template[] = response?.data || [];

  const handleRefresh = async () => {
    refetch();
    toast.success("Templates refreshed successfully");
  };

  const handleSync = async () => {
    setIsSyncModalOpen(true);
  };

  const handleSyncStatus = async () => {
    try {
      await syncTemplatesStatus({ waba_id: wabaId }).unwrap();
      toast.success("Templates status synced successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync templates status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTemplateId) return;
    try {
      const response = await deleteTemplate(deleteTemplateId).unwrap();
      toast.success(response.message || "Template deleted successfully");
      setDeleteTemplateId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete template");
      setDeleteTemplateId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "APPROVED":
        return <Badge className="bg-emerald-50 text-primary border-emerald-100 dark:border-primary dark:bg-transparent hover:bg-emerald-50 px-2 py-0.5 text-[10px] font-bold">APPROVED</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-50 dark:bg-(--card-color) dark:border-(--card-border-color) text-amber-600 border-amber-100 hover:bg-amber-50 px-2 py-0.5 text-[10px] font-bold">PENDING</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50 px-2 py-0.5 text-[10px] font-bold">REJECTED</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-50 px-2 py-0.5 text-[10px] font-bold">{s || "DRAFT"}</Badge>;
    }
  };

  const WabaDisplay = (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-xs">
      <div className="p-1.5 bg-primary/10 rounded-md">
        <Database className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider leading-none mb-0.5">Connected WABA ID</span>
        <span className="text-sm font-semibold text-slate-700 dark:text-amber-50 leading-tight">{currentWaba?.whatsapp_business_account_id || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      <CommonHeader title="Templates" description="Manage and design your WhatsApp message templates" featureKey="template_bots_used" onRefresh={handleRefresh} onSync={handleSync} onSyncStatus={handleSyncStatus} isLoading={isLoading || isFetching} isSyncingStatus={isSyncingStatus} onAddClick={() => router.push(`/templates/${wabaId}/create`)} addLabel="Create New Template" onSearch={setSearchQuery} searchTerm={searchQuery} searchPlaceholder="Search templates..." onToggleSidebar={onToggleSidebar} rightContent={WabaDisplay}>
        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 py-5 border-slate-200 dark:border-(--card-border-color) rounded-lg w-40 bg-white/50 dark:bg-(--card-color) transition-all">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200/60 shadow-xl dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="UTILITY">Utility</SelectItem>
              <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 py-5 border-slate-200 dark:border-(--card-border-color) rounded-lg w-40 bg-white/50 dark:bg-(--card-color) transition-all">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200/60 shadow-xl dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CommonHeader>

      <div className="mt-8 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-slate-500 font-medium tracking-wide">Fetching templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">
            <p className="text-sm text-slate-500 dark:text-amber-50">No templates found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template._id} template={template} onSelect={(t) => setPreviewTemplate(t)} onPreview={(t) => setPreviewTemplate(t)} onEdit={(id) => router.push(`/templates/${wabaId}/edit/${id}`)} onDelete={(id) => setDeleteTemplateId(id)} getStatusBadge={getStatusBadge} />
            ))}
          </div>
        )}
      </div>

      <TemplatePreviewModal isOpen={!!previewTemplate} onClose={() => setPreviewTemplate(null)} template={previewTemplate} />

      <ConfirmModal isOpen={!!deleteTemplateId} onClose={() => setDeleteTemplateId(null)} onConfirm={handleConfirmDelete} isLoading={isDeleting} title="Delete Template" subtitle="Are you sure you want to delete this template? This action will remove it permanently from WhatsApp." confirmText="Yes, delete it" variant="danger" />

      <SyncTemplateModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} wabaId={wabaId} onSuccess={() => refetch()} />
    </div>
  );
};

export default TemplatesSection;
