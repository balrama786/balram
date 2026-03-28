"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import { WebhookCardProps } from "@/src/types/webhook";
import { format } from "date-fns";
import { Check, CheckCircle2, Clock, Copy, Edit2, LayoutTemplate, Trash2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const WebhookCard = ({ webhook, onEdit, onToggle, onDelete, onViewPayload, isLoading }: WebhookCardProps) => {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const id = (typeof webhook._id === "string" ? webhook._id : webhook._id?.$oid) || webhook.id;
  const createdAt = webhook.created_at ? (typeof webhook.created_at === "string" ? new Date(webhook.created_at) : new Date(webhook.created_at.$date)) : new Date();

  const webhookUrl = webhook.webhook_url;

  const handleCopy = () => {
    if (!webhookUrl || is_demo_mode) return;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("Webhook URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusLabel = () => {
    if (!webhook.is_template_mapped) return "Not Configured";
    return "Configured";
  };

  const status = getStatusLabel();
  const hasFirstPayload = !!webhook.first_payload;
  const isConfigured = status === "Configured";

  return (
    <div className="bg-white dark:bg-(--card-color) border border-gray-100 dark:border-(--card-border-color) rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-5 border-b border-gray-50 dark:border-(--card-border-color) flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 dark:text-white leading-tight uppercase">{webhook?.webhook_name}</h3>
          <p className="text-[11px] text-slate-400 font-medium">{webhook.platform?.toUpperCase() || "CUSTOM"} WEBHOOK</p>
        </div>
        <Switch checked={webhook.is_active} onCheckedChange={() => id && onToggle(id)} disabled={isLoading} className="data-[state=checked]:bg-emerald-500" />
      </div>

      <div className="p-5 space-y-4 flex-1">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={cn("border-none font-bold text-[10px] px-2 py-0.5", webhook.is_active ? "bg-emerald-50 text-primary dark:bg-transparent" : "bg-slate-100 text-slate-500 dark:bg-(--page-body-bg)")}>
            {webhook.is_active ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="secondary" className={cn("border-none font-bold text-[10px] px-2 py-0.5", !isConfigured ? "bg-rose-50 text-red-500 dark:bg-red-500/10" : "bg-emerald-50 text-primary dark:bg-(--page-body-bg)")}>
            {status}
          </Badge>
          {webhook?.template?.name && (
            <Badge variant="secondary" className={cn("font-bold text-[10px] px-2 py-0.5 bg-blue-400/20 text-blue-800 border border-blue-300 dark:border-(--card-border-color) dark:bg-transparent dark:hover:bg-transparent")}>
              {webhook.template.name}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative group/url">
            <div className="w-full bg-(--input-color) dark:bg-(--page-body-bg) p-3 rounded-lg border border-gray-50 dark:border-none text-[11px] font-mono text-slate-600 dark:text-gray-500 break-all pr-12">{webhookUrl}</div>
            <Button variant="ghost" size="icon" onClick={() => !is_demo_mode && handleCopy()} disabled={is_demo_mode} className={cn("absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-emerald-100", is_demo_mode && "cursor-not-allowed opacity-50")}>
              {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
            </Button>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-gray-400 font-medium pl-1">
            <Clock size={12} />
            Created on {format(createdAt, "MMM dd, yyyy")}
          </div>
        </div>

        {!hasFirstPayload ? (
          <div className="bg-red-50/30 dark:bg-red-400/5 p-3 rounded-lg border border-rose-100/50 dark:border-none flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-bold text-red-500">Waiting for first response</span>
          </div>
        ) : (
          <div className="bg-emerald-50/30 dark:bg-emerald-500/5 p-3 rounded-lg border border-emerald-100/50 dark:border-emerald-500/10 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-primary" />
            <span className="text-[11px] font-bold text-primary">Successfully receiving data</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50/50 dark:bg-(--card-color) border-t border-gray-50 dark:border-(--card-border-color) flex items-center justify-between">
        <Button disabled={!hasFirstPayload} onClick={() => router.push(`/webhooks/map_template/${id}`)} className="bg-primary hover:opacity-90 text-white rounded-lg gap-2 font-bold px-4 h-9 border-none transition-all hover:-translate-y-0.5">
          <LayoutTemplate size={16} /> {isConfigured ? "Edit Template" : "Map Template"}
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onViewPayload(webhook)} className="h-9 w-9 rounded-lg text-primary hover:bg-emerald-50 dark:hover:bg-emerald-500/10" title="Show Payload">
            <Zap size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(webhook)} className="h-9 w-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-(--table-hover)" title="Edit">
            <Edit2 size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => id && onDelete(id)} className="h-9 w-9 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebhookCard;
