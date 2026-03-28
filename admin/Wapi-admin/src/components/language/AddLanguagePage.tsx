/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import {
  useCreateLanguageMutation,
  useGetLanguageByIdQuery,
  useUpdateLanguageMutation,
} from "@/src/redux/api/languageApi";
import { languageSchema } from "@/src/utils/validation-schemas";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Globe, Layout, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface AddLanguagePageProps {
  id?: string;
}

const AddLanguagePage = ({ id }: AddLanguagePageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditMode = !!id;

  const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();
  const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();

  const { data: languageData, isLoading: isLoadingLanguage } = useGetLanguageByIdQuery(
    id || "",
    { skip: !id }
  );

  const initialValues = {
    name: languageData?.data?.name || "",
    code: languageData?.data?.code || "",
    status: languageData?.data?.status ?? true,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditMode && id) {
        await updateLanguage({
          id,
          data: values,
        }).unwrap();
        toast.success(t("languages.update_success"));
      } else {
        await createLanguage(values).unwrap();
        toast.success(t("languages.create_success"));
      }
      router.push("/languages");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t(isEditMode ? "languages.update_error" : "languages.create_error");
      toast.error(errorMessage);
    }
  };

  if (isEditMode && isLoadingLanguage) {
    return <div className="p-8 text-center">{t("common.loading")}</div>;
  }

  return (
    <div className=" min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-(--text-green-primary) mb-2">
            {isEditMode ? t("languages.edit_title") : t("languages.add_title")}
          </h1>
          <p className="text-gray-400 text-sm">
            {isEditMode ? t("languages.edit_subtitle") : t("languages.add_subtitle")}
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={languageSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Language Info Card */}
              <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded bg-(--text-green-primary) flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="dark:text-gray-100 text-lg font-bold text-gray-900">
                    {t("languages.basic_info")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="name" className="dark:text-gray-200 text-sm font-medium text-gray-900">
                      {t("languages.name_label")} <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder={t("languages.name_placeholder")}
                      className={`dark:bg-page-body bg-(--input-color) h-11 border-gray-300 p-3 dark:border-(--card-border-color) ${
                        errors.name && touched.name ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="code" className="dark:text-gray-200 text-sm font-medium text-gray-900">
                      {t("languages.code_label")} <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="code"
                      name="code"
                      placeholder={t("languages.code_placeholder")}
                      className={`dark:bg-page-body bg-(--input-color) p-3 h-11 border-gray-300 dark:border-(--card-border-color) ${
                        errors.code && touched.code ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="status" className="dark:text-gray-200 text-sm font-semibold text-gray-900">
                      {t("languages.status")}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("languages.status_description")}
                    </p>
                  </div>
                  <Switch
                    id="status"
                    checked={values.status}
                    onCheckedChange={(checked: boolean) => setFieldValue("status", checked)}
                    className="data-[state=checked]:bg-(--text-green-primary)"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-amber-50 dark:hover:bg-(--dark-sidebar)"
                  disabled={isCreating || isUpdating}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2.5 bg-(--text-green-primary) hover:bg-(--text-green-primary) text-white font-medium shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <Layout className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isEditMode ? t("languages.update_button") : t("languages.save_button")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddLanguagePage;
