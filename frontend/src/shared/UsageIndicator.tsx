/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/src/redux/hooks";
import { ChartNoAxesColumn } from "lucide-react";
import { USAGE_MAPPING } from "../constants/usageMap";

interface UsageIndicatorProps {
  featureKey: string;
}

const UsageIndicator = ({ featureKey }: UsageIndicatorProps) => {
  const { subscription } = useAppSelector((state) => state.setting);

  if (!subscription || !featureKey) return null;

  const usageData = subscription.usage || {};
  const planData = (subscription.plan_id as any)?.features || {};

  const config = (USAGE_MAPPING as any)[featureKey];
  if (!config) return null;

  const used = usageData[featureKey] || 0;
  const limit = planData[config.featureKey];

  if (limit === undefined || limit === false) return null;

  const isUnlimited = typeof limit === "boolean" && limit === true;
  const limitValue = isUnlimited ? "∞" : typeof limit === "number" ? limit : 0;
  const remaining = isUnlimited ? "∞" : Math.max(0, (limit as number) - used);

  const Icon = config.icon || ChartNoAxesColumn;

  return (
    <div className="flex items-center gap-2.5 px-4 h-12.5 bg-blue-50/50 dark:bg-(--card-color) border border-blue-200 dark:border-(--card-border-color) rounded-xl transition-all duration-300 animate-in fade-in zoom-in-95 group">
      <div className="p-1.5 bg-blue-500/20 dark:bg-blue-500/10 rounded-lg text-blue-500 dark:text-primary group-hover:scale-110 transition-transform duration-300">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-medium text-slate-600 dark:text-gray-500 tracking-widest leading-none">Remaining</span>
        <div className="flex gap-2 items-baseline">
          <span className="text-[18px] font-bold text-slate-900 dark:text-white leading-none">{remaining.toLocaleString()}</span>
          <span className="text-[15px] font-bold text-slate-300 dark:text-gray-600">/</span>
          <span className="text-[13px] font-bold text-slate-400 dark:text-gray-500">{limitValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default UsageIndicator;
