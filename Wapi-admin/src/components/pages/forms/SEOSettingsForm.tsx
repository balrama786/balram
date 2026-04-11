"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

interface SEOSettingsFormProps {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMetaDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SEOSettingsForm = ({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
}: SEOSettingsFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-gray-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Search className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="text-lg font-bold dark:text-white">
          {t("pages.seo_section", "SEO & Meta Data")}
        </h2>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meta_title" className="text-sm font-semibold dark:text-gray-300">
            {t("pages.meta_title_label", "Meta Title")}
          </Label>
          <Input
            id="meta_title"
            placeholder={t("pages.meta_title_placeholder", "Search engine optimized title")}
            value={metaTitle}
            onChange={onMetaTitleChange}
            className="h-11 bg-gray-50 dark:bg-page-body border-gray-200 dark:border-(--card-border-color)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_description" className="text-sm font-semibold dark:text-gray-300">
            {t("pages.meta_description_label", "Meta Description")}
          </Label>
          <Textarea
            id="meta_description"
            placeholder={t("pages.meta_description_placeholder", "Brief summary for search results")}
            value={metaDescription}
            onChange={onMetaDescriptionChange}
            className="min-h-25 bg-gray-50 dark:bg-page-body border-gray-200 dark:border-(--card-border-color) resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SEOSettingsForm;
