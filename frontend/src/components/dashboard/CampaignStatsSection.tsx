"use client";

import { CampaignStatistics } from "@/src/redux/api/dashboardApi";
import { Megaphone, Send, CheckCircle2, Eye, ArrowUpRight } from "lucide-react";
import DashboardStatCard from "./DashboardStatCard";
import { useRouter } from "next/navigation";

interface CampaignStatsSectionProps {
  data: CampaignStatistics;
  isLoading: boolean;
  filters: string;
}

const CampaignStatsSection = ({ data, isLoading, filters }: CampaignStatsSectionProps) => {
  const router = useRouter();
  // Mock trend and chart data since it's not in the current API response
  const getMockData = (key: string) => {
    const trends = {
      totalCampaignsCreated: { value: 12, isUp: true, data: [10, 15, 8, 20, 15, 25, 22, 30] },
      totalSent: { value: 8, isUp: true, data: [20, 25, 30, 25, 35, 40, 38, 45] },
      messagesDelivered: { value: 5, isUp: false, data: [45, 40, 35, 30, 25, 20, 15, 10] },
      messagesRead: { value: 15, isUp: true, data: [5, 10, 15, 12, 18, 25, 22, 30] },
    };
    return trends[key as keyof typeof trends] || { value: 0, isUp: true, data: [10, 10, 10, 10] };
  };

  const STATS_CONFIG = [
    { label: "Total Campaigns", key: "totalCampaignsCreated" as const, icon: <Megaphone size={14} />, color: "text-orange-500" },
    { label: "Messages Sent", key: "totalSent" as const, icon: <Send size={14} />, color: "text-primary" },
    { label: "Delivered", key: "messagesDelivered" as const, icon: <CheckCircle2 size={14} />, color: "text-emerald-500" },
    { label: "Read", key: "messagesRead" as const, icon: <Eye size={14} />, color: "text-violet-500" },
  ];

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/10 rounded-xl">
            <Megaphone size={18} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">Campaign Statistics</h3>
            <p className="text-xs text-slate-400 font-bold">Performance overview</p>
          </div>
        </div>
        <div onClick={() => router.push("/campaigns")} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
          <ArrowUpRight size={17} className="text-primary/60" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STATS_CONFIG.map((stat) => {
          const mock = getMockData(stat.key);
          return <DashboardStatCard key={stat.key} label={stat.label} value={data?.[stat.key] || 0} icon={stat.icon} color={stat.color} isLoading={isLoading} chartData={mock.data} trend={{ value: mock.value, isUp: mock.isUp }} filters={filters} />;
        })}
      </div>
    </div>
  );
};

export default CampaignStatsSection;
