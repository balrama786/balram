"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField } from "@/src/redux/reducers/settingsSlice";
import SettingCard from "../shared/SettingCard";
import { ImageBaseUrl } from "@/src/constants";

const WhatsAppSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);

  const onChange = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    dispatch(updateSettingField({ key, value }));
  };

  return (
    <div className="space-y-5">
      <SettingCard title="WhatsApp API Credentials" description="Configure your Meta WhatsApp Business API credentials.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">App ID</Label>
            <Input value={settings.app_id ?? ""} onChange={(e) => onChange("app_id", e.target.value)} placeholder="Your Meta App ID" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">App Secret</Label>
            <Input type="password" value={settings.app_secret ?? ""} onChange={(e) => onChange("app_secret", e.target.value)} placeholder="Your Meta App Secret" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration ID</Label>
            <Input value={settings.configuration_id ?? ""} onChange={(e) => onChange("configuration_id", e.target.value)} placeholder="WhatsApp Configuration ID" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Webhook Verification Token</Label>
            <Input type="password" value={settings.webhook_verification_token ?? ""} onChange={(e) => onChange("webhook_verification_token", e.target.value)} placeholder="Webhook verification token" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Webhook URL</Label>
            <Input value={`${ImageBaseUrl ?? ""}${settings.whatsapp_webhook_url ?? ""}`} onChange={(e) => onChange("whatsapp_webhook_url", e.target.value)} placeholder="https://yourdomain.com/api/webhook/whatsapp" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" disabled />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default WhatsAppSettings;
