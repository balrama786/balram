import { Switch } from "@/src/elements/ui/switch";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";

interface GatewayCardProps {
  title: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}

// This is now used as the Settings Panel — no card wrapper needed.
// Children are rendered directly; the header toggle is built here.
const GatewayCard = ({ title, enabled, onToggle, children }: GatewayCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      {/* Settings Panel Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-(--input-border-color) dark:border-(--card-border-color)">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            {title} · Configuration
          </p>
          <div className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${enabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
            {enabled ? (
              <><CheckCircle2 className="w-4 h-4" /> {t("gateway.active")}</>
            ) : (
              <><XCircle className="w-4 h-4" /> {t("gateway.inactive")}</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-500">{enabled ? "Enabled" : "Disabled"}</span>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-(--text-green-primary)"
          />
        </div>
      </div>

      {/* Form Body */}
      <div className={`flex-1 px-8 py-8 transition-all duration-300 ${!enabled ? "opacity-50 pointer-events-none select-none" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default GatewayCard;
