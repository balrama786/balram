/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetStripeSettingsQuery, useUpdateStripeSettingsMutation } from "@/src/redux/api/paymentGatewayApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import Can from "../shared/Can";
import { usePermissions } from "@/src/hooks/usePermissions";

const StripeSettings = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { data, isLoading } = useGetStripeSettingsQuery();
  const [updateStripeSettings, { isLoading: isUpdating }] = useUpdateStripeSettingsMutation();

  const StripeData = data?.data;

  const [settings, setSettings] = useState({
    is_stripe_active: false,
    stripe_publishable_key: "",
    stripe_secret_key: "",
  });

  const [showPk, setShowPk] = useState(false);
  const [showSk, setShowSk] = useState(false);

  useEffect(() => {
    if (StripeData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings({
        is_stripe_active: StripeData.is_stripe_active || false,
        stripe_publishable_key: StripeData.stripe_publishable_key || "",
        stripe_secret_key: StripeData.stripe_secret_key || "",
      });
    }
  }, [StripeData]);

  const handleToggle = async (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, is_stripe_active: enabled }));
    try {
      // Send only is_stripe_active for toggle
      await updateStripeSettings({ is_stripe_active: enabled } as any).unwrap();
      toast.success(enabled ? t("gateway.stripe_enabled") : t("gateway.stripe_disabled"));
    } catch (error: any) {
      toast.error(error?.data?.message || (enabled ? t("gateway.stripe_enable_error") : t("gateway.stripe_disable_error")));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      const payload: any = {};
      
      if (settings.is_stripe_active !== StripeData?.is_stripe_active) {
        payload.is_stripe_active = settings.is_stripe_active;
      }
      
      if (settings.stripe_publishable_key !== StripeData?.stripe_publishable_key && !settings.stripe_publishable_key.includes('****')) {
        payload.stripe_publishable_key = settings.stripe_publishable_key;
      }
      
      if (settings.stripe_secret_key !== StripeData?.stripe_secret_key && !settings.stripe_secret_key.includes('****')) {
        payload.stripe_secret_key = settings.stripe_secret_key;
      }

      if (Object.keys(payload).length === 0) {
        toast.info(t("common.no_changes"));
        return;
      }

      await updateStripeSettings(payload).unwrap();
      toast.success(t("gateway.stripe_updated"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("gateway.stripe_update_error"));
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
            Publishable Key <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Input value={settings.stripe_publishable_key} onChange={(e) => handleInputChange("stripe_publishable_key", e.target.value)} type={showPk ? "text" : "password"} placeholder="pk_test_..." className="h-10 pr-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
            <button type="button" tabIndex={-1} onClick={() => setShowPk(!showPk)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showPk ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Secret Key <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Input value={settings.stripe_secret_key} onChange={(e) => handleInputChange("stripe_secret_key", e.target.value)} type={showSk ? "text" : "password"} placeholder="sk_test_..." className="h-10 pr-10 font-mono text-sm bg-(--input-color) dark:bg-page-body border-(--input-border-color) dark:border-none focus-visible:ring-1 focus-visible:ring-(--text-green-primary)" />
            <button type="button" tabIndex={-1} onClick={() => setShowSk(!showSk)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {showSk ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between py-4 px-5 border border-(--input-border-color) dark:bg-page-body dark:border-none rounded-lg bg-slate-50/50">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("gateway.enable_gateway")}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t("gateway.enable_gateway_desc")}</p>
        </div>
        <div className="relative flex items-center shrink-0 ml-4">
          <input id="stripe-enable" type="checkbox" checked={settings.is_stripe_active} onChange={(e) => handleToggle(e.target.checked)} disabled={!hasPermission("update.payment_gateways")} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-(--text-green-primary) cursor-pointer disabled:cursor-not-allowed" />
        </div>
      </div>

      <div className="rounded-lg border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/20 px-5 py-4 space-y-2">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 22" className="w-6 h-4 shrink-0" fill="none">
            <rect width="32" height="22" rx="3" fill="#635BFF" />
            <text x="4" y="15" fontSize="9" fontWeight="bold" fill="white" fontFamily="sans-serif">
              stripe
            </text>
          </svg>
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Stripe Configuration</p>
        </div>
        <p className="text-xs text-indigo-600/80 dark:text-indigo-400/70">Get your Stripe credentials from the Stripe Dashboard. You&apos;ll need both Test and Live credentials.</p>
        <ul className="space-y-0.5">
          <li className="text-xs text-slate-600 dark:text-slate-400">
            • Test keys start with <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1 py-0.5 rounded text-[10px] font-mono">pk_test_</code> or <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1 py-0.5 rounded text-[10px] font-mono">sk_test_</code>
          </li>
          <li className="text-xs text-slate-600 dark:text-slate-400">
            • Live keys start with <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1 py-0.5 rounded text-[10px] font-mono">pk_live_</code> or <code className="bg-indigo-100 dark:bg-indigo-900/40 px-1 py-0.5 rounded text-[10px] font-mono">sk_live_</code>
          </li>
        </ul>
        <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-1">
          Get Stripe API Keys <ExternalLink className="w-3 h-3" />
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

export default StripeSettings;
