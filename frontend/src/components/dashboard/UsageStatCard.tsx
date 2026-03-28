"use client";

import { useRouter } from "next/navigation";
import React from "react";
import CountUp from "react-countup";

interface UsageStatCardProps {
  label: string;
  current: number;
  limit: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  path: string;
  isLoading?: boolean;
  showUsage?: boolean;
}

const UsageStatCard = ({ label, current, limit, icon, color, path, isLoading = false, showUsage = true }: UsageStatCardProps) => {
  const router = useRouter();
  const percentage = limit > 0 ? Math.min(Math.round((current / limit) * 100), 100) : 0;
  const bgColor = color.replace("text-", "bg-");

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-(--card-color) rounded-xl p-5 border border-slate-100 dark:border-(--card-border-color) animate-pulse shadow-sm min-h-36.25 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="space-y-3">
          <div className="w-16 h-8 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => router.push(path)} className="group cursor-pointer bg-white dark:bg-(--card-color) rounded-lg sm:p-6 p-4 border border-slate-100 dark:border-(--card-border-color) shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-40">
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-10 transition-all duration-500 group-hover:opacity-20 ${bgColor}`} />
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-500 rotate-12 group-hover:rotate-0 scale-[2.5] ${color}`}>{icon}</div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${bgColor}/10 ${color} transition-transform group-hover:scale-110 duration-300`}>{icon}</div>
          <p className="text-[14px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors truncate">{label}</p>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              <CountUp end={current} duration={1.5} separator="," />
            </h3>
            {showUsage && limit > 0 && <span className="text-sm font-medium text-slate-400 dark:text-slate-500">/ {limit.toLocaleString()}</span>}
          </div>
          {!showUsage && <span className={`text-[9px] font-bold ${color} dark:text-slate-600 tracking-widest`}>Real-time</span>}

          {showUsage && (
            <div className="space-y-3 mt-2">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                <div className={`h-full ${bgColor} transition-all duration-1000 ease-out shadow-[0_0_8px] shadow-current`} style={{ width: `${percentage}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[10px] font-bold ${color} uppercase tracking-wider`}>{percentage}% utilized</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageStatCard;
