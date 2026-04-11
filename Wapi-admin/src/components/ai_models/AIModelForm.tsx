/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { AIModel, CreateAIModelRequest } from "@/src/types/store";
import { aiModelSchema } from "@/src/utils/validation-schemas";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { Globe, ListPlus, Plus, Save, Settings2, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TestModelModal from "./TestModelModal";

interface KeyValuePair {
  key: string;
  value: string;
}

interface FormValues {
  displayName: string;
  provider: AIModel["provider"];
  modelId: string;
  apiEndpoint: string;
  description: string;
  is_default: boolean;
  headerList: KeyValuePair[];
  paramList: KeyValuePair[];
  payloadType: "json" | "formdata";
  payloadJson: string;
  payloadForm: KeyValuePair[];
  responsePath: string;
  config: AIModel["config"];
}

interface AIModelFormProps {
  initialValues?: AIModel;
  onSubmit: (values: CreateAIModelRequest) => void;
  isLoading: boolean;
}

const PROVIDER_MODELS: Record<string, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  google: ["gemini-2.5-flash-lite", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro", "gemini-pro-vision", "gemini-2.0-flash"],
  mistral: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "open-mixtral-8x22b", "open-mixtral-8x7b", "open-mistral-7b"],
  groq: ["mixtral-8x7b-32768", "llama3-70b-8192", "llama3-8b-8192", "gemma-7b-it"],
  cohere: ["command-r-plus", "command-r", "command", "command-light", "command-nightly"],
};

