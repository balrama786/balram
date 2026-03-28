"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { MarketingType, MarketingTypeOption } from "@/src/types/components/Template";
import { BookOpen, Gift, Image as ImageIcon, Phone, ShoppingBag, Tag, Ticket } from "lucide-react";
import React from "react";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

const MARKETING_TYPES: MarketingTypeOption[] = [
  { label: "Standard", value: "none", icon: <Tag size={16} />, description: "Regular marketing message" },
  { label: "Limited Time Offer", value: "limited_time_offer", icon: <Gift size={16} />, description: "With expiration timer" },
  { label: "Coupon Code", value: "coupon_code", icon: <Ticket size={16} />, description: "Include a copy-able code" },
  { label: "Catalog", value: "catalog", icon: <BookOpen size={16} />, description: "Link your product catalog" },
  { label: "Call Permission", value: "call_permission", icon: <Phone size={16} />, description: "Request phone call opt-in" },
  { label: "Carousel Product", value: "carousel_product", icon: <ShoppingBag size={16} />, description: "Horizontal product cards" },
  { label: "Carousel Media", value: "carousel_media", icon: <ImageIcon size={16} />, description: "Horizontal image cards" },
];

interface BasicInfoSectionProps {
  language: string;
  setLanguage: (lang: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  marketingType: MarketingType;
  setMarketingType: (type: MarketingType) => void;
  offerText: string;
  setOfferText: (val: string) => void;
  languages: { label: string; value: string }[];
  categories: { label: string; value: string; icon: React.ReactNode }[];
}

export const BasicInfoSection = ({ language, setLanguage, category, setCategory, templateName, setTemplateName, marketingType, setMarketingType, offerText, setOfferText, languages, categories }: BasicInfoSectionProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Template Name</Label>
          <Input placeholder="e.g. welcome_message" value={templateName || ""} onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all" />
          <p className="text-[11px] text-slate-500 dark:text-gray-500">Lowercase letters, numbers and underscores only.</p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Template Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-12 py-5.5 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-(--input-color) dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg) transition-all">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 dark:bg-(--card-color) dark:border-(--card-border-color)">
              {languages.map((lang) => (
                <SelectItem className="dark:hover:bg-(--table-hover)" key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-400">The language this template is written in.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Template Category</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button key={cat.value} type="button" onClick={() => setCategory(cat.value)} className={`flex items-center gap-3 p-4 rounded-lg border transition-all group ${category === cat.value ? "border-primary bg-emerald-50/50 text-primary dark:bg-emerald-500/10" : "border-slate-100 bg-slate-50/30 dark:bg-(--table-hover) dark:border-(--table-hover) text-slate-500 hover:border-primary dark:hover:border-(--card-border-color)"}`}>
              <div className={`p-2 rounded-lg transition-colors ${category === cat.value ? "bg-emerald-100 dark:bg-(--dark-sidebar)" : "bg-white dark:bg-(--page-body-bg) dark:text-amber-50 group-hover:bg-emerald-50 dark:group-hover:bg-(--card-color)"}`}>{cat.icon}</div>
              <div className="flex flex-col items-start -translate-y-px">
                <span className="font-bold text-sm tracking-tight dark:text-gray-300">{cat.label}</span>
                <span className="text-[10px] opacity-70 font-medium uppercase tracking-wider dark:text-gray-400">Select Category</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400">Classify your template based on its primary purpose.</p>
      </div>

      {category === "MARKETING" && (
        <div className="pt-6 border-t border-slate-100 dark:border-(--card-border-color) space-y-5">
          <div>
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Marketing Template Type</Label>
            <p className="text-[11px] text-slate-400 mt-1">Choose the type of marketing experience to deliver.</p>
          </div>

          {/* Compact two-column list layout — scales well for 7+ types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MARKETING_TYPES.map((type) => {
              const isActive = marketingType === type.value;
              return (
                <button key={type.value} type="button" onClick={() => setMarketingType(type.value)} className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left group ${isActive ? "border-primary bg-emerald-50/60 dark:bg-emerald-500/10" : "border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:bg-(--table-hover) hover:border-primary/30 dark:hover:border-(--card-border-color)"}`}>
                  <div className={`p-2 rounded-lg shrink-0 transition-colors ${isActive ? "bg-emerald-100 dark:bg-emerald-500/20 text-primary" : "bg-white dark:bg-(--page-body-bg) text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-(--card-color)"}`}>{type.icon}</div>
                  <div className="flex flex-col min-w-0">
                    <span className={`font-bold text-[13px] tracking-tight leading-tight ${isActive ? "text-primary" : "text-slate-700 dark:text-gray-300"}`}>{type.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500 leading-tight truncate">{type.description}</span>
                  </div>
                  {isActive && (
                    <div className="ml-auto shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {marketingType === "limited_time_offer" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Offer Text</Label>
              <CharacterCountWrapper current={offerText?.length || 0} max={60}>
                <Input placeholder="e.g. Expires in 24 hours" value={offerText || ""} onChange={(e) => setOfferText(e.target.value.slice(0, 60))} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all" />
              </CharacterCountWrapper>
              <p className="text-[11px] text-slate-400">This text will be displayed prominently alongside the expiration timer.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
