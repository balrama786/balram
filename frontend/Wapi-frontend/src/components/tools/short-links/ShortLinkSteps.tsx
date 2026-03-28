"use client";

import { Check, Layout, Lightbulb, Target } from "lucide-react";
import React from "react";

interface ShortLinkStepsProps {
  variant?: "horizontal" | "vertical";
}

const ShortLinkSteps: React.FC<ShortLinkStepsProps> = ({ variant = "horizontal" }) => {
  const steps = [
    {
      id: 1,
      title: "Configure WhatsApp Number",
      description: "Select your country to automatically apply the correct dial code. Enter your active WhatsApp phone number without any leading zeros or special characters for a seamless connection.",
    },
    {
      id: 2,
      title: "Add Custom Welcome Message",
      description: "Draft a personalized message that will be pre-filled in your customer's input field when they click your link. This makes it easier for them to start the conversation with you.",
    },
    {
      id: 3,
      title: "Generate & Deploy Link",
      description: "Once generated, you'll receive a professional short link and a scan-ready QR code. You can now copy the link or download the QR code to use across your marketing channels.",
    },
  ];

  if (variant === "vertical") {
    return (
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-fit space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Layout size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Simple Steps</h2>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.id} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold z-10 shadow-lg shadow-emerald-500/20">
                    {step.id}
                  </div>
                  {step.id < 3 && <div className="w-[1.5px] h-full bg-slate-100 dark:bg-(--page-body-bg) absolute top-7 left-3.25" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-bold text-slate-800 dark:text-white text-[14px] mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-primary flex items-center justify-center">
              <Lightbulb size={16} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pro Tips for Success</p>
          </div>
          <div className="space-y-4">
            {[
              "Verify your number format to avoid redirection errors.",
              "Use clear call-to-actions (CTA) like 'Chat with Us' or 'Get Support'.",
              "Include your short link in social media bios for 40% more leads.",
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1">
                  <Check size={14} className="text-emerald-500" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-normal">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sm:pt-8 pt-4 border-t border-slate-100 dark:border-(--card-border-color)">
           <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg sm:p-5 p-4 border border-emerald-500/10">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                    <Target size={16} />
                 </div>
                 <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Marketing Tip</p>
              </div>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                Add your WhatsApp QR code to physical banners, business cards, and product packaging to bridge the gap between offline and online engagement efficiently.
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-2xl border border-slate-200 dark:border-(--card-border-color) p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <Layout size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Simple Steps to Create WhatsApp Link</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.id} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-500/20">
              {step.id}
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{step.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:pt-8 pt-4 border-t border-slate-100 dark:border-(--card-border-color)">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wider text-[10px]">Pro Tips for Customization:</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            "Use local number formats correctly",
            "Keep welcome messages short & clear",
            "Post link on Instagram & Facebook Bio",
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check size={14} className="shrink-0" />
              <span className="text-xs font-bold">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortLinkSteps;
