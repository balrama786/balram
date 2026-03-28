"use client";

import React, { useRef } from "react";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { HeaderSectionProps } from "@/src/types/components/Template";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const HeaderSection = ({ templateType, setTemplateType, headerText, setHeaderText, templateTypes, setHeaderFile, headerFile }: HeaderSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("File size exceeds 5MB limit");
      }
      setHeaderFile(file);
    }
  };

  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Template Header</h3>
        <p className="text-xs text-slate-500 font-medium dark:text-gray-400">Add an optional header to your template to make it stand out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Text */}
        <div className="space-y-4">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Header Text</Label>
          <CharacterCountWrapper current={headerText?.length || 0} max={60}>
            <Input
              placeholder="Type your header here..."
              value={headerText || ""}
              onChange={(e) => {
                setHeaderText(e.target.value.slice(0, 60));
              }}
              className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all font-medium"
            />
          </CharacterCountWrapper>
          <p className="text-[11px] text-slate-400">Max 60 characters. Variables are not allowed in headers.</p>
        </div>

        {/* Media Selector */}
        <div className="space-y-4">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Media Header</Label>
          <div className="grid grid-cols-4 gap-2 [@media(max-width:435px)]:grid-cols-2">
            {templateTypes
              .filter((t) => t.value !== "text" && t.value !== "none")
              .map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    if (templateType === type.value) {
                      setTemplateType("none");
                      setHeaderFile(null);
                    } else {
                      setTemplateType(type.value);
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all font-bold text-[10px] uppercase tracking-wider ${templateType === type.value ? "border-primary bg-emerald-50/50 text-primary dark:bg-(--table-hover)" : "border-slate-150 dark:border-(--table-hover) bg-slate-50/20 dark:bg-(--table-hover) text-slate-400 dark:text-gray-500 hover:border-primary dark:hover:border-(--card-border-color)"}`}
                >
                  <div className={`p-1.5 rounded-lg ${templateType === type.value ? "bg-emerald-100 dark:bg-(--card-color)" : "bg-white dark:bg-transparent shadow-xs"}`}>{type.icon}</div>
                  {type.label}
                </button>
              ))}
          </div>
        </div>
      </div>

      {templateType !== "text" && templateType !== "none" && (
        <div className="pt-6 border-t border-slate-50 dark:border-(--card-border-color)">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={templateType === "image" ? "image/*" : templateType === "video" ? "video/*" : templateType === "document" ? ".pdf,.doc,.docx" : "*"} />
          {headerFile ? (
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shadow-sm">
                  <div className="text-emerald-600 dark:text-emerald-400">{templateTypes.find((t) => t.value === templateType)?.icon}</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-50">{headerFile.name}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{(headerFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHeaderFile(null);
                  setTemplateType("none");
                }}
                className="p-2.5 text-slate-500 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 dark:border-(--card-border-color) rounded-lg p-10 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-(--card-color) hover:bg-white dark:hover:bg-(--table-hover) hover:border-primary dark:hover:border-(--card-border-color) transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-lg bg-white dark:bg-(--dark-body) shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="text-primary" size={24} />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-gray-500">Upload {templateType} header</p>
              <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-1.5 font-medium">PDF, JPG, PNG or MP4 (Max 5MB)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
