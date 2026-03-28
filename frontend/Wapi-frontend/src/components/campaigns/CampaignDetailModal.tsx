"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/src/elements/ui/tabs";
import { useGetCampaignByIdQuery } from "@/src/redux/api/campaignApi";
import { AlertCircle, Clock, MessageSquare, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { MessagesTab } from "./detail/MessagesTab";
import { OverviewTab } from "./detail/OverviewTab";

const CampaignDetailModal = ({ isOpen, onClose, campaignId }: { isOpen: boolean; onClose: () => void; campaignId: string | null }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: campaignResult, isLoading } = useGetCampaignByIdQuery(campaignId || "", { skip: !campaignId });

  const campaign = campaignResult?.data;

  if (!isOpen) return null;

  const stats = campaign?.stats || {
    total_recipients: 0,
    sent_count: 0,
    delivered_count: 0,
    read_count: 0,
    failed_count: 0,
    pending_count: 0,
  };

  const progress = stats.total_recipients > 0 ? Math.round(((stats.total_recipients - stats.pending_count) / stats.total_recipients) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="lg:max-w-4xl! max-w-[calc(100%-2rem)]! max-h-[90vh] flex flex-col p-0! overflow-hidden dark:bg-(--card-color) gap-0 border-0 rounded-lg shadow-2xl">
        <DialogHeader className="p-0 shrink-0 bg-white dark:bg-(--card-color) border-b border-slate-100 dark:border-slate-800 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-(--light-primary) dark:bg-(--dark-body) rounded-lg">
                <MessageSquare className="text-primary w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-slate-800 text-left dark:text-white text-lg font-black tracking-tight">Campaign Details</DialogTitle>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider line-clamp-1 text-left">{campaign?.name || "Loading..."}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover) text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-0">
            <Tabs className="w-full">
              <TabsList className="bg-transparent p-0 gap-6 dark:border-(--card-border-color) border-b border-transparent w-full justify-start h-auto">
                {[
                  { id: "overview", label: "Overview", icon: TrendingUp },
                  { id: "messages", label: "Messages", icon: MessageSquare },
                ].map((tab) => (
                  <TabsTrigger key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`gap-2 px-0 pb-4 shadow-none! rounded-none border-b-2 ${activeTab === tab.id ? "border-slate-300 dark:border-(--card-border-color) p-2" : "border-transparent"} hover:border-slate-300 p-2 dark:hover:border-(--dark-sidebar) text-slate-400 font-bold text-sm transition-all hover:text-slate-600 dark:hover:text-slate-300`}>
                    <tab.icon size={16} /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto sm:p-6 p-4 bg-slate-50/50 dark:bg-(--card-color) custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Clock className="w-10 h-10 text-primary opacity-50" />
              <p className="text-sm font-bold text-slate-400 animate-pulse">Loading campaign data...</p>
            </div>
          ) : campaign ? (
            <Tabs className="mt-0">
              <OverviewTab campaign={campaign} stats={stats} progress={progress} active={activeTab === "overview"} />
              <MessagesTab recipients={campaign.recipients || []} active={activeTab === "messages"} />
            </Tabs>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <p className="font-bold text-slate-600 dark:text-slate-300">Campaign not found</p>
              <p className="text-xs font-medium text-slate-400">The campaign you requested could not be loaded.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailModal;
