"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/elements/ui/command";
import { cn } from "@/src/lib/utils";
import { Language, LANGUAGES } from "@/src/constants/languages";
import { Flag } from "../../shared/Flag";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
  isOpen,
  onOpenChange,
  className,
  triggerClassName,
}) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full h-14 px-5 flex items-center justify-between rounded-lg! border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) hover:border-blue-200 dark:hover:border-(--card-border-color) transition-all duration-300 shadow-sm",
            triggerClassName
          )}
        >
          <div className="flex items-center gap-3">
            <Flag countryCode={selectedLanguage.countryCode} size={22} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{selectedLanguage.name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ChevronRight size={18} className={cn("transition-transform", isOpen && "rotate-90")} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-(--radix-popover-trigger-width) p-0 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-2xl overflow-hidden z-50", className)}
        align="start"
      >
        <Command className="border-none w-full">
          <CommandInput placeholder="Search language..." className="h-12 border-none focus:ring-0" />
          <CommandList className="max-h-60 custom-scrollbar overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-slate-500">No language found.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-2 gap-1 p-2">
                {LANGUAGES.map((lang) => (
                  <CommandItem
                    key={lang.code}
                    value={lang.name}
                    onSelect={() => {
                      onSelect(lang);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedLanguage.code === lang.code
                        ? "bg-blue-50 dark:bg-(--table-hover) text-blue-600 dark:text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-(--table-hover) text-slate-600 dark:text-gray-500"
                    )}
                  >
                    <Flag countryCode={lang.countryCode} size={20} />
                    <span className="text-xs">{lang.name}</span>
                    {selectedLanguage.code === lang.code && <Check size={14} className="ml-auto" />}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
