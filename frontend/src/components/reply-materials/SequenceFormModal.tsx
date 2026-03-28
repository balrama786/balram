"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Sequence } from "@/src/types/sequence";
import { Loader2, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "@/src/elements/ui/label";

interface SequenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
  editItem?: Sequence | null;
}

const SequenceFormModal: React.FC<SequenceFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading, editItem }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
    }
  }, [isOpen, editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name: name.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="sm:px-6 px-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
            <div className="text-left rtl:text-right">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">{editItem ? "Edit Sequence" : "Create Sequence"}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium">{editItem ? "Update your sequence name" : "Start by giving your sequence a name"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="sm:p-6 p-4 pt-3 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-400">Sequence Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Onboarding Follow-up" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:border-primary" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 h-11 rounded-xl border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()} className="flex-1 h-11 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : editItem ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SequenceFormModal;
