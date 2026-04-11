/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AIModelForm from "@/src/components/ai_models/AIModelForm";
import { useCreateModelMutation } from "@/src/redux/api/aiModelApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CreateAIModelRequest } from "@/src/types/store";

const CreateAIModelPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [createModel, { isLoading }] = useCreateModelMutation();

  const handleSubmit = async (values: CreateAIModelRequest) => {
    try {
      await createModel(values).unwrap();
      toast.success(t("ai_models.create_success"));
      router.push("/ai_models");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("ai_models.create_error"));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-(--text-green-primary)">{t("ai_models.create_title")}</h1>
        <p className="text-sm text-gray-400">{t("ai_models.add_subtitle")}</p>
      </div>
      <AIModelForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateAIModelPage;
