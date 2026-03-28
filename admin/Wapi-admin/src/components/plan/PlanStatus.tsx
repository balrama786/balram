"use client";

import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { PlanStatusProps } from "@/src/types/components";
import { useTranslation } from "react-i18next";

const PlanStatus = ({ formData, onFieldChange }: PlanStatusProps) => {
  const { t } = useTranslation();

  return (
    <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-(--text-green-primary)/20 flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-(--text-green-primary)" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-none">{t("plan.visibility_status")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("plan.visibility_status_desc") || "Control how this plan appears to your users"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-xl border border-gray-100 dark:border-(--card-border-color) transition-all hover:border-(--text-green-primary)/30">
          <div className="space-y-1">
            <Label htmlFor="is_featured" className="text-sm font-bold text-gray-900 dark:text-gray-200 cursor-pointer">
              {t("plan.featured_label")}
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-50">{t("plan.featured_description")}</p>
          </div>
          <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => onFieldChange("is_featured", checked)} className="data-[state=checked]:bg-(--text-green-primary)" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-page-body rounded-xl border border-gray-100 dark:border-(--card-border-color) transition-all hover:border-(--text-green-primary)/30">
          <div className="space-y-1">
            <Label htmlFor="is_active" className="text-sm font-bold text-gray-900 dark:text-gray-200 cursor-pointer">
              {t("plan.active_label")}
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-50">{t("plan.active_description")}</p>
          </div>
          <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => onFieldChange("is_active", checked)} className="data-[state=checked]:bg-(--text-green-primary)" />
        </div>
      </div>
    </div>
  );
};

export default PlanStatus;
