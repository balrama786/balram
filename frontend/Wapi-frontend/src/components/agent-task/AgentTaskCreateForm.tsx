/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { useCreateAgentTaskMutation, useGetAgentTaskByIdQuery, useUpdateAgentTaskMutation } from "@/src/redux/api/agentTaskApi";
import { AgentTask, TaskPriority, TaskStatus } from "@/src/types/agentTask";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { DatePicker } from "@/src/elements/ui/date-picker";
import { format, parse } from "date-fns";

interface AgentTaskCreateFormProps {
  agentId: string;
  taskId?: string;
}

const AgentTaskCreateForm = ({ agentId, taskId }: AgentTaskCreateFormProps) => {
  const { data: taskResult, isLoading: isFetching } = useGetAgentTaskByIdQuery(taskId || "", {
    skip: !taskId,
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  return <AgentTaskFormFields key={taskId || "create"} agentId={agentId} taskId={taskId} initialData={taskResult?.data} />;
};

interface AgentTaskFormFieldsProps {
  agentId: string;
  taskId?: string;
  initialData?: AgentTask;
}

const AgentTaskFormFields = ({ agentId, taskId, initialData }: AgentTaskFormFieldsProps) => {
  const router = useRouter();
  const [createTask, { isLoading: isCreating }] = useCreateAgentTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateAgentTaskMutation();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: (initialData?.status as TaskStatus) || "pending",
    agent_id: initialData?.agent_id?._id || agentId,
    task_priority: (initialData?.task_priority as TaskPriority) || "medium",
    due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().split("T")[0] : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and Description are required");
      return;
    }

    try {
      if (taskId) {
        await updateTask({ id: taskId, data: formData }).unwrap();
        toast.success("Task updated successfully");
      } else {
        await createTask(formData).unwrap();
        toast.success("Task created successfully");
      }
      router.push(`/tasks?taskId=${taskId || ""}${agentId ? `&agentId=${agentId}` : ""}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${taskId ? "update" : "create"} task`);
    }
  };

  return (
    <div className="sm:p-8 p-4 space-y-8 min-h-screen bg-(--input-color)/30 dark:bg-transparent animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-lg dark:border-(--card-border-color) border hover:bg-white dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) shadow-sm transition-all" onClick={() => router.back()}>
            <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">{taskId ? "Edit Task" : "Create New Task"}</h1>
            <p className="text-slate-500 font-medium pt-1 text-sm">{taskId ? "Update task details and requirements." : "Assign a clear objective and set expectations for your team."}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-(--card-color) sm:p-8 p-5 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
          <div className="space-y-2 flex flex-col">
            <label className="text-sm  text-slate-700 dark:text-slate-200">Task Title</label>
            <Input placeholder="e.g. Follow up with Lead #402 regarding Q3 Promo" className="bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) h-12 text-base  focus:ring-primary/20" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm  text-slate-700 dark:text-slate-200">Description</label>
            <Textarea placeholder="Provide detailed instructions and context for this task..." className="bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) min-h-37.5 text-base leading-relaxed focus:ring-primary/20" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-6 [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:flex">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm  text-slate-700 dark:text-slate-200">Priority Level</label>
              <Select value={formData.task_priority} onValueChange={(val: TaskPriority) => setFormData({ ...formData, task_priority: val })}>
                <SelectTrigger className="bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:hover:bg-(--page-body-bg) dark:border-none h-12 ">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) dark:hover:bg-(--page-body-bg)">
                  <SelectItem value="low" className="py-2.5 font-medium dark:hover:bg-(--table-hover)">
                    Low Priority
                  </SelectItem>
                  <SelectItem value="medium" className="py-2.5 dark:hover:bg-(--table-hover)">
                    Medium Priority
                  </SelectItem>
                  <SelectItem value="high" className="py-2.5 dark:hover:bg-(--table-hover)">
                    High Priority
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm  text-slate-700 dark:text-slate-200">Initial Status</label>
              <Select value={formData.status} onValueChange={(val: TaskStatus) => setFormData({ ...formData, status: val })}>
                <SelectTrigger className="bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:hover:bg-(--page-body-bg) dark:border-none h-12 ">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color)">
                  <SelectItem value="pending" className="py-2.5 dark:hover:bg-(--table-hover)">
                    Pending
                  </SelectItem>
                  <SelectItem value="in_progress" className="py-2.5 dark:hover:bg-(--table-hover)">
                    In Progress
                  </SelectItem>
                  <SelectItem value="on_hold" className="py-2.5 dark:hover:bg-(--table-hover)">
                    On Hold
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm  text-slate-700 dark:text-slate-200">Due Date</label>
            <DatePicker 
              date={formData.due_date ? parse(formData.due_date, 'yyyy-MM-dd', new Date()) : undefined} 
              onChange={(date) => setFormData({ ...formData, due_date: date ? format(date, 'yyyy-MM-dd') : "" })}
              className="h-12"
            />
          </div>

          <div className="pt-6 flex justify-end gap-4 flex-wrap">
            <Button variant="outline" className="h-12 px-4.5 py-5  dark:bg-(--dark-sidebar) dark:text-gray-400 text-slate-600 border-(--input-border-color) hover:bg-(--input-color) transition-all" onClick={() => router.back()} type="button">
              Cancel
            </Button>
            <Button className="h-12 px-4.5 py-5 font-extrabold text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all translate-y-0 active:translate-y-1" onClick={handleSubmit} disabled={isCreating || isUpdatingTask}>
              {isCreating || isUpdatingTask ? (taskId ? "Updating..." : "Creating...") : taskId ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTaskCreateForm;
