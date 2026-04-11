"use client";

import { Switch } from "@/src/elements/ui/switch";
import { SettingToggleProps } from "@/src/types/setting";

const SettingToggle = ({ label, description, checked, onCheckedChange, disabled }: SettingToggleProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} className="data-[state=checked]:bg-(--text-green-primary) shrink-0" />
    </div>
  );
};

export default SettingToggle;
