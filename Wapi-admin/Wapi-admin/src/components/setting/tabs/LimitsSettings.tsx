/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField, updateSettingError } from "@/src/redux/reducers/settingsSlice";
import SettingCard from "../shared/SettingCard";
import TagInput from "../shared/TagInput";
import { useState, useEffect } from "react";
import SettingToggle from "../shared/SettingToggle";

const LimitsSettings = ({ isLoading }: { isLoading?: boolean }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});

  const validationSchema = yup.object().shape({
    document_file_limit: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError("Must be a number")
      .min(1, "Min 1 MB")
      .max(100, "Max 100 MB")
      .required("Required"),
    audio_file_limit: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError("Must be a number")
      .min(1, "Min 1 MB")
      .max(100, "Max 100 MB")
      .required("Required"),
    video_file_limit: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError("Must be a number")
      .min(1, "Min 1 MB")
      .max(1024, "Max 1024 MB")
      .required("Required"),
    image_file_limit: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError("Must be a number")
      .min(1, "Min 1 MB")
      .max(50, "Max 50 MB")
      .required("Required"),
    multiple_file_share_limit: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .typeError("Must be a number")
      .min(1, "Min 1")
      .max(50, "Max 50")
      .required("Required"),
  });

  const onChange = async (key: keyof AppSettings, value: any) => {
    dispatch(updateSettingField({ key, value }));

    try {
      const field = validationSchema.fields[key as keyof typeof validationSchema.fields];
      if (field) {
        await (field as yup.AnySchema).validate(value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
        dispatch(updateSettingError({ key, error: null }));
      }
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [key]: err.message }));
      dispatch(updateSettingError({ key, error: err.message }));
    }
  };

  // Clear component errors on unmount to not block other tabs
  useEffect(() => {
    return () => {
      fileLimits.forEach(({ key }) => {
        dispatch(updateSettingError({ key, error: null }));
      });
    };
  }, []);

  const fileLimits: { key: keyof AppSettings; label: string }[] = [
    { key: "document_file_limit", label: "Document Limit (MB)" },
    { key: "audio_file_limit", label: "Audio Limit (MB)" },
    { key: "video_file_limit", label: "Video Limit (MB)" },
    { key: "image_file_limit", label: "Image Limit (MB)" },
    { key: "multiple_file_share_limit", label: "Multi-file Share Limit" },
  ];

  return (
    <div className="space-y-5">
      <SettingCard title="Communication Features" description="Enable or disable communication capabilities.">
        <SettingToggle label="Media Sharing" description="Allow users to send media files." checked={settings.allow_media_send ?? true} onCheckedChange={(v) => onChange("allow_media_send", v)} disabled={isLoading} />
      </SettingCard>
      <SettingCard title="File Upload Limits" description="Set maximum file sizes for uploads (in MB).">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${!settings.allow_media_send ? "opacity-50 grayscale-50" : ""}`}>
          {fileLimits.map(({ key, label }) => (
            <div key={key} className="space-y-1.5 flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
              <Input type="number" disabled={!settings.allow_media_send || isLoading} value={(settings[key] as any) ?? ""} onChange={(e) => onChange(key, e.target.value === "" ? "" : Number(e.target.value))} min={1} className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 ${errors[key] ? "border-red-500 focus-visible:ring-red-500" : ""}`} />
              {errors[key] && <p className="text-xs text-red-500 font-medium">{errors[key]}</p>}
            </div>
          ))}
        </div>

        <div className={`space-y-1.5 flex flex-col pt-2 ${!settings.allow_media_send ? "opacity-50 grayscale-50" : ""}`}>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allowed File Upload Types</Label>
          <TagInput disabled={!settings.allow_media_send || isLoading} value={Array.isArray(settings.allowed_file_upload_types) ? settings.allowed_file_upload_types : []} onChange={(tags) => onChange("allowed_file_upload_types", tags)} />
        </div>
      </SettingCard>
    </div>
  );
};

export default LimitsSettings;
