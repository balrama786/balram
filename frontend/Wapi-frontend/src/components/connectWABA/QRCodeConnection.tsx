/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useConnectWhatsAppMutation, useLazyGetBaileysQRCodeQuery } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import { AlertCircle, CheckCircle2, Loader2, QrCode, RefreshCw, Smartphone } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface QRCodeConnectionProps {
  isDisabled?: boolean;
}

const QRCodeConnection = ({ isDisabled }: QRCodeConnectionProps) => {
  const { selectedWorkspace }: any = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const [instanceName, setInstanceName] = useState("");
  const [wabaId, setWabaId] = useState<string | null>(selectedWorkspace?.waba_id || null);
  const [status, setStatus] = useState<"idle" | "generating" | "scanning" | "connected" | "failed" | "expired">("idle");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const attemptedWabaIds = useState<Set<string>>(new Set())[0];

  const [connectWhatsApp, { isLoading: isConnecting }] = useConnectWhatsAppMutation();
  const [getQRCode, { data: qrData, isFetching: isFetchingQR }] = useLazyGetBaileysQRCodeQuery();
  const { data: workspacesData, refetch: refetchWorkspaces } = useGetWorkspacesQuery();

  const latestWorkspace = workspacesData?.data?.find((ws: any) => ws._id === selectedWorkspace?._id);
  const connectionStatus = latestWorkspace?.connection_status || selectedWorkspace?.connection_status;
  const currentWabaId = latestWorkspace?.waba_id || selectedWorkspace?.waba_id;
  const isConnected = isBaileys ? !!currentWabaId && connectionStatus === "connected" : !!currentWabaId;

  const handleGenerateQR = useCallback(async () => {
    try {
      setStatus("generating");
      setQrCode(null);

      const targetWabaId = wabaId || latestWorkspace?.waba_id || selectedWorkspace?.waba_id;

      if (isBaileys && targetWabaId) {
        try {
          const res = await getQRCode(targetWabaId).unwrap();
          if (res?.success) {
            refetchWorkspaces();
            return;
          }
        } catch (error: any) {
          console.error("Direct QR fetch failed:", error);
          setStatus("failed");
          toast.error(error?.data?.message || error?.message || "Failed to fetch QR code");
          return;
        }
      }

      if (!isBaileys || !targetWabaId) {
        const nameToUse = instanceName.trim() || selectedWorkspace?.name || latestWorkspace?.name || "";
        if (!nameToUse) {
          setStatus("idle");
          toast.error("Please enter an instance name");
          return;
        }

        if (!instanceName) setInstanceName(nameToUse);

        const response: any = await connectWhatsApp({
          name: nameToUse,
          provider: "baileys",
          workspace_id: selectedWorkspace?._id,
        }).unwrap();

        if (response.success && response.data?.waba_id) {
          const newWabaId = response.data.waba_id;
          setWabaId(newWabaId);

          const qrRes = await getQRCode(newWabaId).unwrap();
          if (qrRes?.success && qrRes.data?.qr_code) {
            refetchWorkspaces();
          } else {
            setStatus("failed");
            toast.error("Connected but failed to fetch QR code. Please try refreshing.");
          }
        } else {
          throw new Error(response.message || "Failed to get connection ID");
        }
      }
    } catch (error: any) {
      setStatus("failed");
      toast.error(error?.data?.message || error?.message || "Failed to initialize connection");
    }
  }, [isBaileys, wabaId, latestWorkspace, selectedWorkspace, instanceName, getQRCode, refetchWorkspaces, connectWhatsApp]);

  useEffect(() => {
    if (selectedWorkspace && isBaileys && selectedWorkspace.waba_id && !wabaId) {
      setWabaId(selectedWorkspace.waba_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace, isBaileys]);

  useEffect(() => {
    if (qrData?.success && qrData.data?.qr_code) {
      setQrCode(qrData.data.qr_code);
      setStatus("scanning");
    } else if (qrData?.success && qrData.data?.status === "connected") {
      setStatus("connected");
    } else if (qrData?.success && qrData.data?.status === "qr_timeout") {
      setStatus("expired");
    } else if (qrData?.success && qrData.data?.status === "disconnected") {
      // If disconnected and we don't have a QR, maybe it was a transient error or session loss
      if (!qrCode) setStatus("failed");
    }
  }, [qrData, qrCode]);

  useEffect(() => {
    const isQrcodeStatus = connectionStatus === "qrcode";
    const targetWabaId = wabaId || latestWorkspace?.waba_id;

    if (isBaileys && targetWabaId && isQrcodeStatus && status === "idle") {
      if (!attemptedWabaIds.has(targetWabaId)) {
        attemptedWabaIds.add(targetWabaId);
        handleGenerateQR();
      }
    }
  }, [isBaileys, wabaId, latestWorkspace?.waba_id, connectionStatus, status, handleGenerateQR, attemptedWabaIds]);

  const handleRefreshQR = async () => {
    if (wabaId) {
      try {
        await getQRCode(wabaId).unwrap();
        refetchWorkspaces();
      } catch (error: any) {
        toast.error(error?.error || "Failed to refresh QR code");
      }
    }
  };

  const steps = ["Open WhatsApp on your phone", "Tap Menu (⋮) or Settings (⚙️) and select Linked Devices", "Tap on Link a Device", "Point your phone to this screen to capture the QR code"];

  if (status === "connected" || (isConnected && connectionStatus === "connected") || (isDisabled && !isBaileys)) {
    return (
      <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden rounded-none!">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-primary">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Connected</h3>
            <p className="text-gray-500 text-sm max-w-sm">{isDisabled && !isBaileys ? "This workspace is already connected via WhatsApp Business API." : "Your WhatsApp instance is already linked and active in this workspace."}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden min-h-125">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Connect via QR Code</h3>
              <p className="text-gray-500 text-sm">Quickly link your WhatsApp account by scanning a QR code.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                  Instance Name <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="e.g. Sales Team WhatsApp" className="h-11 border-(--input-border-color) bg-(--input-color) focus:border-primary dark:border-(--card-border-color) focus:ring-primary" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} disabled={status !== "idle" && status !== "failed"} />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Follow these steps:</p>
                <ul className="space-y-4">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-none w-6 h-6 rounded-full bg-slate-100 dark:bg-(--dark-body) text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {status === "idle" || status === "failed" ? (
                <Button onClick={handleGenerateQR} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95" disabled={isConnecting}>
                  {isConnecting ? <Loader2 className="mr-2 animate-spin" size={18} /> : <QrCode className="mr-2" size={18} />}
                  {status === "failed" ? "Retry Generate QR" : "Generate QR Code"}
                </Button>
              ) : (
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Smartphone className={status === "scanning" ? "animate-bounce" : "animate-pulse"} size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{status === "scanning" ? "QR Generated" : "Awaiting Scan"}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{status === "scanning" ? "Point your phone at the QR code" : "Initializing secure connection..."}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: QR Code Display */}
          <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) sm:p-6 p-4 min-h-87.5">
            {status === "idle" && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300 shadow-sm mx-auto">
                  <QrCode size={40} />
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  QR code will appear here after <br /> initializing the connection
                </p>
              </div>
            )}

            {(status === "generating" || (status === "scanning" && isFetchingQR && !qrCode)) && (
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-sm text-slate-400 font-medium">Generating secure QR code...</p>
              </div>
            )}

            {(status === "scanning" || status === "failed" || status === "expired") && qrCode && (
              <div className="relative group">
                <div className="p-4 bg-white rounded-lg dark:bg-(--dark-body) shadow-xl overflow-hidden">
                  <Image src={qrCode} alt="WhatsApp QR Code" width={250} height={250} className={`transition-all duration-300 ${isFetchingQR || status === "expired" ? "blur-md opacity-50" : ""}`} />
                  {(isFetchingQR || status === "expired") && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      {status === "expired" ? (
                        <>
                          <AlertCircle size={32} className="text-amber-500 mb-2" />
                          <p className="text-xs font-bold text-slate-700">QR Expired</p>
                        </>
                      ) : (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      )}
                    </div>
                  )}
                </div>

                <Button variant="secondary" size="sm" className={`absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full px-4 h-9 bg-white dark:bg-(--page-body-bg) shadow-lg border border-slate-100 dark:border-(--card-border-color) dark:hover:bg-(--table-hover) hover:bg-slate-50 transition-opacity ${status === "expired" ? "opacity-100 ring-2 ring-primary" : "opacity-100"}`} onClick={handleRefreshQR} disabled={isFetchingQR}>
                  <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetchingQR ? "animate-spin" : ""}`} />
                  {status === "expired" ? "Generate New QR" : "Refresh QR"}
                </Button>
              </div>
            )}

            {status === "failed" && !qrCode && (
              <div className="text-center space-y-4 text-red-500">
                <AlertCircle size={40} className="mx-auto" />
                <p className="text-sm font-medium">
                  Initialization failed. <br /> Please check your network and try again.
                </p>
              </div>
            )}

            {status === "expired" && !qrCode && (
              <div className="text-center space-y-4 text-amber-500">
                <RefreshCw size={40} className="mx-auto animate-pulse" />
                <p className="text-sm font-medium">
                  QR code session expired. <br /> Please click refresh to get a new one.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeConnection;
