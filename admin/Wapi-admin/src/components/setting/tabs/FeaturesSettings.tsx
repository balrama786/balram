import * as yup from "yup";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField, updateSettingError } from "@/src/redux/reducers/settingsSlice";
import SettingCard from "../shared/SettingCard";
import SettingToggle from "../shared/SettingToggle";
import { useState, useEffect } from "react";

const FeaturesSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});

  const validationSchema = yup.object().shape({
    free_trial_days: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).typeError("Must be a number").min(1, "Min 1 day").max(364, "Max 364 days").required("Required"),
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

  useEffect(() => {
    return () => {
      dispatch(updateSettingError({ key: "free_trial_days", error: null }));
    };
  }, []);

  return (
    <div className="space-y-5">
      <SettingCard title="Free Trial" description="Configure the free trial period for new users.">
        <SettingToggle label="Enable Free Trial" description="Allow new users to start with a free trial." checked={settings.free_trial_enabled ?? false} onCheckedChange={(v) => onChange("free_trial_enabled", v)} />
        {settings.free_trial_enabled && (
          <div className="space-y-1.5 flex flex-col pt-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Trial Duration (days)</Label>
            <Input
              type="number"
              value={settings.free_trial_days ?? ""}
              onChange={(e) => onChange("free_trial_days", e.target.value === "" ? "" : Number(e.target.value))}
              min={1}
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 max-w-xs ${
                errors.free_trial_days ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.free_trial_days && <p className="text-xs text-red-500 font-medium">{errors.free_trial_days}</p>}
          </div>
        )}
      </SettingCard>

      <SettingCard title="Communication Features" description="Enable or disable communication capabilities.">
        <SettingToggle label="Media Sharing" description="Allow users to send media files." checked={settings.allow_media_send ?? true} onCheckedChange={(v) => onChange("allow_media_send", v)} />
      </SettingCard>
    </div>
  );
};

export default FeaturesSettings;
