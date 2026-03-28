"use client";

import React, { useMemo } from "react";
import { Badge } from "@/src/elements/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Label } from "@/src/elements/ui/label";
import { AlertCircle, CheckCircle2, Database, LayoutTemplate, Settings2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { TemplateSelectionStepProps } from "@/src/types/webhook";

const TemplateSelectionStep = ({ webhookData, connectionsData, selectedWabaId, setSelectedWabaId, templatesData, isTemplatesLoading, selectedTemplateId, setSelectedTemplateId, setVariableMappings }: TemplateSelectionStepProps) => {
  const approveTemplete = useMemo(() => templatesData?.data?.filter((item) => item.status === "approved"), [templatesData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="lg:col-span-1 space-y-6">
        <Card className="rounded-lg border-none shadow-sm overflow-hidden bg-white dark:bg-(--card-color)">
          <CardHeader className="bg-emerald-50/50 dark:bg-emerald-500/5 pb-4 border-b dark:border-white/5">
            <CardTitle className="text-sm font-bold flex items-center gap-2  tracking-wider text-primary">
              <Database className="h-4 w-4" /> Webhook Context
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400 font-black tracking-widest">Active Webhook</Label>
              <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{webhookData?.webhook?.webhook_name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400 font-black tracking-widest">Platform</Label>
              <Badge className="bg-emerald-50 text-primary dark:bg-emerald-500/10 dark:text-primary border-none hover:bg-(--light-primary) font-bold text-[10px] px-2 py-0.5">{webhookData?.webhook?.platform?.toUpperCase() || "CUSTOM"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-none shadow-sm overflow-hidden bg-white dark:bg-(--card-color)">
          <CardHeader className="bg-blue-50/50 dark:bg-blue-500/5 pb-4 border-b dark:border-white/5">
            <CardTitle className="text-sm font-bold flex items-center gap-2  tracking-wider text-blue-600">
              <Settings2 className="h-4 w-4" /> Account Config
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">WhatsApp Business Account</Label>
              <div className="p-3 bg-primary/5 dark:bg-black/10 rounded-lg border border-primary/20">
                <p className="font-bold text-slate-700 dark:text-slate-200">{connectionsData?.data?.find((c) => c.id === selectedWabaId)?.name || "Connected WABA"}</p>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight truncate">WABA ID: {connectionsData?.data?.find((c) => c.id === selectedWabaId)?.whatsapp_business_account_id || selectedWabaId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between px-2 flex-wrap">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-emerald-500" /> Choose Message Template
          </h3>
          {approveTemplete && <Badge className="bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-gray-500 border-none px-2.5 py-1 text-[11px] font-bold">{approveTemplete.length} Templates Found</Badge>}
        </div>

        {isTemplatesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : approveTemplete?.length === 0 ? (
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-white/10 h-125 flex flex-col items-center justify-center text-center sm:p-8 p-4 space-y-4">
            <div className="p-6 bg-slate-50 dark:bg-(--dark-body) rounded-full">
              <AlertCircle className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">No Approved Templates</h4>
              <p className="text-slate-500 dark:text-gray-400 max-w-sm text-sm">This WABA does not have any approved message templates.</p>
            </div>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-150 overflow-auto pr-2 custom-scrollbar">
            {approveTemplete?.map((template) => (
              <div
                key={template._id}
                onClick={() => {
                  setSelectedTemplateId(template._id);
                  setVariableMappings({});
                }}
                className={cn("p-5 rounded-lg border transition-all cursor-pointer relative group flex flex-col h-full", selectedTemplateId === template._id ? "border-primary bg-(--light-primary) dark:bg-primary/10 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20" : "border-gray-50 dark:border-white/5 bg-white dark:bg-(--card-color) hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-lg")}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-emerald-50 text-primary dark:bg-emerald-500/10 dark:text-primary border-none font-black text-[10px] uppercase tracking-tighter px-2">{template.category}</Badge>
                  {selectedTemplateId === template._id && (
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{template.template_name.replace(/_/g, " ")}</h4>
                <p className="text-[11px] text-slate-500 dark:text-gray-500 line-clamp-3 font-medium leading-relaxed mb-4 flex-1">{template.message_body}</p>
                <div className="pt-3 border-t dark:border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">{template.language}</span>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
