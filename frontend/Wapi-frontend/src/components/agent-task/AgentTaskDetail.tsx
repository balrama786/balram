/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useDeleteAgentTaskMutation, useGetAgentTaskByIdQuery, useUpdateAgentTaskStatusMutation } from "@/src/redux/api/agentTaskApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { TaskStatus } from "@/src/types/agentTask";
import { formatDate } from "@/src/utils";
import { Calendar, Check, Edit3, Flag, Loader2, Trash2, User, ChevronLeft, LayoutList } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AgentTaskComments from "./AgentTaskComments";
import { useAppSelector } from "@/src/redux/hooks";

interface AgentTaskDetailProps {
  taskId: string;
  onToggleSidebar?: () => void;
}

const AgentTaskDetail = ({ taskId, onToggleSidebar }: AgentTaskDetailProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";
  const { data: taskResult, isLoading, error } = useGetAgentTaskByIdQuery(taskId, { skip: !taskId });
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAgentTaskStatusMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteAgentTaskMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ADD THIS: Handle when no task is selected
  if (!taskId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-60">
        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-slate-400" />
        </div>
        <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">NO DIALOGUE YET</p>
      </div>
    );
  }

  const task = taskResult?.data;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-60">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="font-bold text-slate-500 tracking-widest text-sm">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 text-slate-400">
        <p className="font-bold capitalize tracking-widest text-sm">Failed to load task details</p>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateStatus({ id: task._id, status: newStatus }).unwrap();
      toast.success("Task status updated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTask([task._id]).unwrap();
      toast.success("Task deleted successfully");
      setIsDeleteModalOpen(false);
      // Navigate back to the tasks list
      if (agentId) {
        router.push(`/tasks?agentId=${agentId}`);
      } else {
        router.push("/tasks");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete task");
    }
  };

  const statusOptions: { label: string; value: TaskStatus; color: string }[] = [
    { label: "Pending", value: "pending", color: "bg-slate-400" },
    { label: "In Progress", value: "in_progress", color: "bg-amber-500" },
    { label: "On Hold", value: "on_hold", color: "bg-blue-500" },
    { label: "Completed", value: "completed", color: "bg-emerald-500" },
    { label: "Cancelled", value: "cancelled", color: "bg-red-500" },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-(--card-color) overflow-hidden">
      <div className="flex items-center justify-between sm:px-8 px-4 py-2 border-b flex-wrap gap-3 border-slate-100 dark:border-(--card-border-color) bg-white/50 dark:bg-(--dark-sidebar) backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 bg-primary/10 text-primary rounded-lg [@media(min-width:992px)]:hidden hover:bg-primary/20 transition-all active:scale-95" onClick={onToggleSidebar}>
            <LayoutList size={18} />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-white capitalize line-clamp-1 leading-tight">{task.title}</h2>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-gray-500 leading-relaxed font-semibold line-clamp-1">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3  [@media(max-width:335px)]:flex-wrap">
          {!isAgent && (
            <>
              <Button variant="ghost" size="icon" className="sm:h-9 sm:w-9 h-7 w-7 border border-red-200 text-red-500 dark:bg-red-900/20 dark:border-(--card-border-color) bg-red-50 rounded-lg transition-all" onClick={() => setIsDeleteModalOpen(true)} disabled={isDeleting}>
                <Trash2 size={19} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="sm:h-9 sm:w-9 h-7 w-7 border border-primary/30 text-primary bg-primary/5 rounded-lg transition-all"
                onClick={() => {
                  const agentId = typeof task.agent_id === "string" ? task.agent_id : task.agent_id?._id;
                  if (agentId) {
                    router.push(`/tasks/edit/${task._id}?agentId=${agentId}`);
                  } else {
                    toast.error("Agent ID missing, cannot edit task");
                  }
                }}
              >
                <Edit3 size={19} />
              </Button>
            </>
          )}
          <Button className="bg-primary text-white gap-2.5 h-10 px-6 font-bold rounded-lg shadow-lg shadow-emerald-500/10 transition-all [@media(max-width:335px)]:ml-auto rtl:[@media(max-width:375px)]:mr-auto rtl:[@media(max-width:375px)]:ml-0 active:scale-95" disabled={task.status === "completed" || isUpdatingStatus} onClick={() => handleStatusChange("completed")}>
            <Check size={18} />
            Mark Complete
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto custom-scrollbar">
        <div className="p-5 max-w-5xl space-y-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center sm:gap-6 gap-3 justify-between">
              <div className="space-y-2.5 min-w-35">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 block ml-1">Current Status</label>
                <Select value={task.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                  <SelectTrigger className="w-full bg-slate-50 border-none h-11 px-4 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg dark:bg-(--page-body-bg) dark:border-(--card-border-color) border-slate-100 shadow-xl p-1">
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="rounded-lg dark:hover:bg-(--card-color) font-medium text-xs py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${opt.color}`} />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Assignee</label>
                <div className="flex items-center gap-3 bg-(--input-color) px-4 py-2 rounded-lg h-11 border border-transparent transition-all dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover) dark:hover:border-(--card-border-color) hover:border-slate-100 cursor-default">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/10 font-black text-xs">{task.agent_id?.name?.charAt(0) || "U"}</div>
                  <span className="font-normal text-sm text-slate-700 dark:text-gray-400">{task.agent_id?.name || "Unassigned"}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Due Date</label>
                <div className="flex items-center gap-3 bg-(--input-color) px-4 py-2 rounded-lg dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover) h-11 transition-all hover:border-slate-100 cursor-default">
                  <Calendar size={18} className="text-slate-400" />
                  <span className="font-normal text-sm text-slate-700 dark:text-gray-500">{task.due_date ? formatDate(task.due_date) : "No deadline"}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Priority</label>
                <div className="flex items-center gap-3 bg-(--input-color) px-4 py-2 rounded-lg dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover) h-11 transition-all hover:border-slate-100 cursor-default border-transparent">
                  <Flag size={18} className={`${task.task_priority === "high" ? "text-red-500 fill-red-500" : task.task_priority === "medium" ? "text-amber-500 fill-amber-500" : "text-slate-400 fill-slate-400"}`} />
                  <span className={`font-normal text-xs tracking-widest ${task.task_priority === "high" ? "text-red-600" : task.task_priority === "medium" ? "text-amber-600" : "text-slate-500"}`}>{task.task_priority}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto dark:border-(--card-border-color) dark:bg-neutral-900/30">
        <AgentTaskComments taskId={task._id} comments={task.agent_comments || []} />
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} title="Delete Task" subtitle="Are you sure you want to delete this task? This action cannot be undone." />
    </div>
  );
};

export default AgentTaskDetail;
