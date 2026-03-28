"use client";

import { ContactYearlyEntry } from "@/src/redux/api/dashboardApi";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { ArrowUpRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ContactYearlyChartProps {
  data: ContactYearlyEntry[];
  isLoading: boolean;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ContactYearlyChart = ({ data, isLoading }: ContactYearlyChartProps) => {
  const router = useRouter();
  const categories = data.map((d) => {
    const [year, month] = d._id.split("-");
    return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
  });

  // Use bar chart when only 1 data point (area needs 2+ points to render)
  const useBar = data.length <= 1;

  const series = [
    { name: "Lead", data: data.map((d) => d.lead) },
    { name: "Active", data: data.map((d) => d.active) },
    { name: "Customer", data: data.map((d) => d.customer) },
    { name: "Prospect", data: data.map((d) => d.prospect) },
    { name: "Inactive", data: data.map((d) => d.inactive) },
  ];

  const commonOptions: ApexOptions = {
    chart: {
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: "inherit",
      dropShadow: { enabled: !useBar, top: 4, left: 0, blur: 6, color: "#16a34a", opacity: 0.15 },
    },
    colors: ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#94a3b8"],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { style: { colors: "#94a3b8", fontSize: "11px", fontWeight: "500" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8", fontSize: "11px" }, formatter: (v) => String(Math.round(v)) },
      min: 0,
    },
    grid: { borderColor: "rgba(148,163,184,0.12)", strokeDashArray: 4, xaxis: { lines: { show: false } } },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px", fontWeight: "600", labels: { colors: "#94a3b8" }, markers: { size: 6 } },
    tooltip: { theme: "dark", shared: true, intersect: false },
  };

  const areaOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: "area" },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02, stops: [0, 95, 100] } },
    stroke: { curve: "smooth", width: 2.5 },
    markers: { size: data.length === 1 ? 6 : 0, strokeWidth: 2, hover: { size: 7 } },
  };

  const barOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: "bar" },
    plotOptions: { bar: { columnWidth: "40%", borderRadius: 5, borderRadiusApplication: "end" } },
    stroke: { show: false },
  };

  const options = useBar ? barOptions : areaOptions;
  const type = useBar ? "bar" : "area";

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Users size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white">Contact Growth</h3>
            <p className="text-[11px] text-slate-400 font-medium">Yearly overview by status</p>
          </div>
        </div>
        <div onClick={() => router.push("/contacts")} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
          <ArrowUpRight size={17} className="text-primary/60" />
        </div>
      </div>
      {isLoading ? <div className="h-70 w-full bg-slate-100 dark:bg-(--card-color) rounded-lg animate-pulse" /> : data.length === 0 ? <div className="h-70 flex items-center justify-center text-slate-400 text-sm font-medium">No data available yet</div> : <ReactApexChart options={options} series={series} type={type} height={280} />}
    </div>
  );
};

export default ContactYearlyChart;
