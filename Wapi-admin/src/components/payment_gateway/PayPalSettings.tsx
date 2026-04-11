/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetPayPalSettingsQuery, useUpdatePayPalSettingsMutation } from "@/src/redux/api/paymentGatewayApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import Can from "../shared/Can";
import { usePermissions } from "@/src/hooks/usePermissions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";

const PayPalSettings = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { data, isLoading } = useGetPayPalSettingsQuery();
  const [updatePayPalSettings, { isLoading: isUpdating }] = useUpdatePayPalSettingsMutation();

  const PayPalData = data?.data;

  const [settings, setSettings] = useState({
    is_paypal_active: false,
    paypal_client_id: "",
    paypal_secret_key: "",
    paypal_mode: "sandbox" as "sandbox" | "live",
  });

  const [showSk, setShowSk] = useState(false);

  useEffect(() => {
    if (PayPalData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings({
        is_paypal_active: PayPalData.is_paypal_active || false,
        paypal_client_id: PayPalData.paypal_client_id || "",
        paypal_secret_key: PayPalData.paypal_secret_key_set ? "" : PayPalData.paypal_secret_key || "",
        paypal_mode: (PayPalData.paypal_mode as "sandbox" | "live") || "sandbox",
      });
    }
  }, [PayPalData]);

  const handleToggle = async (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, is_paypal_active: enabled }));
    try {
      // Send only is_paypal_active for toggle
      await updatePayPalSettings({ is_paypal_active: enabled } as any).unwrap();
      toast.success(enabled ? t("gateway.paypal_enabled") : t("gateway.paypal_disabled"));
    } catch (error: any) {
      toast.error(error?.data?.message || (enabled ? t("gateway.paypal_enable_error") : t("gateway.paypal_disable_error")));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      const payload: any = {};

      if (settings.is_paypal_active !== PayPalData?.is_paypal_active) {
        payload.is_paypal_active = settings.is_paypal_active;
      }

      if (settings.paypal_client_id !== PayPalData?.paypal_client_id && !settings.paypal_client_id.includes("****")) {
        payload.paypal_client_id = settings.paypal_client_id;
      }

      if (settings.paypal_secret_key !== (PayPalData as any)?.paypal_secret_key && settings.paypal_secret_key !== "" && !settings.paypal_secret_key.includes("****")) {
        payload.paypal_secret_key = settings.paypal_secret_key;
      }

      if (settings.paypal_mode !== (PayPalData as any)?.paypal_mode) {
        payload.paypal_mode = settings.paypal_mode;
      }

      if (Object.keys(payload).length === 0) {
        toast.info(t("common.no_changes"));
        return;
      }

      await updatePayPalSettings(payload).unwrap();
      toast.success(t("gateway.paypal_updated"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("gateway.paypal_update_error"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
          <span className="text-sm">{t("settings.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Client ID <span className="text-red-400">*</span>
          </label>
          <Input value={settings.paypal_client_id} onChange={(e) => handleInputChange("paypal_client_id", e.target.value)} placeholder="Enter PayPal Client ID" className="h-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Secret Key <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Input value={settings.paypal_secret_key} onChange={(e) => handleInputChange("paypal_secret_key", e.target.value)} type={showSk ? "text" : "password"} placeholder="Enter PayPal Secret Key" className="h-10 pr-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
            <button type="button" tabIndex={-1} onClick={() => setShowSk(!showSk)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showSk ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Environment Mode <span className="text-red-400">*</span>
        </label>
        <Select value={settings.paypal_mode} onValueChange={(val) => handleInputChange("paypal_mode", val)}>
          <SelectTrigger className="h-10 bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus:ring-1 focus:ring-(--text-green-primary)">
            <SelectValue placeholder="Select Environment" />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--card-color) dark:border-(--card-border-color)">
            <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
            <SelectItem value="live">Live (Production)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start justify-between py-4 px-5 border border-(--input-border-color) dark:bg-page-body dark:border-none rounded-lg bg-slate-50/50">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("gateway.enable_gateway")}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t("gateway.enable_gateway_desc")}</p>
        </div>
        <div className="relative flex items-center shrink-0 ml-4">
          <input id="paypal-enable" type="checkbox" checked={settings.is_paypal_active} onChange={(e) => handleToggle(e.target.checked)} disabled={!hasPermission("update.payment_gateways")} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-(--text-green-primary) cursor-pointer disabled:cursor-not-allowed" />
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 px-5 py-4 space-y-2">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 22" className="w-6 h-4 shrink-0" fill="none">
            <rect width="32" height="22" rx="3" fill="#003087" />
            <path d="M11 7h4c2 0 3.5.5 3.5 2.5S17 12 15 12h-2l-.5 2.5H10L11 7z" fill="#009cde" />
            <path d="M13 9h4c2 0 3.5.5 3.5 2.5S19 14 17 14h-2l-.5 2.5H12L13 9z" fill="#fff" transform="translate(2, 1)" />
            <text x="4" y="15" fontSize="7" fontWeight="bold" fill="white" fontFamily="sans-serif">
              PayPal
            </text>
          </svg>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">PayPal Configuration</p>
        </div>
        <p className="text-xs text-blue-600/80 dark:text-blue-400/70">Get your PayPal credentials from the PayPal Developer Dashboard. You&apos;ll need to create a REST API app to get these keys.</p>
        <ul className="space-y-0.5">
          <li className="text-xs text-slate-600 dark:text-slate-400">
            • Use <span className="font-semibold">Sandbox</span> mode for testing transactions without real money.
          </li>
          <li className="text-xs text-slate-600 dark:text-slate-400">
            • Switch to <span className="font-semibold">Live</span> mode when you are ready to accept real payments.
          </li>
        </ul>
        <a href="https://developer.paypal.com/dashboard/applications" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline mt-1">
          Get PayPal API Keys <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex justify-end">
        <Can permission="update.payment_gateways">
          <Button onClick={handleUpdate} disabled={isUpdating} className="h-9 px-7 bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-60">
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.saving")}
              </span>
            ) : (
              t("common.save_changes")
            )}
          </Button>
        </Can>
      </div>
    </div>
  );
};

export default PayPalSettings;
