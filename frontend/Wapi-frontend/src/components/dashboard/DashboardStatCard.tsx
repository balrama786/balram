"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";
import CountUp from "react-countup";
import { presets } from "./DashboardDateFilter";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isLoading: boolean;
  chartData: number[];
  trend: { value: number; isUp: boolean };
  prefix?: string;
  decimals?: number;
  className?: string;
  filters?: string;
}

const DashboardStatCard = ({ label, value, icon, color, isLoading, chartData, prefix = "", decimals = 0, className = "", filters }: DashboardStatCardProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: true },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    tooltip: { enabled: false },
    colors: [color.includes("primary") ? "#16a34a" : color.includes("orange") ? "#f97316" : color.includes("emerald") ? "#10b981" : color.includes("violet") ? "#8b5cf6" : color.includes("amber") ? "#f59e0b" : "#16a34a"],
  };

  return (
    <div className={`flex-1 h-full bg-white dark:bg-(--dark-body) rounded-lg overflow-hidden border-2 border-slate-100 dark:border-none p-5 transition-all hover:shadow-md group ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) group-hover:bg-white dark:group-hover:bg-(--table-hover) transition-colors ${color}`}>{icon}</div>
          <span className="text-[14px] font-medium text-slate-500 dark:text-slate-400 tracking-tight line-clamp-1">{label}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 mt-auto [@media(max-width:1500px)]:flex-wrap">
        <div className="flex-1">
          {isLoading ? (
            <div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mb-1" />
          ) : (
            <h4 className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-2">
              {prefix}
              <CountUp end={value} duration={1.5} separator="," decimals={decimals} />
            </h4>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium">This {presets.find((item) => item.value === filters)?.label}</span>
          </div>
        </div>

        <div className="w-24 flex items-end [@media(max-width:1500px)]:w-full">
          {!isLoading && (
            <div className="w-full h-full">
              <ReactApexChart options={chartOptions} series={[{ name: label, data: chartData }]} type="area" height={100} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
