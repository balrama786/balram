/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DatePicker } from "@/src/elements/ui/date-picker";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { CampaignFormValues } from "@/src/types/components";
import { format, parse } from "date-fns";
import { FormikProps } from "formik";
import { Calendar, CheckCircle2, Clock, Rocket, Send } from "lucide-react";

const StepScheduling = ({ formik }: { formik: FormikProps<CampaignFormValues> }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
          <Clock className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="sm:text-xl text-lg font-black text-primary tracking-tight">Launch & Schedule</h2>
          <p className="text-slate-500 text-sm font-medium">Choose when to send out your campaign.</p>
        </div>
      </div>

      <div className="max-w-xl space-y-8">
        <CardItem title="Send Immediately" description="Process and send this campaign right after you hit the launch button." icon={<Rocket size={20} />} isActive={!formik.values.is_scheduled} onClick={() => formik.setFieldValue("is_scheduled", false)} />

        <div className={cn("p-4 sm:p-6 md:p-8 rounded-lg border transition-all duration-500 space-y-4 sm:space-y-6", formik.values.is_scheduled ? "bg-emerald-50/30 border-[#16a34a57] dark:bg-emerald-500/5 dark:border-emerald-500/20" : "bg-white dark:bg-(--dark-sidebar) border-slate-100 dark:border-none")}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors shrink-0", formik.values.is_scheduled ? "bg-(--light-primary) text-gray-600" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400")}>
                <Calendar size={20} className="sm:w-5.5 sm:h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-black text-xs sm:text-sm uppercase tracking-wider truncate", formik.values.is_scheduled ? "text-primary" : "text-slate-600 dark:text-gray-400")}>Schedule for Later</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Pick a specific date and time</p>
              </div>
            </div>
            <Switch checked={formik.values.is_scheduled} onCheckedChange={(checked) => formik.setFieldValue("is_scheduled", checked)} className="data-[state=checked]:bg-emerald-500 self-start sm:self-auto" />
          </div>

          {formik.values.is_scheduled ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
              <Label htmlFor="scheduled_at" className="text-xs font-black uppercase tracking-widest text-primary ml-1">
                Pick Date & Time
              </Label>
              <div className="relative">
                <DatePicker 
                  date={formik.values.scheduled_at ? parse(formik.values.scheduled_at, "yyyy-MM-dd'T'HH:mm", new Date()) : undefined} 
                  onChange={(date) => formik.setFieldValue("scheduled_at", date ? format(date, "yyyy-MM-dd'T'HH:mm") : "")} 
                  showTime={true}
                  className="h-12 sm:h-14 pl-10 sm:pl-12 font-bold text-sm sm:text-base border-[#16a34a57]"
                />
                <Calendar className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none" size={16} aria-hidden="true" />
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-primary dark:text-primary font-medium leading-relaxed">Your campaign will be processed as soon as you hit the launch button. Best for time-sensitive broadcasts.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-(--table-hover) p-8 flex-col sm:flex-row rounded-lg flex items-center gap-6 text-white overflow-hidden relative group">
        <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 opacity-10 transition-transform group-hover:scale-110">
          <Send size={240} />
        </div>
        <div className="w-16 h-16 bg-white/10 dark:bg-(--dark-body) backdrop-blur-md rounded-lg flex items-center justify-center shrink-0">
          <CheckCircle2 size={32} className="dark:text-primary" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black tracking-tight">Ready to launch?</h3>
          <p className="text-white/60 font-medium text-sm">Please review all steps before proceeding. Campaigns cannot be edited once they are in the sending queue.</p>
        </div>
      </div>
    </div>
  );
};

const CardItem = ({ title, description, icon, isActive, onClick }: any) => (
  <div onClick={onClick} className={cn("p-6 rounded-lg flex-col sm:flex-row border transition-all duration-300 cursor-pointer flex items-center gap-5", isActive ? "bg-slate-50 border-primary dark:bg-primary/5 dark:border-primary shadow-lg" : "bg-white dark:bg-(--dark-sidebar) border-slate-100 dark:border-(--card-border-color) dark:hover:border-(--card-border-color) hover:border-slate-200")}>
    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center transition-all", isActive ? "bg-(--light-primary) text-primary dark:bg-primary shadow-md dark:text-white" : "bg-slate-50 dark:bg-(--dark-sidebar) text-slate-400")}>{icon}</div>
    <div>
      <h3 className={cn("font-black text-sm uppercase tracking-wider", isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-gray-400")}>{title}</h3>
      <p className="text-[10px] text-slate-400 font-medium">{description}</p>
    </div>
  </div>
);

export default StepScheduling;
