"use client";

import { cn } from "@/src/lib/utils";
import { UsageStatsGridProps } from "@/src/types/subscription";
import React from "react";
import { USAGE_MAPPING } from "../../constants/usageMap";

const UsageStatsGrid: React.FC<Omit<UsageStatsGridProps, "usageMapping">> = ({ currentUsage, activePlanFeatures }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 [@media(min-width:525px)_and_(max-width:639px)]:grid-cols-2">
      {Object.entries(USAGE_MAPPING).map(([key, config]) => {
        const used = currentUsage[key] || 0;
        const limit = activePlanFeatures[config.featureKey];
        const isUnlimited = typeof limit === "boolean" && limit === true;
        const limitValue = isUnlimited ? "∞" : typeof limit === "number" ? limit : 0;
        const percentage = isUnlimited ? 0 : Number(limitValue) > 0 ? (used / (limitValue as number)) * 100 : 0;

        if (limit === false) return null;

        const Icon = config.icon;

        return (
          <div key={key} className="p-4 rounded-lg bg-white dark:bg-(--card-color) border border-slate-100 dark:border-none flex flex-col justify-between transition-colors hover:bg-slate-50 dark:hover:bg-(--table-hover)">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-(--dark-body) text-slate-500 dark:text-gray-500 border border-slate-100 dark:border-none">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">{config.label}</span>
              </div>
            </div>
            {isUnlimited && <span className="text-[10px] font-bold text-primary tracking-tight">Unlimited</span>}
            <div className="flex items-baseline justify-between gap-2 mt-auto">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{used.toLocaleString()}</h4>
              <span className="text-xs font-medium text-slate-400">of {limitValue.toLocaleString()}</span>
            </div>

            {!isUnlimited && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-(--dark-body) rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-700 ease-out rounded-full", percentage > 90 ? "bg-rose-500" : percentage > 70 ? "bg-amber-500" : "bg-primary dark:bg-primary")} style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UsageStatsGrid;
