"use client";

import { TemplateInsights } from "@/src/redux/api/dashboardApi";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { LayoutTemplate, CheckCircle2, XCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import { Badge } from "@/src/elements/ui/badge";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";

interface TemplateInsightsSectionProps {
  data: TemplateInsights;
  isLoading: boolean;
}

const columns: Column<{ _id: string; template_name: string; sent: string; delivered: string; read: string; status: string; usageCount: number }>[] = [
  {
    header: "Template Identifier",
    accessorKey: "template_name",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <span className="font-bold text-slate-700 dark:text-slate-200 text-xs font-mono">{row.template_name}</span>
      </div>
    ),
  },
  {
    header: "Sent",
    accessorKey: "sent",
    cell: (row) => <Badge className={`text-[12px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full bg-transparent text-primary`}>{row.sent}</Badge>,
  },
  {
    header: "Delivered",
    accessorKey: "delivered",
    cell: (row) => <Badge className={`text-[12px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full bg-transparent text-amber-500`}>{row.delivered}</Badge>,
  },
  {
    header: "Read",
    accessorKey: "read",
    cell: (row) => <Badge className={`text-[12px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full bg-transparent text-blue-500`}>{row.read}</Badge>,
  },
  {
    header: "WABA Status",
    accessorKey: "status",
    cell: (row) => <Badge className={`text-[10px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full ${row.status === "approved" ? "bg-emerald-500/10 text-primary dark:text-emerald-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}>{row.status}</Badge>,
  },
  {
    header: "Usage",
    accessorKey: "usageCount",
    cell: (row) => (
      <div className="flex items-center gap-1.5">
        <TrendingUp size={12} className="text-primary/60" />
        <span className="font-black text-primary text-sm">{row.usageCount}</span>
      </div>
    ),
  },
];

const TemplateInsightsSection = ({ data, isLoading }: TemplateInsightsSectionProps) => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate size={22} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Template Insights</h3>
            <p className="text-sm text-slate-400 font-bold">Health & utilization metrics</p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg px-4 py-2 border border-emerald-500/10 transition-transform hover:scale-[1.02] cursor-default">
              <div className="flex items-center gap-2 text-primary dark:text-primary">
                <CheckCircle2 size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Approved</span>
              </div>
              {isLoading ? (
                <div className="h-6 w-8 bg-emerald-100 dark:bg-(--card-color) rounded animate-pulse" />
              ) : (
                <p className="text-[11px] font-black text-primary dark:text-primary leading-none">
                  <CountUp end={data?.totalTemplatesApproved || 0} duration={1.5} />
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 dark:bg-red-500/10 rounded-lg px-4 py-2 border border-red-500/10 transition-transform hover:scale-[1.02] cursor-default">
              <div className="flex items-center gap-2 text-red-500 dark:text-red-500">
                <XCircle size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">Rejected</span>
              </div>
              {isLoading ? (
                <div className="h-6 w-8 bg-red-100 dark:bg-(--card-color) rounded-lg animate-pulse" />
              ) : (
                <p className="text-[11px] font-black text-red-500 dark:text-red-500 leading-none">
                  <CountUp end={data?.rejectedTemplates || 0} duration={1.5} />
                </p>
              )}
            </div>
          </div>
          <div onClick={() => router.push("/templates")} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
            <ArrowUpRight size={17} className="text-primary/60" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-50/50 dark:bg-(--card-color) rounded-lg p-1 overflow-hidden">
        <DataTable data={data?.mostUsedTemplates || []} columns={columns} isLoading={isLoading} emptyMessage="No template usage detected yet" className="border-none shadow-none rounded-none bg-transparent" getRowId={(row) => row._id} />
      </div>
    </div>
  );
};

export default TemplateInsightsSection;
