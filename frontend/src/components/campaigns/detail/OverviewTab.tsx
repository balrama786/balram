
import { Badge } from "@/src/elements/ui/badge";
import { Progress } from "@/src/elements/ui/progress";
import { TabsContent } from "@/src/elements/ui/tabs";
import { Campaign, CampaignStats, ManageWabaColumn } from "@/src/types/components";
import { cn, formatDate } from "@/src/utils";
import { Calendar, Clock, FileText, Globe, Hash, Phone, TrendingUp } from "lucide-react";
import { DetailRow, StatBox } from "./DetailComponents";

export const OverviewTab = ({ campaign, stats, progress, active }: { campaign: Campaign; stats: CampaignStats; progress: number; active: boolean }) => (
  <TabsContent active={active} className="space-y-6 focus:outline-none mt-0">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Details Card */}
      <div className="bg-white dark:bg-(--dark-body) p-6 rounded-lg border border-slate-200 dark:border-none shadow-sm space-y-6">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <FileText size={16} className="text-primary" /> Campaign Details
        </h3>
        <div className="space-y-4">
          <DetailRow label="Name" value={campaign.name} icon={Hash} />
          <DetailRow
            label="Status"
            value={
              <Badge variant="outline" className={cn("uppercase font-black text-[10px] px-2 py-0.5 rounded-full border-2", 
                campaign.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50" : "bg-blue-50 text-primary border-blue-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
              )}>
                {campaign.status}
              </Badge>
            }
            icon={Clock}
          />
          <DetailRow label="WABA ID" value={(typeof campaign.waba_id === 'object' && campaign.waba_id !== null) ? (campaign.waba_id as ManageWabaColumn).whatsapp_business_account_id : campaign.waba_id} icon={Phone} />
          <DetailRow label="Created" value={formatDate(campaign.created_at)} icon={Calendar} />
          <DetailRow label="Template" value={campaign.template_name} icon={FileText} />
          <DetailRow label="Language" value={campaign.language_code || "en_US"} icon={Globe} />
        </div>
      </div>

      {/* Stats Card */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-(--dark-body) p-6 rounded-lg border border-slate-200 dark:border-none shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-(--card-border-color)">
            <TrendingUp size={16} className="text-primary" /> Message Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
            <StatBox label="Sent" count={stats.sent_count} color="blue" />
            <StatBox label="Delivered" count={stats.delivered_count} color="emerald" />
            <StatBox label="Read" count={stats.read_count} color="purple" />
            <StatBox label="Failed" count={stats.failed_count} color="red" />
            </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-(--dark-body) p-6 rounded-lg border border-slate-200 dark:border-none shadow-sm space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Delivery Progress</h3>
            <span className="text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5 bg-slate-100 dark:bg-(--page-body-bg)" />
        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium text-center">
            <span className="font-bold text-slate-700 dark:text-slate-200">{stats.total_recipients - stats.pending_count}</span> of <span className="font-bold text-slate-700 dark:text-slate-200">{stats.total_recipients}</span> contacts processed
        </p>
        </div>
      </div>
    </div>
  </TabsContent>
);
