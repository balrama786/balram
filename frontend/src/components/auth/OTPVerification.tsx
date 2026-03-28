/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { useResendOTPMutation, useVerifyOtpMutation } from "@/src/redux/api/authApi";
import { useAppSelector } from "@/src/redux/hooks";
import { OTPVerificationSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { ArrowLeft, Clock, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DynamicLogo } from "./common/DynamicLogo";

export const OTPVerificationPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { authRedirectField: email } = useAppSelector((state) => state.auth);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOTPMutation();

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.Login);
    }
  }, [email, router]);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OTPVerificationSchema,
    onSubmit: async (values) => {
      try {
        const response = await verifyOtp({
          email: email,
          otp: values.otp,
        }).unwrap();
        toast.success(response.message || t("auth.otp_verified_success"));
        router.push(ROUTES.ResetPassword);
      } catch (error: any) {
        toast.error(error?.data?.message || t("auth.otp_invalid"));
      }
    },
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Update formik value
    const otpString = newOtp.join("");
    formik.setFieldValue("otp", otpString);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Update formik value
    const otpString = newOtp.join("");
    formik.setFieldValue("otp", otpString);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp({ email }).unwrap();
      toast.success(response.message || t("auth.new_code_sent"));
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      formik.setFieldValue("otp", "");
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error?.data?.message || t("auth.resend_code_failed"));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-0 items-center">
          {/* Left Side - Visual & Info */}
          <div className="hidden lg:flex flex-col justify-center p-12 bg-linear-to-br from-emerald-600 to-teal-700 rounded-l-3xl relative overflow-hidden min-h-150">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>

            <div className="relative z-10 space-y-8">
              {/* Icon */}
              <div className="flex items-center gap-3 mb-6">
                <DynamicLogo />
              </div>

              <div>
                <h2 className="text-4xl text-white mb-4 leading-tight">{t("auth.verify_email_address_title")}</h2>
                <p className="text-emerald-100 text-lg">{t("auth.verification_code_sent_desc")}</p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{t("auth.check_inbox")}</p>
                      <p className="text-emerald-100 text-sm">
                        {t("auth.sent_code_to")} <span className="font-semibold">{email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{t("auth.valid_for_10_mins")}</p>
                      <p className="text-emerald-100 text-sm">{t("auth.code_expires_desc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="pt-4">
                <p className="text-emerald-200 text-sm font-medium mb-2">💡 {t("auth.didnt_receive_it_tip")}</p>
                <ul className="text-emerald-100 text-sm space-y-1">
                  <li>• {t("auth.check_spam_bullet")}</li>
                  <li>• {t("auth.ensure_email_correct", { email })}</li>
                  <li>• {t("auth.wait_and_request_bullet")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - OTP Form */}
          <div className="bg-white lg:rounded-r-3xl shadow-2xl p-8 lg:p-12 min-h-150 flex flex-col justify-center relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-100/50 to-teal-100/50 rounded-bl-full"></div>

            <div className="relative z-10 max-w-md mx-auto w-full">
              {/* Back Button */}
              <Button onClick={() => router.push(ROUTES.Login)} className="bg-transparent hover:bg-gray-100 flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">{t("auth.back_to_login")}</span>
              </Button>

              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo width={140} height={40} className="h-10 w-auto object-contain" skeletonClassName="h-10 w-32" />
              </div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl text-slate-900 font-bold mb-3">{t("auth.enter_verification_code")}</h2>
                <p className="text-slate-600">
                  {t("auth.code_sent_to")} <span className="font-semibold text-slate-900">{email}</span>
                </p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                {/* OTP Input */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-4">{t("auth.6_digit_code_label")}</label>
                  <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-16 text-center text-2xl font-bold border border-(--input-border-color) rounded-lg focus:border-primary focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    ))}
                  </div>
                  {formik.touched.otp && formik.errors.otp && <p className="text-sm text-red-500 mt-3 text-center">{formik.errors.otp}</p>}
                </div>

                {/* Timer & Resend */}
                <div className="mb-8">
                  {timer > 0 ? (
                    <div className="bg-slate-50 border border-(--input-border-color) rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <p className="text-sm">
                          {t("auth.resend_code_in")}{" "}
                          <span className="font-bold text-primary">
                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={handleResend} disabled={isResending} className="w-full h-14 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 text-center transition-colors disabled:opacity-50 group">
                      <div className="flex items-center justify-center gap-2 text-slate-700">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-sm font-medium">{isResending ? t("auth.sending_new_code") : t("auth.resend_verification_code")}</span>
                      </div>
                    </Button>
                  )}
                </div>

                {/* Verify Button */}
                <Button type="submit" className="w-full h-13 bg-primary text-white rounded-lg shadow-lg shadow-emerald-500/30 transition-all text-base font-semibold" disabled={isLoading || otp.some((d) => !d)}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("auth.verifying")}
                    </div>
                  ) : (
                    t("auth.verify_and_continue")
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <p className="text-center text-sm text-slate-500 mt-6">
                {t("auth.need_help_contact")}{" "}
                <a href="#" className="text-primary font-medium">
                  support@whatsappcrm.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
