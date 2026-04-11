/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AIModelForm from "@/src/components/ai_models/AIModelForm";
import { Button } from "@/src/elements/ui/button";
import { useGetModelByIdQuery, useUpdateModelMutation } from "@/src/redux/api/aiModelApi";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CreateAIModelRequest } from "@/src/types/store";

const EditAIModelPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const modelName = params.modelName as string;

  const { data, isLoading: isFetching } = useGetModelByIdQuery(modelName);
  const [updateModel, { isLoading: isUpdating }] = useUpdateModelMutation();

  const handleSubmit = async (values: CreateAIModelRequest) => {
    try {
      await updateModel({ id: modelName, data: values }).unwrap();
      toast.success(t("ai_models.update_success"));
      router.push("/ai_models");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("ai_models.update_error"));
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--text-green-primary)"></div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">{t("ai_models.no_models_found")}</p>
        <Button onClick={() => router.push("/ai_models")} className="mt-4">
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-green-primary) mb-2">{t("ai_models.edit_title")}</h1>
        <p className="text-sm text-gray-400">{t("ai_models.edit_subtitle")}</p>
      </div>
      <AIModelForm initialValues={data.data} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
};

export default EditAIModelPage;
