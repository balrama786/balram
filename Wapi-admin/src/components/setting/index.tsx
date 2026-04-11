/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/src/redux/api/settingApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { resetDirty, setSettings } from "@/src/redux/reducers/settingsSlice";
import CommonHeader from "@/src/shared/CommonHeader";
import { BarChart2, Globe, Mail, MessageSquare, Palette, RefreshCw, Save, Wrench } from "lucide-react";
import Can from "../shared/Can";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { SettingsFilesProvider, usePendingFiles } from "./shared/SettingsFilesContext";
import BrandingSettings from "./tabs/BrandingSettings";
import EmailSettings from "./tabs/EmailSettings";
import GeneralSettings from "./tabs/GeneralSettings";
import LimitsSettings from "./tabs/LimitsSettings";
import MaintenanceSettings from "./tabs/MaintenanceSettings";
import WhatsAppSettings from "./tabs/WhatsAppSettings";

const tabs = [
  { id: "general", label: "General", icon: Globe, description: "App info & preferences" },
  { id: "branding", label: "Branding", icon: Palette, description: "Logos & icons" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, description: "API credentials" },
  { id: "email", label: "Email", icon: Mail, description: "SMTP configuration" },
  { id: "limits", label: "Limits", icon: BarChart2, description: "File & group limits" },
  { id: "maintenance", label: "Maintenance", icon: Wrench, description: "Maintenance & error pages" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// Inner component so it can access the context
const SettingInner = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pendingFiles = usePendingFiles();
  const { data, isLoading, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const settingsData = useAppSelector((state) => state.settings.data);
  const isDirty = useAppSelector((state) => state.settings.isDirty);
  const errors = useAppSelector((state) => state.settings.errors);
  const hasErrors = Object.keys(errors).length > 0;
  const [activeTab, setActiveTab] = useState<TabId>("general");

  useEffect(() => {
    if (data) {
      dispatch(setSettings(data));
    }
  }, [data, dispatch]);

  const handleSave = async () => {
    if (hasErrors) {
      toast.error(t("settings.fix_errors"));
      return;
    }
    try {
      const hasPendingFiles = pendingFiles.current.size > 0;

      // Identify changed fields by comparing with initial data
      const changedFields: Partial<typeof settingsData> = {};
      Object.entries(settingsData).forEach(([key, value]) => {
        const originalValue = (data as any)?.[key];
        const isFilePending = pendingFiles.current.has(key);

        // If the field has a pending file or the value has changed, include it
        if (isFilePending || JSON.stringify(value) !== JSON.stringify(originalValue)) {
          (changedFields as any)[key] = value;
        }
      });

      // If no fields changed and no files are pending, just reset and return
      if (Object.keys(changedFields).length === 0 && !hasPendingFiles) {
        dispatch(resetDirty());
        return;
      }

      let payload: FormData | Partial<typeof settingsData>;

      if (hasPendingFiles) {
        const formData = new FormData();

        Object.entries(changedFields).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean" || typeof value === "number") {
            formData.append(key, String(value));
          } else if (typeof value === "string") {
            if (!value.startsWith("blob:")) {
              formData.append(key, value);
            }
          }
        });

        pendingFiles.current.forEach((file, fieldKey) => {
          formData.append(fieldKey, file, file.name);
        });

        payload = formData;
      } else {
        payload = changedFields;
      }

      await updateSettings(payload).unwrap();
      pendingFiles.current.clear();
      dispatch(resetDirty());
      toast.success(t("settings.save_success"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("settings.save_error"));
    }
  };

  const handleRefresh = () => {
    refetch();
    pendingFiles.current.clear();
    toast.info(t("settings.refreshed"));
  };

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings isLoading={isUpdating} />;
      case "branding":
        return <BrandingSettings />;
      case "whatsapp":
        return <WhatsAppSettings />;
      case "email":
        return <EmailSettings />;
      case "limits":
        return <LimitsSettings isLoading={isUpdating} />;
      case "maintenance":
        return <MaintenanceSettings isLoading={isUpdating} />;
    }
  };

  const activeTabInfo = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader title={t("settings.title")} description={t("settings.description")} onRefresh={handleRefresh} isLoading={isLoading} />

      <div className="min-[1400px]:hidden mb-4 bg-white dark:bg-(--card-color) rounded-lg border border-gray-100 dark:border-(--card-border-color) shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${isActive ? "bg-(--text-green-primary)/10 text-(--text-green-primary)" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-(--table-hover) hover:text-gray-900 dark:hover:text-gray-100"}`}>
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-(--text-green-primary)/15 text-(--text-green-primary)" : "bg-gray-100 dark:bg-(--dark-body) text-gray-500 dark:text-white"}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{t(`settings.tabs.${id}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-w-0">
        <aside className="hidden min-[1400px]:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-35 bg-white dark:bg-(--card-color) rounded-xl border border-gray-100 dark:border-(--card-border-color) shadow-sm overflow-hidden">
            <div className="p-3 space-y-2.5">
              {tabs.map(({ id, label, icon: Icon, description }) => {
                const isActive = activeTab === id;
                return (
                  <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${isActive ? "bg-(--text-green-primary)/10 text-(--text-green-primary)" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-(--table-hover) hover:text-gray-900 dark:hover:text-gray-100"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-(--text-green-primary)/15 text-(--text-green-primary)" : "bg-gray-100 dark:bg-(--dark-body) text-gray-500 dark:text-white group-hover:bg-gray-200 dark:group-hover:bg-(--card-color)"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-(--text-green-primary)" : ""}`}>{t(`settings.tabs.${id}`)}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{t(`settings.tabs.${id}_desc`)}</p>
                    </div>
                    {isActive && <div className="w-1 h-4 rounded-full bg-(--text-green-primary) shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Content Header */}
          <div className="flex flex-wrap gap-2 items-center justify-between mb-5 bg-white dark:bg-(--card-color) p-4 sm:p-5 rounded-lg shadow-sm dark:border dark:border-(--card-border-color)">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center shrink-0">
                <activeTabInfo.icon className="w-4 h-4 sm:w-5 sm:h-5 text-(--text-green-primary)" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">{t(`settings.tabs.${activeTab}`)}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(`settings.tabs.${activeTab}_desc`)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isDirty && <span className="text-xs text-amber-500 dark:text-amber-400 font-medium px-2 py-1.5 bg-amber-50 dark:bg-transparent rounded-lg border border-amber-200 dark:border-amber-600">{t("settings.unsaved_changes")}</span>}
              <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 px-3 sm:px-4 gap-1.5 border-(--input-border-color) dark:border-none dark:bg-page-body text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-(--table-hover)">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline text-sm">{t("common.refresh")}</span>
              </Button>
              <Can permission="update.settings">
                <Button size="sm" onClick={handleSave} disabled={isUpdating || hasErrors} className="h-9 px-3 sm:px-4 gap-1.5 bg-primary rounded-lg hover:bg-primary/90 text-white shadow-sm shadow-primary/20">
                  {isUpdating ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span className="text-sm">{isUpdating ? t("common.saving") : t("common.save_changes")}</span>
                </Button>
              </Can>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-white dark:bg-(--card-color) rounded-xl border border-gray-100 dark:border-(--card-border-color)">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-200 dark:border-zinc-700 border-t-(--text-green-primary) rounded-full animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.loading")}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">{renderTab()}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Outer wrapper provides the files context
const Setting = () => (
  <SettingsFilesProvider>
    <SettingInner />
  </SettingsFilesProvider>
);

export default Setting;
