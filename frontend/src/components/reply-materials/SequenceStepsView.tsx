/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { useDeleteSequenceStepMutation, useGetSequenceByIdQuery, useReorderSequenceStepsMutation, useUpdateSequenceStepMutation } from "@/src/redux/api/sequenceApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { SequenceStep } from "@/src/types/sequence";
import { AlertCircle, ArrowLeft, ListOrdered, Loader2, Plus, Save } from "lucide-react";
import { Reorder } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SequenceStepModal from "./SequenceStepModal";
import SequenceStepRow from "./SequenceStepRow";

interface SequenceStepsViewProps {
  sequenceId: string;
  onBack: () => void;
}

const SequenceStepsView: React.FC<SequenceStepsViewProps> = ({ sequenceId, onBack }) => {
  const { data, isLoading, refetch } = useGetSequenceByIdQuery(sequenceId);
  const [reorderSteps, { isLoading: isReordering }] = useReorderSequenceStepsMutation();
  const [deleteStep, { isLoading: isDeleting }] = useDeleteSequenceStepMutation();
  const [updateStep] = useUpdateSequenceStepMutation();

  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [stepToEdit, setStepToEdit] = useState<SequenceStep | null>(null);
  const [stepToDelete, setStepToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (data?.data?.steps) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSteps(data.data.steps);
      setHasChanges(false);
    }
  }, [data]);

  const handleReorder = (newOrder: SequenceStep[]) => {
    setSteps(newOrder);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    try {
      const payload = steps.map((s, idx) => ({ id: s._id, sort: idx + 1 }));
      await reorderSteps({ steps: payload }).unwrap();
      toast.success("Order saved successfully");
      setHasChanges(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save order");
    }
  };

  const handleDeleteStep = async () => {
    if (!stepToDelete) return;
    try {
      await deleteStep(stepToDelete).unwrap();
      toast.success("Step deleted successfully");
      setStepToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete step");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updateStep({ id, data: { is_active: active } }).unwrap();
      toast.success(active ? "Step activated" : "Step paused");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update step");
    }
  };

  const openEditModal = (step: SequenceStep) => {
    setStepToEdit(step);
    setIsStepModalOpen(true);
  };

  const openCreateModal = () => {
    setStepToEdit(null);
    setIsStepModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <p className="text-slate-500 font-medium">Loading sequence steps...</p>
      </div>
    );
  }

  const sequence = data?.data;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-white dark:bg-(--dark-body)">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-(--card-border-color)">
        <div className="flex items-center gap-4 transition-all duration-300">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover)">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">{sequence?.name}</h1>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold ", sequence?.is_active ? "bg-green-50 text-green-600 dark:bg-emerald-900/20" : "bg-slate-100  text-slate-500")}>{sequence?.is_active ? "Active" : "Paused"}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mt-2 dark:text-gray-400">Manage the message flow and timing for this sequence.</p>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <Button onClick={handleSaveOrder} disabled={isReordering} className="bg-primary/80 text-white gap-2">
                {isReordering ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Order
              </Button>
            )}
            <Button onClick={openCreateModal} className="gap-2 text-white">
              <Plus size={16} />
              Add Step
            </Button>
          </div>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm font-medium">
            <AlertCircle size={18} />
            {' You have unsaved order changes. Click "Save Order" to apply.'}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6 border border-slate-100 dark:border-slate-800/60">
              <ListOrdered size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No steps yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">Add your first step to start building this sequence.</p>
            <Button onClick={openCreateModal} variant="outline" className="gap-2">
              <Plus size={16} />
              Add First Step
            </Button>
          </div>
        ) : (
          <Reorder.Group axis="y" values={steps} onReorder={handleReorder} className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <SequenceStepRow key={step._id} step={step} index={index} onEdit={openEditModal} onDelete={setStepToDelete} onToggleActive={handleToggleActive} />
            ))}
          </Reorder.Group>
        )}
      </div>

      <ConfirmModal isOpen={!!stepToDelete} onClose={() => setStepToDelete(null)} onConfirm={handleDeleteStep} isLoading={isDeleting} title="Delete Step?" subtitle="This will remove this step from the sequence flow." />

      {isStepModalOpen && <SequenceStepModal isOpen={isStepModalOpen} onClose={() => setIsStepModalOpen(false)} sequenceId={sequenceId} wabaId={sequence?.waba_id || ""} editStep={stepToEdit} onSuccess={refetch} nextSort={steps.length + 1} />}
    </div>
  );
};

export default SequenceStepsView;
