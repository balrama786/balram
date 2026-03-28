/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LANGUAGES } from "@/src/constants/languages";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { useTransformMessageMutation } from "@/src/redux/api/chatApi";
import { AiTransformFeature } from "@/src/types/components/chat";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Loader2, RefreshCcw, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { LanguageSelector } from "../../chat/messages/LanguageSelector";
import { TRANSFORM_FEATURES } from "../../data/aiTextTransData";

interface AiTextTransformModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onSuccess: (transformedText: string) => void;
}

const AiTextTransformModal: React.FC<AiTextTransformModalProps> = ({ isOpen, onClose, message, onSuccess }) => {
  const [selectedFeature, setSelectedFeature] = useState<AiTransformFeature>("improve");
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isLanguagePopoverOpen, setIsLanguagePopoverOpen] = useState(false);
  const [transformedResult, setTransformedResult] = useState<string | null>(null);

  const [transformMessage, { isLoading }] = useTransformMessageMutation();

  const handleTransform = async () => {
    try {
      const response = await transformMessage({
        message,
        feature: selectedFeature,
        language: selectedLanguage.name,
      }).unwrap();

      if (response.success && response.data?.transformed) {
        setTransformedResult(response.data.transformed);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Transformation failed. Please try again.");
    }
  };

  const handleApply = () => {
    if (transformedResult) {
      onSuccess(transformedResult);
      handleClose();
    }
  };

  const handleClose = () => {
    setTransformedResult(null);
    onClose();
  };

  const currentTheme = TRANSFORM_FEATURES.find((f) => f.id === selectedFeature) || TRANSFORM_FEATURES[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-175 overflow-hidden bg-white dark:bg-(--card-color) dark:border-(--card-border-color) shadow-2xl p-0!">
        <div className="sm:p-8 p-4">
          <DialogHeader className="mb-8 relative">
            <div className="flex items-center gap-5">
              <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-500 shadow-lg", currentTheme.bg, currentTheme.color)}>
                <Sparkles size={32} />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">AI Text Transform</DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-gray-500 mt-1">Choose how to enhance your message</DialogDescription>
              </div>
            </div>
            <Button onClick={handleClose} className="absolute right-0 bg-gray-100 hover:bg-slate-200 dark:hover:bg-(--table-hover) dark:bg-transparent top-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={20} />
            </Button>
          </DialogHeader>

          <div className="space-y-8">
            {/* User Message Preview */}
            <div className="space-y-3 flex flex-col">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your Message</label>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color) relative group gap-3">
                <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed max-h-20 overflow-y-auto custom-scrollbar">{message}</p>
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>

            {/* Feature Selection Grid */}
            {!transformedResult && (
              <div className="space-y-3 flex flex-col">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select Transformation</label>
                <div className="grid grid-cols-2 gap-4 [@media(max-width:603px)]:grid-cols-1">
                  {TRANSFORM_FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    const isSelected = selectedFeature === feature.id;
                    return (
                      <button key={feature.id} onClick={() => setSelectedFeature(feature.id)} className={cn("flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 relative group", isSelected ? cn("bg-white dark:bg-(--table-hover)", feature.border, "shadow-xl border-opacity-100") : "bg-white dark:bg-(--dark-sidebar) border-slate-100 dark:border-(--card-border-color) hover:border-slate-200 dark:hover:border-(--card-border-color)")}>
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm", isSelected ? feature.bg : "bg-slate-50 dark:bg-(--card-color) group-hover:bg-slate-100 dark:group-hover:bg-(--page-body-bg)")}>
                          <Icon size={24} className={isSelected ? feature.color : "text-slate-400"} />
                        </div>
                        <div className="text-left">
                          <p className={cn("text-[13px] font-bold transition-colors", isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-gray-500")}>{feature.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{feature.desc}</p>
                        </div>
                        {isSelected && (
                          <div className={cn("absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg", feature.active)}>
                            <Check size={14} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Translation Language Selector */}
            <AnimatePresence>
              {selectedFeature === "translate" && !transformedResult && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden flex flex-col">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Target Language</label>

                  <LanguageSelector selectedLanguage={selectedLanguage} onSelect={setSelectedLanguage} isOpen={isLanguagePopoverOpen} onOpenChange={setIsLanguagePopoverOpen} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transformed Result Display */}
            <AnimatePresence>
              {transformedResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Transformed Result</span>
                    <button onClick={() => setTransformedResult(null)} className="text-primary hover:underline flex items-center gap-1">
                      <RefreshCcw size={12} />
                      <span>Start Over</span>
                    </button>
                  </label>
                  <div className={cn("p-6 rounded-lg border bg-white dark:bg-(--table-hover) relative group", currentTheme.border)}>
                    <p className="text-base text-slate-900 dark:text-white leading-relaxed font-medium">{transformedResult}</p>
                    <div className={cn("absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg", currentTheme.active)}>
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter className="py-4 px-8 border-t border-slate-50 dark:border-none bg-slate-50/10 dark:bg-(--card-color)">
          <Button onClick={transformedResult ? handleApply : handleTransform} disabled={isLoading} className={cn("w-full h-12 rounded-lg text-white font-bold text-lg shadow-2xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden", "bg-linear-to-r dark:bg-primary", currentTheme.gradient)}>
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 size={24} className="animate-spin text-white/70" />
                <span className="animate-pulse">Transforming with AI...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {transformedResult ? <CheckCircle2 size={24} /> : <Sparkles size={24} className="group-hover:animate-pulse" />}
                <span>{transformedResult ? "Use This Message" : "Transform Now"}</span>
              </div>
            )}

            {/* Background sparkle effect */}
            <div className="absolute top-0 -left-full w-[200%] h-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out px-4.5 py-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiTextTransformModal;
