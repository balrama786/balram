/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useRegisterMutation } from "@/src/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setAuthRedirectField } from "@/src/redux/reducers/authSlice";
import { registerSchema } from "@/src/utils/validationSchema";
import { Label } from "@radix-ui/react-label";
import { useFormik } from "formik";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, MapPin, Phone, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { COUNTRIES } from "../../constants/countries";
import { CountrySelect } from "../shared/CountrySelect";
import { DynamicLogo } from "./common/DynamicLogo";

export const RegisterPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const { allow_user_signup } = useAppSelector((state) => state.setting);
  console.log("🚀 ~ RegisterPage ~ allow_user_signup:", allow_user_signup)

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = COUNTRIES.find((c) => c.name === countryName);
    formik.setFieldValue("country", countryName);
    formik.setFieldValue("countryCode", selectedCountry?.dial_code || "");
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      countryCode: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          country: values.country,
          countryCode: values.countryCode,
          password: values.password,
        };

        const response = await register(payload).unwrap();

        if (response.success) {
          toast.success(t("auth.registration_success"));
          router.push(ROUTES.Login);
          dispatch(setAuthRedirectField(values.email));
        }
      } catch (error: any) {
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else if (error?.message) {
          toast.error(error.message);
        } else if (error?.error) {
          toast.error(error.error);
        } else {
          toast.error(t("auth.registration_failed"));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const onNavigateToLogin = () => {
    router.push(ROUTES.Login);
  };

  const benefits = [t("auth.benefit_1"), t("auth.benefit_2"), t("auth.benefit_3"), t("auth.benefit_4"), t("auth.benefit_5"), t("auth.benefit_6")];

  if (!allow_user_signup) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-100 via-white-50 to-emerald-50 dark:bg-(--page-body-bg)">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-emerald-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-semibold text-2xl">Registration Disabled</h1>
          <p className="w-[60%] text-slate-700 py-2 mb-3 text-center">New account registration is currently disabled. Please contact your administrator to get access.</p>
          <Button color="primary" className="px-5 rounded-md" onClick={() => router.push(ROUTES.Login)}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-0 items-stretch">
          {/* Left Side - Benefits & CTA (2 columns) */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-l-3xl relative overflow-hidden lg:col-span-2">
            {/* Geometric Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full -ml-40 -mb-40"></div>
            <div className="absolute top-1/3 right-8 w-1 h-40 bg-emerald-500/20 rotate-12"></div>
            <div className="absolute bottom-1/3 left-8 w-1 h-32 bg-emerald-500/20 -rotate-12"></div>

            <div className="relative z-10 space-y-10">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <DynamicLogo />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200 text-sm font-medium">{t("auth.start_free_trial")}</span>
                </div>
                <h2 className="text-3xl text-white leading-tight mb-4">
                  {t("auth.join_businesses_header")}
                  <br />
                  <span className="text-emerald-300">{t("auth.growing_with_us")}</span>
                </h2>
                <p className="text-slate-300 text-base">{t("auth.register_description_long")}</p>
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-200">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl text-white font-bold">99.9%</p>
                <p className="text-slate-400 text-sm">{t("auth.uptime_label")}</p>
              </div>
              <div>
                <p className="text-3xl text-white font-bold">10K+</p>
                <p className="text-slate-400 text-sm">{t("auth.users_label")}</p>
              </div>
              <div>
                <p className="text-3xl text-white font-bold">24/7</p>
                <p className="text-slate-400 text-sm">{t("auth.support_label")}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form (3 columns) */}
          <div className="bg-white lg:rounded-r-3xl shadow-2xl p-8 lg:p-10 flex flex-col justify-center relative lg:col-span-3 min-h-200">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-emerald-100 to-blue-100 opacity-40 rounded-bl-[100px]"></div>

            <div className="relative z-10 max-w-2xl mx-auto w-full">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo width={140} height={40} className="h-10 w-auto object-contain" skeletonClassName="h-10 w-32" />
              </div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl text-slate-900 mb-2">{t("auth.register_title")}</h2>
                <p className="text-slate-600">{t("auth.register_subtitle")}</p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                      {t("auth.full_name")}
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <Input id="fullName" name="fullName" placeholder={t("auth.full_name_placeholder")} value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 h-11 border border-(--input-border-color) focus:border-primary rounded-lg" />
                    </div>
                    {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-xs mt-1">{formik.errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      {t("auth.email_address")}
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <Input id="email" name="email" type="email" placeholder={t("auth.email_placeholder")} value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 h-11 border border-(--input-border-color) focus:border-primary rounded-lg" />
                    </div>
                    {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      {t("auth.phone_number")}
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <Input id="phone" name="phone" type="number" placeholder={t("auth.phone_placeholder")} value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 h-12 border border-slate-200 focus:border-emerald-500 rounded-lg" />
                    </div>
                    {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>}
                  </div>

                  {/* Country */}
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="country" className="text-sm font-medium text-slate-700">
                      {t("auth.country_name")}
                    </Label>
                    <div className="flex gap-2">
                      <CountrySelect id="country" name="country" placeholder={t("auth.country_placeholder")} value={formik.values.country} onChange={handleCountryChange} onBlur={formik.handleBlur} error={formik.errors.country} touched={formik.touched.country} icon={<MapPin className="w-5 h-5" />} className="flex-1" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      {t("auth.password")}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={t("auth.password_placeholder")} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-12 border border-slate-200 focus:border-emerald-500 rounded-lg" />
                      <Button onClick={() => setShowPassword(!showPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                    {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                      {t("auth.confirm_password")}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder={t("auth.confirm_password_placeholder")} value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-12 border border-slate-200 focus:border-emerald-500 rounded-lg" />
                      <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full h-13 mt-4 bg-primary text-white rounded-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all text-base font-semibold group" disabled={isLoading || formik.isSubmitting}>
                  {isLoading || formik.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
                      {t("auth.creating_account")}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {t("auth.create_account_button")}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                {false && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">{t("auth.or_register_with")}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg" disabled={isLoading || formik.isSubmitting}>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t("auth.google")}
                      </Button>
                      <Button type="button" variant="outline" className="h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg" disabled={isLoading || formik.isSubmitting}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        {t("auth.github")}
                      </Button>
                    </div>
                  </>
                )}
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  {t("auth.already_have_account")}{" "}
                  <Button onClick={onNavigateToLogin} className="bg-transparent hover:bg-gray-100 px-2 font-semibold text-primary hover:text-emerald-700 transition-colors">
                    {t("auth.sign_in_here")}
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
