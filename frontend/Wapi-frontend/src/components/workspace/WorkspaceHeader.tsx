"use client";

import React from "react";
import Image from "next/image";

interface WorkspaceHeaderProps {
  logoUrl?: string;
  appName?: string;
  title: string;
  description: string;
  badgeText: string;
}

export function WorkspaceHeader({
  logoUrl,
  appName,
  title,
  description,
  badgeText,
}: WorkspaceHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-8 pt-8 pb-0">
        <div className="flex items-center gap-2.5">
          <Image
            src={logoUrl || "/assets/logos/logo1.png"}
            alt={appName || "logo"}
            width={140}
            height={40}
            unoptimized
          />
        </div>
      </div>

      <div className="text-center mb-10 mt-12">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {badgeText}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>
        <p className="mt-2.5 text-sm text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
          {description}
        </p>
      </div>
    </>
  );
}
