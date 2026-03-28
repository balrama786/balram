/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Languages, Loader2, Sparkles } from "lucide-react";
import { useTransformMessageMutation } from "@/src/redux/api/chatApi";
import { toast } from "sonner";
import { Language, LANGUAGES } from "@/src/constants/languages";
import { LanguageSelector } from "./LanguageSelector";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";

interface MessageTranslationProps {
  messageText: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

const MessageTranslation: React.FC<MessageTranslationProps> = ({ messageText, onTranslated, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  const [transformMessage, { isLoading }] = useTransformMessageMutation();

  const handleTranslate = async () => {
    try {
      const response = await transformMessage({
        message: messageText,
        feature: "translate",
        language: selectedLanguage.name,
      }).unwrap();

      if (response.success && response.data?.transformed) {
        onTranslated(response.data.transformed);
        setIsOpen(false);
        toast.success(`Message translated to ${selectedLanguage.name}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Translation failed. Please try again.");
    }
  };

  return (
    <div className={cn("opacity-0 group-hover/bubble:opacity-100 transition-opacity", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="bg-white border border-neutral-400 p-1.5 rounded-full shadow text-primary transition-all dark:bg-(--table-hover) dark:border-(--card-border-color) dark:hover:bg-(--table-hover)">
            <Languages size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-2xl z-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" />
              <span className="font-bold text-slate-800 dark:text-white text-sm">Translate Message</span>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Language</label>
              <LanguageSelector selectedLanguage={selectedLanguage} onSelect={setSelectedLanguage} isOpen={isLanguageSelectorOpen} onOpenChange={setIsLanguageSelectorOpen} triggerClassName="h-10 px-3 rounded-xl" />
            </div>

            <Button onClick={handleTranslate} disabled={isLoading} className="w-full h-10 rounded-lg bg-primary hover:bg-emerald-600 text-white font-bold transition-all shadow-lg">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Translating...</span>
                </>
              ) : (
                <span>Translate Now</span>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageTranslation;
