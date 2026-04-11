/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { useGetIsDemoModeQuery, useLoginMutation, useGetPublicRolesQuery } from "@/src/redux/api/authApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useAppDispatch } from "@/src/redux/hooks";
import { setCredentials, setLoading } from "@/src/redux/reducers/authSlice";
import { LoginRequest } from "@/src/types/auth";
import { Label } from "@radix-ui/react-label";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DynamicLogo } from "./common/DynamicLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveUrl = (url?: string): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

const DEFAULT_FAVICON = "/assets/logos/sidebarLogo.png";

function applyFavicon(href: string) {
  if (typeof window === "undefined") return;
  const links = document.querySelectorAll("link[rel*='icon']");
  if (links.length > 0) {
    links.forEach((link: any) => {
      if (link.href !== href) link.href = href;
    });
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
  }
}

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { data: brandingData, isSuccess } = useGetIsDemoModeQuery();
  const { data: rolesData } = useGetPublicRolesQuery();
  const isDemoMode = brandingData?.is_demo_mode ?? false;

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [role_id, setRoleId] = useState("");

  useEffect(() => {
    if (!brandingData || !isSuccess) return;

    const faviconHref = resolveUrl(brandingData?.favicon_url) || DEFAULT_FAVICON;
    const apply = () => applyFavicon(faviconHref);

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: false });
    const interval = setInterval(apply, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [brandingData, isSuccess]);

  useEffect(() => {
    if (rolesData?.success && rolesData.data.length > 0 && !role_id) {
      const superAdmin = rolesData.data.find((r) => r.name.toLowerCase() === "super_admin");
      if (superAdmin) {
        setRoleId(superAdmin._id);
      } else {
        setRoleId(rolesData.data[0]._id);
      }
    }
  }, [rolesData, role_id]);

  const fillDemoCredentials = () => {
    setIdentifier("admin@example.com");
    setPassword("123456789");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    dispatch(setLoading(true));

    try {
      const loginData: LoginRequest = {
        identifier: identifier.trim(),
        password,
        role_id: role_id || undefined,
      };

      const response = await login(loginData).unwrap();

      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        })
      );

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "An error occurred during login");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-[#f6f8f7] bg-admin dark:bg-page-body min-h-screen flex items-center justify-center p-4.5 relative overflow-hidden flex-col">
      <div className="w-full max-w-md relative shadow-2xl rounded-lg">
        <Card className="w-full max-w-xl bg-white border-0 shadow-none overflow-hidden rounded-lg dark:bg-(--card-color) dark:border dark:border-(--card-border-color)">
          <CardContent className="pt-12 pb-8 px-8 sm:px-10">
            {/* Logo / Icon */}
            <div className="flex flex-col items-center mb-8">
              <DynamicLogo />
              <h1 className="text-lg sm:text-2xl font-bold text-(--text-green-primary) mb-2 mt-2">Login to Your Account</h1>
              <p className="text-sm text-slate-500 text-center dark:text-gray-400">Enter your credentials to access the portal</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex flex-col dark:text-gray-300">
                  Enter your email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input id="email" type="text" placeholder="Email or phone number" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="dark:border-(--card-border-color) dark:bg-page-body pl-10 h-12 pe-3.75 border-slate-200 focus:border-none shadow-none focus:ring-none" required disabled={isLoading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 flex flex-col dark:text-gray-300">
                  Enter your password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 dark:bg-page-body dark:border-(--card-border-color) h-12 border-slate-200 shadow-none focus:border-none focus:ring-none" required disabled={isLoading} />
                  <Button onClick={() => setShowPassword(!showPassword)} className="bg-transparent hover:bg-transparent shadow-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" disabled={isLoading} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex flex-col dark:text-gray-300">Select your role</Label>
                <Select value={role_id} onValueChange={setRoleId}>
                  <SelectTrigger className="h-12 border-slate-200 dark:bg-page-body dark:border-(--card-border-color) shadow-none focus:border-none focus:ring-none">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-(--card-color) dark:border-(--card-border-color) z-110">
                    {rolesData?.data
                      ?.filter((role) => !["user", "agent"].includes(role.name.toLowerCase()))
                      .map((role) => (
                        <SelectItem key={role._id} value={role._id} className="cursor-pointer dark:hover:bg-zinc-800">
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full h-14 text-white font-medium text-base transition-all shadow-md shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login to Admin Panel"}
                <Lock className="w-4 h-4" />
              </Button>
            </form>

            {isDemoMode && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-(--card-border-color)" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500 dark:bg-(--card-color) dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-(--light-primary) rounded-lg border border-[#16a34a33] justify-center flex cursor-pointer dark:bg-transparent dark:border-(--card-border-color)" onClick={fillDemoCredentials}>
                  <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Demo Credentials</p>
                </div>
              </>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/forgot-password" prefetch={false} className="text-sm text-(--text-green-primary) hover:text-emerald-700 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="relative z-10 p-8 text-center">
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <a href="#" className="text-sm font-bold text-gray-600 transition-colors dark:text-gray-400">
            Privacy Policy
          </a>
          <a href="#" className="text-sm font-bold text-gray-600 transition-colors dark:text-gray-400">
            Terms of Service
          </a>
          <a href="#" className="text-sm font-bold text-gray-600 transition-colors dark:text-gray-400">
            Help Center
          </a>
        </div>
        <p className="text-[13px] text-gray-400 font-semibold">© 2026 Wapi CRM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginForm;
