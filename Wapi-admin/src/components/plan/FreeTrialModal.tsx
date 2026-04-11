"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as yup from "yup";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/src/redux/api/settingApi";
import FormDialog from "@/src/shared/FormDialog";
import SettingToggle from "../setting/shared/SettingToggle";

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FreeTrialModal = ({ isOpen, onClose }: FreeTrialModalProps) => {
  const { t } = useTranslation();
  const { data: settings, isFetching } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    free_trial_enabled: false,
    free_trial_days: 1,
  });

  const [errors, setErrors] = useState<{ free_trial_days?: string }>({});

  useEffect(() => {
    if (settings && isOpen) {
      setFormData({
        free_trial_enabled: settings.free_trial_enabled ?? false,
        free_trial_days: settings.free_trial_days ?? 1,
      });
    }
  }, [settings, isOpen]);

  const validationSchema = yup.object().shape({
    free_trial_days: yup
      .number()
      .typeError("Must be a number")
      .min(1, "Min 1 day")
      .max(364, "Max 364 days")
      .required("Required"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.free_trial_enabled) {
        await validationSchema.validate({ free_trial_days: formData.free_trial_days });
      }
      setErrors({});
      
      await updateSettings(formData).unwrap();
      toast.success(t("settings.save_success"));
      onClose();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        setErrors({ free_trial_days: err.message });
      } else {
        toast.error(err?.data?.message || t("settings.save_error"));
      }
    }
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Free Trial Settings"
      isLoading={isUpdating || isFetching}
      submitLabel={t("common.save_changes")}
    >
      <div className="space-y-6">
        <SettingToggle
          label="Enable Free Trial"
          description="Allow new users to start with a free trial."
          checked={formData.free_trial_enabled}
          onCheckedChange={(v) => setFormData((prev) => ({ ...prev, free_trial_enabled: v }))}
        />

        {formData.free_trial_enabled && (
          <div className="space-y-2 flex flex-col dark:border-(--card-border-color)">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Free Trial Duration (days)
            </Label>
            <Input
              type="number"
              value={formData.free_trial_days || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  free_trial_days: e.target.value === "" ? 0 : Number(e.target.value),
                }))
              }
              min={1}
              className={`flex-1 h-11 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 ${
                errors.free_trial_days ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.free_trial_days && (
              <p className="text-xs text-red-500 font-medium">{errors.free_trial_days}</p>
            )}
          </div>
        )}
      </div>
    </FormDialog>
  );
};

export default FreeTrialModal;
