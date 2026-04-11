"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CharacterCountWrapperProps {
  current: number;
  max: number;
  children: React.ReactNode;
  className?: string;
  counterClassName?: string;
  showCounter?: boolean;
}

const CharacterCountWrapper = ({ current, max, children, className, counterClassName, showCounter = true }: CharacterCountWrapperProps) => {
  const isOverLimit = current > max;

  return (
    <div className={cn("relative flex flex-col gap-1", className)}>
      {children}
      {showCounter && (
        <div className={cn("absolute -bottom-6 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-black/20 backdrop-blur-sm pointer-events-none transition-all", isOverLimit ? "text-rose-500 bg-rose-50/80 dark:bg-rose-500/10" : "text-slate-400 dark:text-gray-500", counterClassName)}>
          {current} / {max}
        </div>
      )}
    </div>
  );
};

export default CharacterCountWrapper;
