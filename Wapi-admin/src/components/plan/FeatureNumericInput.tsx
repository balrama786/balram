"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { FeatureNumericInputProps } from "@/src/types/components";

const FeatureNumericInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
}: FeatureNumericInputProps) => {
  return (
    <div className="space-y-2.5 flex flex-col group">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-focus-within:text-(--text-green-primary) transition-colors">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dark:bg-page-body p-3 dark:border-(--card-border-color) h-12 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg"
      />
    </div>
  );
};

export default FeatureNumericInput;
