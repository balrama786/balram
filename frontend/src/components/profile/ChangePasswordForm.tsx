"use client";

import { Button } from "@/src/elements/ui/button";
import { ChangePasswordPayload } from "@/src/types/auth";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { useChangePasswordMutation } from "@/src/redux/api/authApi";
import { useFormik } from "formik";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as Yup from "yup";

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const validationSchema = Yup.object({
    current_password: Yup.string().required(t("common.required")),
    new_password: Yup.string().min(8, t("auth.password_min_length")).required(t("common.required")),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], t("auth.passwords_must_match"))
      .required(t("common.required")),
  });

  const formik = useFormik<ChangePasswordPayload & { confirm_password: string }>({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword({
          current_password: values.current_password,
          new_password: values.new_password,
        }).unwrap();
        toast.success(t("profile.password_change_success"));
        resetForm();
      } catch (error: unknown) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || t("profile.password_change_failed"));
      }
    },
  });

  return (
    <Card className="border-gray-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          {t("profile.change_password")}
        </CardTitle>
        <CardDescription>{t("profile.change_password_desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current_password">{t("profile.current_password")}</Label>
              <div className="relative group">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input id="current_password" type={showCurrentPassword ? "text" : "password"} placeholder={t("profile.current_password_placeholder")} className="pl-10 py-5.5 pr-10 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-primary" {...formik.getFieldProps("current_password")} />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.current_password && formik.errors.current_password && <p className="text-red-500 text-xs">{formik.errors.current_password}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new_password">{t("profile.new_password")}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input id="new_password" type={showNewPassword ? "text" : "password"} placeholder={t("profile.new_password_placeholder")} className="pl-10 py-5.5 pr-10 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-primary" {...formik.getFieldProps("new_password")} />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.new_password && formik.errors.new_password && <p className="text-red-500 text-xs">{formik.errors.new_password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm_password">{t("auth.confirm_password")}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input id="confirm_password" type={showConfirmPassword ? "text" : "password"} placeholder={t("auth.confirm_password_placeholder")} className="pl-10 py-5.5 pr-10 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-primary" {...formik.getFieldProps("confirm_password")} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.confirm_password && formik.errors.confirm_password && <p className="text-red-500 text-xs">{formik.errors.confirm_password}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading || !formik.dirty} className="bg-primary hover:bg-emerald-600 text-white px-8 h-11 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {t("profile.update_password")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
