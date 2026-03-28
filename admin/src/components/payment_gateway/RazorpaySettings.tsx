/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetRazorpaySettingsQuery, useUpdateRazorpaySettingsMutation } from "@/src/redux/api/paymentGatewayApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const RazorpaySettings = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRazorpaySettingsQuery();
  const [updateRazorpaySettings, { isLoading: isUpdating }] = useUpdateRazorpaySettingsMutation();

  const RazorpayData = data?.data;

  const [settings, setSettings] = useState({
    is_razorpay_active: false,
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_webhook_secret: "",
  });

  const [showSecret, setShowSecret] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  useEffect(() => {
    if (RazorpayData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings({
        is_razorpay_active: RazorpayData.is_razorpay_active || false,
        razorpay_key_id: RazorpayData.razorpay_key_id || "",
        razorpay_key_secret: RazorpayData.razorpay_key_secret_set || "",
        razorpay_webhook_secret: RazorpayData.razorpay_webhook_secret_set || "",
      });
    }
  }, [RazorpayData]);

  const handleToggle = async (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, is_razorpay_active: enabled }));
    try {
      await updateRazorpaySettings({ ...settings, is_razorpay_active: enabled }).unwrap();
      toast.success(enabled ? t("gateway.razorpay_enabled") : t("gateway.razorpay_disabled"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || (enabled ? t("gateway.razorpay_enable_error") : t("gateway.razorpay_disable_error")));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateRazorpaySettings(settings).unwrap();
      toast.success(t("gateway.razorpay_updated"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("gateway.razorpay_update_error"));
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
        {/* Key ID */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Key ID <span className="text-red-400">*</span>
          </label>
          <Input value={settings.razorpay_key_id} onChange={(e) => handleInputChange("razorpay_key_id", e.target.value)} placeholder="rzp_test_..." className="h-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
        </div>

        {/* Key Secret */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Key Secret <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Input value={settings.razorpay_key_secret} onChange={(e) => handleInputChange("razorpay_key_secret", e.target.value)} type={showSecret ? "text" : "password"} placeholder="Enter Key Secret" className="h-10 pr-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
            <button type="button" tabIndex={-1} onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Webhook Secret</label>
        <div className="relative max-w-full">
          <Input value={settings.razorpay_webhook_secret} onChange={(e) => handleInputChange("razorpay_webhook_secret", e.target.value)} type={showWebhook ? "text" : "password"} placeholder="Enter Webhook Secret" className="h-10 pr-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
          <button type="button" tabIndex={-1} onClick={() => setShowWebhook(!showWebhook)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {showWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">Used to validate incoming Razorpay webhook events</p>
      </div>

      <div className="flex items-start justify-between py-4 px-5 border border-(--input-border-color) dark:border-none rounded-lg bg-slate-50/50 dark:bg-page-body">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("gateway.enable_gateway")}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t("gateway.enable_gateway_desc")}</p>
        </div>
        <div className="relative flex items-center shrink-0 ml-4">
          <input id="razorpay-enable" type="checkbox" checked={settings.is_razorpay_active} onChange={(e) => handleToggle(e.target.checked)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-[var(--text-green-primary)] cursor-pointer" />
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 px-5 py-4 space-y-2 flex flex-col">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 52 22" className="w-10 h-4 shrink-0" fill="none">
            <rect width="52" height="22" rx="3" fill="#072654" />
            <text x="6" y="15" fontSize="9" fontWeight="bold" fill="#3395FF" fontFamily="sans-serif">
              Razorpay
            </text>
          </svg>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Razorpay Configuration</p>
        </div>
        <p className="text-xs text-blue-600/80 dark:text-blue-400/70">Get your Razorpay credentials from the Razorpay Dashboard. You&apos;ll need both Test and Live credentials.</p>
        <ul className="space-y-0.5">
          <li className="text-xs text-slate-600 dark:text-slate-400">
            • Test keys start with <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded text-[10px] font-mono">rzp_test_</code>
          </li>
          <li className="text-xs text-slate-600 dark:text-slate-400">
            • Live keys start with <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded text-[10px] font-mono">rzp_live_</code>
          </li>
        </ul>
        <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline mt-1">
          Get Razorpay API Keys <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex justify-end">
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
      </div>
    </div>
  );
};

export default RazorpaySettings;
