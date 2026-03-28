"use client";

import { Sequence } from "@/src/types/sequence";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import SequenceCard from "./SequenceCard";

interface SequencesGridProps {
  items: Sequence[];
  isLoading: boolean;
  onEdit: (sequence: Sequence) => void;
  onDelete: (id: string) => void;
  onViewSteps: (id: string) => void;
  onAdd: () => void;
}

const SequencesGrid: React.FC<SequencesGridProps> = ({
  items,
  isLoading,
  onEdit,
  onDelete,
  onViewSteps,
  onAdd,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) flex items-center justify-center text-slate-300 dark:text-primary mb-6 border border-slate-100 dark:border-none">
          <Zap size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
          No sequences yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs font-medium mb-6">
          Create a sequence to automate your message flow over time.
        </p>
        <Button
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 h-11 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
          Create Sequence
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((sequence) => (
        <SequenceCard
          key={sequence._id}
          sequence={sequence}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewSteps={onViewSteps}
        />
      ))}
    </div>
  );
};

export default SequencesGrid;
