/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { useGetMetaTemplatesQuery, useSyncMetaTemplatesMutation } from "@/src/redux/api/templateApi";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface SyncTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  wabaId: string;
  onSuccess: () => void;
}

export const SyncTemplateModal = ({ isOpen, onClose, wabaId, onSuccess }: SyncTemplateModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: response, isLoading, refetch } = useGetMetaTemplatesQuery({ waba_id: wabaId }, { skip: !isOpen });
  const [syncTemplates, { isLoading: isSyncing }] = useSyncMetaTemplatesMutation();

  const templates = response?.data || [];

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return templates;
    const lowerQuery = searchQuery.toLowerCase();
    return templates.filter((t: any) => t.name?.toLowerCase().includes(lowerQuery) || t.category?.toLowerCase().includes(lowerQuery));
  }, [templates, searchQuery]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTemplates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTemplates.map((t: any) => t.id));
    }
  };

  const handleSync = async () => {
    if (selectedIds.length === 0) return;
    try {
      await syncTemplates({
        waba_id: wabaId,
        meta_template_ids: selectedIds,
      }).unwrap();

      toast.success(`${selectedIds.length} templates synced successfully`);
      onSuccess();
      onClose();
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync templates");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0! overflow-hidden dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color)">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-primary tracking-tight text-left">Sync Templates from Meta</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 font-medium">Select the templates you want to import to your account.</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading} className="rounded-lg text-slate-400 hover:text-primary transition-all">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="mt-6 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input placeholder="Search Meta templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-10 bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:border-primary transition-all rounded-lg text-sm" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 pt-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500 font-medium tracking-wide">Fetching from Meta...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 dark:bg-(--page-body-bg)/50 rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">
              <p className="text-sm text-slate-500">No templates found</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-(--card-color) rounded-t-lg border border-slate-100 dark:border-(--card-border-color) border-b">
                <Checkbox checked={selectedIds.length === filteredTemplates.length && filteredTemplates.length > 0} onCheckedChange={toggleSelectAll} className="w-4.5 h-4.5" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Template Name</span>
                <span className="ml-auto text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category / Status</span>
              </div>

              <div className="border border-slate-100 dark:border-(--card-border-color) border-t-0 rounded-b-lg divide-y divide-slate-100 dark:divide-(--card-border-color)">
                {filteredTemplates.map((template: any) => (
                  <div key={template.id} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-emerald-500/5 transition-colors cursor-pointer ${selectedIds.includes(template.id) ? "bg-emerald-50/30 dark:bg-emerald-500/10" : ""}`} onClick={() => toggleSelection(template.id)}>
                    <Checkbox checked={selectedIds.includes(template.id)} onCheckedChange={() => toggleSelection(template.id)} className="w-4.5 h-4.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-bold text-slate-700 dark:text-gray-200 tracking-tight break-all">{template.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 font-mono tracking-tighter">ID: {template.id}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                      <Badge variant="outline" className="h-5 text-[10px] font-medium border-slate-200 text-slate-500 bg-white dark:bg-(--page-body-bg) dark:border-primary dark:text-primary">
                        {template.category}
                      </Badge>
                      <Badge className={`h-5 text-[10px] font-medium ${template.status === "APPROVED" ? "bg-emerald-50 dark:bg-emerald-900/20 dark:border-(--card-border-color) text-primary border-emerald-100 " : template.status === "REJECTED" ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{template.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-(--card-border-color) flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
          <p className="text-[11px] text-slate-500 font-medium">{selectedIds.length} templates selected</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose} className="h-10 px-6 dark:bg-(--page-body-bg) font-bold text-slate-500">
              Cancel
            </Button>
            <Button onClick={handleSync} disabled={selectedIds.length === 0 || isSyncing} className="h-10 px-8 bg-primary text-white font-bold rounded-lg shadow-sm">
              {isSyncing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sync Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
