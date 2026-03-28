"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { Workspace } from "@/src/types/workspace";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/src/elements/ui/sheet";
import { Building2, CheckCircle2, Loader2, Plus, Wifi, WifiOff, Edit2, Trash2 } from "lucide-react";
import WorkspaceFormModal from "./WorkspaceFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Button } from "@/src/elements/ui/button";
import { useDeleteWorkspaceMutation } from "@/src/redux/api/workspaceApi";
import { toast } from "sonner";
import { clearWorkspace } from "@/src/redux/reducers/workspaceSlice";

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceSwitcherModal({ isOpen, onClose }: WorkspaceSwitcherModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { isRTL } = useAppSelector((state) => state.layout);
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";

  const { data, isLoading } = useGetWorkspacesQuery(undefined, { skip: !isOpen });
  const [deleteWorkspace, { isLoading: isDeleting }] = useDeleteWorkspaceMutation();
  const workspaces: Workspace[] = data?.data || [];

  const [formOpen, setFormOpen] = useState(false);
  const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSelect = (ws: Workspace) => {
    dispatch(setWorkspace(ws));
    onClose();
    if (isAgent) {
      router.push("/chat");
    } else {
      router.push("/dashboard");
    }
  };

  const handleEdit = (workspace: Workspace) => {
    setEditWorkspace(workspace);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteWorkspace(deleteId).unwrap();
      toast.success("Workspace deleted successfully");
      if (selectedWorkspace?._id === deleteId) {
        dispatch(clearWorkspace());
      }
      setDeleteId(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete workspace");
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-[320px] dark:bg-(--card-color) max-w-[100vw] sm:w-95 sm:max-w-95 p-0 pb-5 flex flex-col gap-0">
          <SheetHeader className="px-5 py-4 border-b dark:border-(--card-border-color)">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-primary/70 to-primary flex items-center justify-center">
                  <Building2 size={15} className="text-white" />
                </div>
                <SheetTitle className="text-base">Workspaces</SheetTitle>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            )}

            {!isLoading && workspaces.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Building2 size={24} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-gray-400">No workspaces yet. Create your first one.</p>
                <button
                  onClick={() => {
                    setEditWorkspace(null);
                    setFormOpen(true);
                  }}
                  className="mt-1 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  + Create Workspace
                </button>
              </div>
            )}

            {!isLoading &&
              workspaces.map((ws) => {
                const isActive = selectedWorkspace?._id === ws._id;
                const isBaileys = ws.waba_type === "baileys";
                const isWabaConnected = isBaileys ? !!ws.waba_id && ws.connection_status === "connected" : !!ws.waba_id;
                const hasWabaId = !!ws.waba_id;

                return (
                  <div key={ws._id} className={`w-full relative group p-1`}>
                    <button onClick={() => handleSelect(ws)} className={`w-full text-start flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 ${isActive ? "border-primary/80 dark:border-primary bg-primary/10 dark:bg-emerald-900/15" : "border-slate-200 dark:border-white/10 hover:border-primary/10 dark:hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm ${isActive ? "bg-primary text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300"}`}>{ws.name.charAt(0).toUpperCase()}</div>

                      <div className="flex-1 min-w-0 pe-12">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-white text-sm truncate">{ws.name}</span>
                          {isActive && <CheckCircle2 size={14} className="shrink-0 text-primary" />}
                        </div>
                        {ws.description && <p className="text-xs text-slate-400 dark:text-gray-500 truncate mt-0.5">{ws.description}</p>}
                        <div className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium flex-wrap ${isWabaConnected ? "text-primary dark:text-primary" : "text-amber-500 dark:text-amber-400"}`}>
                          {isWabaConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
                          {isWabaConnected ? "WABA Connected" : hasWabaId ? "WABA Disconnected" : "No WABA"}
                          {hasWabaId && <span className="border border-slate-200 text-slate-500 bg-slate-50 rounded-lg dark:bg-(--dakr-body) dark:border-(--card-border-color) dark:text-gray-400 px-2">{ws?.waba_type}</span>}
                        </div>
                      </div>
                    </button>

                    {!isAgent && (
                      <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(ws);
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-(--page-body-bg) text-slate-400 hover:text-primary transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(ws._id);
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-(--page-body-bg) text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          {!isAgent && (
            <Button
              onClick={() => {
                setEditWorkspace(null);
                setFormOpen(true);
              }}
              className="mx-4 flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary transition-colors py-2.5 rounded-lg"
            >
              <Plus size={14} />
              New
            </Button>
          )}
        </SheetContent>
      </Sheet>

      <WorkspaceFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} workspace={editWorkspace} />
      <ConfirmDeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} isLoading={isDeleting} />
    </>
  );
}
