"use client";

import { Button } from "@/src/elements/ui/button";
import { ShortLinkData } from "@/src/types/short-link";
import { Check, Copy, Download, Link2, Plus, QrCode } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ShortLinkSuccessProps {
  data: ShortLinkData;
  onReset: () => void;
}

const ShortLinkSuccess: React.FC<ShortLinkSuccessProps> = ({ data, onReset }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.short_link);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = data.qr_code;
    link.download = `whatsapp-qr-${data.short_code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Link Generated Successfully!</h2>
        <p className="text-slate-500 dark:text-slate-400">Your WhatsApp direct chat link is ready to use.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color)">
            <Image src={data.qr_code} alt="QR Code" width={180} height={180} className="rounded-lg shadow-sm" unoptimized />
          </div>
          <Button variant="outline" className="w-full gap-2 h-11" onClick={handleDownloadQR}>
            <Download size={16} />
            Download QR Code
          </Button>
        </div>

        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5 text-center md:text-left">
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Short Link</Label>
              <div className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) break-all text-sm font-mono text-primary font-medium">{data.short_link}</div>
            </div>

            <Button className="w-full gap-2 h-11 shadow-lg dark:text-white shadow-primary/20" onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-(--card-border-color) space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Link2 size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Number</p>
                <p className="text-sm text-slate-500">+{data.mobile}</p>
              </div>
            </div>
            {data.first_message && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <QrCode size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Message</p>
                  <p className="text-sm text-slate-500 line-clamp-2">{data.first_message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col sm:flex-row gap-3">
        <Button variant="ghost" className="h-12 px-8 text-slate-500 bg-gray-100 dark:bg-(--page-body-bg) dark:text-gray-400" onClick={() => router.push("/tools/links")}>
          View All Links
        </Button>
        <Button variant="outline" className="h-12 px-8 gap-2" onClick={onReset}>
          <Plus size={18} />
          Create Another
        </Button>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Label = ({ children, className }: any) => <span className={`block text-sm font-medium ${className}`}>{children}</span>;

export default ShortLinkSuccess;
