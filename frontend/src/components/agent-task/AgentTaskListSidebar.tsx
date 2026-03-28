"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetAgentTasksQuery } from "@/src/redux/api/agentTaskApi";
import { TaskPriority } from "@/src/types/agentTask";
import { formatDate } from "@/src/utils";
import { Plus, Search, ChevronLeft, MessageSquare, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Fragment } from "react";
import { useAppSelector } from "@/src/redux/hooks";

interface AgentTaskListSidebarProps {
  agentId: string;
  onSelectTask?: () => void;
  onClose?: () => void;
}

const AgentTaskListSidebar = ({ agentId, onSelectTask, onClose }: AgentTaskListSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";
  const currentTaskId = searchParams.get("taskId");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: tasksResult, isLoading } = useGetAgentTasksQuery({
    agent_id: agentId,
    search: debouncedSearch,
  });

  const allTasks = tasksResult?.data?.tasks || [];

  const tasks = allTasks.filter((task) => {
    if (filter === "all") return true;
    return task.task_priority === filter;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20 text-[10px] lowercase font-medium";
      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20 lowercase text-[10px] font-medium";
      case "low":
        return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-neutral-800 dark:text-gray-500 dark:border-neutral-700 text-[10px] font-medium lowercase";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-(--card-color) overflow-x-hidden">
      {/* Sidebar Header */}
      <div className="p-5 space-y-4 border-b border-slate-100 dark:border-(--card-border-color)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => router.push(isAgent ? "/chat" : "/agents")}>
              <ChevronLeft size={18} />
            </Button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tasks</h2>
          </div>
          <div className="flex items-center gap-2">
            {!isAgent && (
              <Button size="icon" className="h-9 w-9 rounded-lg border border-primary/80 bg-primary/20 hover:bg-primary hover:text-white text-primary shadow-sm" onClick={() => router.push(`/agents/task/${agentId}/create`)}>
                <Plus size={20} />
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg [@media(min-width:992px)]:hidden" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" size={16} />
          <Input placeholder="Search tasks..." className="pl-9 h-11 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) rounded-lg focus:ring-primary/10 transition-all font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <Badge variant={filter === "all" ? "default" : "outline"} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "all" ? "bg-primary dark:hover:bg-(--table-hover) dark:text-gray-400 dark:bg-(--page-body-bg)" : "text-slate-500 dark:text-gray-400 dark:border-none dark:bg-(--dark-body) border-slate-200"}`} onClick={() => setFilter("all")}>
            All
          </Badge>
          <Badge variant={filter === "low" ? "default" : "outline"} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "low" ? "bg-primary dark:hover:bg-(--table-hover) dark:text-gray-400 dark:bg-(--page-body-bg)" : "text-slate-500 dark:text-gray-400 dark:border-none dark:bg-(--dark-body) border-slate-200"}`} onClick={() => setFilter("low")}>
            Low
          </Badge>
          <Badge variant={filter === "medium" ? "default" : "outline"} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "medium" ? "bg-primary dark:hover:bg-(--table-hover) dark:text-gray-400 dark:bg-(--page-body-bg)" : "text-slate-500 dark:text-gray-400 dark:border-none dark:bg-(--dark-body) border-slate-200"}`} onClick={() => setFilter("medium")}>
            Medium
          </Badge>
          <Badge variant={filter === "high" ? "default" : "outline"} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "high" ? "bg-primary dark:hover:bg-(--table-hover) dark:text-gray-400 dark:bg-(--page-body-bg)" : "text-slate-500 dark:text-gray-400 dark:border-none dark:bg-(--dark-body) border-slate-200"}`} onClick={() => setFilter("high")}>
            High
          </Badge>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No tasks found</p>
          </div>
        ) : (
          tasks.map((task) => (
            <Fragment key={task._id}>
              <div
                className={`p-4 my-0 transition-all cursor-pointer group relative overflow-hidden ${currentTaskId === task._id ? "bg-(--light-primary) dark:bg-(--dark-sidebar) shadow-lg shadow-primary/5 translate-x-1" : "border-transparent hover:bg-(--light-primary) dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) dark:hover:border-(--card-border-color) hover:border-primary"}`}
                onClick={() => {
                  router.push(`/tasks?taskId=${task._id}${!isAgent ? `&agentId=${agentId}` : ""}`);
                  onSelectTask?.();
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold truncate text-slate-700 dark:text-slate-200 text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{task.title}</h3>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span className="lowercase">{formatDate(task.created_at)}</span>
                    <Badge className={`uppercase text-[9px] px-2 py-0.5 rounded-lg border font-black shrink-0 w-fit mt-1 ${getPriorityColor(task.task_priority)}`}>{task.task_priority}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg [@media(min-width:992px)]:hidden bg-primary/5 text-primary hover:bg-primary/10">
                    <MessageSquare size={16} />
                  </Button>
                </div>
              </div>
              <hr className="m-0" />
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentTaskListSidebar;
