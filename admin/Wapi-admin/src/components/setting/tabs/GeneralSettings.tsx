import * as yup from "yup";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField, updateSettingError } from "@/src/redux/reducers/settingsSlice";
import SettingCard from "../shared/SettingCard";
import SettingToggle from "../shared/SettingToggle";
import { useState, useEffect } from "react";

const GeneralSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});

  const validationSchema = yup.object().shape({
    session_expiration_days: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).typeError("Must be a number").min(1, "Min 1 day").required("Required"),
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
      dispatch(updateSettingError({ key: "session_expiration_days", error: null }));
    };
  }, []);

  return (
    <div className="space-y-5">
      <SettingCard title="Application Info" description="Basic information about your application.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">App Name</Label>
            <Input value={settings.app_name ?? ""} onChange={(e) => onChange("app_name", e.target.value)} placeholder="My Application" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">App Email</Label>
            <Input value={settings.app_email ?? ""} onChange={(e) => onChange("app_email", e.target.value)} placeholder="admin@example.com" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">App Description</Label>
            <Input value={settings.app_description ?? ""} onChange={(e) => onChange("app_description", e.target.value)} placeholder="A short description of your app" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</Label>
            <Input value={settings.support_email ?? ""} onChange={(e) => onChange("support_email", e.target.value)} placeholder="support@example.com" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Theme Mode</Label>
            <Select value={settings.default_theme_mode ?? "light"} onValueChange={(v) => onChange("default_theme_mode", v)}>
              <SelectTrigger className="h-11 bg-(--input-color) dark:border-none dark:focus:shadow-none dark:bg-page-body border-(--input-border-color) p-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color)">
                <SelectItem className="dark:hover:bg-(--table-hover)" value="light">Light</SelectItem>
                <SelectItem className="dark:hover:bg-(--table-hover)" value="dark">Dark</SelectItem>
                <SelectItem className="dark:hover:bg-(--table-hover)" value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Expiration (days)</Label>
            <Input
              type="number"
              value={settings.session_expiration_days ?? ""}
              onChange={(e) => onChange("session_expiration_days", e.target.value === "" ? "" : Number(e.target.value))}
              min={1}
              className={`h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 ${
                errors.session_expiration_days ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.session_expiration_days && <p className="text-xs text-red-500 font-medium">{errors.session_expiration_days}</p>}
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Preferences" description="Control application-wide behavior.">
        <div className="space-y-4">
          <SettingToggle label="Allow User Signup" description="Allow new users to register for an account." checked={settings.allow_user_signup ?? true} onCheckedChange={(v) => onChange("allow_user_signup", v)} />
          <SettingToggle label="Demo Mode" description="Enable demo mode to mask sensitive data and show demo credentials." checked={settings.is_demo_mode ?? false} onCheckedChange={(v) => onChange("is_demo_mode", v)} />
          
          {settings.is_demo_mode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t dark:border-(--card-border-color)">
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo User Email</Label>
                <Input value={settings.demo_user_email ?? ""} onChange={(e) => onChange("demo_user_email", e.target.value)} placeholder="john@example.com" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo User Password</Label>
                <Input value={settings.demo_user_password ?? ""} onChange={(e) => onChange("demo_user_password", e.target.value)} placeholder="123456789" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo Agent Email</Label>
                <Input value={settings.demo_agent_email ?? ""} onChange={(e) => onChange("demo_agent_email", e.target.value)} placeholder="jack@example.com" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Demo Agent Password</Label>
                <Input value={settings.demo_agent_password ?? ""} onChange={(e) => onChange("demo_agent_password", e.target.value)} placeholder="123456789" className="h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
              </div>
            </div>
          )}
        </div>
      </SettingCard>
    </div>
  );
};

export default GeneralSettings;
