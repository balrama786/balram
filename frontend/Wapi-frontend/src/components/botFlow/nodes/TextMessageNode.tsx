/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { useReactFlow } from "@xyflow/react";
import { Type } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TextMessageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
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
    <BaseNode id={id} title="Text Message" icon={<Type size={18} />} iconBgColor="bg-emerald-100" iconColor="text-emerald-600" borderColor="border-emerald-200" handleColor="bg-emerald-500!" errors={errors}>
      <NodeField label="Select message type">
        <Select value={data.messageType || "Simple text"} onValueChange={(value) => updateNodeData("messageType", value)} onOpenChange={() => setTouched(true)}>
          <SelectTrigger className="h-9 text-sm bg-(--input-color) dark:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg)">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--page-body-bg)">
            <SelectItem className="dark:hover:bg-(--card-color)" value="Simple text">
              Simple text
            </SelectItem>
            <SelectItem className="dark:hover:bg-(--card-color)" value="Template">
              Template
            </SelectItem>
            <SelectItem className="dark:hover:bg-(--card-color)" value="Interactive">
              Interactive
            </SelectItem>
            <SelectItem className="dark:hover:bg-(--card-color)" value="Media">
              Media
            </SelectItem>
          </SelectContent>
        </Select>
      </NodeField>

      <NodeField label="Message Content" required error={(touched || data.forceValidation) && !data.message?.trim() ? "Message content cannot be empty" : ""}>
        <Textarea placeholder="Type your message" value={data.message || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("message", e.target.value)} className={`min-h-25 resize-y text-sm ${(touched || data.forceValidation) && !data.message?.trim() ? "border-gray-200 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color)" : ""}`} />
      </NodeField>
    </BaseNode>
  );
}
