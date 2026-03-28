"use client";

import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField } from "@/src/redux/reducers/settingsSlice";
import { usePendingFiles } from "../shared/SettingsFilesContext";
import SettingCard from "../shared/SettingCard";
import ImageUrlField from "../shared/ImageUrlField";

const logoFields: { key: keyof AppSettings; label: string }[] = [
  { key: "favicon_url", label: "Favicon" },
  { key: "logo_light_url", label: "Logo (Light Mode)" },
  { key: "logo_dark_url", label: "Logo (Dark Mode)" },
  { key: "sidebar_light_logo_url", label: "Sidebar Favicon (Light)" },
  { key: "sidebar_dark_logo_url", label: "Sidebar Favicon (Dark)" },
];

const BrandingSettings = () => {
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
      <SettingCard title="Logos & Icons" description="Set URLs or upload images for your application logos and icons.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logoFields.map(({ key, label }) => (
            <ImageUrlField key={key} label={label} value={(settings[key] as string) ?? ""} onChange={(v) => onChange(key, v)} onFileChange={(file) => onFileChange(key, file)} />
          ))}
        </div>
      </SettingCard>
    </div>
  );
};

export default BrandingSettings;
