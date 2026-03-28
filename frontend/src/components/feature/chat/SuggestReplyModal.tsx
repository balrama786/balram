/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { useSuggestReplyMutation } from "@/src/redux/api/chatApi";
import { SuggestReplyMessage } from "@/src/types/components/chat";
import { AnimatePresence, motion } from "framer-motion";
import { BotMessageSquare, BrainCircuit, Check, Copy, Heart, Loader2, MessageCircle, MessageSquare, Quote, Sparkles, X, Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface SuggestReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastMessages: SuggestReplyMessage[] | null;
  onUseReply: (reply: string) => void;
}

const REPLY_TONES = [
  { label: "Professional", value: "professional", icon: BrainCircuit, color: "blue", desc: "Formal and clear" },
  { label: "Friendly", value: "friendly", icon: MessageCircle, color: "emerald", desc: "Warm and inviting" },
  { label: "Casual", value: "casual", icon: Zap, color: "amber", desc: "Relaxed and direct" },
  { label: "Empathetic", value: "empathetic", icon: Heart, color: "rose", desc: "Understanding and kind" },
  { label: "Concise", value: "concise", icon: Quote, color: "slate", desc: "Short and sweet" },
];

const SuggestReplyModal: React.FC<SuggestReplyModalProps> = ({ isOpen, onClose, lastMessages, onUseReply }) => {
  const [tone, setTone] = useState<string>("professional");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [suggestReply, { isLoading }] = useSuggestReplyMutation();

  const handleSuggest = async () => {
    try {
      const response = await suggestReply({
        conversation: lastMessages,
        tone: tone,
      }).unwrap();

      if (response.success && response.data?.suggestedReplies) {
        setSuggestions(response.data.suggestedReplies);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to get suggestions");
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard");
  };

  const handleClose = () => {
    setSuggestions([]);
    setTone("professional");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-150 overflow-hidden bg-white dark:bg-(--card-color) border-none shadow-2xl p-0!">
        <div className="p-7 max-h-148.75 overflow-auto custom-scrollbar">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-lg bg-emerald-100 dark:bg-(--table-hover) flex items-center justify-center text-primary">
                  <BotMessageSquare size={32} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={12} />
                  </motion.div>
                </div>
              </div>
              <div className="text-left">
                <DialogTitle className="text-xl font-bold tracking-tight text-primary">AI Suggest Reply</DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-gray-500">Craft the perfect response with AI powered suggestions.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg ml-auto dark:hover:bg-(--table-hover)">
                <X size={20} />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tone Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BrainCircuit size={16} className="text-emerald-500" /> Choose Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {REPLY_TONES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = tone === t.value;
                  return (
                    <button key={t.value} onClick={() => setTone(t.value)} className={cn("flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-colors duration-300 group relative overflow-hidden", isSelected ? "border-primary bg-emerald-50/50 dark:bg-emerald-500/10" : "border-slate-100 dark:border-(--card-border-color) hover:border-slate-200 dark:hover:border-(--card-border-color) bg-slate-50/30 dark:bg-(--table-hover)")}>
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300", isSelected ? "bg-primary text-white shadow-lg" : "bg-white dark:bg-(--card-color) text-slate-500")}>
                        <Icon size={20} />
                      </div>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", isSelected ? "text-primary" : "text-slate-400")}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleSuggest} disabled={isLoading} className="w-full px-4.5 py-5 bg-primary text-white font-bold h-12 rounded-lg shadow-md shadow-emerald-600/20 transition-colors group overflow-hidden relative">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  <span className="animate-pulse">Analyzing conversation...</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={20} />
                  <span>Generate Suggestions</span>
                </div>
              )}
            </Button>

            {/* Suggestions List */}
            <AnimatePresence mode="wait">
              {suggestions.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">AI Generated Replies</label>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-(--card-color) mx-4" />
                  </div>

                  <div className="max-h-85 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="relative p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--dark-sidebar) hover:border-emerald-200 dark:hover:border-(--card-border-color) transition-colors duration-300">
                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{suggestion}</p>
                        <div className="flex items-center justify-end gap-3 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(suggestion, index)} className="h-9 px-3 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-(--table-hover) hover:text-primary">
                            {copiedIndex === index ? (
                              <div className="flex items-center gap-2 text-primary">
                                <Check size={16} /> <span className="text-[10px] font-bold uppercase">Copied</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Copy size={16} /> <span className="text-[10px] font-bold uppercase tracking-tight">Copy</span>
                              </div>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              onUseReply(suggestion);
                              handleClose();
                            }}
                            className="h-9 text-[12px] flex items-center rounded-lg bg-primary hover:bg-primary text-white font-bold px-4 shadow-lg shadow-emerald-600/10 transition-transform active:scale-95"
                          >
                            <MessageSquare size={14} /> Use Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                !isLoading && (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-100 dark:border-(--card-border-color) rounded-lg opacity-50">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-(--dark-sidebar) flex items-center justify-center dark:text-gray-400 text-slate-400">
                      <Sparkles size={24} />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Click generate to see magic suggestions</p>
                  </div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 dark:bg-(--card-color) p-4 border-t border-slate-100 dark:border-(--card-border-color)">
          <div className="w-full flex items-center justify-center gap-2 text-slate-400">
            <BotMessageSquare size={14} />
            <p className="text-[10px] font-medium uppercase tracking-widest">Suggestions based on {lastMessages?.length || 0} conversation context</p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestReplyModal;