const AIModelForm = ({ initialValues, onSubmit, isLoading }: AIModelFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const defaultValues: FormValues = {
    displayName: initialValues?.display_name || "",
    provider: initialValues?.provider || "openai",
    modelId: initialValues?.model_id || "",
    apiEndpoint: initialValues?.apiEndpoint || "",
    description: initialValues?.description || "",
    is_default: initialValues?.is_default || false,
    headerList: Object.entries(initialValues?.headers_template || {}).map(([key, value]) => ({ key, value })),
    paramList: Object.entries(initialValues?.config || {})
      .filter(([k]) => !["max_tokens", "temperature", "top_p", "frequency_penalty", "presence_penalty", "payload", "payload_type"].includes(k))
      .map(([key, value]) => ({ key, value: String(value) })),
    payloadType: (initialValues?.config?.payload_type as "json" | "formdata") || "json",
    payloadJson: initialValues?.config?.payload_type === "json" ? (typeof initialValues?.config?.payload === "string" ? initialValues.config.payload : JSON.stringify(initialValues.config.payload, null, 2)) : "",
    payloadForm: initialValues?.config?.payload_type === "formdata" && typeof initialValues?.config?.payload === "object" ? Object.entries(initialValues.config.payload as Record<string, any>).map(([key, value]) => ({ key, value: String(value) })) : [{ key: "", value: "" }],
    responsePath: initialValues?.response_path || "",
    config: initialValues?.config || {
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
  };

  const providers = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google" },
    { value: "cohere", label: "Cohere" },
    { value: "mistral", label: "Mistral" },
    { value: "groq", label: "Groq" },
    { value: "custom", label: "Custom" },
  ];

  const handleSubmit = (values: FormValues) => {
    const headers: Record<string, string> = {};
    values.headerList.forEach((item: KeyValuePair) => {
      if (item.key) headers[item.key] = item.value;
    });

    const config: any = { ...values.config };
    values.paramList.forEach((item: KeyValuePair) => {
      if (item.key) config[item.key] = item.value;
    });

    if (values.provider === "custom") {
      config.payload_type = values.payloadType;
      if (values.payloadType === "json") {
        config.payload = values.payloadJson;
      } else {
        const formData: Record<string, string> = {};
        values.payloadForm.forEach((item) => {
          if (item.key) formData[item.key] = item.value;
        });
        config.payload = formData;
      }
    }

    const finalValues: CreateAIModelRequest = {
      displayName: values.displayName,
      provider: values.provider,
      modelId: values.modelId,
      apiEndpoint: values.apiEndpoint,
      description: values.description,
      is_default: values.is_default,
      headersTemplate: headers,
      config: config,
      responsePath: values.provider === "custom" ? values.responsePath : undefined,
    };

    onSubmit(finalValues);
  };

  return (
    <Formik initialValues={defaultValues} validationSchema={aiModelSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="flex flex-col lg:flex-row gap-8 items-start ">
          <div className="flex-1 space-y-8 w-full">
            {/* Basic Information */}
            <Card className="border shadow-sm dark:bg-(--card-color) bg-white rounded-lg overflow-hidden">
              <CardContent className="sm:p-6 p-4 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="displayName" className="text-sm font-semibold text-slate-700 dark:text-gray-400">
                      {t("ai_models.form.name")}
                    </Label>
                    <Field name="displayName" as={Input} placeholder={t("ai_models.form.enter_name")} className={cn("h-12 px-3 rounded-lg bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) border-(--input-border-color) focus:bg-(--input-color) dark:focus:bg-page-body border transition-all", touched.displayName && errors.displayName && "border-red-500 ring-red-100 dark:ring-(--card-b0rder-color)")} />
                    <ErrorMessage name="displayName" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="provider" className="text-sm font-semibold text-slate-700 dark:text-gray-400">
                      {t("ai_models.form.provider")}
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        setFieldValue("provider", value);
                        if (value !== "custom" && PROVIDER_MODELS[value]) {
                          setFieldValue("modelId", PROVIDER_MODELS[value][0]);
                        } else if (value === "custom") {
                          setFieldValue("modelId", "");
                        }
                      }}
                      value={values.provider}
                    >
                      <SelectTrigger className={cn("h-12 px-3 shadow-none rounded-lg bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none transition-all", touched.provider && errors.provider && "border-red-500 ring-red-100 dark:ring-(--card-border-color)")}>
                        <SelectValue placeholder={t("ai_models.form.select_provider")} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-lg">
                        {providers.map((p) => (
                          <SelectItem key={p.value} value={p.value} className="py-3 rounded-lg dark:hover:bg-(--dark-sidebar)">
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="provider" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="modelId" className="text-sm font-semibold text-slate-700 dark:text-gray-400">
                      {t("ai_models.form.model_name")}
                    </Label>
                    {values.provider !== "custom" && PROVIDER_MODELS[values.provider] ? (
                      <Select onValueChange={(value) => setFieldValue("modelId", value)} value={values.modelId}>
                        <SelectTrigger className={cn("h-12 px-3 shadow-none rounded-lg bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none transition-all", touched.modelId && errors.modelId && "border-red-500 ring-red-100 dark:ring-(--card-border-color)")}>
                          <SelectValue placeholder={t("ai_models.form.enter_model_name")} />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-lg">
                          {PROVIDER_MODELS[values.provider].map((model) => (
                            <SelectItem key={model} value={model} className="py-3 rounded-lg dark:hover:bg-(--dark-sidebar)">
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Field name="modelId" as={Input} placeholder={t("ai_models.form.enter_model_name")} className={cn("h-12 px-3 rounded-lg bg-(--input-color) border-(--input-border-color) focus:bg-(--input-color) dark:focus:bg-page-body dark:bg-page-body dark:border-(--card-border-color) transition-all", touched.modelId && errors.modelId && "border-red-500 ring-red-100")} />
                    )}
                    <ErrorMessage name="modelId" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("ai_models.form.base_url")}
                  </Label>  
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <Field name="apiEndpoint" as={Input} placeholder={t("ai_models.form.enter_base_url")} className={cn("h-12 pl-11 rtl:pr-3 rtl:pl-0 rounded-lg bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-(--card-border-color) transition-all", touched.apiEndpoint && errors.apiEndpoint && "border-red-500 ring-red-100 dark:ring-(--card-border-color)")} />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">{"Leave empty to use provider's default endpoint"}</p>
                  <ErrorMessage name="apiEndpoint" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-gray-400">
                    {t("ai_models.form.description")}
                  </Label>
                  <Field name="description" as={Textarea} placeholder={t("ai_models.form.enter_description")} className="min-h-30 rounded-lg bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-(--card-border-color) dark:focus-visible:shadow-none transition-all p-4" />
                </div>

                <div className="flex items-center gap-4 p-5 bg-slate-50/50 dark:bg-(--dark-body) rounded-lg border border-(--input-border-color) dark:border-none">
                  <Switch checked={values.is_default} onCheckedChange={(checked) => setFieldValue("is_default", checked)} className="data-[state=checked]:bg-(--text-green-primary)" />
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-slate-900 dark:text-white">{t("ai_models.form.is_default")}</Label>
                    <p className="text-xs text-slate-500 italic">This model will be used by default for AI features.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Headers & Params */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
              {/* Headers */}
              <Card className="border shadow-sm dark:bg-(--card-color) bg-white rounded-lg h-fit">
                <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-slate-50 dark:border-(--card-border-color) px-6">
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <ListPlus className="w-4 h-4 text-(--text-green-primary)" />
                    {t("ai_models.form.add_headers")}
                  </CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-(--text-green-primary) border border-(--text-green-primary) dark:border-none hover:bg-emerald-50 dark:bg-page-body dark:hover:bg-(--dark-sidebar) hover:text-(--text-green-primary) h-9 px-4 rounded-lg font-bold"
                    onClick={() => {
                      const newList = [...values.headerList, { key: "", value: "" }];
                      setFieldValue("headerList", newList);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> {t("common.add")}
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <FieldArray name="headerList">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.headerList.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-sm italic">No custom headers added.</div>
                        ) : (
                          values.headerList.map((_, index) => (
                            <div key={index} className="flex gap-3 group animate-in fade-in slide-in-from-top-1">
                              <Field name={`headerList.${index}.key`} as={Input} placeholder="Key" className="h-11 rounded-lg px-3 bg-(--input-color) dark:bg-page-body focus:bg-(--input-color) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg) transition-all shadow-none" />
                              <Field name={`headerList.${index}.value`} as={Input} placeholder="Value" className="h-11 rounded-lg px-3 bg-(--input-color) dark:bg-page-body focus:bg-(--input-color) dark:focus:bg-(--page-body-bg) transition-all shadow-none" />
                              <Button type="button" variant="ghost" size="icon" className="shrink-0 h-11 w-11 text-red-400 hover:text-red-600 hover:bg-red-50 dark:border-(--card-border-color) dark:hover:bg-(--dark-sidebar) rounded-lg group-hover:opacity-100" onClick={() => remove(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>

              {/* Params */}
              <Card className="border shadow-sm dark:bg-(--card-color) bg-white rounded-lg h-fit">
                <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-slate-50 dark:border-(--card-border-color) px-6">
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-(--text-green-primary)" />
                    {t("ai_models.form.add_params")}
                  </CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-(--text-green-primary) border border-(--text-green-primary) dark:border-none dark:bg-page-body hover:bg-emerald-50 dark:hover:bg-(--dark-sidebar) hover:text-primary h-9 px-4 rounded-lg font-bold"
                    onClick={() => {
                      const newList = [...values.paramList, { key: "", value: "" }];
                      setFieldValue("paramList", newList);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> {t("common.add")}
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <FieldArray name="paramList">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.paramList.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-sm italic">No custom params added.</div>
                        ) : (
                          values.paramList.map((_, index) => (
                            <div key={index} className="flex gap-3 group animate-in fade-in slide-in-from-top-1">
                              <Field name={`paramList.${index}.key`} as={Input} placeholder="Key" className="h-11 rounded-lg px-3 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:bg-(--input-color) transition-all shadow-none" />
                              <Field name={`paramList.${index}.value`} as={Input} placeholder="Value" className="h-11 rounded-lg px-3 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:bg-(--input-color) transition-all shadow-none" />
                              <Button type="button" variant="ghost" size="icon" className="shrink-0 h-11 w-11 text-red-400 hover:text-red-600 dark:border-(--card-border-color) dark:hover:bg-(--dark-sidebar) hover:bg-red-50 rounded-lg group-hover:opacity-100" onClick={() => remove(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>
            </div>

            {/* Custom Provider Fields */}
            {values.provider === "custom" && (
              <Card className="border-none shadow-sm dark:bg-(--card-color) bg-white rounded-lg">
                <CardHeader className="py-6 px-8 border-b border-slate-50 dark:border-(--card-border-color)">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    Custom Provider Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="sm:p-6 p-4 space-y-6">
                  <div className="flex gap-2 p-1.5 bg-slate-100/80 dark:bg-(--dark-sidebar) rounded-lg w-fit">
                    <Button type="button" size="sm" variant={values.payloadType === "json" ? "default" : "ghost"} className={cn("h-10 px-6 text-sm font-bold rounded-lg transition-all border-none hover:bg-(--light-primary)", values.payloadType === "json" ? "bg-white dark:bg-(--table-hover) dark:hover:bg-(--dark-sidebar) text-(--text-green-primary) shadow-sm dark:ring-(--card-border-color) ring-1 ring-slate-200/50 " : "text-slate-500 hover:text-slate-700  dark:hover:bg-(--dark-sidebar) dark:hover:text-amber-50")} onClick={() => setFieldValue("payloadType", "json")}>
                      JSON
                    </Button>
                    <Button type="button" size="sm" variant={values.payloadType === "formdata" ? "default" : "ghost"} className={cn("h-10 px-6 text-sm font-bold rounded-lg transition-all border-none hover:bg-(--light-primary)", values.payloadType === "formdata" ? "bg-white dark:bg-(--table-hover) dark:hover:bg-(--dark-sidebar) text-(--text-green-primary) shadow-sm dark:ring-(--card-border-color) ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 dark:hover:bg-(--dark-sidebar) dark:hover:text-amber-50")} onClick={() => setFieldValue("payloadType", "formdata")}>
                      Formdata
                    </Button>
                  </div>

                  {values.payloadType === "json" ? (
                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="payloadJson" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Payload JSON
                      </Label>
                      <Field name="payloadJson" as={Textarea} placeholder="Enter JSON payload structure.." className="min-h-40 font-mono text-sm border-none bg-slate-950 text-(--text-green-primary) rounded-lg p-6 focus:ring-1 focus:ring-emerald-500/50" />
                    </div>
                  ) : (
                    <div className="space-y-4 flex flex-col">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Form Data Fields</Label>
                      <FieldArray name="payloadForm">
                        {({ push, remove }) => (
                          <div className="space-y-4">
                            {values.payloadForm.map((_, index) => (
                              <div key={index} className="flex gap-4 group animate-in fade-in slide-in-from-top-2 transition-all">
                                <Field name={`payloadForm.${index}.key`} as={Input} placeholder="Field Name" className="h-12 px-3 rounded-lg bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:bg-(--input-color) dark:focus:bg-page-body transition-all shadow-none" />
                                <Field name={`payloadForm.${index}.value`} as={Input} placeholder="Value Mapping" className="h-12 px-3 rounded-lg bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:bg-(--input-color) transition-all dark:focus:bg-page-body shadow-none" />
                                <Button type="button" variant="ghost" size="icon" className="shrink-0 h-12 w-12 text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" onClick={() => remove(index)}>
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" className="mt-2 text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 border-dashed border border-slate-200 dark:border-(--card-border-color) dark:hover:bg-page-body dark:bg-page-body dark:hover:border-(--card-border-color) hover:border-slate-300 hover:bg-slate-50 h-12 w-full rounded-lg font-bold flex gap-2 shadow-none" onClick={() => push({ key: "", value: "" })}>
                              <Plus className="w-4 h-4" /> {t("common.add")} Payload Field
                            </Button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  )}

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="responsePath" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Response Path
                    </Label>
                    <Field name="responsePath" as={Input} placeholder="e.g. choices[0].message.content" className="h-12 px-3 rounded-lg bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) border-(--input-border-color) focus:bg-(--input-color) transition-all shadow-none" />
                    <ErrorMessage name="responsePath" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Sticky Actions */}
          <div className="w-full lg:w-96 space-y-6 h-fit lg:sticky lg:top-28 self-start z-10">
            <div className="space-y-6">
              <Card className=" shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-(--card-color) bg-white rounded-lg overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-2">
                    <Button type="button" onClick={() => router.back()} className="w-full px-4.5 py-5 h-12 text-black/50 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-(--dark-sidebar) bg-white dark:bg-page-body border dark:border-none rounded-lg shadow-none dark:shadow-none text-[15px] flex items-center justify-center gap-3 transition-all active:scale-95">
                      {t("common.cancel")}
                    </Button>
                    <Button type="submit" disabled={isLoading} className="w-full px-4.5 py-5 bg-(--text-green-primary) hover:bg-(--text-green-primary) text-white h-12 rounded-lg shadow-lg shadow-emerald-200 dark:shadow-none text-[16px] font-bold flex items-center justify-center gap-3 transition-all active:scale-95">
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-6 h-6" />
                          {t("common.save")}
                        </>
                      )}
                    </Button>
                  </div>
                  <Button type="button" variant="outline" className="w-full bg-gray-100 border border-gray-300 text-slate-600 dark:hover:text-amber-50 hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) hover:text-slate-900 dark:text-gray-300 shadow-none dark:bg-(--card-color) dark:border-(--card-border-color) h-12 rounded-lg text-[14px] font-bold flex items-center justify-center gap-3 transition-all" disabled={!values.modelId} onClick={() => setIsTestModalOpen(true)}>
                    <Sparkles className="w-5 h-5" />
                    {t("ai_models.form.test_model")}
                  </Button>

                  <TestModelModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} modelId={initialValues?._id || ""} />

                  <div className="pt-6 border-t border-slate-50 dark:border-(--card-border-color) mt-4">
                    <p className="text-xs text-slate-400 text-center leading-relaxed">Changes will be applied immediately to all connected AI features upon saving.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Status Summary */}
              {/* <Card className="border-none shadow-sm dark:bg-(--card-color) bg-emerald-50/50 rounded-lg">
                <CardContent className="p-6">
                  <h4 className="text-sm font-bold text-(--text-green-primary) mb-4 flex items-center gap-2 uppercase tracking-tight">
                    <ShieldCheck className="w-4 h-4" />
                    Model Configuration Summary
                  </h4>
                  <ul className="space-y-3 text-xs text-(--text-green-primary)">
                    <li className="flex justify-between">
                      <span>Provider:</span>
                      <span className="font-bold uppercase">{values.provider}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Model ID:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{values.modelId || "Not set"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Custom Headers:</span>
                      <span className="font-bold">{values.headerList.filter((h) => h.key).length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Default Model:</span>
                      <span className={cn("font-bold px-2 py-0.5 rounded-full text-[10px]", values.is_default ? "bg-emerald-200 text-emerald-800" : "bg-slate-200 dark:bg-(--dark-sidebar) text-slate-600 dark:text-gray-300")}>{values.is_default ? "YES" : "NO"}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card> */}
              <Card className="border shadow-sm dark:border-(--card-border-color) dark:bg-(--card-color) bg-white rounded-lg overflow-hidden">
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="space-y-1.5 p-6 flex flex-row items-center justify-between py-5 border-b border-slate-50 dark:border-(--card-border-color) px-6">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-wide">
                      <ShieldCheck className="w-5 h-5 text-(--text-green-primary)" />
                      Model Configuration Summary
                    </h4>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-3 mb-2 last:p-0 border-b border-(--input-border-color) dark:border-(--card-border-color)">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Provider:</span>
                      <span className="font-semibold text-(--text-green-primary) uppercase text-sm">{values.provider}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 mb-2 last:p-0 border-b border-(--input-border-color) dark:border-(--card-border-color)">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Model ID:</span>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{values.modelId || <span className="text-slate-400 dark:text-slate-500 italic">Not set</span>}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 mb-2 last:p-0 border-b border-(--input-border-color) dark:border-(--card-border-color)">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Custom Headers:</span>
                      <span className="inline-flex items-center justify-center min-w-7 h-7 px-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-(--text-green-primary) rounded-full font-bold text-sm">{values.headerList.filter((h) => h.key).length}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 mb-2 last:p-0">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Default Model:</span>
                      <span className={cn("font-semibold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wide transition-colors", values.is_default ? "bg-(--text-green-primary) text-white shadow-sm" : "bg-slate-200 dark:bg-page-body text-slate-600 dark:text-slate-300")}>{values.is_default ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AIModelForm;
