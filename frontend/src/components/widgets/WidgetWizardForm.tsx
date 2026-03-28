/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { WidgetData } from "@/src/types/widget";
import { useCreateWidgetMutation, useUpdateWidgetMutation } from "@/src/redux/api/widgetApi";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/utils";
import { toast } from "sonner";
import { Loader2, Palette, Type, MessageCircle, Settings, Rocket, ChevronRight, ChevronLeft, Check } from "lucide-react";
import WidgetSuccess from "./WidgetSuccess";
import { AppearanceStep } from "./steps/AppearanceStep";
import { HeaderStep } from "./steps/HeaderStep";
import { BodyStep } from "./steps/BodyStep";
import { ActionStep } from "./steps/ActionStep";

interface WidgetWizardFormProps {
  data: Partial<WidgetData>;
  onChange: (field: keyof WidgetData, value: any) => void;
  onSuccess: () => void;
  existingId?: string;
  isStandalone?: boolean;
  onBodyBgImageChange?: (previewUrl: string | null, file: File | null) => void;
}

const STEPS = [
  { id: "appearance", label: "Appearance", icon: Palette, description: "Widget button & position" },
  { id: "header", label: "Header", icon: Type, description: "Chat window header style" },
  { id: "body", label: "Body", icon: MessageCircle, description: "Welcome message & colors" },
  { id: "action", label: "Action", icon: Settings, description: "Chat button customization" },
];

const WidgetWizardForm: React.FC<WidgetWizardFormProps> = ({ data, onChange, onSuccess, existingId, isStandalone, onBodyBgImageChange }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [bodyBgType, setBodyBgType] = useState<"color" | "image">("color");
  const [bodyBgImageName, setBodyBgImageName] = useState<string | null>(null);

  const [createWidget, { isLoading: isCreating }] = useCreateWidgetMutation();
  const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetMutation();
  const isLoading = isCreating || isUpdating;

  const activeStep = STEPS[stepIdx];

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "widget_image" && (value as unknown) instanceof File) {
            formData.append(key, value as unknown as File);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      let response;
      if (existingId) {
        response = await updateWidget({ id: existingId, body: formData }).unwrap();
        toast.success("Widget updated successfully!");
      } else {
        response = await createWidget(formData).unwrap();
        toast.success("Widget created successfully!");
      }

      if (response.success && response.data) {
        setGeneratedScript(response.data.embed_code || response.data.script_tag || "");
        setIsSuccess(true);
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return <WidgetSuccess script={generatedScript} onBack={() => setIsSuccess(false)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) p-3 sm:p-5 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === stepIdx;
            const isDone = idx < stepIdx;
            return (
              <React.Fragment key={step.id}>
                <button onClick={() => setStepIdx(idx)} className={cn("flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all duration-300 shrink-0", isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : isDone ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-400 dark:text-gray-500 hover:text-slate-600 hover:bg-slate-50 group dark:hover:bg-(--table-hover)")}>
                  <span className={cn("flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-bold", isActive ? "bg-white/20" : isDone ? "bg-primary/20" : "bg-slate-100 dark:bg-(--dark-body)")}>{isDone ? <Check size={10} className="sm:size-3" /> : <Icon size={10} className="sm:size-3 group-hover:text-gray-400" />}</span>
                  <span className="hidden md:block group-hover:text-gray-400">{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && <div className={cn("flex-1 min-w-2.5 sm:min-w-5 h-0.5 rounded-full transition-all duration-500", idx < stepIdx ? "bg-primary" : "bg-slate-100 dark:bg-(--card-border-color)")} />}
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-3 pl-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="text-primary font-semibold">{activeStep.label}</span> — {activeStep.description}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <div className="sm:p-6 p-4 space-y-5">
          {stepIdx === 0 && <AppearanceStep data={data} onChange={onChange} isStandalone={isStandalone} />}
          {stepIdx === 1 && <HeaderStep data={data} onChange={onChange} />}
          {stepIdx === 2 && <BodyStep data={data} onChange={onChange} bodyBgType={bodyBgType} setBodyBgType={setBodyBgType} bodyBgImageName={bodyBgImageName} setBodyBgImageName={setBodyBgImageName} onBodyBgImageChange={onBodyBgImageChange} />}
          {stepIdx === 3 && <ActionStep data={data} onChange={onChange} />}
        </div>

        <div className="px-4 sm:px-6 py-4 bg-slate-50/60 dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) flex justify-between items-center gap-2">
          <Button variant="ghost" onClick={() => setStepIdx((p) => p - 1)} disabled={stepIdx === 0} className="gap-1 sm:gap-2 text-slate-500 dark:text-gray-300 dark:hover:text-gray-300 dark:bg-(--page-body-bg) px-3 sm:px-4.5! py-4 sm:py-5! hover:text-slate-700 disabled:opacity-30 text-xs sm:text-sm">
            <ChevronLeft size={16} />
            <span className="hidden xs:inline">Back</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("rounded-full transition-all duration-300", i === stepIdx ? "w-4 sm:w-6 h-1.5 sm:h-2 bg-primary" : i < stepIdx ? "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary/40" : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700")} />
            ))}
          </div>

          {stepIdx < STEPS.length - 1 ? (
            <Button onClick={() => setStepIdx((p) => p + 1)} className="gap-1 sm:gap-2 text-white text-xs sm:text-sm px-4! py-4 sm:py-5!">
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading} className="gap-1 sm:gap-2 shadow-lg shadow-primary/20 text-white px-3 sm:px-4.5! py-4 sm:py-5! text-xs sm:text-sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket size={16} />}
              <span>{existingId ? "Update" : "Generate"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetWizardForm;
