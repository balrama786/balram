/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

export function SendMessageNode({ data, id }: any) {
  const { deleteElements, setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.message || !data.message.trim()) errors.push("Message content is required");
  }

  const updateNodeData = (field: string, value: string) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };

  return (
    <div className={`relative w-80 rounded-lg border bg-white p-4 shadow-lg transition-all ${errors.length > 0 ? "border-red-200 shadow-red-50" : "border-gray-200"}`}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-primary !border-2 !border-white shadow-sm" />

      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
          <Badge variant="outline" className="h-6 w-6 border-none p-0 flex items-center justify-center text-lg">
            📧
          </Badge>
        </div>
        <div className="text-[15px] font-semibold">Send Message</div>
        <Button onClick={() => deleteElements({ nodes: [{ id }] })} size="icon" variant="ghost" className="ml-auto h-6 w-6 rounded-full text-gray-400 hover:text-red-500">
          <X className="h-4 w-4" />
        </Button>``
      </div>

      {errors.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3">
          <div className="flex items-start gap-2 text-red-800">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold mb-1">Please fix the following errors:</div>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 opacity-90">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <Label className="mb-1.5 block text-xs font-medium text-gray-600">Select message type</Label>
        <Select value={data.messageType || "Simple text"} onValueChange={(value) => updateNodeData("messageType", value)} onOpenChange={() => setTouched(true)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Simple text">Simple text</SelectItem>
            <SelectItem value="Template">Template</SelectItem>
            <SelectItem value="Interactive">Interactive</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block text-xs font-medium text-gray-600">Message Content *</Label>
        <Textarea placeholder="Type your message" value={data.message || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("message", e.target.value)} className={`min-h-25 resize-y text-sm ${(touched || data.forceValidation) && !data.message?.trim() ? "border-gray-200 bg-(--input-color) dark:border-(--card-border-color)" : ""}`} />
        {(touched || data.forceValidation) && !data.message?.trim() && <p className="mt-1 text-[10px] text-red-500 font-medium">Message content cannot be empty</p>}
      </div>

      <Handle type="source" position={Position.Right} className="w-3! h-3! bg-emerald-500! border-2! border-white! dark:border-(--card-border-color)! shadow-sm" />
    </div>
  );
}
