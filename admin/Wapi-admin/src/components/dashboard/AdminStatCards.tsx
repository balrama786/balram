"use client";

import { Card, CardContent } from "@/src/elements/ui/card";
import {
  Users,
  CreditCard,
  Layout,
  DollarSign,
  Cpu,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import CountUp from "react-countup";

interface AdminStatCardsProps {
  counts: {
    totalUsers: number;
    activeSubscriptions: number;
    totalPlans: number;
    revenue: {
      today: number;
      month: number;
      total: number;
    };
    activeAIModels: number;
    totalContactInquiries: number;
  };
}

const AdminStatCards = ({ counts }: AdminStatCardsProps) => {
  const stats = [
    {
      label: "Total Users",
      value: counts.totalUsers,
      icon: Users,
      color: "text-blue-500",
      iconBg: "bg-blue-500/10",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
      description: "Registered platform users",
      trend: "+12%",
    },
    {
      label: "Subscriptions",
      value: counts.activeSubscriptions,
      icon: CreditCard,
      color: "text-indigo-500",
      iconBg: "bg-indigo-500/10",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
      description: "Active paying tenants",
      trend: "+5%",
    },
    {
      label: "Active Plans",
      value: counts.totalPlans,
      icon: Layout,
      color: "text-purple-500",
      iconBg: "bg-purple-500/10",
      trendIcon: Minus,
      trendColor: "text-slate-400 bg-slate-400/10",
      description: "Available tier options",
      trend: "Stable",
    },
    {
      label: "Monthly Revenue",
      value: counts.revenue.month,
      prefix: "₹",
      icon: DollarSign,
      color: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
      description: "Earnings this month",
      trend: "₹" + counts.revenue.today + " today",
    },
    {
      label: "AI Configs",
      value: counts.activeAIModels,
      icon: Cpu,
      color: "text-orange-500",
      iconBg: "bg-orange-500/10",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500 bg-emerald-500/10",
      description: "Neural configurations",
      trend: "Online",
    },
    {
      label: "Inquiries",
      value: counts.totalContactInquiries,
      icon: MessageSquare,
      color: "text-pink-500",
      iconBg: "bg-pink-500/10",
      trendIcon: TrendingDown,
      trendColor: "text-amber-500 bg-amber-500/10",
      description: "Pending support",
      trend: "Action needed",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 [@media(min-width:475px)_and_(max-width:767px)]:grid-cols-2 [@media(min-width:768px)_and_(max-width:1199px)]:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`overflow-hidden border-0 border-l-[3px] bg-white dark:bg-(--card-color) shadow-sm hover:shadow-md transition-all duration-300 group rounded-xl`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              {/* Top row: icon + trend badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg ${stat.iconBg} ${stat.color} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 ${stat.trendColor}`}
                >
                  <stat.trendIcon size={9} />
                  {stat.trend}
                </span>
              </div>

              {/* Value */}
              <div>
                <div
                  className={`text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-baseline gap-0.5`}
                >
                  {stat.prefix && (
                    <span className="text-base font-bold opacity-60">
                      {stat.prefix}
                    </span>
                  )}
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </div>
              </div>

              {/* Label + description */}
              <div className="border-t border-slate-100 dark:border-white/5 pt-2.5">
                <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest leading-none mb-1">
                  {stat.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatCards;
