"use client";

import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import React from "react";

interface NodeFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function NodeField({
  label,
  required,
  error,
  description,
  children,
  className,
  labelClassName,
}: NodeFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className={cn("block text-xs font-semibold text-gray-700 dark:text-gray-400", labelClassName)}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {description && <p className="text-[11px] text-gray-500 italic">{description}</p>}
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
