"use client";

import React from "react";
import Image from "next/image";
import { useGetIsDemoModeQuery } from "@/src/redux/api/authApi";
import { Skeleton } from "@/src/elements/ui/skeleton";

interface DynamicLogoProps {
  width?: number;
  height?: number;
  className?: string;
  skeletonClassName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveUrl = (url?: string): string => {
  if (!url || url.length <= 0) return "/assets/logos/logo3.png";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

export const DynamicLogo = ({
  width = 160,
  height = 48,
  className = "h-12 w-auto object-contain",
  skeletonClassName = "h-12 w-40"
}: DynamicLogoProps) => {
  const { data: demoModeRes, isLoading } = useGetIsDemoModeQuery();

  if (isLoading) {
    return <Skeleton className={skeletonClassName} />;
  }

  const logoUrl = resolveUrl(demoModeRes?.logo_light_url);

  return (
    <Image
      src={logoUrl}
      alt="App Logo"
      width={width}
      height={height}
      className={className}
      unoptimized
      priority
    />
  );
};
