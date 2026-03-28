"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/src/components/auth/LoginForm";
import { ROUTES } from "@/src/constants/route";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(ROUTES.Dashboard);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-white to-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return <LoginPage />;
};

export default Page;
