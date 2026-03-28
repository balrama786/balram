
import { cn } from "@/src/utils";
import { LucideIcon } from "lucide-react";

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
}

export const DetailRow = ({ label, value, icon: Icon }: DetailRowProps) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-100 [@media(max-width:480px)]:flex-col dark:border-(--card-border-color) last:border-0 last:pb-0">
    <div className="flex items-center gap-2 text-slate-500">
      <div className="p-1.5 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg">
        <Icon size={14} className="text-slate-600 dark:text-gray-500" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wide dark:text-gray-500 text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{value || "N/A"}</span>
  </div>
);

interface StatBoxProps {
  label: string;
  count: number;
  color: "blue" | "emerald" | "purple" | "red" | "orange";
}

export const StatBox = ({ label, count, color }: StatBoxProps) => {
  const colors = {
    blue: "bg-blue-50/50 text-blue-600 border-blue-100 dark:bg-(--page-body-bg) dark:text-blue-400 dark:border-none",
    emerald: "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-(--page-body-bg) dark:text-emerald-400 dark:border-none",
    purple: "bg-purple-50/50 text-purple-600 border-purple-100 dark:bg-(--page-body-bg) dark:text-purple-400 dark:border-none",
    red: "bg-red-50/50 text-red-600 border-red-100 dark:bg-(--page-body-bg) dark:text-red-400 dark:border-none",
    orange: "bg-orange-50/50 text-orange-600 border-orange-100 dark:bg-(--page-body-bg) dark:text-orange-400 dark:border-none",
  };

  return (
    <div className={cn("p-4 rounded-lg border flex flex-col items-center justify-center text-center transition-all hover:shadow-md", colors[color])}>
      <span className="text-2xl font-black tracking-tight">{count}</span>
      <span className="text-[10px] uppercase font-bold opacity-80 mt-1">{label}</span>
    </div>
  );
};
