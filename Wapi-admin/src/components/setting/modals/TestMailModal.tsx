/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useTestMailMutation, AppSettings } from "@/src/redux/api/settingApi";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TestMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  smtpSettings: Partial<AppSettings>;
}

const TestMailModal = ({ isOpen, onClose, smtpSettings }: TestMailModalProps) => {
  const { t } = useTranslation();
  const [to, setTo] = useState("");
  const [testMail, { isLoading }] = useTestMailMutation();

  const handleSendTestMail = async () => {
    if (!to) {
      toast.error(t("settings.test_mail_recipient_required"));
      return;
    }

    try {
      const response = await testMail({
        to,
        smtp_host: smtpSettings.smtp_host || "",
        smtp_port: smtpSettings.smtp_port || 587,
        smtp_user: smtpSettings.smtp_user || "",
        smtp_pass: smtpSettings.smtp_pass || "",
        mail_from_name: smtpSettings.mail_from_name || "",
        mail_from_email: smtpSettings.mail_from_email || "",
      }).unwrap();

      if (response.success) {
        toast.success(response.message || t("settings.test_mail_success"));
        onClose();
        setTo("");
      } else {
        toast.error(response.message || t("settings.test_mail_failed"));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data?.message || error.message || t("settings.test_mail_error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {t("settings.test_mail_title")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.test_mail_desc")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-email">{t("settings.test_mail_recipient_label")}</Label>
            <Input id="to-email" type="email" placeholder="example@gmail.com" value={to} onChange={(e) => setTo(e.target.value)} className="h-10" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSendTestMail} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("settings.test_mail_sending")}
              </>
            ) : (
              t("settings.test_mail_send_btn")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestMailModal;
