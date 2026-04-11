/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Button } from "@/src/elements/ui/button";
import { Plus, Trash2, Twitter, Linkedin, Facebook, Instagram, Share2, Shield } from "lucide-react";
import { FooterSection } from "@/src/types/landingPage";

interface FooterFormProps {
  data: FooterSection;
  onChange: (data: FooterSection) => void;
}

const FooterForm = ({ data, onChange }: FooterFormProps) => {
  const handleChange = (field: keyof FooterSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSocialChange = (index: number, network: string, value: string) => {
    const newSocialLinks = [...data.social_links];
    newSocialLinks[index] = { ...newSocialLinks[index], [network]: value };
    handleChange("social_links", newSocialLinks);
  };

  const addCtaButton = () => {
    handleChange("cta_buttons", [...data.cta_buttons, { text: "", link: "" }]);
  };

  const removeCtaButton = (index: number) => {
    handleChange("cta_buttons", data.cta_buttons.filter((_, i) => i !== index));
  };

  const handleCtaButtonChange = (index: number, field: "text" | "link", value: string) => {
    const newButtons = [...data.cta_buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    handleChange("cta_buttons", newButtons);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-10">
        <div className="[@media(min-width:1421px)]:col-span-6 space-y-6">
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Pre-footer CTA Title</Label>
            <Input value={data.cta_title} onChange={(e) => handleChange("cta_title", e.target.value)} placeholder="e.g. Ready to escalate your growth?" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px] font-medium" />
          </div>
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">CTA Supporting Description</Label>
            <Textarea value={data.cta_description} onChange={(e) => handleChange("cta_description", e.target.value)} placeholder="Enter final call to action narrative" rows={4} className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) resize-none text-[15px] leading-relaxed p-4" />
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              <Label className="text-[11px] font-black uppercase tracking-[0.1em] text-primary">Global Action Buttons</Label>
            </div>
            <Button onClick={addCtaButton} variant="ghost" size="sm" className="h-8 px-3 text-primary hover:bg-primary/5 text-xs font-bold rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New Button
            </Button>
          </div>
          <div className="space-y-4">
            {data.cta_buttons.map((btn, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center group bg-gray-50/50 dark:bg-(--dark-body) p-3 rounded-lg border border-gray-100 dark:border-none shadow-sm transition-all hover:border-primary/20 relative">
                <Input value={btn.text} onChange={(e) => handleCtaButtonChange(index, "text", e.target.value)} placeholder="Label" className="w-full sm:flex-1 h-10 text-[13px] bg-white border-gray-100 rounded-lg dark:bg-(--page-body-bg) px-4 pr-10 sm:pr-4" />
                <Input value={btn.link} onChange={(e) => handleCtaButtonChange(index, "link", e.target.value)} placeholder="/destination" className="w-full sm:flex-2 h-10 text-[13px] bg-white border-gray-100 rounded-lg dark:bg-(--page-body-bg) px-4" />
                <button onClick={() => removeCtaButton(index)} className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 w-8 h-8 sm:w-10 sm:h-10 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 flex items-center justify-center transition-all bg-white/80 dark:bg-zinc-800/10 sm:bg-transparent shadow-sm sm:shadow-none sm:opacity-0 sm:group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.cta_buttons.length === 0 && (
              <div className="py-10 border-2 border-dashed border-gray-100 dark:border-(--card-border-color) rounded-[2rem] flex items-center justify-center bg-gray-50/20 text-gray-400">
                <p className="text-[12px] italic">No active pre-footer buttons defined</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-10 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
        <div className="[@media(min-width:1421px)]:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Social Architecture</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-1">
                <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-(--dark-body) dark:border-none flex items-center justify-center text-sky-500 shrink-0 shadow-sm border border-sky-100/50">
                  <Twitter className="w-5 h-5" />
                </div>
                <Input value={data.social_links[0]?.twitter || ""} onChange={(e) => handleSocialChange(0, "twitter", e.target.value)} placeholder="X / Twitter handle..." className="h-11 text-[13px] bg-white dark:bg-page-body border-gray-100 rounded-lg" />
              </div>
              <div className="flex items-center gap-3 p-1">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-(--dark-body) dark:border-none flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/50">
                  <Linkedin className="w-5 h-5" />
                </div>
                <Input value={data.social_links[0]?.linkedin || ""} onChange={(e) => handleSocialChange(0, "linkedin", e.target.value)} placeholder="LinkedIn profile..." className="h-11 text-[13px] bg-white dark:bg-page-body border-gray-100 rounded-lg" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-1">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-(--dark-body) dark:border-none flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100/50">
                  <Facebook className="w-5 h-5" />
                </div>
                <Input value={data.social_links[0]?.facebook || ""} onChange={(e) => handleSocialChange(0, "facebook", e.target.value)} placeholder="Facebook page..." className="h-11 text-[13px] bg-white dark:bg-page-body border-gray-100 rounded-lg" />
              </div>
              <div className="flex items-center gap-3 p-1">
                <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-(--dark-body) dark:border-none flex items-center justify-center text-pink-600 shrink-0 shadow-sm border border-pink-100/50">
                  <Instagram className="w-5 h-5" />
                </div>
                <Input value={data.social_links[0]?.instagram || ""} onChange={(e) => handleSocialChange(0, "instagram", e.target.value)} placeholder="Instagram handle..." className="h-11 text-[13px] bg-white dark:bg-page-body border-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Legal Signature</h3>
          </div>

          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Copyright Disclaimer</Label>
            <Input value={data.copy_rights_text} onChange={(e) => handleChange("copy_rights_text", e.target.value)} placeholder="e.g. © 2024 WAPI Global. All rights reserved." className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[14px] rounded-lg px-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterForm;
