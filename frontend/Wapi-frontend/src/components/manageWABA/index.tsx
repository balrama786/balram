"use client";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import WabaRequired from "@/src/shared/WabaRequired";
import { WABAConnection } from "@/src/types/whatsapp";
import { Phone } from "lucide-react";
import { useMemo } from "react";

import PhoneNumbers from "./PhoneNumbers";

const WabaPhoneNumbers = () => {
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaIdFromWorkspace = selectedWorkspace?.waba_id;
  const { data: connectionsResult, isLoading } = useGetConnectionsQuery({ page: 1, limit: 100 });

  const activeWaba = useMemo(() => {
    const data = connectionsResult?.data;
    if (!data || !wabaIdFromWorkspace) return null;
    return data.find((c: WABAConnection) => c.id === wabaIdFromWorkspace || c._id === wabaIdFromWorkspace);
  }, [connectionsResult, wabaIdFromWorkspace]);

  if (!wabaIdFromWorkspace) {
    return <WabaRequired title="WABA Connection Required" description="No WhatsApp Business Account is currently connected to this workspace. Connect one now to start sending messages." />;
  }

  if (isLoading) {
    return (
      <div className="sm:p-8 p-4 space-y-8">
        <CommonHeader title="WABA Phone Numbers" description="Details of the WhatsApp Business Account connected to this workspace" isLoading={true} />
        <Card className="border-none shadow-sm dark:bg-(--card-color)">
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Loading WABA details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeWaba) {
    return (
      <div className="sm:p-8 p-4 space-y-8">
        <CommonHeader title="WABA Phone Numbers" description="Details of the WhatsApp Business Account connected to this workspace" />
        <Card className="border-none shadow-sm dark:bg-(--card-color)">
          <CardContent className="p-16 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-(--dark-body) rounded-full flex items-center justify-center">
              <Phone size={40} className="text-slate-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Workspace WABA Not Found</h3>
              <p className="text-slate-500 dark:text-gray-400 max-w-sm">The WABA ID associated with this workspace could not be found or has been disconnected.</p>
            </div>
            <Button onClick={() => (window.location.href = "/connect_waba")} className="bg-primary text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
              Re-connect WABA
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PhoneNumbers wabaId={activeWaba.id || (activeWaba._id as string)} />;
};

export default WabaPhoneNumbers;
