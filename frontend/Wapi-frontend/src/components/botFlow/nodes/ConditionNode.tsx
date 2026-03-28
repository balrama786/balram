/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Filter } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ConditionNode({ data, id }: any) {
  const condition = data.condition || {};
  const field = condition.field || "message";
  const operator = condition.operator || "contains_any";
  const value = condition.value || [];

  return (
    <BaseNode
      id={id}
      title="Logic Condition"
      icon={<Filter size={18} />}
      iconBgColor="bg-blue-100"
      iconColor="text-blue-600"
      borderColor="border-blue-200"
      handleColor="bg-blue-500!"
      headerRight={
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] h-4 px-1.5">
          Process Step
        </Badge>
      }
    >
      <NodeField label="Match Field">
        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md border border-gray-100 italic">
          {field}
        </div>
      </NodeField>

      <NodeField label="Operator">
        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md border border-gray-100 italic">
          {operator.replace("_", " ")}
        </div>
      </NodeField>

      <NodeField label="Expected Values">
        <div className="flex flex-wrap gap-1">
          {Array.isArray(value) ? (
            value.length > 0 ? (
              value.map((v: string, i: number) => (
                <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                  {v}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-gray-400">No values</span>
            )
          ) : (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
              {value}
            </Badge>
          )}
        </div>
      </NodeField>
    </BaseNode>
  );
}
