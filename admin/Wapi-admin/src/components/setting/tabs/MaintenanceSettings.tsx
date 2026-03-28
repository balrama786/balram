"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField } from "@/src/redux/reducers/settingsSlice";
import { usePendingFiles } from "../shared/SettingsFilesContext";
import SettingCard from "../shared/SettingCard";
import SettingToggle from "../shared/SettingToggle";
import ImageUrlField from "../shared/ImageUrlField";
import SimpleTagInput from "../shared/SimpleTagInput";

const MaintenanceSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);
  const pendingFiles = usePendingFiles();

  const onChange = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    dispatch(updateSettingField({ key, value }));
  };

  const onFileChange = (fieldKey: keyof AppSettings, file: File | null) => {
    if (file) {
      pendingFiles.current.set(fieldKey as string, file);
    } else {
      pendingFiles.current.delete(fieldKey as string);
    }
  };

  return (
    <div className="space-y-5">
      <SettingCard title="Maintenance Mode" description="Put the application in maintenance mode.">
        <SettingToggle
          label="Enable Maintenance Mode"
          description="When enabled, users will see the maintenance page."
          checked={settings.maintenance_mode ?? false}
          onCheckedChange={(v) => onChange("maintenance_mode", v)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Title</Label>
            <Input
              value={settings.maintenance_title ?? ""}
              onChange={(e) => onChange("maintenance_title", e.target.value)}
              placeholder="Under Maintenance"
              className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3"
            />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Message</Label>
            <Textarea
              value={settings.maintenance_message ?? ""}
              onChange={(e) => onChange("maintenance_message", e.target.value)}
              placeholder="We are performing some maintenance. Please check back later."
              rows={3}
              className="bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 resize-none"
            />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allowed IPs (during maintenance)</Label>
            <SimpleTagInput
              value={Array.isArray(settings.maintenance_allowed_ips) ? settings.maintenance_allowed_ips : []}
              onChange={(ips) => onChange("maintenance_allowed_ips", ips)}
              placeholder="e.g. 192.168.1.1"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">IPs that can bypass maintenance mode and access the application.</p>
          </div>
        </div>
        <div className="pt-2">
          <ImageUrlField
            label="Maintenance Page Image"
            value={settings.maintenance_image_url ?? ""}
            onChange={(v) => onChange("maintenance_image_url", v)}
            onFileChange={(file) => onFileChange("maintenance_image_url", file)}
          />
        </div>
      </SettingCard>

      <SettingCard title="Error Pages" description="Customize the 404 and no-internet error pages.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">404 Page Title</Label>
            <Input
              value={settings.page_404_title ?? ""}
              onChange={(e) => onChange("page_404_title", e.target.value)}
              placeholder="Page Not Found"
              className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3"
            />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">404 Page Content</Label>
            <Input
              value={settings.page_404_content ?? ""}
              onChange={(e) => onChange("page_404_content", e.target.value)}
              placeholder="The page you are looking for does not exist."
              className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3"
            />
          </div>
        </div>
        <div className="pt-2">
          <ImageUrlField
            label="404 Page Image"
            value={settings.page_404_image_url ?? ""}
            onChange={(v) => onChange("page_404_image_url", v)}
            onFileChange={(file) => onFileChange("page_404_image_url", file)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">No Internet Title</Label>
            <Input
              value={settings.no_internet_title ?? ""}
              onChange={(e) => onChange("no_internet_title", e.target.value)}
              placeholder="No Internet Connection"
              className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3"
            />
          </div>
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">No Internet Content</Label>
            <Input
              value={settings.no_internet_content ?? ""}
              onChange={(e) => onChange("no_internet_content", e.target.value)}
              placeholder="Please check your internet connection and try again."
              className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3"
            />
          </div>
        </div>
        <div className="pt-2">
          <ImageUrlField
            label="No Internet Page Image"
            value={settings.no_internet_image_url ?? ""}
            onChange={(v) => onChange("no_internet_image_url", v)}
            onFileChange={(file) => onFileChange("no_internet_image_url", file)}
          />
        </div>
      </SettingCard>
    </div>
  );
};

export default MaintenanceSettings;
