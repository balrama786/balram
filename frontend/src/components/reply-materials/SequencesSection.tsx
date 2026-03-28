/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateSequenceMutation, useDeleteSequenceMutation, useGetSequencesQuery, useUpdateSequenceMutation } from "@/src/redux/api/sequenceApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Sequence } from "@/src/types/sequence";
import React, { useState } from "react";
import { toast } from "sonner";
import SequenceFormModal from "./SequenceFormModal";
import SequencesGrid from "./SequencesGrid";
import SequenceStepsView from "./SequenceStepsView";

interface SequencesSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

const SequencesSection: React.FC<SequencesSectionProps> = ({ wabaId, onToggleSidebar }) => {
  const [viewStepsId, setViewStepsId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Sequence | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetSequencesQuery({ waba_id: wabaId }, { skip: !wabaId || !!viewStepsId });
  const [createSequence, { isLoading: isCreating }] = useCreateSequenceMutation();
  const [updateSequence, { isLoading: isUpdating }] = useUpdateSequenceMutation();
  const [deleteSequence, { isLoading: isDeleting }] = useDeleteSequenceMutation();

  const sequences = data?.data || [];
  const filteredSequences = sequences.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenCreate = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (seq: Sequence) => {
    setItemToEdit(seq);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (values: { name: string }) => {
    try {
      if (itemToEdit) {
        await updateSequence({ id: itemToEdit._id, name: values.name }).unwrap();
        toast.success("Sequence updated");
      } else {
        await createSequence({ waba_id: wabaId, name: values.name }).unwrap();
        toast.success("Sequence created");
      }
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteSequence(itemToDelete).unwrap();
      toast.success("Sequence deleted");
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  if (viewStepsId) {
    return <SequenceStepsView sequenceId={viewStepsId} onBack={() => setViewStepsId(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6">
      <CommonHeader title="Sequences" description="Automate your message flows with scheduled steps" onSearch={setSearchTerm} searchTerm={searchTerm} onAddClick={handleOpenCreate} addLabel="Add Sequence" isLoading={isLoading || isFetching} onToggleSidebar={onToggleSidebar} />

      <div className="mt-8">
        <SequencesGrid items={filteredSequences} isLoading={isLoading} onEdit={handleOpenEdit} onDelete={handleOpenDelete} onViewSteps={setViewStepsId} onAdd={handleOpenCreate} />
      </div>

      <SequenceFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} isLoading={isCreating || isUpdating} editItem={itemToEdit} />

      <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} isLoading={isDeleting} title="Delete Sequence?" subtitle="This will permanently delete the sequence and all its steps." />
    </div>
  );
};

export default SequencesSection;
