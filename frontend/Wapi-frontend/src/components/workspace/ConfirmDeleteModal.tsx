"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, isLoading, title, description }: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) dark:border-(--card-border-color)">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <DialogTitle className="text-red-600 dark:text-red-400">{title || "Delete Workspace"}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <div className="py-2">
          <DialogDescription className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
            {description || "Are you sure you want to delete this workspace? This action cannot be undone and all associated data will be lost."}
          </DialogDescription>
        </div>
        <DialogFooter className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" className="flex-1" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
