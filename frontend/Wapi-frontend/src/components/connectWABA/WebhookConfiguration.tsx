"use client";

import { ImageBaseUrl } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useAppSelector } from "@/src/redux/hooks";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const WebhookConfiguration = () => {
  const { setting } = useAppSelector((state) => state.setting);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${title} is copied.`);
  };

  return (
    <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden h-full">
      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300">Webhook Configuration</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Webhook URL</Label>
            <div className="flex gap-2">
              <Input readOnly value={`${ImageBaseUrl ?? ""}${setting?.whatsapp_webhook_url || ""}`} className="bg-gray-50/50 border-gray-200 text-gray-600 dark:border-(--card-border-color) h-11 focus-visible:outline-none focus-visible:ring-0" />
              <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 border-gray-200 text-gray-400 hover:tex t-gray-900" onClick={() => copyToClipboard(setting?.whatsapp_webhook_url || "Webhook url", "Webhook url")}>
                <Copy size={18} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Verification Token</Label>
            <div className="flex gap-2">
              <Input readOnly value={setting?.webhook_verification_token || ""} className="bg-gray-50/50 border-gray-200 text-gray-600 dark:border-(--card-border-color) h-11 focus-visible:outline-none focus-visible:ring-0" />
              <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 border-gray-200 text-gray-400 hover:text-gray-900" onClick={() => copyToClipboard(setting?.webhook_verification_token || "Verification token", "Verification token")}>
                <Copy size={18} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfiguration;
