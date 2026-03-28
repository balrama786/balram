/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { stripHtml } from "@/lib/utils";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import {
  useCreateFaqMutation,
  useGetFaqByIdQuery,
  useUpdateFaqMutation,
} from "@/src/redux/api/faqApi";
import CKEditorComponent from "@/src/shared/CkEditor";
import { ArrowLeft, Check, HelpCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface AddFaqPageProps {
  id?: string;
}

type FaqFormState = {
  title: string;
  description: string;
  status: boolean;
};

const AddFaqPage = ({ id }: AddFaqPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const faqId = id;
  const isEditMode = !!faqId;

  const { data: faqData, isLoading: isLoadingFaq } = useGetFaqByIdQuery(
    faqId ?? "",
    { skip: !faqId },
  );

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  const isLoading = isCreating || isUpdating || isLoadingFaq;

  const initialFormState: FaqFormState = useMemo(() => {
    if (isEditMode && faqData?.data) {
      return {
        title: faqData.data.title || "",
        description: faqData.data.description || "",
        status: faqData.data.status || true,
      };
    }

    return {
      title: "",
      description: "",
      status: true,
    };
  }, [isEditMode, faqData]);

  const [form, setForm] = useState<FaqFormState>({
    title: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    if (isEditMode && faqData?.data) {
      setForm({
        title: faqData.data.title || "",
        description: faqData.data.description || "",
        status: faqData.data.status ?? true,
      });
    }
  }, [isEditMode, faqData]);

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;

    const plainDescription = stripHtml(form.description);

    try {
      if (isEditMode && faqId) {
        await updateFaq({
          id: faqId,
          data: {
            title: form.title,
            description: plainDescription,
            status: form.status,
          },
        }).unwrap();
        toast.success(t("faq.success_updated"));
      } else {
        await createFaq({
          title: form.title,
          description: plainDescription,
          status: form.status,
        }).unwrap();
        toast.success(t("faq.success_created"));
      }

      setTimeout(() => router.push("/manage_faqs"), 1000);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          t(isEditMode ? "faq.error_update" : "faq.error_create"),
      );
    }
  };
  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="">
            <h1 className="text-2xl font-bold text-(--text-green-primary) mb-2">
              {isEditMode ? t("faq.edit_title") : t("faq.add_title")}
            </h1>
            <p className="text-gray-400 text-sm">
              {isEditMode ? t("faq.edit_subtitle") : t("faq.add_subtitle")}
            </p>
          </div>
        </div>
        {/* Form Content */}
        <div className="space-y-6">
          {/* Question Card */}
          <div className="dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-gray-100 bg-white rounded-lg shadow-sm border border-(--input-border-color) sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="dark:text-white text-xl font-bold text-gray-900">
                {t("faq.question_label")}
              </h2>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label
                htmlFor="title"
                className="dark:text-gray-200 text-sm font-medium text-gray-900"
              >
                {t("faq.question_label")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder={t("faq.question_placeholder")}
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="dark:bg-page-body h-11 bg-(--input-color) border-gray-300 dark:border-(--card-border-color) p-3 focus:border-(--text-green-primary) focus:ring-(--text-green-primary)"
              />
            </div>
          </div>

          {/* Answer Card */}
          <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg shadow-sm border border-gray-200 sm:p-6 p-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h2 className="dark:text-white text-xl font-bold text-gray-900">
                {t("faq.answer_label")}
              </h2>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label
                htmlFor="description"
                className="dark:text-gray-200 text-sm font-medium text-gray-900"
              >
                {t("faq.answer_label")} <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg overflow-hidden transition-all bg-gray-50">
                <CKEditorComponent
                  value={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                  placeholder={t("faq.answer_placeholder")}
                  minHeight="200px"
                />
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg shadow-sm border border-gray-200 sm:p-6 p-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label
                  htmlFor="status"
                  className="dark:text-gray-200 text-sm font-semibold text-gray-900"
                >
                  {t("faq.publish_label")}
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("faq.publish_description")}
                </p>
              </div>
              <Switch
                id="status"
                checked={form.status}
                onCheckedChange={(value) =>
                  setForm((prev) => ({ ...prev, status: value }))
                }
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2.5 border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-amber-50 dark:hover:bg-(--dark-sidebar) text-gray-700 hover:bg-gray-50 font-medium"
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-(--text-green-primary) hover:bg-(--text-green-primary) text-white font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                isLoading || !form.title || !form.description || isLoadingFaq
              }
            >
              <Check className="w-4 h-4 mr-2" />
              {isLoading
                ? isEditMode
                  ? t("common.updating")
                  : t("common.creating")
                : isEditMode
                  ? t("faq.update_button")
                  : t("faq.save_button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFaqPage;
