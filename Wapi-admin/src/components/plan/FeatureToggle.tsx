"use client";

import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { FeatureToggleProps } from "@/src/types/components";

const FeatureToggle = ({
  id,
  label,
  description,
  icon,
  checked,
  onCheckedChange,
}: FeatureToggleProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-(--card-border-color) hover:bg-gray-50/50 dark:hover:bg-page-body transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center group-hover:bg-(--text-green-primary)/20 transition-colors">
          <div className="text-(--text-green-primary)">{icon}</div>
        </div>
        <div>
          <Label htmlFor={id} className="text-sm font-bold text-gray-900 dark:text-gray-200 cursor-pointer block leading-tight">
            {label}
          </Label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">{description}</p>
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-(--text-green-primary)" />
    </div>
  );
};

export default FeatureToggle;
