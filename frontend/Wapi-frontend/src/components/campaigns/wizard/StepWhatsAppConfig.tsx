"use client";

import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { cn } from "@/src/lib/utils";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import { CampaignFormValues, Template } from "@/src/types/components";
import { WABAConnection } from "@/src/types/whatsapp";
import { FormikProps } from "formik";
import { CheckCircle2, Globe, Layout, Loader2, Smartphone } from "lucide-react";
import { useMemo } from "react";

const StepWhatsAppConfig = ({ formik }: { formik: FormikProps<CampaignFormValues> }) => {
  const { data: connectionsResult, isLoading: loadingConnections } = useGetConnectionsQuery({});

  const connections: WABAConnection[] = useMemo(() => {
    if (!connectionsResult) return [];
    const data = Array.isArray(connectionsResult) ? connectionsResult : connectionsResult?.data;
    return (data || []) as WABAConnection[];
  }, [connectionsResult]);

  const { data: templatesResult, isLoading: loadingTemplates } = useGetTemplatesQuery({ waba_id: formik.values.waba_id }, { skip: !formik.values.waba_id });

  const templates = useMemo(() => templatesResult?.data || [], [templatesResult]);
  const finalTemplatesData = useMemo(() => templates.filter((item) => item.status === "approved"), [templates]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
          <Smartphone className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="sm:text-xl text-lg font-black text-primary tracking-tight">WhatsApp Configuration</h2>
          <p className="text-slate-500 font-medium text-sm">Select the official account and template for this campaign.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label className="text-[13px] font-medium text-slate-500 dark:text-gray-400 ml-1">WABA Account</Label>
          {formik.values.waba_id && connections.length > 0 ? (
            <div className="p-4 bg-primary/5 dark:bg-(--page-body-bg) rounded-lg border border-primary/20 flex flex-col items-start">
              <p className="font-bold text-slate-700 dark:text-slate-200">{connections.find((c) => c.id === formik.values.waba_id)?.name || "Selected WABA"}</p>
              <p className="text-xs text-slate-500 font-medium">
                WABA ID: <span className="font-bold text-primary">{connections.find((c) => c.id === formik.values.waba_id)?.whatsapp_business_account_id}</span>
              </p>
            </div>
          ) : (
            <Select
              value={formik.values.waba_id}
              onValueChange={(val) => {
                formik.setFieldValue("waba_id", val);
                formik.setFieldValue("template_id", "");
              }}
            >
              <SelectTrigger className="p-5 bg-(--input-color) dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color) dark:hover:bg-(--page-body-bg) h-15! font-bold text-slate-700">
                <SelectValue placeholder={loadingConnections ? "Loading accounts..." : "Choose an account"} className="" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-2xl border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color)">
                {connections.map((conn) => (
                  <SelectItem key={conn.id} value={conn.id} className="rounded-lg dark:hover:bg-(--table-hover) py-3 px-4">
                    <div className="flex flex-col items-start text-slate-600 dark:text-gray-400">
                      <p className="font-medium">{conn.name}</p>
                      <p>WABA ID : <span className="font-medium">{conn.whatsapp_business_account_id}</span></p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {formik.values.waba_id ? (
        <div className="space-y-6 animate-in slide-in-from-top-4 max-h-161.75 overflow-auto custom-scrollbar">
          <div className="flex items-center justify-between flex-wrap">
            <Label className="text-[13px] font-medium text-slate-500 ml-1">Select Message Template</Label>
            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg text-slate-400">{finalTemplatesData.length} APPROVED TEMPLATES</span>
          </div>

          {loadingTemplates ? (
            <div className="h-40 flex items-center justify-center bg-slate-50/50 rounded-lg border dark:border-(--card-border-color) dark:bg-(--dark-sidebar) border-dashed border-slate-200">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : finalTemplatesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {finalTemplatesData.map((tpl: Template) => {
                const isSelected = formik.values.template_id === tpl._id;
                return (
                  <div key={tpl._id} onClick={() => formik.setFieldValue("template_id", tpl._id)} className={cn("group relative p-4 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden", isSelected ? "bg-(--light-primary) dark:bg-(--table-hover) border-primary" : "bg-white dark:bg-(--dark-body) border-slate-100 dark:border-none  dark:hover:bg-(--table-hover) hover:border-primary/40 hover:bg-slate-50/50 shadow-sm")}>
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                        <CheckCircle2 size={24} fill="currentColor" className="text-primary-foreground stroke-primary" />
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[9px] font-black capitalize px-2 py-0.5 rounded-full", tpl.category === "MARKETING" ? "bg-orange-50 dark:bg-(--page-body-bg) dark:text-primary text-orange-500" : "bg-blue-50 dark:bg-(--page-body-bg) dark:text-primary text-blue-500")}>{tpl.category.toLocaleLowerCase()}</span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                          <Globe size={10} /> {tpl.language}
                        </div>
                      </div>

                      <h4 className="font-black text-sm text-slate-700 dark:text-slate-200 truncate pr-8 rtl:pr-0 rtl:pl-8">{tpl.template_name}</h4>

                      <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed font-medium">{tpl.message_body.replace(/{{.*?}}/g, "___")}</p>

                      <div className="flex items-center justify-between gap-3 pt-1 border-t dark:border-(--card-border-color)">
                        <div className="flex items-center gap-1.5">
                          <Layout size={12} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500">{tpl.header?.format || "no"} header</span>
                        </div>
                        <div className="">
                          <span className={cn("capitalize text-[9px] font-black px-2 py-0.5 rounded-full", tpl.status === "rejected" ? "bg-red-50 dark:bg-(--card-color) dark:text-primary text-red-500" : tpl.status === "pending" ? "bg-yellow-50 dark:bg-(--card-color) dark:text-primary text-yellow-500" : "bg-blue-50 dark:bg-(--card-color) dark:text-primary text-blue-500")}>{tpl.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center dark:bg-(--dark-sidebar) dark:border-(--card-border-color) bg-slate-50/50 rounded-lg border-2 border-dashed border-slate-200 space-y-2">
              <Layout className="text-slate-300" size={32} />
              <p className="text-slate-400 font-bold text-sm">No templates found for this account.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-40 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-(--card-color) dark:hover:bg-(--table-hover) dark:border-(--card-border-color) rounded-lg border-2 border-dashed border-slate-200 space-y-2">
          <Layout className="text-slate-300" size={32} />
          <p className="text-slate-400 font-bold text-sm text-center">Select WABA ID and select templates.</p>
        </div>
      )}
    </div>
  );
};

export default StepWhatsAppConfig;
