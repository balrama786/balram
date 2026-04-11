"use client";

import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { useTranslation } from "react-i18next";
import { Layout } from "lucide-react";

interface VisibilitySettingsFormProps {
  status: boolean;
  onStatusChange: (val: boolean) => void;
}

const VisibilitySettingsForm = ({ status, onStatusChange }: VisibilitySettingsFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-gray-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Layout className="w-5 h-5 text-amber-500" />
        </div>
        <h2 className="text-lg font-bold dark:text-white">
          {t("pages.status_section", "Visibility")}
        </h2>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-page-body rounded-lg border border-gray-100 dark:border-(--card-border-color)">
        <div className="space-y-0.5">
          <Label className="text-sm font-bold dark:text-white">{t("common.status")}</Label>
          <p className="text-xs text-gray-500">
            {status ? t("common.published") : t("common.hidden")}
          </p>
        </div>  
        <Switch
          checked={status}
          onCheckedChange={onStatusChange}
          className="data-[state=checked]:bg-(--text-green-primary)"
        />
      </div>
    </div>
  );
};

export default VisibilitySettingsForm;
