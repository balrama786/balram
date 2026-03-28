"use client";

import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Home, Loader2 } from "lucide-react";
import React from "react";

interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ProfileAssignAgentProps {
  agents: Agent[];
  selectedAgentId?: string;
  onAssign: (agentId: string) => void;
  onUnassign: () => void;
  isLoading?: boolean;
  isUnassigning?: boolean;
}

const ProfileAssignAgent = ({ agents, selectedAgentId, onAssign, onUnassign, isLoading, isUnassigning }: ProfileAssignAgentProps) => {
  return (
    <div className="bg-white dark:bg-(--dark-body) dark:border-none border border-gray-100 dark:border-(--card-border-color) rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
          <Home size={18} />
        </div>
        <span>Assign agent</span>
      </div>

      <div className="space-y-1.5 relative">
        <Label className="text-[10px] font-medium text-slate-400 absolute -top-2 left-3 bg-white dark:bg-(--page-body-bg) px-1 z-10">Agents</Label>
        <Select value={selectedAgentId} onValueChange={onAssign} disabled={isLoading}>
          <SelectTrigger className="w-full h-11 py-7 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-none border-gray-200 dark:hover:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus:ring-0">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id} className="cursor-pointer dark:hover:bg-(--table-hover)">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{agent.name}</span>
                  {(agent.email || agent.phone) && (
                    <span className="text-[10px] text-slate-400">
                      {agent.email}
                      {agent.email && agent.phone ? " • " : ""}
                      {agent.phone}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAgentId && agents.find((a) => a.id === selectedAgentId) && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-slate-500 dark:text-gray-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-500">Assigned:</span> {agents.find((a) => a.id === selectedAgentId)?.name}
            {agents.find((a) => a.id === selectedAgentId)?.phone && ` (${agents.find((a) => a.id === selectedAgentId)?.phone})`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUnassign}
            disabled={isUnassigning}
            className="h-6 w-14 text-[10px] text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/20 hover:bg-rose-50 p-0"
          >
            {isUnassigning ? <Loader2 className="animate-spin h-3 w-3" /> : "Remove"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileAssignAgent;
