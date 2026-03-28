/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateChatbotMutation, useDeleteChatbotMutation, useGetChatbotsQuery, useUpdateChatbotMutation } from "@/src/redux/api/chatbotApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Chatbot } from "@/src/types/chatbot";
import React, { useState } from "react";
import { toast } from "sonner";
import ChatbotFormModal from "./ChatbotFormModal";
import ChatbotGrid from "./ChatbotGrid";
import ChatbotTrainSection from "./ChatbotTrainSection";

interface ChatbotSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

const ChatbotSection: React.FC<ChatbotSectionProps> = ({ wabaId, onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Chatbot | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [trainingChatbot, setTrainingChatbot] = useState<Chatbot | null>(null);

  const { data: chatbotsData, isLoading, refetch } = useGetChatbotsQuery({ waba_id: wabaId }, { skip: !wabaId });
  const [createChatbot, { isLoading: isCreating }] = useCreateChatbotMutation();
  const [updateChatbot, { isLoading: isUpdating }] = useUpdateChatbotMutation();
  const [deleteChatbot, { isLoading: isDeleting }] = useDeleteChatbotMutation();

  const filteredChatbots = (chatbotsData?.data || []).filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editItem) {
        await updateChatbot({ id: editItem._id, data }).unwrap();
        toast.success("Chatbot updated successfully");
      } else {
        await createChatbot(data).unwrap();
        toast.success("Chatbot created successfully");
      }
      setIsModalOpen(false);
      setEditItem(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteChatbot(deleteId).unwrap();
      toast.success("Chatbot deleted successfully");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete chatbot");
    }
  };

  if (trainingChatbot) {
    return (
      <ChatbotTrainSection
        chatbot={trainingChatbot}
        onBack={() => {
          setTrainingChatbot(null);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 sm:p-6 p-4 overflow-y-auto custom-scrollbar">
      <CommonHeader
        title="AI Chatbots"
        description="Manage your intelligent automated assistants"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        searchPlaceholder="Search chatbots..."
        onRefresh={refetch}
        onAddClick={() => {
          setEditItem(null);
          setIsModalOpen(true);
        }}
        addLabel="Create Chatbot"
        isLoading={isLoading}
        onToggleSidebar={onToggleSidebar}
      />

      <div className="mt-8 flex-1">
        <ChatbotGrid
          items={filteredChatbots}
          isLoading={isLoading}
          onEdit={(chatbot) => {
            setEditItem(chatbot);
            setIsModalOpen(true);
          }}
          onDelete={setDeleteId}
          onTrain={setTrainingChatbot}
          onAdd={() => setIsModalOpen(true)}
        />
      </div>

      <ChatbotFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        editItem={editItem}
        wabaId={wabaId}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Chatbot"
        subtitle="Are you sure you want to delete this chatbot? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ChatbotSection;
