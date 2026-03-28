/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { useGetWabaConfigurationQuery, useUpdateWabaConfigurationMutation } from "@/src/redux/api/wabaConfigurationApi";
import { WabaConfigPayload, ReplyRef, DelayedReplyRef } from "@/src/types/waba-configuration";
import ConfigRow from "./waba-config/ConfigRow";
import ToggleSwitch from "./waba-config/ToggleSwitch";
import { cn } from "@/src/lib/utils";

interface WabaConfigSectionProps {
  wabaId: string;
}

interface ToggleConfigField {
  key: keyof Omit<WabaConfigPayload, "round_robin_assignment">;
  label: string;
  description: string;
  hasDelayMinutes?: boolean;
}

const CONFIG_FIELDS: ToggleConfigField[] = [
  {
    key: "out_of_working_hours",
    label: "Out of Working Hours",
    description: "Auto-reply sent when a message is received outside working hours",
  },
  {
    key: "welcome_message",
    label: "Welcome Message",
    description: "First message sent to a new contact",
  },
  {
    key: "delayed_reply",
    label: "Delayed Reply",
    description: "Message sent after a configurable delay when no agent responds",
    hasDelayMinutes: true,
  },
  {
    key: "fallback_message",
    label: "Fallback Message",
    description: "Sent when no matching keyword action is found",
  },
  {
    key: "reengagement_message",
    label: "Re-engagement Message",
    description: "Sent to re-engage inactive contacts after a period of silence",
  },
];

const WabaConfigSection: React.FC<WabaConfigSectionProps> = ({ wabaId }) => {
  const [localConfig, setLocalConfig] = useState<WabaConfigPayload>({});
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
  const initializedWabaId = useRef<string | null>(null);

  const { data, isLoading, isError } = useGetWabaConfigurationQuery(wabaId, { skip: !wabaId });
  const [updateConfig, { isLoading: isSaving }] = useUpdateWabaConfigurationMutation();

  useEffect(() => {
    if (data?.data && initializedWabaId.current !== wabaId) {
      const d = data.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalConfig({
        out_of_working_hours: d.out_of_working_hours ?? null,
        welcome_message: d.welcome_message ?? null,
        delayed_reply: d.delayed_reply ?? null,
        fallback_message: d.fallback_message ?? null,
        reengagement_message: d.reengagement_message ?? null,
        round_robin_assignment: d.round_robin_assignment ?? false,
      });
      setEnabledMap({
        out_of_working_hours: !!d.out_of_working_hours?.id,
        welcome_message: !!d.welcome_message?.id,
        delayed_reply: !!d.delayed_reply?.id,
        fallback_message: !!d.fallback_message?.id,
        reengagement_message: !!d.reengagement_message?.id,
      });
      initializedWabaId.current = wabaId;
    }
  }, [data, wabaId]);

  const saveConfig = useCallback(
    async (newConfig: WabaConfigPayload) => {
      try {
        const response = await updateConfig({ wabaId, data: newConfig }).unwrap();
        toast.success(response.message || "Configuration saved");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to save configuration");
      }
    },
    [wabaId, updateConfig]
  );

  const handleToggle = (key: string, enabled: boolean) => {
    setEnabledMap((prev) => ({ ...prev, [key]: enabled }));
    if (!enabled) {
      const newConfig = { ...localConfig, [key]: null };
      setLocalConfig(newConfig);
      saveConfig(newConfig);
    }
  };

  const handleReplyChange = (key: keyof WabaConfigPayload, ref: ReplyRef | null) => {
    const newConfig = { ...localConfig, [key]: ref };
    setLocalConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleDelayChange = (minutes: number) => {
    const current = localConfig.delayed_reply as DelayedReplyRef | null;
    const newRef: DelayedReplyRef | null = current ? { ...current, delay_minutes: minutes } : { id: "", type: "", delay_minutes: minutes };
    const newConfig = { ...localConfig, delayed_reply: newRef };
    setLocalConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleRoundRobin = (v: boolean) => {
    const newConfig = { ...localConfig, round_robin_assignment: v };
    setLocalConfig(newConfig);
    saveConfig(newConfig);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-slate-400">
        <Info size={28} />
        <p className="text-sm">Could not load configuration. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {CONFIG_FIELDS.filter((_, i) => i % 2 === 0).map((field) => (
            <ConfigRow
              key={field.key}
              field={field}
              value={localConfig[field.key] as any}
              enabled={!!enabledMap[field.key]}
              isExpanded={!!enabledMap[field.key]}
              isSaving={isSaving}
              wabaId={wabaId}
              onToggle={(v) => handleToggle(field.key, v)}
              onReplyChange={(ref) => handleReplyChange(field.key, ref)}
              onDelayChange={field.hasDelayMinutes ? handleDelayChange : undefined}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {CONFIG_FIELDS.filter((_, i) => i % 2 !== 0).map((field) => (
            <ConfigRow
              key={field.key}
              field={field}
              value={localConfig[field.key] as any}
              enabled={!!enabledMap[field.key]}
              isExpanded={!!enabledMap[field.key]}
              isSaving={isSaving}
              wabaId={wabaId}
              onToggle={(v) => handleToggle(field.key, v)}
              onReplyChange={(ref) => handleReplyChange(field.key, ref)}
              onDelayChange={field.hasDelayMinutes ? handleDelayChange : undefined}
            />
          ))}
      <div className="rounded-lg border border-slate-100 dark:border-(--card-border-color)/50 bg-white dark:bg-(--card-color) shadow-sm">
        <div className="flex items-center justify-between p-4 sm:p-5">
          <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
            <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-(--dark-body) text-slate-400">
              <Loader2 size={15} className={cn(localConfig.round_robin_assignment && "text-primary animate-pulse")} />
            </div>
            <div className="min-w-0">
              <p className={cn("text-sm font-bold", localConfig.round_robin_assignment ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400")}>Round Robin Assignment</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">Automatically assign incoming chats to agents in a round-robin order</p>
            </div>
          </div>
          <ToggleSwitch checked={!!localConfig.round_robin_assignment} onChange={handleRoundRobin} disabled={isSaving} />
        </div>
      </div>
        </div>
      </div>

    </div>
  );
};

export default WabaConfigSection;
