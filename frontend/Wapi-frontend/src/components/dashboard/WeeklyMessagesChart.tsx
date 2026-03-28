"use client";

import { WeeklyMessageEntry } from "@/src/redux/api/dashboardApi";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MessageSquare, Zap } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface WeeklyMessagesChartProps {
  data: WeeklyMessageEntry[];
  isLoading: boolean;
}

const WeeklyMessagesChart = ({ data, isLoading }: WeeklyMessagesChartProps) => {
  const categories = data.map((d) => {
    const date = new Date(d._id);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const series = [
    { name: "Incoming", type: "area" as const, data: data.map((d) => d.incoming) },
    { name: "Outgoing", type: "bar" as const, data: data.map((d) => d.outgoing) },
    { name: "Activity Index", type: "line" as const, data: data.map((d) => d.total) },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 320,
      stacked: false,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      dropShadow: { enabled: true, top: 10, left: 0, blur: 15, color: "#16a34a", opacity: 0.1 },
    },
    colors: ["#16a34a", "rgba(22,163,74,0.15)", "#f59e0b"],
    fill: {
      type: ["gradient", "solid", "gradient"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    stroke: { width: [3, 0, 4], curve: "smooth", dashArray: [0, 0, 0] },
    plotOptions: {
      bar: { columnWidth: "35%", borderRadius: 6, borderRadiusApplication: "end" },
    },
    dataLabels: { enabled: false },
    markers: {
      size: [0, 0, 6],
      strokeColors: "#fff",
      strokeWidth: 3,
      strokeOpacity: 1,
      hover: { size: 8 }
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 }, formatter: (v) => String(Math.round(v)) },
      min: 0,
    },
    grid: { borderColor: "rgba(148,163,184,0.08)", strokeDashArray: 5 },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontWeight: 700,
      labels: { colors: "#64748b" },
      markers: { size: 8 },
      itemMargin: { horizontal: 10 }
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: { formatter: (v) => `${v} messages` }
    },
  };

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-8 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3 sm:gap-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <MessageSquare size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Conversation Flow</h3>
            <p className="text-sm text-slate-400 font-bold">Analysis of incoming & outgoing traffic</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
          <Zap size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live Tracking</span>
        </div>
      </div>

      <div className="relative min-h-80">
        {isLoading ? (
          <div className="absolute inset-0 bg-slate-50 dark:bg-(--card-color)! rounded-2xl animate-pulse" />
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-bold bg-slate-50 dark:bg-(--card-color)! rounded-lg border border-dashed dark:border-(--card-border-color) border-slate-100">
            Waiting for communication data...
          </div>
        ) : (
          <ReactApexChart options={options} series={series} type="line" height={320} />
        )}
      </div>
    </div>
  );
};

export default WeeklyMessagesChart;
