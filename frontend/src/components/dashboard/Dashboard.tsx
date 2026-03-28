/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetDashboardQuery } from "@/src/redux/api/dashboardApi";
import { useState } from "react";
import CampaignStatsSection from "./CampaignStatsSection";
import CatalogStatsSection from "./CatalogStatsSection";
import ContactYearlyChart from "./ContactYearlyChart";
import { DashboardDateFilter } from "./DashboardDateFilter";
import QuickActionsCard from "./QuickActionsCard";
import StatCards from "./StatCards";
import SubscriptionCard from "./SubscriptionCard";
import TemplateInsightsSection from "./TemplateInsightsSection";
import WabaStatusCard from "./WabaStatusCard";
import WeeklyMessagesChart from "./WeeklyMessagesChart";
import WelcomeCard from "./WelcomeCard";

const Dashboard = () => {
  const [filters, setFilters] = useState<{ dateRange: string; startDate?: string; endDate?: string }>({
    dateRange: "this_year",
  });
  const { data, isLoading } = useGetDashboardQuery(filters);
  const d = data?.data;

  const enhancedCounts = {
    ...d?.counts,
    totalOrders: d?.catalogData?.ordersFromWhatsApp || 0,
    totalWebhooks: (d?.counts as any)?.totalWebhooks || 0,
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 bg-(--page-body-bg) min-h-screen dark:bg-(--dark-body)">
      <div className="flex justify-between items-center flex-wrap gap-3 sm:gap-0">
        <div className="space-y-1">
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Performance & Analytics</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your business metrics in real-time</p>
        </div>
        <div className="flex justify-end items-center gap-4">
          <DashboardDateFilter onFilterChange={setFilters} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-3 h-full">
          <WelcomeCard />
          <QuickActionsCard />
        </div>
        <WabaStatusCard />
        <div className="md:col-span-2 xl:col-span-1">
          <SubscriptionCard />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-bold text-slate-800 dark:text-white tracking-wider">Resource Usage</h5>
          </div>
          <StatCards section="usage" counts={enhancedCounts as any} isLoading={isLoading} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-bold text-slate-800 dark:text-white tracking-wider">Real-time Metrics</h5>
          </div>
          <StatCards section="metrics" counts={enhancedCounts as any} isLoading={isLoading} />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-sm border border-slate-100 dark:border-(--card-border-color)">
        <ContactYearlyChart data={d?.contactYearlyChart ?? []} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
        <div className="lg:col-span-2">
          <CampaignStatsSection data={d?.campaignStatistics ?? ({} as never)} isLoading={isLoading} filters={filters.dateRange} />
        </div>
        <div className="lg:col-span-4">
          <TemplateInsightsSection data={d?.templateInsights ?? ({} as never)} isLoading={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3">
          <WeeklyMessagesChart data={d?.weeklyMessagesChart ?? []} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <CatalogStatsSection data={d?.catalogData ?? ({} as never)} isLoading={isLoading} filters={filters.dateRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
