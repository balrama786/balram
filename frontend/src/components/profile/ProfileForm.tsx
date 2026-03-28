"use client";

import { COUNTRIES } from "@/src/constants/countries";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/src/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { updateUser } from "@/src/redux/reducers/authSlice";
import { UpdateProfilePayload } from "@/src/types/auth";
import { useFormik } from "formik";
import { Loader2, Mail, Notebook, Phone, Save, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { CountrySelect } from "../shared/CountrySelect";

const ProfileForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Use query with provides/invalidates for data loading
  const { data: profileData, isLoading: isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Sync profile data to Redux on fetch
  useEffect(() => {
    if (profileData?.user) {
      dispatch(updateUser(profileData.user));
    }
  }, [profileData, dispatch]);

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = COUNTRIES.find((c) => c.name === countryName);
    formik.setFieldValue("country", countryName);
    formik.setFieldValue("country_code", selectedCountry?.dial_code || "");
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("common.required")),
    email: Yup.string().email(t("auth.invalid_email")).required(t("common.required")),
    phone: Yup.string().required(t("common.required")),
    country: Yup.string().required(t("common.required")),
    country_code: Yup.string().required(t("common.required")),
    note: Yup.string(),
  });

  const formik = useFormik<UpdateProfilePayload>({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      country: user?.country || "",
      country_code: user?.country_code || "",
      note: user?.note || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateProfile(values).unwrap();
        // Mutation invalidates 'User' tag, which triggers re-fetch, 
        // but we can also update local state for immediate feedback
        dispatch(updateUser(values));
        toast.success(t("profile.update_success"));
      } catch (error: unknown) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || t("profile.update_failed"));
      }
    },
  });

  if (isFetching && !user) {
    return (
       <Card className="border-gray-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-slate-500">{t("common.loading")}</p>
        </CardContent>
       </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {t("profile.personal_information")}
        </CardTitle>
        <CardDescription>{t("profile.personal_information_desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="name">{t("auth.full_name")}</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input id="name" placeholder={t("auth.full_name_placeholder")} className="pl-10 py-5.5 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-primary" {...formik.getFieldProps("name")} />
              </div>
              {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs">{formik.errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="email">{t("auth.email_address")}</Label>
              <div className="relative group  cursor-disabled">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input id="email" type="email" disabled placeholder={t("auth.email_placeholder")} className="pl-10 py-5.5 bg-slate-50 dark:bg-(--dark-body) border-slate-200 text-slate-500 dark:text-slate-400" {...formik.getFieldProps("email")} />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="country">{t("auth.country_name")}</Label>
              <CountrySelect id="country" name="country" placeholder={t("auth.country_placeholder")} value={formik.values.country} onChange={handleCountryChange} onBlur={formik.handleBlur} error={formik.errors.country} touched={formik.touched.country} className="w-full" />
            </div>

            {/* Phone */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="phone">{t("auth.phone_number")}</Label>
              <div className="flex gap-2">
                <div className="w-20 shrink-0">
                  <Input value={formik.values.country_code} disabled placeholder="+1" className="p-5.5 bg-slate-50 dark:bg-(--dark-body) border-slate-200 text-center" />
                </div>
                <div className="relative flex-1 group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input id="phone" type="number" placeholder={t("auth.phone_placeholder")} className="pl-10 py-5.5 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-primary" {...formik.getFieldProps("phone")} />
                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-xs">{formik.errors.phone}</p>}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="note">{t("profile.note_label")}</Label>
            <div className="relative group">
              <Notebook className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Textarea id="note" placeholder={t("profile.note_placeholder")} className="pl-10 min-h-24 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-1 focus-visible:ring-primary" {...formik.getFieldProps("note")} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isUpdating || !formik.dirty} className="bg-primary hover:bg-primary text-white px-8 h-11 flex items-center gap-2">
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t("common.save_changes")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
