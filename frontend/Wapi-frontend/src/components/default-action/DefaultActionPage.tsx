"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import CommonHeader from "@/src/shared/CommonHeader";
import { useAppSelector } from "@/src/redux/hooks";
import WorkingHoursModal from "./WorkingHoursModal";
import WabaConfigSection from "./WabaConfigSection";

const DefaultActionPage: React.FC = () => {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const isConnected = isBaileys ? !!selectedWorkspace?.waba_id && selectedWorkspace?.connection_status === "connected" : !!selectedWorkspace?.waba_id;
  const wabaId = selectedWorkspace?.waba_id || "";
  const [workingHoursOpen, setWorkingHoursOpen] = useState(false);

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <CommonHeader
        title="Default Action"
        description="Configure automated responses and working hours for your WhatsApp Business account"
        rightContent={
          <Button onClick={() => setWorkingHoursOpen(true)} variant="outline" disabled={!wabaId} className="flex items-center gap-2.5 h-12 px-5 rounded-lg border-primary text-primary hover:text-primary hover:bg-primary/5 font-semibold transition-all">
            <Clock size={18} />
            Set Working Hours
          </Button>
        }
      />

      {isConnected ? (
        <WabaConfigSection wabaId={wabaId} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color) shadow-sm flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 transition-transform">
            <div className="p-4 bg-white dark:bg-(--dark-sidebar) rounded-lg shadow-inner shadow-slate-100 dark:shadow-none">
              <Clock size={32} className="text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No WABA Connected</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed text-sm">
            Please connect a WhatsApp Business Account to configure automated responses and working hours.
          </p>
          <Button
            onClick={() => window.location.href = '/connect_waba'}
            variant="outline"
            className="mt-8 h-11 px-6 rounded-lg border-primary text-primary hover:bg-primary/5 font-semibold transition-all"
          >
            Connect WABA
          </Button>
        </div>
      )}

      <WorkingHoursModal open={workingHoursOpen} onClose={() => setWorkingHoursOpen(false)} wabaId={wabaId} />
    </div>
  );
};

export default DefaultActionPage;
