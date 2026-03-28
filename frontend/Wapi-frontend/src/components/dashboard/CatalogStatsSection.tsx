"use client";

import { CatalogData } from "@/src/redux/api/dashboardApi";
import { ShoppingBag, ShoppingCart, DollarSign, Package, ArrowUpRight } from "lucide-react";
import DashboardStatCard from "./DashboardStatCard";
import { useRouter } from "next/navigation";

interface CatalogStatsSectionProps {
  data: CatalogData;
  isLoading: boolean;
  filters: string;
}

const CatalogStatsSection = ({ data, isLoading, filters }: CatalogStatsSectionProps) => {
  const router = useRouter();
  // Mock trend and chart data since it's not in the current API response
  const getMockData = (key: string) => {
    const trends = {
      ordersFromWhatsApp: { value: 5, isUp: true, data: [2, 5, 3, 8, 6, 10, 8, 12] },
      revenueFromWhatsApp: { value: 18, isUp: true, data: [100, 200, 150, 300, 250, 400, 350, 500] },
      totalProducts: { value: 2, isUp: true, data: [45, 46, 46, 47, 47, 48, 48, 49] },
    };
    return trends[key as keyof typeof trends] || { value: 0, isUp: true, data: [10, 10, 10, 10] };
  };

  const STATS_CONFIG = [
    { label: "Orders Received", key: "ordersFromWhatsApp" as const, icon: <ShoppingCart size={14} />, color: "text-amber-500", prefix: "", decimals: 0 },
    { label: "Revenue Generated", key: "revenueFromWhatsApp" as const, icon: <DollarSign size={14} />, color: "text-emerald-500", prefix: "$", decimals: 2 },
    { label: "Live Inventory", key: "totalProducts" as const, icon: <Package size={14} />, color: "text-primary", prefix: "", decimals: 0 },
  ];

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl">
              <ShoppingBag size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">Catalog Performance</h3>
              <p className="text-xs text-slate-400 font-bold">WABA Commerce metrics</p>
            </div>
          </div>
        </div>
        <div onClick={() => router.push("/orders")} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
          <ArrowUpRight size={17} className="text-primary/60" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STATS_CONFIG.map((stat, index) => {
          const mock = getMockData(stat.key);
          // Third item (index 2) should be full width
          const isFullWidth = index === 2;

          return <DashboardStatCard key={stat.key} label={stat.label} value={data?.[stat.key] || 0} icon={stat.icon} color={stat.color} isLoading={isLoading} chartData={mock.data} trend={{ value: mock.value, isUp: mock.isUp }} prefix={stat.prefix} decimals={stat.decimals} className={isFullWidth ? "sm:col-span-2" : ""} filters={filters} />;
        })}
      </div>
    </div>
  );
};

export default CatalogStatsSection;
