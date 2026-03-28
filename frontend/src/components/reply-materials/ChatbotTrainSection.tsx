/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { Label } from "@/src/elements/ui/label";
import { Chatbot, ChatbotTrainingItem, ChatbotTrainPayload, TrainingDataType } from "@/src/types/chatbot";
import { ArrowLeft, Plus, Trash2, Save, Loader2, MessageSquare, Globe, FileText, Type } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useTrainChatbotMutation, useScrapeUrlMutation, useExtractDocumentMutation } from "@/src/redux/api/chatbotApi";

interface ChatbotTrainSectionProps {
  chatbot: Chatbot;
  onBack: () => void;
}

const ChatbotTrainSection: React.FC<ChatbotTrainSectionProps> = ({ chatbot, onBack }) => {
  const [businessName, setBusinessName] = useState(chatbot.business_name || "");
  const [businessDescription, setBusinessDescription] = useState(chatbot.business_description || "");
  const [trainingData, setTrainingData] = useState<ChatbotTrainingItem[]>(chatbot.training_data || []);
  const [rawText, setRawText] = useState(chatbot.raw_training_text || "");

  const [activeType, setActiveType] = useState<TrainingDataType>("text");
  const [isSaving, setIsSaving] = useState(false);
  const [scrapeUrl, { isLoading: isScraping }] = useScrapeUrlMutation();
  const [extractDocument, { isLoading: isExtracting }] = useExtractDocumentMutation();
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [trainChatbot] = useTrainChatbotMutation();

  const handleAddQA = () => {
    setTrainingData([...trainingData, { question: "", answer: "" }]);
  };

  const handleRemoveQA = (index: number) => {
    setTrainingData(trainingData.filter((_, i) => i !== index));
  };

  const handleQAChange = (index: number, field: keyof ChatbotTrainingItem, value: string) => {
    const newData = [...trainingData];
    newData[index] = { ...newData[index], [field]: value };
    setTrainingData(newData);
  };

  const handleFetchUrl = async () => {
    if (!websiteUrl.trim()) return;
    try {
      const result = await scrapeUrl({ url: websiteUrl }).unwrap();
      setRawText((prev) => (prev ? prev + "\n\n" + result.data.text : result.data.text));
      toast.success("Website content fetched successfully");
      setWebsiteUrl("");
      setActiveType("text");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to fetch website");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await extractDocument(formData).unwrap();
      setRawText((prev) => (prev ? prev + "\n\n" + result.data.text : result.data.text));
      toast.success("Document content extracted successfully");
      setActiveType("text");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to extract document");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: ChatbotTrainPayload = {
        business_name: businessName,
        business_description: businessDescription,
        knowledgeType: activeType,
      };

      if (activeType === "q&a") {
        payload.training_data = trainingData.filter((qa) => qa.question.trim() || qa.answer.trim());
        payload.raw_training_text = "";
      } else {
        payload.raw_training_text = rawText;
        payload.training_data = [];
      }

      await trainChatbot({
        id: chatbot._id,
        data: payload,
      }).unwrap();
      toast.success("Chatbot trained successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to train chatbot");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-white dark:bg-(--dark-body)">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-(--card-border-color) flex items-center justify-between sticky top-0 bg-white/80 dark:bg-(--card-color)/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Train {chatbot.name}</h2>
            <p className="text-xs text-slate-400 font-medium">Configure knowledge base and personality</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-white h-10 px-6 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
          {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} />}
          Save
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium  text-slate-900 dark:text-gray-400">1. Business Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-medium text-slate-500">Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="How should the AI refer to your business?" className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--card-color) focus:ring-primary" />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-medium text-slate-500">Business Description</Label>
              <Textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="What does your business do? What are your main goals?" className="min-h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--card-color) resize-none" />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-gray-400">2. Knowledge Base</h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-(--card-color) rounded-lg p-4 border border-slate-100 dark:border-(--card-border-color)">
            <div className="flex gap-2 mb-6">
              {[
                { id: "text", label: "General Text", icon: Type },
                { id: "q&a", label: "Q&A Pairs", icon: MessageSquare },
                { id: "website_url", label: "Website URL", icon: Globe },
                { id: "document", label: "Documents", icon: FileText },
              ].map((type) => (
                <button key={type.id} onClick={() => setActiveType(type.id as TrainingDataType)} className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeType === type.id ? "bg-white dark:bg-(--card-color) border-primary text-primary shadow-sm" : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-gray-400 dark:hover:bg-(--table-hover)"}`}>
                  <type.icon size={20} className="mb-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {activeType === "text" && (
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-slate-500">Paste Information / Detailed Knowledge</Label>
                  <Textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Enter details about your services, products, pricing, policies, etc..." className="min-h-64 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) resize-none" />
                </div>
              )}

              {activeType === "q&a" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-500">Specific Questions & Answers</Label>
                    <Button onClick={handleAddQA} variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5">
                      <Plus size={14} className="mr-1" /> Add QA Pair
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {trainingData.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-(--card-border-color) rounded-lg">
                        <p className="text-xs text-slate-400">No QA pairs added yet.</p>
                      </div>
                    ) : (
                      trainingData.map((qa, idx) => (
                        <div key={idx} className="group relative bg-white dark:bg-(--card-color) p-5 rounded-2xl border border-slate-200 dark:border-(--card-border-color) space-y-4 shadow-sm transition-all hover:border-primary/30">
                          <button onClick={() => handleRemoveQA(idx)} className="absolute top-3 right-3 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2 flex flex-col">
                            <Label className="text-[11px] font-black uppercase text-primary/70 tracking-tight ml-1">Question</Label>
                            <Input value={qa.question} onChange={(e) => handleQAChange(idx, "question", e.target.value)} placeholder="e.g. What are your opening hours?" className="h-12 rounded-lg border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 text-sm font-semibold focus-visible:ring-primary/20 focus:border-primary/50 transition-all" />
                          </div>
                          <div className="space-y-2 flex flex-col">
                            <Label className="text-[11px] font-black uppercase text-slate-400 tracking-tight ml-1">Answer</Label>
                            <Textarea value={qa.answer} onChange={(e) => handleQAChange(idx, "answer", e.target.value)} placeholder="Describe the answer exactly as it should be given..." className="min-h-25 rounded-lg border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm focus-visible:ring-primary/20 focus:border-primary/50 transition-all resize-none" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeType === "website_url" && (
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-slate-500">Website URL to Scrape</Label>
                  <div className="flex gap-2">
                    <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com/faq" className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg)" />
                    <Button onClick={handleFetchUrl} disabled={isScraping || !websiteUrl.trim()} className="h-11 px-6 rounded-lg bg-slate-900 text-white dark:bg-(--page-body-bg) font-bold">
                      {isScraping ? <Loader2 size={16} className="animate-spin" /> : "Fetch"}
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-400">Scraping will convert the page content into general training text below.</p>
                </div>
              )}

              {activeType === "document" && (
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-slate-500">Knowledge Documents (PDF, CSV, XLSX, TXT)</Label>
                  <label className="h-32 border-2 border-dashed border-slate-200 dark:border-(--card-border-color) rounded-lg flex flex-col items-center justify-center gap-2 bg-white dark:bg-(--card-color) cursor-pointer hover:border-primary/50 transition-colors">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.csv,.xlsx,.xls,.txt" disabled={isExtracting} />
                    {isExtracting ? <Loader2 size={24} className="animate-spin text-primary" /> : <Plus className="text-slate-300" />}
                    <span className="text-xs text-slate-400 font-medium tracking-tight">{isExtracting ? "Extracting knowledge..." : "Click to upload doc"}</span>
                  </label>
                  <p className="text-sm text-slate-400 dark:text-gray-400">Uploading documents will extract text and append it to general text.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatbotTrainSection;
