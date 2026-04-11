/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DynamicLogo } from "@/src/components/auth/common/DynamicLogo";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { useVerifyOtpMutation } from "@/src/redux/api/authApi";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const VerifyOtpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";
  const email = searchParams.get("email") || "";
  const identifier = mobile || email;
  const identifierType = mobile ? "mobile" : "email";

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!identifier) {
      router.push("/auth/forgot-password");
    }
  }, [identifier, router]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const payload: any = { otp: otpString };
      if (mobile) {
        payload.mobile = mobile;
      } else {
        payload.email = email;
      }

      await verifyOtp(payload).unwrap();
      setSuccess("OTP Verified!");
      setTimeout(() => {
        const params = mobile ? `mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otpString)}` : `email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`;
        router.push(`/auth/reset-password?${params}`);
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Invalid OTP";
      setError(typeof errorMessage === "string" ? errorMessage : "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-admin dark:bg-[var(--page-body-bg)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 dark:bg-[var(--card-color)] dark:border dark:border-[var(--card-border-color)]">
        <CardContent className="p-6 pb-8 px-8 sm:pt-12 sm:px-8 sm:pb-8">
          <div className="flex flex-col items-center mb-8">
            <DynamicLogo />
            <h1 className="text-lg sm:text-2xl font-bold text-primary mb-2 mt-2">Verify OTP</h1>
            <p className="text-sm text-slate-500 text-center dark:text-gray-400">
              {"We've sent a code to"} <span className="font-semibold text-slate-700 dark:text-gray-300">{identifier}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#ff000014] border border-[#ff000042] rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 dark:bg-[#32433230] dark:border-[var(--card-border-color)] rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
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
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-full h-full py-[8px] px-0 sm:py-[8px] sm:px-[12px] sm:w-12 sm:h-14 text-center text-xl font-bold border-slate-200 dark:border-[var(--card-border-color)] focus:border-[var(--text-green-primary)] focus:ring-[var(--text-green-primary)] dark:bg-page-body"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button type="submit" className="w-full h-12 bg-linear-to-r bg-[var(--text-green-primary)] text-white font-medium shadow-md shadow-primary/20 transition-all" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center dark:border-[var(--card-border-color)]">
            <Link href="/auth/forgot-password" className="inline-flex items-center text-sm text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change {identifierType === "mobile" ? "Mobile Number" : "Email Address"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpContent;
