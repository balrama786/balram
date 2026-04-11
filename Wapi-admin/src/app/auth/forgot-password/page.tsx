/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Mail, AlertCircle, ArrowLeft, Phone, Shield } from "lucide-react";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/src/redux/api/authApi";
import Link from "next/link";
import { DynamicLogo } from "@/src/components/auth/common/DynamicLogo";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [inputType, setInputType] = useState<"mobile" | "email">("mobile");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inputValue.trim()) {
      setError(`Please enter your ${inputType === "mobile" ? "mobile number" : "email address"}`);
      return;
    }

    // Basic validation
    if (inputType === "email" && !inputValue.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Send either mobile or email based on what's provided
      const payload: any = { otp: "" }; // Placeholder, will be overwritten
      if (inputType === "mobile") {
        payload.mobile = inputValue;
      } else {
        payload.email = inputValue;
      }
      delete payload.otp; // Remove placeholder
      
      await forgotPassword(payload).unwrap();
      setSuccess("OTP sent successfully!");
      
      // Navigate to verify OTP page with the identifier
      setTimeout(() => {
        const param = inputType === "mobile" 
          ? `mobile=${encodeURIComponent(inputValue)}`
          : `email=${encodeURIComponent(inputValue)}`;
        router.push(`/auth/verify-otp?${param}`);
      }, 1000);
    } catch (err: any) {
      // Fixed: Added proper null checks to prevent toLowerCase error
      const errorMessage = err?.data?.message || err?.message || "Failed to send OTP";
      setError(typeof errorMessage === 'string' ? errorMessage : "Failed to send OTP");
    }
  };

  const toggleInputType = () => {
    setInputType(prev => prev === "mobile" ? "email" : "mobile");
    setInputValue("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-[#f6f8f7] dark:bg-[var(--page-body-bg)] min-h-screen bg-admin flex items-center relative overflow-hidden justify-center p-4">
      {/* <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div> */}
      <Card className="w-full max-w-md shadow-2xl border-0 dark:bg-[var(--card-color)] dark:border dark:border-[var(--card-border-color)]">
        <CardContent className="pt-12 pb-8 px-8">
          <div className="flex flex-col items-center mb-8">
            <DynamicLogo />
            <h1 className="text-lg sm:text-2xl font-bold text-[var(--text-green-primary)] mb-2">Forgot Password?</h1>
            <p className="text-sm text-slate-500 text-center dark:text-gray-400">Enter your {inputType === "mobile" ? "mobile number" : "email address"} to receive a verification code</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="input" className="text-sm font-medium text-slate-700 flex flex-col dark:text-gray-400">
                {inputType === "mobile" ? "Mobile Number" : "Email Address"}
              </Label>
              <div className="relative">
                {inputType === "mobile" ? <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /> : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
                <Input id="input" type={inputType === "mobile" ? "tel" : "email"} placeholder={inputType === "mobile" ? "Enter your mobile number" : "Enter your email address"} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="pl-10 h-12 text-sm sm:text-base dark:bg-page-body dark:border-(--card-border-color) pr-4.75 border-slate-200 shadow-none focus:border-none focus:ring-none" required disabled={isLoading} />
              </div>
              <div onClick={toggleInputType} className="text-xs bg-transparent text-primary hover:bg-transparent transition-colors">
                Use {inputType === "mobile" ? "email" : "mobile number"} instead
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-white font-medium text-base transition-all shadow-md shadow-primary/20" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center dark:border-[var(--card-border-color)]">
            <Link href="/auth/login" className="inline-flex items-center text-sm text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
