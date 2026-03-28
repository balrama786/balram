"use client";

import { Card, CardContent } from "@/src/elements/ui/card";
import { WABA_SETUP_STEPS } from "@/src/constants/wabaSetupData";
import { WabaSetupGuideProps } from "@/src/types/whatsapp";
import { AlertCircle, AppWindow, CheckCircle2, Key, Phone, Webhook } from "lucide-react";
import Link from "next/link";

const iconMap = {
  Phone: <Phone size={20} />,
  AppWindow: <AppWindow size={20} />,
  Key: <Key size={20} />,
  Webhook: <Webhook size={20} />,
  CheckCircle2: <CheckCircle2 size={20} />,
};

const WabaSetupGuide = ({ isConnected }: WabaSetupGuideProps) => {
  return (
    <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-slate-50 dark:bg-(--page-body-bg) px-6 py-5 border-b border-slate-100 dark:border-(--card-border-color)">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">WhatsApp Business API Setup Guide</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Complete these steps in your Meta Developer account to activate WAPI.</p>
      </div>

      <CardContent className="sm:p-6 p-4 flex-1 space-y-6">
        <div className="space-y-4">
          {WABA_SETUP_STEPS.map((step, index) => (
            <div key={index} className="flex gap-4 group relative">
              {index !== WABA_SETUP_STEPS.length - 1 && <div className="absolute left-5 rtl:left-0 rtl:right-5 top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-(--page-body-bg) transition-colors " />}

              <div className={`shrink-0 w-10 h-10 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center z-10 shadow-sm border border-white dark:border-slate-900`}>{iconMap[step.iconName]}</div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-slate-400 dark:text-gray-600 border border-slate-200 dark:border-slate-800 px-1.5 rounded">0{index + 1}</span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed line-clamp-3">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1 space-y-4">
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
              <AlertCircle size={18} className="rotate-180" />
              <h5 className="text-sm font-bold">Need Help?</h5>
            </div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400/80 leading-relaxed font-medium">
              For detailed instructions, visit the{" "}
              <Link href="https://developers.facebook.com/docs/whatsapp/cloud-api" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline decoration-blue-300 dark:decoration-blue-700 underline-offset-2 hover:text-blue-800 transition-colors">
                WhatsApp Cloud API Documentation
              </Link>
            </p>
          </div>

          {!isConnected && (
            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                <AlertCircle size={18} />
                <h5 className="text-sm font-bold">Connection Status Notice</h5>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-500/80 leading-relaxed font-medium">
                If your WhatsApp Business API is <span className="underline decoration-2">not connected</span>: Please complete all steps above and ensure credentials are <strong>valid</strong>. An active connection is required to use automation flows, campaigns, live chat, and analytics.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WabaSetupGuide;
