"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { AlertCircle, X } from "lucide-react";
import React from "react";

interface BaseNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  borderColor?: string;
  handleColor?: string;
  errors?: string[];
  children: React.ReactNode;
  showInHandle?: boolean;
  showOutHandle?: boolean;
  headerRight?: React.ReactNode;
  className?: string;
}

export function BaseNode({
  id,
  title,
  icon,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-600",
  borderColor = "border-gray-200",
  handleColor = "bg-emerald-500!",
  errors = [],
  children,
  showInHandle = true,
  showOutHandle = true,
  headerRight,
  className,
}: BaseNodeProps) {
  const { deleteElements } = useReactFlow();

  return (
    <div className={cn("relative w-80 rounded-lg border-2 bg-white p-4 shadow-lg dark:bg-(--card-color) dark:shadow-(--table-hover) dark:border-(--card-border-color) transition-all", errors.length > 0 ? "border-red-200 shadow-red-50 dark:border-(--card-border-color)" : borderColor, className)}>
      {showInHandle && <Handle type="target" id="tgt" position={Position.Left} className={cn("w-3! h-3! border-2! border-white! dark:border-(--card-border-color)! shadow-sm", handleColor)} />}

      <div className="mb-4 flex items-center gap-2">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", iconBgColor, iconColor)}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-gray-900 truncate dark:text-gray-300">{title}</div>
          {headerRight}
        </div>
        <Button onClick={() => deleteElements({ nodes: [{ id }] })} size="icon" variant="ghost" className="h-6 w-6 rounded-full text-gray-400 hover:text-red-500">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-100 dark:bg-(--dark-sidebar) bg-red-50 p-3 dark:border-(--card-border-color)">
          <div className="flex items-start gap-2 text-red-800">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold mb-1 text-red-900">Please fix the following:</div>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 opacity-90 text-red-800">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">{children}</div>

      {showOutHandle && <Handle type="source" id="src" position={Position.Right} className={cn("w-3! h-3! border-2! border-white! dark:border-(--card-border-color)! shadow-sm", handleColor)} />}
    </div>
  );
}
