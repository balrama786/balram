/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { Sparkles, Loader2, X } from "lucide-react";
import { INDUSTRIES, OCCASIONS, PURPOSES, ACTIONS, TONES, LANGUAGES } from "../../data/ai-templates";
import { useSuggestTemplateMutation } from "@/src/redux/api/templateApi";
import { toast } from "sonner";
import { AITemplateModalProps } from "@/src/types/components/Template";

const AITemplateModal = ({ isOpen, onClose, onSuccess }: AITemplateModalProps) => {
  const [suggestTemplate, { isLoading }] = useSuggestTemplateMutation();
  const [formData, setFormData] = useState({
    businessName: "",
    language: "en_US",
    customLanguage: "",
    industry: "",
    customIndustry: "",
    occasion: "",
    customOccasion: "",
    purpose: "",
    customPurpose: "",
    action: "",
    customAction: "",
    tone: "",
    customTone: "",
    additionalDetails: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.industry || !formData.purpose || !formData.action || !formData.tone) {
      return toast.error("Please fill in all required fields");
    }

    const payload = {
      businessName: formData.businessName,
      language: formData.language === "other" ? formData.customLanguage : formData.language,
      industry: formData.industry === "other" ? formData.customIndustry : formData.industry,
      occasion: formData.occasion === "other" ? formData.customOccasion : formData.occasion,
      purpose: formData.purpose === "other" ? formData.customPurpose : formData.purpose,
      action: formData.action === "other" ? formData.customAction : formData.action,
      tone: formData.tone === "other" ? formData.customTone : formData.tone,
      additionalDetails: formData.additionalDetails,
      modelId: "6982e3707bd75229fe817176",
      apiKey: "AIzaSyCBZW1acPngVsrDDjFdNUGY0f4dou3SUQo",
    };

    try {
      const response = await suggestTemplate(payload).unwrap();
      if (response.success && response.data?.[0]) {
        onSuccess(response.data[0]);
        toast.success("Template generated successfully!");
        onClose();
      } else {
        toast.error("Failed to generate template content");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Error generating template");
    }
  };

  const renderDropdownWithOther = (
    label: string,
    field: string,
    options: { value: string; label: string }[],
    placeholder: string
  ) => {
    const isOther = (formData as any)[field] === "other";
    const customField = `custom${field.charAt(0).toUpperCase() + field.slice(1)}`;

    return (
      <div className="space-y-2 w-full">
        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
        <Select value={(formData as any)[field]} onValueChange={(val) => handleChange(field, val)}>
          <SelectTrigger className="h-11 sm:h-12 rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-primary">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isOther && (
          <Input
            placeholder={`Enter custom ${label.toLowerCase()}...`}
            value={(formData as any)[customField]}
            onChange={(e) => handleChange(customField, e.target.value)}
            className="h-10 sm:h-11 rounded-lg mt-2 bg-slate-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1rem)] sm:max-w-3xl bg-white dark:bg-(--card-color) rounded-xl sm:rounded-2xl p-0! overflow-hidden border-none shadow-2xl [&>button]:hidden focus:outline-none">
        {/* ── Header ── */}
        <DialogHeader className="p-3 sm:p-5 pb-3 sm:pb-4 bg-slate-50/80 dark:bg-(--daerk-sidebar) backdrop-blur-sm border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 shrink-0 mt-0.5 sm:mt-0">
                <Sparkles size={18} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex flex-col pt-0.5 sm:pt-0">
                <DialogTitle className="text-sm sm:text-xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                  Build with AI
                </DialogTitle>
                <p className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed sm:leading-normal mt-0.5">
                  Generate high-converting WhatsApp templates in seconds
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) shadow-sm text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-all mt-0.5"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className="p-3.5 sm:p-6 lg:p-8 max-h-[70vh] sm:max-h-[65vh] overflow-y-auto custom-scrollbar space-y-4 sm:space-y-6">
          {/* Business Name */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Business Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              className="h-10 sm:h-12 text-sm rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-primary px-3 sm:px-4"
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-6">
            {renderDropdownWithOther("Language", "language", LANGUAGES, "Select language")}
            {renderDropdownWithOther("Industry", "industry", INDUSTRIES, "Select your industry")}
            {renderDropdownWithOther("Occasion", "occasion", OCCASIONS, "Select occasion")}
            {renderDropdownWithOther("Purpose", "purpose", PURPOSES, "Select your message purpose")}
            {renderDropdownWithOther("Action", "action", ACTIONS, "Select your action")}
            {renderDropdownWithOther("Tone", "tone", TONES, "Select tone of the message template")}
          </div>

          {/* Additional Details */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Additional Details</Label>
            <Textarea
              placeholder="Any other details about template like festivals, offers (10 % off on making charge), etc"
              value={formData.additionalDetails}
              onChange={(e) => handleChange("additionalDetails", e.target.value)}
              className="min-h-[80px] sm:min-h-[120px] text-sm rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-primary p-3 sm:p-4 resize-none"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-3 sm:p-5 flex flex-col sm:flex-row gap-2 sm:gap-3 bg-slate-50/50 dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color)">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:flex-1 h-10 sm:h-12 rounded-lg font-bold text-slate-500 bg-slate-100/80 hover:bg-slate-200 dark:bg-(--table-hover) dark:text-amber-50 dark:hover:bg-opacity-80 transition-all sm:order-1 text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full sm:flex-[2] h-10 sm:h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 sm:order-2 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="mr-2" size={16} />
                <span>Generate Template</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITemplateModal;
