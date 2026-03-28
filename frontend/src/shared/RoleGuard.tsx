"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "../app/loading";

interface RoleGuardProps {
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAllowed = useMemo(() => {
    if (isAuthenticated) {
      if (user?.role === "agent") {
        const allowedRoutes = ["/chat", "/tasks", "/landing", "/manage_profile", "/workspace"];
        return allowedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
      } else {
        // Prevent non-agents from accessing root /tasks without agentId
        if ((pathname === "/tasks" || pathname.startsWith("/tasks")) && !agentId) {
          return false;
        }
      }
    }
    return true;
  }, [user, pathname, isAuthenticated, agentId]);

  useEffect(() => {
    if (isAuthenticated && !isAllowed) {
      setTimeout(() => setIsRedirecting(true), 0);
      router.push(user?.role === "agent" ? "/chat" : "/dashboard");
    }
  }, [user, pathname, router, isAuthenticated, isAllowed]);

  useEffect(() => {
    if (isAllowed && isRedirecting) {
      setTimeout(() => setIsRedirecting(false), 0);
    }
  }, [pathname, isAllowed, isRedirecting]);

  if (isLoading || isRedirecting) {
    return <Loading />;
  }

  if (isAuthenticated && !isAllowed) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default RoleGuard;
