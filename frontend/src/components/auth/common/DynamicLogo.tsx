"use client";

import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetIsDemoModeQuery } from "@/src/redux/api/authApi";
import Image from "next/image";

interface DynamicLogoProps {
  width?: number;
  height?: number;
  className?: string;
  skeletonClassName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

const resolveUrl = (url?: string): string => {
  if (!url || url.length <= 0) return "/assets/logos/logo3.png";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

export const DynamicLogo = ({ width = 200, height = 56, className = "h-14 w-auto object-contain", skeletonClassName = "h-14 w-48 animate-pulse bg-transparent" }: DynamicLogoProps) => {
  const { data: demoModeRes, isLoading } = useGetIsDemoModeQuery();

  if (isLoading) {
    return <Skeleton className={skeletonClassName} />;
  }

  const logoUrl = resolveUrl(demoModeRes?.logo_dark_url);

  return <Image src={logoUrl} alt="App Logo" width={width} height={height} className={className} unoptimized priority />;
};
