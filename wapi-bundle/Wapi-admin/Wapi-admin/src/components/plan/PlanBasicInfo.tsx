"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { PlanBasicInfoProps } from "@/src/types/components";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

const PlanBasicInfo = ({ formData, onFieldChange }: PlanBasicInfoProps) => {
  const { t } = useTranslation();
  const handleNameChange = (value: string) => {
    onFieldChange("name", value);
    const autoSlug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    onFieldChange("slug", autoSlug);
  };

  return (
    <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg shadow-sm border border-(--input-border-color) sm:p-6 p-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-(--text-green-primary)" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-none">{t("plan.basic_info")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("plan.basic_info_desc") || "Set the core identity of your subscription plan"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2.5 flex flex-col">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("plan.name_label")} <span className="text-red-500 font-bold">*</span>
          </Label>
          <Input id="name" placeholder={t("plan.name_placeholder") || "e.g. Professional Plan"} value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className="dark:bg-page-body dark:border-(--card-border-color) p-3 h-12 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg" />
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label htmlFor="slug" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("plan.slug_label")}
          </Label>
          <Input id="slug" placeholder={t("plan.slug_placeholder") || "pro-plan"} value={formData.slug} disabled className="dark:bg-page-body dark:border-(--card-border-color) p-3 h-12 bg-gray-100/50 border-gray-200 cursor-not-allowed opacity-70 rounded-lg" />
        </div>

        <div className="md:col-span-2 space-y-2.5 flex flex-col">
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("plan.description_label")}
          </Label>
          <Textarea id="description" placeholder={t("plan.description_placeholder") || "A brief overview of what this plan offers to your customers..."} value={formData.description} onChange={(e) => onFieldChange("description", e.target.value)} className="dark:bg-page-body dark:border-(--card-border-color) min-h-25 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg resize-none p-3" rows={4} />
        </div>
      </div>
    </div>
  );
};

export default PlanBasicInfo;
