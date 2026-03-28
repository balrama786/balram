"use client";

import { cn } from "@/src/lib/utils";
import { ChevronRight, MessageSquare, Rocket, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const QuickActionsCard = () => {
  const router = useRouter();

  const actions = [
    {
      title: "Campaigns",
      icon: <Rocket size={18} className="text-blue-500" />,
      path: "/campaigns",
      color: "blue",
      description: "Send broadcast messages",
    },
    {
      title: "Tools",
      icon: <Users size={18} className="text-emerald-500" />,
      path: "/contacts",
      color: "emerald",
      description: "Manage chat bot & message link",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-lg bg-white dark:bg-(--card-color) p-5 border border-slate-100 dark:border-(--card-border-color) shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={14} className="text-primary" />
          Quick Actions
        </h3>
      </div>

      <div className="gap-3 flex flex-col sm:flex-row items-center justify-between [@media(max-width:1461px)]:flex-col [@media(max-width:1461px)]:flex-none! flex-1">
        {actions.map((action, i) => (
          <button key={i} onClick={() => router.push(action.path)} className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-none hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", action.color === "blue" && "bg-blue-50 dark:bg-blue-500/10", action.color === "emerald" && "bg-emerald-50 dark:bg-emerald-500/10", action.color === "amber" && "bg-amber-50 dark:bg-amber-500/10")}>{action.icon}</div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700 dark:text-white">{action.title}</p>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{action.description}</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
