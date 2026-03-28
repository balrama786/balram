/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { MessageCircle, QrCode, Settings2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmbeddedSignup } from "@/src/utils/hooks/useEmbeddedSignup";
import { useConnectionMutation } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

interface ConnectWabaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectWabaModal = ({ isOpen, onClose }: ConnectWabaModalProps) => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connection] = useConnectionMutation();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);

  const handleFinish = useCallback(
    async (code: string, signupData: any) => {
      try {
        setIsConnecting(true);
        await connection({ code, signupData, workspace_id: selectedWorkspace?._id }).unwrap();
        toast.success("WABA connected successfully!");
        onClose();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to connect WABA");
      } finally {
        setIsConnecting(false);
      }
    },
    [connection, selectedWorkspace, onClose]
  );

  const { startSignup, fbReady } = useEmbeddedSignup(handleFinish);

  const options = [
    {
      id: "embedded",
      title: "Embedded Signup",
      description: "Official Meta connection for large scale messaging",
      icon: <ShieldCheck className="text-primary" size={24} />,
      onClick: startSignup,
      disabled: !fbReady || isConnecting,
      badge: "Official",
    },
    {
      id: "qrcode",
      title: "QR Code (Baileys)",
      description: "Quick link by scanning QR code from your phone",
      icon: <QrCode className="text-amber-500" size={24} />,
      onClick: () => {
        router.push("/connect_waba?tab=qrcode");
        onClose();
      },
      badge: "Quick",
    },
    {
      id: "manual",
      title: "Manual Configuration",
      description: "Setup via your own Meta App and Phone details",
      icon: <Settings2 className="text-blue-500" size={24} />,
      onClick: () => {
        router.push("/connect_waba?tab=manual");
        onClose();
      },
      badge: "Advanced",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125 p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageCircle className="text-primary" size={24} />
            Choose Connection Method
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select how you want to connect your WhatsApp account</p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {options.map((option) => (
            <button key={option.id} onClick={option.onClick} disabled={option.disabled} className={cn("w-full flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-sidebar)/50 text-left transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.01] group active:scale-[0.99]", option.disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent")}>
              <div className="mt-1 p-2.5 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-100 dark:border-(--card-border-color) group-hover:bg-primary/10 transition-colors">{option.icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-gray-200">{option.title}</h4>
                  <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border", option.id === "embedded" ? "bg-primary/10 text-primary border-primary/20" : option.id === "qrcode" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20")}>{option.badge}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-(--dark-sidebar) p-4 flex justify-end gap-3 border-t border-slate-100 dark:border-(--card-border-color)">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWabaModal;
