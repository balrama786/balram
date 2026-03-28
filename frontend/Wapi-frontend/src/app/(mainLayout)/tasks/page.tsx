"use client";

import AgentTaskDetail from "@/src/components/agent-task/AgentTaskDetail";
import AgentTaskListSidebar from "@/src/components/agent-task/AgentTaskListSidebar";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { ClipboardList } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RootState } from "@/src/redux/store";

const AgentTaskPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentIdFromParams = params.id as string;
  const agentIdFromSearch = searchParams.get("agentId");
  const taskId = searchParams.get("taskId");
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const agentId = agentIdFromParams || agentIdFromSearch || (user?.role === "agent" ? user.id : "");

  return (
    <div className="flex shadow h-[calc(100vh-100px)] overflow-hidden [@media(max-width:991px)]:h-[unset] bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) rounded-lg mt-4 mx-4 animate-in fade-in zoom-in-95 duration-500 relative">
      {/* Sidebar / Drawer */}
      <aside
        className={`w-96 border-r border-slate-100 dark:border-(--card-border-color) h-full overflow-hidden flex flex-col bg-white/50 backdrop-blur-md transition-all duration-300 z-50
        [@media(max-width:991px)]:absolute [@media(max-width:991px)]:top-0 [@media(max-width:991px)]:left-0 [@media(max-width:991px)]:h-full [@media(max-width:991px)]:w-70 [@media(max-width:991px)]:bg-white [@media(max-width:991px)]:dark:bg-(--card-color)
        ${isSidebarOpen ? "[@media(max-width:991px)]:translate-x-0" : "[@media(max-width:991px)]:-translate-x-full"}`}
      >
        <AgentTaskListSidebar agentId={agentId} onSelectTask={() => setIsSidebarOpen(false)} onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* No Overlay for mobile drawer */}


      <main className="flex-1 h-[calc(100vh-100px)] overflow-hidden flex flex-col bg-slate-50/10 w-full">
        {taskId ? (
          <AgentTaskDetail taskId={taskId} onToggleSidebar={() => setIsSidebarOpen(true)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/50 dark:bg-(--card-color) animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[500px]">
            <div className="w-25 h-25 rounded-lg bg-slate-50 dark:bg-(--dark-sidebar) flex items-center justify-center text-slate-200 shadow-inner mb-6 transition-transform hover:scale-105 duration-500">
              <ClipboardList className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-400 text-center">
              Select a task <br />
              <span className="text-sm font-regular tracking-normal normal-case">to view instructions and collaborate</span>
            </h3>
            <div className="mt-6 [@media(min-width:992px)]:hidden">
              <Button onClick={() => setIsSidebarOpen(true)}>View Task List</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentTaskPage;
