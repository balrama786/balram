"use client";

import { Button } from "@/src/elements/ui/button";
import { useGetAdminDashboardQuery } from "@/src/redux/api/adminDashboardApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setPageTitle } from "@/src/redux/reducers/settingsSlice";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlanRevenueChart, RevenueTimelineChart } from "./AdminCharts";
import AdminStatCards from "./AdminStatCards";
import { InquiriesTable, NewUsersTable, SubscriptionsTable } from "./AdminTables";
import { DashboardDateFilter } from "./DashboardDateFilter";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<{ dateRange: string; startDate?: string; endDate?: string }>({
    dateRange: "this_month",
  });
  const { data: response, isLoading, isFetching, refetch } = useGetAdminDashboardQuery(filters);

  useEffect(() => {
    dispatch(setPageTitle("Dashboard"));

    return () => {
      dispatch(setPageTitle(""));
    };
  }, [dispatch]);

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
      toast.success("Dashboard synchronized with central intelligence");
    } catch {
      toast.error("Network sync failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-page-body-bg min-h-screen">
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-48" />
        </div>
        <div className="grid grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-10 gap-8">
          <div className="col-span-6 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="col-span-4 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!response?.data) return null;

  const { counts, charts, tables } = response.data;

  return (
    <div className="min-h-screen bg-page-body-bg relative overflow-hidden selection:bg-primary/20">
      <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-emerald-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-purple-500/2 rounded-full blur-[180px] -z-10 pointer-events-none" />

      <div className="space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <h4 className="text-2xl font-semibold text-primary tracking-tight">Performance & Analytics</h4>
          <div className="flex flex-col md:flex-row  justify-end gap-4 mb-0">
            <div className="flex flex-wrap items-center gap-4 p-1 self-start md:self-auto">
              <DashboardDateFilter onFilterChange={setFilters} />
              <Button variant="outline" onClick={handleRefresh} disabled={isFetching} className="h-11 px-5 gap-3 bg-white/50 dark:bg-page-body border-(--input-border-color) dark:border-none hover:border-primary/50 rounded-lg font-semibold text-sm transition-all dark:hover:bg-(--table-hover) duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/10 group overflow-hidden relative">
                <span className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <RefreshCw size={14} className={`${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} text-primary`} />
                <span className="hidden sm:inline">Intelligence Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        <AdminStatCards counts={counts} />

        <div className="grid grid-cols-2 xl:grid-cols-12 [@media(max-width:768px)]:grid-cols-1 gap-10">
          <div className="xl:col-span-7">
            <NewUsersTable data={tables.newUsers} />
          </div>

          <div className="xl:col-span-5">
            <PlanRevenueChart planRevenue={charts.planRevenueBreakdown} />
          </div>
        </div>

        <div className="w-full">
          <RevenueTimelineChart revenueGraph={charts.revenueGraph} />
        </div>

        <div className="w-full">
          <SubscriptionsTable data={tables.newSubscriptions} title="New Subscriptions" type="active" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <SubscriptionsTable data={tables.newSubscriptions.filter((s) => s.status === "cancelled")} title="Cancelled Subscriptions" type="cancelled" />

          <InquiriesTable data={tables.recentInquiries} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
