"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", props.disabled && "cursor-not-allowed opacity-70")}>
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} ref={ref} {...props} />
        <div className={cn("w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[shadow-none] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--text-green-primary) dark:bg-[#476240]", className)}></div>
      </label>
    );
  }
)
Switch.displayName = "Switch"

export { Switch }
