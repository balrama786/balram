"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { MicOff, Settings, AlertCircle, Info } from "lucide-react";

interface MicErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorType: "no-device" | "permission-denied" | "unknown";
}

const MicErrorModal: React.FC<MicErrorModalProps> = ({ isOpen, onClose, errorType }) => {
  const getErrorInfo = () => {
    switch (errorType) {
      case "no-device":
        return {
          title: "Microphone Not Found",
          description: "We couldn't detect a microphone connected to your device.",
          icon: <MicOff className="text-rose-500" size={48} />,
          advice: ["Ensure your microphone is properly plugged in.", "Check if your device's hardware switch is on.", "Try refreshing the page after connecting your mic."],
        };
      case "permission-denied":
        return {
          title: "Microphone Access Blocked",
          description: "Microphone access has been denied by your browser or system settings.",
          icon: <Settings className="text-amber-500" size={48} />,
          advice: ["Click the lock/camera icon in your address bar to allow access.", "Go to browser settings and reset microphone permissions for this site.", "Ensure no other app is using the microphone exclusively."],
        };
      default:
        return {
          title: "Recording Error",
          description: "An unexpected error occurred while trying to access your microphone.",
          icon: <AlertCircle className="text-blue-500" size={48} />,
          advice: ["Refresh the page and try again.", "Check if your browser supports audio recording.", "Contact support if the issue persists."],
        };
    }
  };

  const info = getErrorInfo();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-full">{info.icon}</div>
          <DialogTitle className="text-xl font-bold text-center">{info.title}</DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">{info.description}</p>
        </DialogHeader>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 my-4">
          <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-200">
            <Info size={16} className="text-primary" />
            <span className="text-sm font-semibold">What you can do:</span>
          </div>
          <ul className="space-y-2">
            {info.advice.map((item, index) => (
              <li key={index} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-32 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MicErrorModal;
