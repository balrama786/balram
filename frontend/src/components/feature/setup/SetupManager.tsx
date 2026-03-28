/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ApiKeyConfig from "@/src/components/feature/setup/ApiKeyConfig";
import ConfigurationSummary from "@/src/components/feature/setup/ConfigurationSummary";
import ModelSelection from "@/src/components/feature/setup/ModelSelection";
import { Button } from "@/src/elements/ui/button";
import { useGetAllModelsQuery, useUpdateUserSettingsMutation } from "@/src/redux/api/settingsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { Form, Formik } from "formik";
import { Loader2, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SetupManager = () => {
  const { t } = useTranslation();
  const { data: modelsData, isLoading: isLoadingModels } = useGetAllModelsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const { userSetting } = useAppSelector((state) => state.setting);

  const handleSave = async (values: { ai_model: string; api_key: string }) => {
    try {
      await updateSettings(values).unwrap();
      toast.success(t("setup.update_success"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("setup.update_failed"));
    }
  };

  if (isLoadingModels || !userSetting) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const initialValues = {
    ai_model: userSetting?.data?.ai_model || "",
    api_key: userSetting?.data?.api_key || "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSave} enableReinitialize>
      {({ values, setFieldValue, handleSubmit }) => {
        const currentModel = modelsData?.data?.models.find((m) => m._id === values.ai_model);

        return (
          <Form className="space-y-6 sm:space-y-8 px-4 [@media(max-width:600px)]:px-0 sm:px-6 lg:px-0" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <ModelSelection models={modelsData?.data?.models || []} selectedModel={values.ai_model} onSelect={(id) => setFieldValue("ai_model", id)} />
              </div>

              <div className="space-y-6 sm:space-y-8">
                <ApiKeyConfig value={values.api_key} onChange={(val) => setFieldValue("api_key", val)} />
                <ConfigurationSummary currentModel={currentModel} hasApiKey={!!values.api_key} />
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 lg:left-72 z-20 px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="max-w-6xl mx-auto p-3 sm:p-4 bg-white/80 dark:bg-(--card-color) backdrop-blur-xl border border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-500 flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">{t("setup.footer_note")}</p>
                <Button type="submit" disabled={isUpdating} className=" h-10 sm:h-11 px-4.5! py-5 sm:px-8 rounded-lg bg-primary text-white font-bold shadow-lg shadow-emerald-600/20 text-sm sm:text-base">
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="sm:w-4.5 sm:h-4.5 mr-2 animate-spin" /> {t("setup.updating")}
                    </>
                  ) : (
                    <>
                      <Save size={18} className="sm:w-4.5 sm:h-4.5 mr-2" /> {t("setup.save_changes")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SetupManager;
