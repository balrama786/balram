"use client";

import React from "react";
import { Megaphone, Send, CheckCircle2, Eye, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import { cn } from "@/src/lib/utils";

interface CampaignStatsProps {
  stats: {
    totalCampaignsCreated: number;
    totalSent: number;
    messagesDelivered: number;
    messagesRead: number;
  };
  isLoading: boolean;
}

const CampaignStats = ({ stats }: CampaignStatsProps) => {
  const statItems = [
    {
      label: "Total Campaigns",
      value: stats?.totalCampaignsCreated || 0,
      icon: <Megaphone size={20} />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "Total campaigns launched",
    },
    {
      label: "Total Sent",
      value: stats?.totalSent || 0,
      icon: <Send size={20} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Messages dispatched",
    },
    {
      label: "Delivered",
      value: stats?.messagesDelivered || 0,
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Successfully delivered",
    },
    {
      label: "Total Read",
      value: stats?.messagesRead || 0,
      icon: <Eye size={20} />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Messages viewed by users",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="group relative bg-white dark:bg-(--card-color) rounded-xl border border-slate-100 dark:border-(--card-border-color) p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 100}ms` }}>
          <div className={cn("absolute -right-1 -bottom-1 opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-500 rotate-12 group-hover:rotate-0 scale-170", item.color)}>{item.icon}</div>

          <div className="relative z-10 flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between">
              <div className={cn("p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110", item.bg, item.color)}>{item.icon}</div>
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <TrendingUp size={12} className={item.color} />
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", item.color)}>Live</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{item.label}</span>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">{item.description}</span>
              </div>
              <h3 className={`text-4xl font-medium ${item.color} opacity-90 dark:text-white tracking-tight`}>
                <CountUp end={item.value} duration={1.5} separator="," />
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignStats;
