"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { Webhook, WebhookModalProps } from "@/src/types/webhook";
import { useState } from "react";

const WebhookModal = ({ isOpen, onClose, onSubmit, webhook, isLoading }: WebhookModalProps) => {
  const [formData, setFormData] = useState<Partial<Webhook>>({
    webhook_name: "",
    config: {
      is_active: true,
      require_auth: false,
    },
  });

  const [prevWebhook, setPrevWebhook] = useState<Webhook | undefined>(webhook);

  if (webhook !== prevWebhook) {
    setPrevWebhook(webhook);
    setFormData(
      webhook
        ? {
            webhook_name: webhook.webhook_name || "",
            config: {
              is_active: webhook.config?.is_active ?? true,
              require_auth: webhook.config?.require_auth ?? false,
            },
          }
        : {
            webhook_name: "",
            config: {
              is_active: true,
              require_auth: false,
            },
          }
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 dark:bg-(--card-color)">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{webhook ? "Edit Webhook" : "Create Webhook"}</DialogTitle>
            <DialogDescription>{webhook ? "Updating existing webhook details." : "Add a new webhook to receive ecommerce events."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Webhook Name</Label>
              <Input id="name" placeholder="Enter webhook name" value={formData.webhook_name || ""} onChange={(e) => setFormData({ ...formData, webhook_name: e.target.value })} required />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 dark:bg-(--dark-body) dark:border-none">
              <div className="space-y-0.5">
                <Label className="text-base">Require Auth</Label>
                <div className="text-sm text-slate-500 dark:text-gray-400">Enable authentication for this webhook.</div>
              </div>
              <Switch
                checked={formData.config?.require_auth || false}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    config: {
                      is_active: formData.config?.is_active ?? true,
                      require_auth: checked,
                    },
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="dark:bg-(--page-body-bg) dark:border-none" type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="dark:text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : webhook ? "Update Webhook" : "Create Webhook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookModal;
