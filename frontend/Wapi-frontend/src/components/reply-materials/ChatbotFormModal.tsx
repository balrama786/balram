/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Label } from "@/src/elements/ui/label";
import { Chatbot } from "@/src/types/chatbot";
import { Loader2, Bot } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetAllModelsQuery } from "@/src/redux/api/settingsApi";
import { AIModel } from "@/src/types/settings";

interface ChatbotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  editItem?: Chatbot | null;
  wabaId: string;
}

const ChatbotFormModal = ({ isOpen, onClose, onSubmit, isLoading, editItem, wabaId }: ChatbotFormModalProps) => {
  const [name, setName] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  const { data: modelsData, isLoading: loadingModels } = useGetAllModelsQuery();
  const models = modelsData?.data?.models || [];

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
      const editAiModel = editItem?.ai_model;
      setAiModel(editAiModel && typeof editAiModel === 'object' ? editAiModel._id : (editAiModel ?? ""));
      setApiKey(editItem?.api_key ?? "");
      setBusinessName(editItem?.business_name ?? "");
      setBusinessDescription(editItem?.business_description ?? "");
    }
  }, [isOpen, editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !aiModel || !apiKey) return;

    const payload = {
      waba_id: wabaId,
      name: name.trim(),
      ai_model: aiModel,
      api_key: apiKey.trim(),
      business_name: businessName.trim(),
      business_description: businessDescription.trim(),
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-lg p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bot size={20} />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {editItem ? "Edit Chatbot" : "Create Chatbot"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium">
                {editItem ? "Update your chatbot configuration" : "Configure your new AI chatbot assistant"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Chatbot Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sales Assistant"
                required
                disabled={isLoading}
                className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">AI Model</Label>
              <Select value={aiModel} onValueChange={setAiModel} disabled={isLoading || loadingModels}>
                <SelectTrigger className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color)  dark:border-none bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder={loadingModels ? "Loading models..." : "Select Model"} />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  {models.map((model: AIModel) => (
                    <SelectItem key={model._id} value={model._id} className="rounded-lg">
                      {model.display_name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">API Key</Label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sk-..."
                type="password"
                required
                disabled={isLoading}
                className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Business Name</Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business Name"
                disabled={isLoading}
                className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Business Description</Label>
              <Textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe what your business does..."
                disabled={isLoading}
                className="min-h-24 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 rounded-lg border-slate-200 hover:bg-primary hover:text-white dark:border-(--card-border-color) text-slate-600 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !aiModel || !apiKey}
              className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : editItem ? (
                "Save Changes"
              ) : (
                "Create Chatbot"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotFormModal;
