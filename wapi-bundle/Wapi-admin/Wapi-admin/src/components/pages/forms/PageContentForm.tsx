"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import CKEditorComponent from "@/src/shared/CkEditor";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PageContentFormProps {
  title: string;
  slug: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (value: string) => void;
}

const PageContentForm = ({
  title,
  slug,
  content,
  onTitleChange,
  onContentChange,
}: PageContentFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-gray-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-(--text-green-primary)/10 rounded-lg">
          <FileText className="w-5 h-5 text-(--text-green-primary)" />
        </div>
        <h2 className="text-xl font-medium dark:text-white">
          {t("pages.content_section", "Page Content")}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="title" className="text-sm font-semibold dark:text-gray-300">
              {t("pages.title_label", "Page Title")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={t("pages.title_placeholder", "Enter page title")}
              value={title}
              onChange={onTitleChange}
              className="h-11 bg-gray-50 dark:bg-page-body border-gray-200 dark:border-(--card-border-color) focus:ring-1 focus:ring-(--text-green-primary)"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="slug" className="text-sm font-semibold dark:text-gray-300">
              {t("pages.slug_label", "Slug")}
            </Label>
            <Input
              id="slug"
              value={slug}
              disabled
              className="h-11 bg-gray-100 dark:bg-(--dark-sidebar) border-gray-200 dark:border-(--card-border-color) text-gray-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 italic">
              {t("pages.slug_hint", "Auto-generated from title or fixed for core pages")}
            </p>
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label htmlFor="content" className="text-sm font-semibold dark:text-gray-300">
            {t("pages.content_label", "Content")} <span className="text-red-500">*</span>
          </Label>
          <div className="border border-gray-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-gray-50 dark:bg-page-body">
            <CKEditorComponent
              value={content}
              onChange={onContentChange}
              placeholder={t("pages.content_placeholder", "Start writing your page content...")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContentForm;
