"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Zap, Sparkles } from "lucide-react";
import { AIModel } from "@/src/types/settings";
import Image from "next/image";

interface ConfigurationSummaryProps {
  currentModel?: AIModel;
  hasApiKey: boolean;
}

const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({ currentModel, hasApiKey }) => {
  const { t } = useTranslation();

  return (
    <Card className="border dark:border-(--card-border-color) shadow-lg bg-slate-900 dark:bg-(--card-color) text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap size={100} fill="white" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={20} className="text-yellow-400 fill-yellow-400/20" />
          <CardTitle className="text-lg font-bold">{t("setup.current_configuration")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">{t("setup.active_model")}</span>
          {currentModel ? (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 ring-1 ring-white/5">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">{currentModel.icon ? <Image src={currentModel.icon} alt={currentModel.display_name} width={24} height={24} className="object-contain" /> : <Sparkles size={20} />}</div>
              <div>
                <h4 className="font-bold text-sm">{currentModel.display_name}</h4>
                <p className="text-[11px] text-slate-400 truncate max-w-37.5">{currentModel.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">{t("setup.no_model_selected")}</p>
          )}
        </div>

        <div className="pt-4 border-t border-white/10">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("setup.api_status")}</span>
          <div className="flex items-center gap-2 mt-1">
            <div className={`h-2.5 w-2.5 rounded-full ${hasApiKey ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-700"}`} />
            <span className={`text-sm font-medium ${hasApiKey ? "text-emerald-400" : "text-slate-500"}`}>{hasApiKey ? t("setup.connected") : t("setup.not_configured")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationSummary;
