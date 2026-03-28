/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useBulkDeleteReplyMaterialsMutation, useCreateReplyMaterialMutation, useDeleteReplyMaterialMutation, useGetReplyMaterialsQuery, useUpdateReplyMaterialMutation } from "@/src/redux/api/replyMaterialApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { ReplyMaterial, ReplyMaterialSidebarItem } from "@/src/types/reply-material";
import React, { useState } from "react";
import { toast } from "sonner";
import ReplyMaterialFormModal from "./ReplyMaterialFormModal";
import ReplyMaterialGrid from "./ReplyMaterialGrid";
import SequencesSection from "./SequencesSection";
import TemplatesSection from "./TemplatesSection";
import CataloguesSection from "./CataloguesSection";
import ChatbotSection from "./ChatbotSection";

interface ReplyMaterialsContentProps {
  activeConfig: ReplyMaterialSidebarItem;
  onToggleSidebar?: () => void;
}

const ReplyMaterialsContent: React.FC<ReplyMaterialsContentProps> = ({ activeConfig, onToggleSidebar }) => {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const waba_id = selectedWorkspace?.waba_id;

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ReplyMaterial | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetReplyMaterialsQuery({ waba_id: waba_id || "", page, limit, search: searchTerm }, { skip: !waba_id });

  const [createMaterial, { isLoading: isCreating }] = useCreateReplyMaterialMutation();
  const [updateMaterial, { isLoading: isUpdating }] = useUpdateReplyMaterialMutation();
  const [deleteMaterial, { isLoading: isDeleting }] = useDeleteReplyMaterialMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteReplyMaterialsMutation();

  const groupKey = activeConfig.groupKey;
  const groupData = (groupKey && data?.data) ? (data.data as any)[groupKey] : null;
  const items = (groupData as any)?.items || [];
  const pagination = (groupData as any)?.pagination || { totalPages: 0, totalItems: 0 };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleOpenCreate = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ReplyMaterial) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (waba_id) formData.append("waba_id", waba_id);

      if (itemToEdit) {
        const response = await updateMaterial({ id: itemToEdit._id, formData }).unwrap();
        toast.success(response.data.message || "Updated successfully");
      } else {
        const response = await createMaterial(formData).unwrap();
        toast.success(response.data.message || "Created successfully");
      }
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const response = await deleteMaterial(itemToDelete).unwrap();
      toast.success(response.message || "Deleted successfully");
      setIsDeleteConfirmOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    try {
      const response = await bulkDelete(selectedIds).unwrap();
      toast.success(response.message || "Bulk deleted successfully");
      setSelectedIds([]);
      setIsBulkDeleteConfirmOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to bulk delete");
    }
  };

  if (activeConfig.type === "chatbot") {
    return <ChatbotSection wabaId={waba_id || ""} onToggleSidebar={onToggleSidebar} />;
  }

  if (activeConfig.type === "catalog") {
    return <CataloguesSection wabaId={waba_id || ""} onToggleSidebar={onToggleSidebar} />;
  }

  if (activeConfig.type === "template") {
    return <TemplatesSection wabaId={waba_id || ""} onToggleSidebar={onToggleSidebar} />;
  }

  if (activeConfig.type === "sequence") {
    return <SequencesSection wabaId={waba_id || ""} onToggleSidebar={onToggleSidebar} />;
  }

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-white dark:bg-(--dark-body)">
      <div className="p-4 sm:p-6">
        <CommonHeader title={activeConfig.label} description={activeConfig.description} onSearch={setSearchTerm} searchTerm={searchTerm} onAddClick={handleOpenCreate} addLabel={`Add ${activeConfig.label}`} onBulkDelete={() => setIsBulkDeleteConfirmOpen(true)} selectedCount={selectedIds.length} isLoading={isLoading || isFetching} onToggleSidebar={onToggleSidebar} />

        <div className="mt-8">
          <ReplyMaterialGrid items={items} type={activeConfig.type} isLoading={isLoading} page={page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} limit={limit} selectedIds={selectedIds} onPageChange={setPage} onToggleSelect={handleToggleSelect} onEdit={handleOpenEdit} onDelete={handleOpenDelete} onAdd={handleOpenCreate} />
        </div>
      </div>

      <ReplyMaterialFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} isLoading={isCreating || isUpdating} config={activeConfig} editItem={itemToEdit} />

      <ConfirmModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleDeleteConfirm} isLoading={isDeleting} title="Delete Material?" subtitle="This will permanently delete this quick-reply item. This action cannot be undone." />

      <ConfirmModal isOpen={isBulkDeleteConfirmOpen} onClose={() => setIsBulkDeleteConfirmOpen(false)} onConfirm={handleBulkDeleteConfirm} isLoading={isBulkDeleting} title="Bulk Delete Materials?" subtitle={`You are about to delete ${selectedIds.length} items. This action cannot be undone.`} />
    </div>
  );
};

export default ReplyMaterialsContent;
