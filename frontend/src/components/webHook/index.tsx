/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import WebhookCard from "./WebhookCard";
import WebhookModal from "./WebhookModal";
import WebhookPayloadModal from "./WebhookPayloadModal";
import { useListWebhooksQuery, useCreateWebhookMutation, useUpdateWebhookMutation, useDeleteWebhookMutation, useToggleWebhookMutation } from "@/src/redux/api/webhookApi";
import { Webhook } from "@/src/types/webhook";
import { toast } from "sonner";
import { LayoutGrid } from "lucide-react";

const WebhookPage = () => {
  const { data, isLoading, refetch } = useListWebhooksQuery();
  const [createWebhook, { isLoading: isCreating }] = useCreateWebhookMutation();
  const [updateWebhook, { isLoading: isUpdating }] = useUpdateWebhookMutation();
  const [deleteWebhook, { isLoading: isDeleting }] = useDeleteWebhookMutation();
  const [toggleWebhook, { isLoading: isToggling }] = useToggleWebhookMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);

  const handleAddClick = () => {
    setSelectedWebhook(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const webhook = data?.webhooks.find((w) => {
      const wId = (typeof w._id === "string" ? w._id : w._id?.$oid) || w.id;
      return wId === id;
    });
    if (webhook) {
      setSelectedWebhook(webhook);
      setIsDeleteModalOpen(true);
    }
  };

  const handleViewPayload = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsPayloadModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleWebhook(id).unwrap();
      toast.success("Webhook status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to toggle status");
    }
  };

  const handleModalSubmit = async (formData: Partial<Webhook>) => {
    try {
      if (selectedWebhook) {
        const id = (typeof selectedWebhook._id === "string" ? selectedWebhook._id : selectedWebhook._id?.$oid) || selectedWebhook.id;
        if (id) {
          await updateWebhook({ id, body: formData }).unwrap();
          toast.success("Webhook updated successfully");
        }
      } else {
        await createWebhook(formData).unwrap();
        toast.success("Webhook created successfully");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!selectedWebhook) return;
    const id = (typeof selectedWebhook._id === "string" ? selectedWebhook._id : selectedWebhook._id?.$oid) || selectedWebhook.id;
    if (!id) return;

    try {
      await deleteWebhook(id).unwrap();
      toast.success("Webhook deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete webhook");
    }
  };

  const filteredWebhooks = useMemo(() => {
    if (!data?.webhooks) return [];
    return data.webhooks.filter((w) => w.webhook_name.toLowerCase().includes(searchTerm.toLowerCase()) || (w.webhook_url && w.webhook_url.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [data, searchTerm]);

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader
        title="Webhooks"
        description="Receive real-time notifications for WhatsApp events directly to your server"
        onSearch={setSearchTerm} // Kept original setSearchTerm for functionality
        searchTerm={searchTerm} // Kept original searchTerm for functionality
        featureKey="whatsapp_webhook_used"
        searchPlaceholder="Search webhooks..."
        onRefresh={refetch} // Kept original refetch for functionality
        onAddClick={handleAddClick} // Kept original handleAddClick for functionality
        addLabel="Create Webhook"
        isLoading={isLoading}
        // The following props are not defined in the current context and are omitted to maintain syntactical correctness.
        // columns={visibleColumns}
        // onColumnToggle={handleColumnToggle}
        // onBulkDelete={handleBulkDelete}
        // selectedCount={selectedIds.length}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-(--card-color) animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredWebhooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebhooks.map((webhook) => {
            const wId = (typeof webhook._id === "string" ? webhook._id : webhook._id?.$oid) || webhook.id;
            return <WebhookCard key={wId} webhook={webhook} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggle={handleToggle} onViewPayload={handleViewPayload} isLoading={isToggling} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-50 dark:bg-(--dark-sidebar) p-6 rounded-full mb-4">
            <LayoutGrid className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-amber-50">No webhooks found</h3>
          <p className="text-slate-500 dark:text-gray-400 max-w-xs mt-2">{"You haven't created any webhooks yet. Click the button above to get started."}</p>
        </div>
      )}

      <WebhookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} webhook={selectedWebhook || undefined} isLoading={isCreating || isUpdating} />

      <WebhookPayloadModal isOpen={isPayloadModalOpen} onClose={() => setIsPayloadModalOpen(false)} webhook={selectedWebhook || undefined} />

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} title="Delete Webhook" subtitle={`Are you sure you want to delete "${selectedWebhook?.webhook_name}"? This action cannot be undone.`} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default WebhookPage;
