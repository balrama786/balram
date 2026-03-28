/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { AlertCircle, CheckCircle2, Database, Loader2, Locate, PlayCircle, Settings2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { FormLivePreview } from "../../templates/form/FormLivePreview";
import PayloadFieldSelector from "../PayloadFieldSelector";
import { MappingStepProps } from "@/src/types/webhook";

const MappingStep = ({ payloadFields, phoneNumberField, setPhoneNumberField, variables, variableMappings, setVariableMappings, template, previewVariables }: MappingStepProps) => (
  <div className="grid [@media(max-width:1400px)]:grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="[@media(min-width:1400px)]:col-span-7 col-span-1 space-y-8">
      {/* Recipient Selection */}
      <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b dark:border-white/5 pb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Database size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white text-sm">Recipient Identification</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{"Crucial: Where is the customer's phone number?"}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Phone Number Field <span className="text-rose-500 text-lg">*</span>
          </Label>
          <PayloadFieldSelector fields={payloadFields} value={phoneNumberField} onChange={setPhoneNumberField} placeholder="Search phone field (e.g. customer.phone)" className="h-14 rounded-lg shadow-sm border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--page-body-bg)" />
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-(--card-color) p-4 rounded-lg border border-amber-100/50 dark:border-(--card-border-color)">
            <AlertCircle size={14} className="text-amber-500 mt-0.5" />
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">Ensure this field in your webhook JSON contains a valid phone number (with country code) for message delivery.</p>
          </div>
        </div>
      </div>

      {/* Variables Section */}
      <div className="space-y-6 max-h-139.5 overflow-auto custom-scrollbar">
        <div className="px-2 flex items-center justify-between flex-wrap gap-3 sm:gap-0">
          <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
            <Settings2 size={16} className="text-primary" /> Template Placeholders
          </h3>
          <Badge className="bg-emerald-500/10 text-primary border-none font-black text-[10px] px-3">{variables.length} Variables to map</Badge>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {variables.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variables.map((v: any, index: number) => {
              const key = v.key || (index + 1).toString();
              const example = v.example || "N/A";
              const currentVal = variableMappings[key] || "";

              return (
                <div key={index} className="group bg-white dark:bg-(--card-color) p-6 rounded-lg border border-gray-50 dark:border-(--card-border-color) hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 space-y-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20 ">
                        <Locate />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary">Placeholder {"{{" + key + "}}"}</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 italic opacity-60">{`Example: "${example}"`}</div>
                      </div>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-lg">
                      <button onClick={() => setVariableMappings((prev) => ({ ...prev, [key]: "" }))} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !currentVal.startsWith("{{") ? "bg-white dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-sm" : "text-slate-400")}>
                        Manual
                      </button>
                      <button onClick={() => setVariableMappings((prev) => ({ ...prev, [key]: "{{" }))} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", currentVal.startsWith("{{") ? "bg-white dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-sm" : "text-slate-400")}>
                        Payload
                      </button>
                    </div>
                  </div>

                  {currentVal.startsWith("{{") ? (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <PayloadFieldSelector fields={payloadFields} value={currentVal.replace("{{", "").replace("}}", "")} onChange={(val) => setVariableMappings((prev) => ({ ...prev, [key]: val ? `{{${val}}}` : "{{" }))} placeholder="Choose field from JSON..." className="h-12 rounded-lg border-emerald-500/10 bg-emerald-50/20 dark:border-none" />
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                      <Input placeholder="Enter custom text here..." value={currentVal} onChange={(e) => setVariableMappings((prev) => ({ ...prev, [key]: e.target.value }))} className="h-12 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-100 focus:ring-emerald-500/20 font-bold text-sm" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-emerald-50/50 dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-dashed border-emerald-200/50 dark:border-(--card-border-color) text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-(--page-body-bg) rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-lg text-primary dark:text-emerald-400">Zero Variables</h4>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/60 font-medium">This template is static. No variable mapping required!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="[@media(min-width:1400px)]:min-w-[400px] shrink-0">
      <div className="sticky top-0 bg-white dark:bg-(--dark-sidebar) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden shadow-2xl">
        <div className="p-5 border-b dark:border-(--card-border-color) bg-slate-50/50 dark:bg-transparent flex items-center gap-2">
          <PlayCircle className="text-primary" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Real-time Preview</span>
        </div>
        <div className="p-[calc(4px+(24-4)*((100vw-320px)/(1920-320)))] flex items-center justify-center bg-slate-100/30 dark:bg-transparent">
          {template ? (
            <FormLivePreview templateType={template.header?.format || "text"} headerText={template.header?.text || ""} messageBody={template.message_body || ""} variables_example={previewVariables} footerText={template.footer_text || ""} buttons={template.buttons || []} headerFile={null} />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-emerald-500 h-10 w-10" />
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Loading Preview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default MappingStep;
