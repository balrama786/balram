/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Button } from "@/src/elements/ui/button";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { AppSettings } from "@/src/redux/api/settingApi";
import { updateSettingField, updateSettingError } from "@/src/redux/reducers/settingsSlice";
import SettingCard from "../shared/SettingCard";
import TestMailModal from "../modals/TestMailModal";
import { Mail } from "lucide-react";

const EmailSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.data);
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const validationSchema = yup.object().shape({
    smtp_port: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).typeError("Must be a number").min(1, "Invalid port").max(65535, "Invalid port").required("Required"),
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
      dispatch(updateSettingError({ key: "smtp_port", error: null }));
    };
  }, []);

  return (
    <div className="space-y-5">
      <SettingCard
        title="SMTP Configuration"
        description="Configure outgoing email via SMTP."
        rightElement={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsTestModalOpen(true)} className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 dark:bg-(--dark-body) hover:text-primary transition-all duration-200">
              <Mail className="w-4 h-4" />
              Test Configuration
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Host</Label>
            <Input value={settings.smtp_host ?? ""} onChange={(e) => onChange("smtp_host", e.target.value)} placeholder="smtp.gmail.com" className="h-10 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Port</Label>
            <Input
              type="number"
              value={settings.smtp_port ?? ""}
              onChange={(e) => onChange("smtp_port", e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="587"
              className={`h-10 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3 ${
                errors.smtp_port ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.smtp_port && <p className="text-xs text-red-500 font-medium">{errors.smtp_port}</p>}
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Username</Label>
            <Input value={settings.smtp_user ?? ""} onChange={(e) => onChange("smtp_user", e.target.value)} placeholder="your@email.com" className="h-10 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Password</Label>
            <Input type="password" value={settings.smtp_pass ?? ""} onChange={(e) => onChange("smtp_pass", e.target.value)} placeholder="••••••••" className="h-10 bg-(--input-color) dark:bg-page-body border-(--input-border-color) p-3" />
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Sender Details" description="Set the name and email address shown to recipients.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Name</Label>
            <Input value={settings.mail_from_name ?? ""} onChange={(e) => onChange("mail_from_name", e.target.value)} placeholder="My Application" className="h-11 p-3 bg-(--input-color) dark:bg-page-body border-(--input-border-color)" />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Email</Label>
            <Input value={settings.mail_from_email ?? ""} onChange={(e) => onChange("mail_from_email", e.target.value)} placeholder="noreply@example.com" className="h-11 p-3 bg-(--input-color) dark:bg-page-body border-(--input-border-color)" />
          </div>
        </div>
      </SettingCard>

      <TestMailModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} smtpSettings={settings} />
    </div>
  );
};

export default EmailSettings;
