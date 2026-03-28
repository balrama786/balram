/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Lock, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/src/redux/api/authApi";
import { DynamicLogo } from "@/src/components/auth/common/DynamicLogo";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const identifier = mobile || email;

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!identifier || !otp) {
      router.push("/auth/forgot-password");
    }
  }, [identifier, otp, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload: any = {
        otp,
        password,
        password_confirmation: confirmPassword,
      };

      if (mobile) {
        payload.mobile = mobile;
      } else {
        payload.email = email;
      }

      await resetPassword(payload).unwrap();

      setSuccess("Password reset successfully!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to reset password";
      setError(typeof errorMessage === "string" ? errorMessage : "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-admin dark:bg-page-body flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 dark:bg-(--card-color) dark:border dark:border-(--card-border-color)">
        <CardContent className="pt-12 pb-8 px-8">
          <div className="flex flex-col items-center mb-8">
            <DynamicLogo />
            <h1 className="text-lg sm:text-2xl font-bold text-(--text-green-primary) mb-2 mt-2">Set New Password</h1>
            <p className="text-sm text-slate-500 text-center dark:text-gray-400">Create a new password for your account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#ff000014] border border-[#ff000042] rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-gray-400">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 pr-[47px] border-slate-200 dark:border-[var(--card-border-color)] focus:border-none focus:ring-none dark:bg-page-body" required disabled={isLoading} />
                <Button onClick={() => setShowPassword(!showPassword)} className="absolute bg-transparent shadow-none right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors hover:bg-transparent" disabled={isLoading}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-gray-400">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-11.75 h-12 border-slate-200 focus:border-(--text-green-primary) dark:bg-page-body focus:ring-(--text-green-primary)" required disabled={isLoading} />
                <Button variant="ghost" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors hover:bg-transparent" disabled={isLoading}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            <div className="p-3 bg-(--light-primary) dark:bg-page-body dark:border-(--card-border-color) border dark:border-none border-emerald-100 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-(--text-green-primary) shrink-0 mt-0.5" />
              <p className="text-xs text-(--text-green-primary)">Use at least 8 characters with a mix of letters, numbers & symbols</p>
            </div>

            <Button type="submit" className="w-full h-12 bg-(--text-green-primary) text-white font-medium shadow-md shadow-primary/20 transition-all" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordContent;
