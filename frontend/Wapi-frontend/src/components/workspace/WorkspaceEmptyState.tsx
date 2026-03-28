"use client";

import React from "react";
import { Plus, ShieldAlert, LogOut } from "lucide-react";

interface WorkspaceEmptyStateProps {
  isAgent: boolean;
  onLogout: () => void;
  onCreateFirst: () => void;
}

export function WorkspaceEmptyState({
  isAgent,
  onLogout,
  onCreateFirst,
}: WorkspaceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white/50 dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) max-w-lg w-full text-center">
      {isAgent ? (
        <>
          <div className="h-16 w-16 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
            <ShieldAlert size={32} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Workspaces Assigned
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 leading-relaxed">
            It looks like you haven&apos;t been assigned to any workspaces yet. Please contact your
            administrator to get access.
          </p>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-primary  text-white  rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <LogOut size={18} />
            Sign Out & Try Again
          </button>
        </>
      ) : (
        <>
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6">
            <Plus size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Workspaces Yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 leading-relaxed">
            Get started by creating your first workspace to manage your WhatsApp Marketing
            campaigns.
          </p>
          <button
            onClick={onCreateFirst}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Create First Workspace
          </button>
        </>
      )}
    </div>
  );
}
