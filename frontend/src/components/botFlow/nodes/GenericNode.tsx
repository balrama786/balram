/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { X } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GenericNode({ data, id }: any) {
  const { deleteElements } = useReactFlow();

  return (
    <div className="relative min-w-45 rounded-lg border-2 bg-white p-3 shadow-md" style={{ borderColor: data.color || "#1a192b" }}>
      <Handle type="target" position={Position.Left} style={{ background: data.color || "#1a192b" }} className="w-3! h-3! border-2! border-white! dark:border-(--card-border-color)! shadow-sm" />

      <Button onClick={() => deleteElements({ nodes: [{ id }] })} size="icon" variant="destructive" className="absolute -right-2 -top-2 h-[22px] w-[22px] rounded-full text-xs" title="Delete node">
        <X className="h-3 w-3" />
      </Button>

      <div className="flex items-center gap-2">
        {typeof data.icon === "string" && <span className="text-lg">{data.icon}</span>}
        <div>
          <div className="text-sm font-semibold">{data.label}</div>
          {data.description && <div className="mt-0.5 text-[11px] text-gray-600">{data.description}</div>}
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: data.color || "#1a192b" }} className="w-3! h-3! border-2! border-white! dark:border-(--card-border-color)! shadow-sm" />
    </div>
  );
}
