"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetWorkspacesQuery, useDeleteWorkspaceMutation } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setWorkspace, clearWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { setLogout } from "@/src/redux/reducers/authSlice";
import { Workspace } from "@/src/types/workspace";
import { Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import WorkspaceFormModal from "@/src/components/workspace/WorkspaceFormModal";
import ConfirmDeleteModal from "@/src/components/workspace/ConfirmDeleteModal";
import { toast } from "sonner";
import { WorkspaceCard } from "@/src/components/workspace/WorkspaceCard";
import { WorkspaceHeader } from "@/src/components/workspace/WorkspaceHeader";
import { WorkspaceEmptyState } from "@/src/components/workspace/WorkspaceEmptyState";
import { UserMenu } from "@/src/components/workspace/UserMenu";

export default function WorkspacePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { logo_light_url, logo_dark_url, app_name } = useAppSelector((state) => state.setting);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data, isLoading } = useGetWorkspacesQuery();
  const [deleteWorkspace, { isLoading: isDeleting }] = useDeleteWorkspaceMutation();
  const workspaces = useMemo(() => data?.data || [], [data]);

  const [formOpen, setFormOpen] = useState(false);
  const [editWorkspace, setEditWorkspace] = useState<Workspace | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAgent = user?.role === "agent";

  const handleSelect = useCallback(
    (workspace: Workspace) => {
      dispatch(setWorkspace(workspace));
      if (isAgent) {
        router.push("/chat");
      } else {
        router.push("/dashboard");
      }
    },
    [dispatch, isAgent, router]
  );

  const handleConnectWaba = useCallback(
    (workspace: Workspace) => {
      dispatch(setWorkspace(workspace));
      router.push(`/connect_waba?workspace_id=${workspace._id}`);
    },
    [dispatch, router]
  );

  const handleEdit = useCallback((workspace: Workspace) => {
    setEditWorkspace(workspace);
    setFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const handleLogout = useCallback(async () => {
    dispatch(clearWorkspace());
    dispatch(setLogout());
    await signOut({ callbackUrl: "/auth/login" });
  }, [dispatch]);

  const confirmDelete = useCallback(async () => {
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
  }, [deleteId, deleteWorkspace, selectedWorkspace, dispatch]);

  // Auto-selection logic
  useEffect(() => {
    if (!isLoading && workspaces.length === 1) {
      const ws = workspaces[0];
      handleSelect(ws);
    }
  }, [isLoading, workspaces, handleSelect]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const logoUrl = useMemo(() => {
    if (!mounted) return null;
    const isDark = theme === "dark";
    const url = isDark ? logo_dark_url : logo_light_url;
    if (!url) return "/assets/logos/logo1.png";

    const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  }, [mounted, theme, logo_light_url, logo_dark_url]);

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="relative min-h-screen bg-(--light-background) dark:bg-(--dark-body) overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      {/* Background Decorations */}
      <div className="absolute -top-30 -right-25 w-120 h-120 rounded-full bg-primary/8 dark:bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-30 -left-20 w-105 h-105 rounded-full bg-primary/6 dark:bg-primary/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <WorkspaceHeader logoUrl={logoUrl || undefined} appName={app_name} title="Choose your Workspace" description="Each workspace is linked to a WhatsApp Business Account. Select one to continue." badgeText="Workspace Selection" />

        <div className="flex-1 flex flex-col items-center justify-start px-4 py-6">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-52 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/8 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && workspaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {workspaces.map((ws) => (
                <WorkspaceCard key={ws._id} workspace={ws} isActive={selectedWorkspace?._id === ws._id} onSelect={() => handleSelect(ws)} onConnectWaba={() => handleConnectWaba(ws)} onEdit={() => handleEdit(ws)} onDelete={() => handleDeleteClick(ws._id)} isAgent={isAgent} />
              ))}

              {!isAgent && (
                <button
                  onClick={() => {
                    setEditWorkspace(null);
                    setFormOpen(true);
                  }}
                  className="group h-50 rounded-lg border-2 border-dashed border-slate-300/70 dark:border-white/10 flex flex-col items-center justify-center gap-3 bg-white/50 dark:bg-white/3 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all duration-250 cursor-pointer"
                >
                  <div className="h-11 w-11 rounded-xl border-2 border-slate-300 dark:border-white/15 group-hover:border-primary flex items-center justify-center text-slate-400 dark:text-gray-500 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-250">
                    <Plus size={20} />
                  </div>
                  <span className="text-sm font-semibold text-slate-400 dark:text-gray-500 group-hover:text-primary transition-colors">New Workspace</span>
                </button>
              )}
            </div>
          )}

          {!isLoading && workspaces.length === 0 && (
            <WorkspaceEmptyState
              isAgent={isAgent}
              onLogout={handleLogout}
              onCreateFirst={() => {
                setEditWorkspace(null);
                setFormOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <UserMenu user={user} isOpen={userMenuOpen} onToggle={() => setUserMenuOpen((v) => !v)} onClose={() => setUserMenuOpen(false)} onLogout={handleLogout} initials={initials} />

      <WorkspaceFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} workspace={editWorkspace} />
      <ConfirmDeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} isLoading={isDeleting} />
    </div>
  );
}
