"use client";

import { SettingCardProps } from "@/src/types/setting";
import React from "react";

const SettingCard = ({ title, description, children, rightElement }: SettingCardProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-gray-200 dark:border-(--card-border-color) shadow-sm overflow-hidden">
      <div className="sm:px-6 px-4 py-4 border-b border-gray-100 dark:border-(--card-border-color) flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className="sm:p-6 p-4 space-y-5">{children}</div>
    </div>
  );
};

export default SettingCard;
